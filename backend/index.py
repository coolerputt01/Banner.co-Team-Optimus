import secrets
import httpx
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File, Form
from src.cloudinary_upload import upload_media
from typing import List, Optional

from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings, AUTH0_AUTHORIZE_URL, AUTH0_TOKEN_URL, AUTH0_LOGOUT_URL, CALLBACK_URL
from src.auth_route import get_current_user
from database import engine, Base, get_db
from models import TokenData, UserInfo, UserUpdateRequest, AuthResponse, AdCreateRequest, AdResponse, AdFeedResponse
from src.crud import get_or_create_user, update_user, create_ad, get_ad_by_id, delete_ad, get_random_feed


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (use Alembic for prod migrations)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="FastAPI + Auth0 Google OAuth", lifespan=lifespan)

_state_store: set[str] = set()


# ── Auth routes ────────────────────────────────────────────────

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

    # Fetch user info from Auth0
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

    # Upsert user in Postgres
    user = await get_or_create_user(db, token_data)

    return AuthResponse(
        access_token=access_token,
        user=UserInfo.model_validate(user),
    )


@app.get("/auth/logout")
def logout():
    return RedirectResponse(
        f"https://{settings.auth0_domain}/v2/logout"
        f"?client_id={settings.auth0_client_id}"
        f"&returnTo={settings.app_base_url}"
    )


# ── User routes ────────────────────────────────────────────────

@app.get("/users/me", response_model=UserInfo)
async def get_my_profile(
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user = await get_or_create_user(db, current_user)
    return UserInfo.model_validate(user)


@app.put("/users/me", response_model=UserInfo)
async def update_my_profile(
    business_name: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
    banner_picture: Optional[UploadFile] = File(None),
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
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


@app.get("/health")
def health():
    return {"status": "ok"}

# ── Ad routes ──────────────────────────────────────────────────

@app.post("/ads", response_model=AdResponse, status_code=201)
async def create_ad_post(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    tags: List[str] = Form([]),         # send as repeated form fields: tags=a&tags=b
    media: Optional[UploadFile] = File(None),
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Validate tag count
    if len(tags) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 tags allowed")

    # Upload media to Cloudinary if provided
    media_url = None
    if media:
        file_bytes = await media.read()
        try:
            media_url = await upload_media(file_bytes, media.content_type)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    # Build payload and save
    payload = AdCreateRequest(title=title, description=description, tags=tags)
    ad = await create_ad(db, current_user.sub, payload, media_url)
    return AdResponse.model_validate(ad)

@app.delete("/ads/{ad_id}", status_code=204)
async def delete_ad_post(
    ad_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ad = await get_ad_by_id(db, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    if ad.user_id != current_user.sub:
        raise HTTPException(status_code=403, detail="Not your ad")
    await delete_ad(db, ad)


# ── Feed route ─────────────────────────────────────────────────

@app.get("/feed", response_model=AdFeedResponse)
async def get_feed(
    limit: int = 10,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns `limit` ads in random order — TikTok style.
    Call again to get a new shuffle. Max 50 per call.
    """
    if limit > 50:
        raise HTTPException(status_code=400, detail="Max limit is 50")

    ads = await get_random_feed(db, limit)
    return AdFeedResponse(
        ads=[AdResponse.model_validate(ad) for ad in ads],
        total=len(ads),
    )

@app.post("/ads/{ad_id}/like", status_code=201)
async def like_an_ad(
    ad_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify ad exists
    ad = await get_ad_by_id(db, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    await like_ad(db, current_user.sub, ad_id)
    return {"message": "Ad liked"}

@app.delete("/ads/{ad_id}/like", status_code=204)
async def unlike_an_ad(
    ad_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    deleted = await unlike_ad(db, current_user.sub, ad_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Like not found")
    return None

@app.get("/ads/{ad_id}/likes")
async def get_likes(
    ad_id: str,
    db: AsyncSession = Depends(get_db),
):
    count = await get_likes_count(db, ad_id)
    # Optionally, also return whether current user has liked it (if authenticated)
    # We'll add optional current_user dependency later.
    return {"ad_id": ad_id, "likes": count}

# Optional: endpoint to check if user liked an ad
@app.get("/ads/{ad_id}/is-liked")
async def is_ad_liked_by_user(
    ad_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    like = await get_like(db, current_user.sub, ad_id)
    return {"liked": like is not None}

# ── Comment endpoints ──────────────────────────────────────────

@app.post("/ads/{ad_id}/comments", response_model=CommentResponse, status_code=201)
async def add_comment(
    ad_id: str,
    payload: CommentCreate,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ad = await get_ad_by_id(db, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    comment = await create_comment(db, current_user.sub, ad_id, payload.content)
    return CommentResponse.model_validate(comment)

@app.get("/ads/{ad_id}/comments", response_model=list[CommentResponse])
async def list_comments(
    ad_id: str,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    comments = await get_comments_for_ad(db, ad_id, skip, limit)
    return [CommentResponse.model_validate(c) for c in comments]

@app.delete("/comments/{comment_id}", status_code=204)
async def delete_comment_endpoint(
    comment_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    comment = await get_comment_by_id(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    # Only comment owner or ad owner can delete
    ad = await get_ad_by_id(db, comment.ad_id)
    if comment.user_id != current_user.sub and (not ad or ad.user_id != current_user.sub):
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    await delete_comment(db, comment)
    return None


@app.post("/ads/{ad_id}/view", status_code=200)
async def record_ad_view(
    ad_id: str,
    request: Request,
    current_user: Optional[TokenData] = Depends(get_current_user),  # see note below
    db: AsyncSession = Depends(get_db),
):
    """
    Record a view for an ad. Call this when the ad is actually seen (e.g., on screen for 2 seconds).
    Uses optional authentication to prevent duplicate views from same user.
    """
    ad = await get_ad_by_id(db, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    user_id = current_user.sub if current_user else None
    client_ip = request.client.host if request.client else None

    was_counted = await record_view(db, ad_id, user_id, client_ip)

    return {
        "ad_id": ad_id,
        "new_view_recorded": was_counted,
        "total_views": await get_ad_views_count(db, ad_id),
    }

@app.get("/ads/{ad_id}/views", response_model=AdViewResponse)
async def get_views(
    ad_id: str,
    current_user: Optional[TokenData] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ad = await get_ad_by_id(db, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    total = await get_ad_views_count(db, ad_id)
    user_viewed = False
    if current_user:
        user_viewed = await has_user_viewed_ad(db, ad_id, current_user.sub)

    return AdViewResponse(ad_id=ad_id, total_views=total, user_viewed=user_viewed)