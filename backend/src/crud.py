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