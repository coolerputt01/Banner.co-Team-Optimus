from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db_models import User, Ad
from models import TokenData, UserUpdateRequest, AdCreateRequest
from sqlalchemy import func, update, select
from sqlalchemy.orm import selectinload
import uuid

async def get_user_by_id(db: AsyncSession, user_id: str) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def get_or_create_user(db: AsyncSession, token: TokenData) -> User:
    user = await get_user_by_id(db, token.sub)
    if user:
        return user
    user = User(
        id=token.sub,
        email=token.email,
        business_name="",
        profile_picture=token.picture,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def update_user(db: AsyncSession, user: User, payload: UserUpdateRequest) -> User:
    update_data = payload.model_dump(exclude_none=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user

# ── Ad operations ─────────────────────────────────────────────

async def create_ad(
    db: AsyncSession,
    user_id: str,
    payload: AdCreateRequest,
    media_url: Optional[str] = None,
) -> Ad:
    ad = Ad(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=payload.title,
        description=payload.description,
        media_url=media_url,
        tags=payload.tags,
    )
    db.add(ad)
    await db.commit()
    await db.refresh(ad)
    return ad

async def get_ad_by_id(db: AsyncSession, ad_id: str) -> Ad | None:
    result = await db.execute(select(Ad).where(Ad.id == ad_id))
    return result.scalar_one_or_none()

async def delete_ad(db: AsyncSession, ad: Ad) -> None:
    await db.delete(ad)
    await db.commit()

async def get_random_feed(db: AsyncSession, limit: int = 10) -> list[Ad]:
    result = await db.execute(
        select(Ad).order_by(func.random()).limit(limit)
    )
    return result.scalars().all()

async def like_ad(db: AsyncSession, user_id: str, ad_id: str) -> Like:
    """Create a like (idempotent – will not duplicate)."""
    # Check if already exists to avoid unique constraint error
    existing = await get_like(db, user_id, ad_id)
    if existing:
        return existing
    like = Like(id=str(uuid.uuid4()), user_id=user_id, ad_id=ad_id)
    db.add(like)
    await db.commit()
    await db.refresh(like)
    return like

async def unlike_ad(db: AsyncSession, user_id: str, ad_id: str) -> bool:
    """Remove a like, return True if deleted."""
    like = await get_like(db, user_id, ad_id)
    if not like:
        return False
    await db.delete(like)
    await db.commit()
    return True

async def get_like(db: AsyncSession, user_id: str, ad_id: str) -> Like | None:
    result = await db.execute(
        select(Like).where(Like.user_id == user_id, Like.ad_id == ad_id)
    )
    return result.scalar_one_or_none()

async def get_likes_count(db: AsyncSession, ad_id: str) -> int:
    result = await db.execute(select(func.count()).select_from(Like).where(Like.ad_id == ad_id))
    return result.scalar_one()

async def get_user_liked_ads_set(db: AsyncSession, user_id: str) -> set[str]:
    """Return set of ad_ids that user has liked."""
    result = await db.execute(select(Like.ad_id).where(Like.user_id == user_id))
    return {row[0] for row in result.all()}

# ── Comment operations ─────────────────────────────────────────
async def create_comment(db: AsyncSession, user_id: str, ad_id: str, content: str) -> Comment:
    comment = Comment(
        id=str(uuid.uuid4()),
        user_id=user_id,
        ad_id=ad_id,
        content=content,
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment

async def get_comments_for_ad(
    db: AsyncSession, ad_id: str, skip: int = 0, limit: int = 50
) -> list[Comment]:
    result = await db.execute(
        select(Comment)
        .where(Comment.ad_id == ad_id)
        .order_by(Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def get_comment_by_id(db: AsyncSession, comment_id: str) -> Comment | None:
    result = await db.execute(select(Comment).where(Comment.id == comment_id))
    return result.scalar_one_or_none()

async def delete_comment(db: AsyncSession, comment: Comment) -> None:
    await db.delete(comment)
    await db.commit()

async def record_view(db: AsyncSession, ad_id: str, user_id: str) -> bool:
    """Record a view for an ad. Returns True if new view was counted, False if duplicate."""
    # Check if user already viewed this ad
    existing = await db.execute(
        select(AdView).where(AdView.ad_id == ad_id, AdView.user_id == user_id)
    )
    if existing.scalar_one_or_none():
        return False

    # Create view record
    view = AdView(id=str(uuid.uuid4()), ad_id=ad_id, user_id=user_id)
    db.add(view)

    # Increment ad's view counter atomically
    await db.execute(
        update(Ad).where(Ad.id == ad_id).values(views_count=Ad.views_count + 1)
    )
    await db.commit()
    return True

async def get_ad_views_count(db: AsyncSession, ad_id: str) -> int:
    result = await db.execute(select(Ad.views_count).where(Ad.id == ad_id))
    return result.scalar_one() or 0

async def has_user_viewed_ad(db: AsyncSession, ad_id: str, user_id: str) -> bool:
    result = await db.execute(
        select(AdView).where(AdView.ad_id == ad_id, AdView.user_id == user_id)
    )
    return result.scalar_one_or_none() is not None

async def create_campaign(db: AsyncSession, user_id: str, ad_id: str, duration_days: int, amount: float, payment_ref: str) -> Campaign:
    campaign = Campaign(
        id=str(uuid.uuid4()),
        user_id=user_id,
        ad_id=ad_id,
        duration_days=duration_days,
        amount_paid=amount,
        payment_ref=payment_ref,
        status="pending"
    )
    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)
    return campaign

async def activate_campaign(db: AsyncSession, payment_ref: str):
    """Activate campaign after successful payment and set its active period."""
    result = await db.execute(select(Campaign).where(Campaign.payment_ref == payment_ref))
    campaign = result.scalar_one_or_none()
    if campaign:
        campaign.status = "active"
        campaign.start_date = func.now()
        campaign.end_date = func.now() + timedelta(days=campaign.duration_days)
        await db.commit()
        return campaign
    return None

# Wallet Operations
async def get_or_create_wallet(db: AsyncSession, user_id: str) -> Wallet:
    result = await db.execute(select(Wallet).where(Wallet.user_id == user_id))
    wallet = result.scalar_one_or_none()
    if not wallet:
        wallet = Wallet(id=str(uuid.uuid4()), user_id=user_id, balance=0.00)
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)
    return wallet

async def credit_wallet(db: AsyncSession, user_id: str, amount: float, reward_id: str):
    """Credit a user's wallet and mark the reward as credited."""
    wallet = await get_or_create_wallet(db, user_id)
    wallet.balance += amount
    await db.execute(update(UserReward).where(UserReward.id == reward_id).values(status="credited"))
    await db.commit()
    return wallet

# Reward Operations
REWARD_AMOUNTS = {"VIEW": 50.00, "LIKE": 55.00, "COMMENT": 55.00}

async def create_reward(db: AsyncSession, user_id: str, ad_id: str, reward_type: str):
    """Create a reward entry for a user action."""
    if reward_type not in REWARD_AMOUNTS:
        return None
    # Check for duplicates: user can earn a reward for a specific ad+action only once
    result = await db.execute(select(UserReward).where(
        UserReward.user_id == user_id,
        UserReward.ad_id == ad_id,
        UserReward.reward_type == reward_type
    ))
    if result.scalar_one_or_none():
        return None
    reward = UserReward(
        id=str(uuid.uuid4()),
        user_id=user_id,
        ad_id=ad_id,
        reward_type=reward_type,
        amount=REWARD_AMOUNTS[reward_type],
        status="pending"
    )
    db.add(reward)
    await db.commit()
    await db.refresh(reward)
    # Immediately credit the wallet
    await credit_wallet(db, user_id, reward.amount, reward.id)
    return reward