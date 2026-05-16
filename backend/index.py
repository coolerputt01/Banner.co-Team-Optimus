import secrets
import httpx
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from src.cloudinary_upload import upload_media
from src.squadco_service import initialize_payment, verify_payment, verify_webhook_signature
from src.auth_route import get_current_user, verify_token
from database import engine, Base, get_db
from config import settings, AUTH0_AUTHORIZE_URL, AUTH0_TOKEN_URL, CALLBACK_URL
from models import (
    TokenData, UserInfo, UserUpdateRequest, AuthResponse,
    AdCreateRequest, AdResponse, AdFeedResponse,
    CommentCreate, CommentResponse, AdViewResponse,
    PaymentInitResponse, PaymentVerifyResponse,
    CampaignResponse, WalletResponse, UserRewardResponse,
)
from db_models import Campaign, User, Ad, Like, Comment, AdView, Wallet, UserReward
from src.crud import (
    get_or_create_user, update_user, create_ad, get_ad_by_id, delete_ad, get_random_feed,
    activate_campaign, create_reward, like_ad, unlike_ad,
    get_likes_count, get_like, record_view, get_ad_views_count, has_user_viewed_ad,
    create_comment, get_comments_for_ad, get_comment_by_id, delete_comment,
    get_or_create_wallet,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="Banner.co API", lifespan=lifespan)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory state store for OAuth CSRF protection
_state_store: set[str] = set()

# Optional auth dependency — returns user if token present, None for guests
_optional_bearer = HTTPBearer(auto_error=False)

