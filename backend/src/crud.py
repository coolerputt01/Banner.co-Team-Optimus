from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db_models import User, Ad
from models import TokenData, UserUpdateRequest, AdCreateRequest
from sqlalchemy import func
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