async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_optional_bearer),
) -> Optional[TokenData]:
    if credentials is None:
        return None
    try:
        return await verify_token(credentials.credentials)
    except Exception:
        return None


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.get("/auth/login")
def login():
    state = secrets.token_urlsafe(32)
    _state_store.add(state)
    params = {
        "response_type": "code",
        "client_id":     settings.auth0_client_id,
        "redirect_uri":  CALLBACK_URL,
        "scope":         "openid profile email",
        "audience":      settings.auth0_audience,
        "state":         state,
        "connection":    "google-oauth2",
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return RedirectResponse(f"{AUTH0_AUTHORIZE_URL}?{query}")


@app.get("/auth/callback", response_model=AuthResponse)
async def callback(
    code:  str = Query(...),
    state: str = Query(...),
    db:    AsyncSession = Depends(get_db),
):
    if state not in _state_store:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    _state_store.discard(state)

    # Exchange code for tokens
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            AUTH0_TOKEN_URL,
            json={
                "grant_type":    "authorization_code",
                "client_id":     settings.auth0_client_id,
                "client_secret": settings.auth0_client_secret,
                "code":          code,
                "redirect_uri":  CALLBACK_URL,
            },
        )
    if token_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Token exchange failed")

    tokens = token_resp.json()
    access_token = tokens["access_token"]

    # Fetch user profile from Auth0
    async with httpx.AsyncClient() as client:
        userinfo_resp = await client.get(
            f"https://{settings.auth0_domain}/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
    if userinfo_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch user info")

    profile = userinfo_resp.json()
    token_data = TokenData(
        sub=profile["sub"],
        email=profile.get("email"),
        name=profile.get("name"),
        picture=profile.get("picture"),
    )

    user = await get_or_create_user(db, token_data)

    # Redirect frontend to /auth/callback with token in query param
    # so the React AuthCallback page can pick it up
    frontend_base = settings.frontend_url.rstrip("/")
    redirect_url = f"{frontend_base}/auth/callback?access_token={access_token}"
    return RedirectResponse(redirect_url)


@app.get("/auth/logout")
def logout():
    return RedirectResponse(
        f"https://{settings.auth0_domain}/v2/logout"
        f"?client_id={settings.auth0_client_id}"
        f"&returnTo={settings.frontend_url}"
    )


# ── User ──────────────────────────────────────────────────────────────────────

@app.get("/users/me", response_model=UserInfo)
async def get_my_profile(
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user = await get_or_create_user(db, current_user)
    # Ensure wallet exists then reload user with wallet eagerly loaded
    await get_or_create_wallet(db, user.id)
    result = await db.execute(
        select(User).options(selectinload(User.wallet)).where(User.id == user.id)
    )
    user = result.scalar_one()
    return UserInfo.model_validate(user)


@app.put("/users/me", response_model=UserInfo)
async def update_my_profile(
    business_name:   Optional[str]        = Form(None),
    bio:             Optional[str]        = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
    banner_picture:  Optional[UploadFile] = File(None),
    current_user:    TokenData            = Depends(get_current_user),
    db:              AsyncSession         = Depends(get_db),
):
    user = await get_or_create_user(db, current_user)

    profile_picture_url = None
    if profile_picture:
        file_bytes = await profile_picture.read()
        try:
            profile_picture_url = await upload_media(
                file_bytes, profile_picture.content_type, folder="profile_pictures"
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    banner_picture_url = None
    if banner_picture:
        file_bytes = await banner_picture.read()
        try:
            banner_picture_url = await upload_media(
                file_bytes, banner_picture.content_type, folder="banner_pictures"
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    payload = UserUpdateRequest(
        business_name=business_name,
        bio=bio,
        profile_picture=profile_picture_url,
        banner_picture=banner_picture_url,
    )
    updated = await update_user(db, user, payload)
    return UserInfo.model_validate(updated)


# ── Campaigns / Payment ───────────────────────────────────────────────────────

@app.post("/campaigns/initiate", response_model=PaymentInitResponse)
async def initiate_campaign_payment(
    duration_days: int = Form(1),
    current_user:  TokenData     = Depends(get_current_user),
    db:            AsyncSession  = Depends(get_db),
):
    if duration_days < 1 or duration_days > 365:
        raise HTTPException(status_code=400, detail="duration_days must be between 1 and 365")
    amount = 499.00 * duration_days
    payment_ref = f"CAMP_{current_user.sub}_{uuid.uuid4().hex}"

    squad_response = await initialize_payment(
        amount=amount,
        email=current_user.email or "",
        user_id=current_user.sub,
        payment_ref=payment_ref,
        ad_id=None,
    )

    # Squadco returns checkout_url inside data.checkout_url
    checkout_url = (
        squad_response.get("data", {}).get("checkout_url")
        or squad_response.get("data", {}).get("auth_url")
        or squad_response.get("checkout_url", "")
    )

    campaign = Campaign(
        id=str(uuid.uuid4()),
        user_id=current_user.sub,
        duration_days=duration_days,
        amount_paid=amount,
        payment_ref=payment_ref,
        status="pending",
    )
    db.add(campaign)
    await db.commit()

    return PaymentInitResponse(checkout_url=checkout_url, payment_ref=payment_ref)


@app.post("/webhook/squadco")
async def squadco_webhook(
    request: Request,
    db:      AsyncSession = Depends(get_db),
):
    body = await request.body()
    signature = request.headers.get("x-squad-encrypted-body", "")
    if not await verify_webhook_signature(body, signature, settings.squad_secret_hash):
        raise HTTPException(status_code=401, detail="Invalid signature")

    payload = await request.json()
    if payload.get("Event") == "charge_successful":
        transaction_ref = payload.get("TransactionRef")
        verification = await verify_payment(transaction_ref)
        if verification.get("data", {}).get("transaction_status") == "Success":
            await activate_campaign(db, transaction_ref)

    return {"status": "ok"}


# ── Ads ───────────────────────────────────────────────────────────────────────

@app.post("/ads", response_model=AdResponse, status_code=201)
async def create_ad_endpoint(
    title:       str                    = Form(...),
    description: Optional[str]         = Form(None),
    tags:        List[str]             = Form([]),
    media:       Optional[UploadFile]  = File(None),
    campaign_id: str                   = Form(...),
    current_user: TokenData            = Depends(get_current_user),
    db:           AsyncSession         = Depends(get_db),
):
    # Verify campaign belongs to user and is paid
    # campaign_id may be either the campaign UUID or the payment_ref
    result = await db.execute(
        select(Campaign).where(
            or_(Campaign.id == campaign_id, Campaign.payment_ref == campaign_id),
            Campaign.user_id == current_user.sub,
            Campaign.status == "paid",
        )
    )
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=400, detail="No valid paid campaign found")

    media_url = None
    if media:
        file_bytes = await media.read()
        media_url = await upload_media(file_bytes, media.content_type)

    payload = AdCreateRequest(title=title, description=description, tags=tags)
    ad = await create_ad(db, current_user.sub, payload, media_url)

    # Link campaign → ad and activate
    campaign.ad_id = ad.id
    campaign.status = "active"
    campaign.start_date = datetime.now(timezone.utc)
    campaign.end_date = datetime.now(timezone.utc) + timedelta(days=campaign.duration_days)
    await db.commit()
    await db.refresh(ad)

    return AdResponse.model_validate(ad)


@app.delete("/ads/{ad_id}", status_code=204)
async def delete_ad_endpoint(
    ad_id:        str,
    current_user: TokenData   = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    ad = await get_ad_by_id(db, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    if ad.user_id != current_user.sub:
        raise HTTPException(status_code=403, detail="Not your ad")
    await delete_ad(db, ad)


# ── Feed ──────────────────────────────────────────────────────────────────────

@app.get("/feed", response_model=AdFeedResponse)
async def get_feed(
    limit:        int        = Query(10, le=50),
    current_user: Optional[TokenData]  = Depends(get_optional_user),
    db:           AsyncSession = Depends(get_db),
):
    ads = await get_random_feed(db, limit)
    return AdFeedResponse(
        ads=[AdResponse.model_validate(ad) for ad in ads],
        total=len(ads),
    )


# ── Likes ─────────────────────────────────────────────────────────────────────

@app.post("/ads/{ad_id}/like", status_code=201)
async def like_an_ad(
    ad_id:        str,
    current_user: TokenData   = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    ad = await get_ad_by_id(db, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    await like_ad(db, current_user.sub, ad_id)
    await create_reward(db, current_user.sub, ad_id, "LIKE")
    return {"message": "Ad liked"}


@app.delete("/ads/{ad_id}/like", status_code=204)
async def unlike_an_ad(
    ad_id:        str,
    current_user: TokenData   = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    deleted = await unlike_ad(db, current_user.sub, ad_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Like not found")


@app.get("/ads/{ad_id}/likes")
async def get_likes(
    ad_id: str,
    db:    AsyncSession = Depends(get_db),
):
    count = await get_likes_count(db, ad_id)
    return {"ad_id": ad_id, "count": count}


@app.get("/ads/{ad_id}/is-liked")
async def is_ad_liked(
    ad_id:        str,
    current_user: TokenData   = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    like = await get_like(db, current_user.sub, ad_id)
    return {"liked": like is not None}


# ── Comments ──────────────────────────────────────────────────────────────────

@app.post("/ads/{ad_id}/comments", response_model=CommentResponse, status_code=201)
async def add_comment(
    ad_id:        str,
    payload:      CommentCreate,
    current_user: TokenData   = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    ad = await get_ad_by_id(db, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    comment = await create_comment(db, current_user.sub, ad_id, payload.content)
    await create_reward(db, current_user.sub, ad_id, "COMMENT")
    return CommentResponse.model_validate(comment)


@app.get("/ads/{ad_id}/comments", response_model=List[CommentResponse])
async def list_comments(
    ad_id: str,
    skip:  int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    db:    AsyncSession = Depends(get_db),
):
    comments = await get_comments_for_ad(db, ad_id, skip, limit)
    return [CommentResponse.model_validate(c) for c in comments]


@app.delete("/comments/{comment_id}", status_code=204)
async def delete_comment_endpoint(
    comment_id:   str,
    current_user: TokenData   = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    comment = await get_comment_by_id(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    ad = await get_ad_by_id(db, comment.ad_id)
    if comment.user_id != current_user.sub and (not ad or ad.user_id != current_user.sub):
        raise HTTPException(status_code=403, detail="Not authorized")
    await delete_comment(db, comment)


# ── Views ─────────────────────────────────────────────────────────────────────

@app.post("/ads/{ad_id}/view")
async def record_ad_view(
    ad_id:        str,
    current_user: TokenData   = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    ad = await get_ad_by_id(db, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    was_counted = await record_view(db, ad_id, current_user.sub)
    if was_counted:
        await create_reward(db, current_user.sub, ad_id, "VIEW")
    return {
        "ad_id": ad_id,
        "new_view_recorded": was_counted,
        "total_views": await get_ad_views_count(db, ad_id),
    }


@app.get("/ads/{ad_id}/views", response_model=AdViewResponse)
async def get_views(
    ad_id:        str,
    current_user: TokenData   = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    ad = await get_ad_by_id(db, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    total = await get_ad_views_count(db, ad_id)
    user_viewed = await has_user_viewed_ad(db, ad_id, current_user.sub)
    return AdViewResponse(ad_id=ad_id, total_views=total, user_viewed=user_viewed)
