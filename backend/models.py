from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


class TokenData(BaseModel):
    sub: str
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None


class WalletInfo(BaseModel):
    balance: float = 0.0
    model_config = {"from_attributes": True}


class UserInfo(BaseModel):
    id: str
    email: str
    business_name: str
    profile_picture: Optional[str] = None
    banner_picture: Optional[str] = None
    bio: Optional[str] = None
    number_of_ads_watched: int = 0
    total_ads_watch_time: float = 0.0
    verified: bool = False
    wallet: Optional[WalletInfo] = None
    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    business_name: Optional[str] = None
    profile_picture: Optional[str] = None
    banner_picture: Optional[str] = None
    bio: Optional[str] = None

    @field_validator("bio")
    @classmethod
    def bio_max_length(cls, v: Optional[str]) -> Optional[str]:
        if v and len(v) > 300:
            raise ValueError("Bio must be 300 characters or fewer")
        return v


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfo


# ── Ad schemas ────────────────────────────────────────────────────────────────

class AdCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    tags: List[str] = []

    @field_validator("tags")
    @classmethod
    def max_five_tags(cls, v: List[str]) -> List[str]:
        if len(v) > 5:
            raise ValueError("Maximum 5 tags allowed")
        return v


class AdResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    media_url: Optional[str] = None
    tags: List[str] = []
    views_count: int = 0

    @field_validator("tags", mode="before")
    @classmethod
    def tags_not_none(cls, v: object) -> List[str]:
        return v if isinstance(v, list) else []

    model_config = {"from_attributes": True}


class AdFeedResponse(BaseModel):
    ads: List[AdResponse]
    total: int


# ── Comment schemas ───────────────────────────────────────────────────────────

class CommentCreate(BaseModel):
    content: str

    @field_validator("content")
    @classmethod
    def content_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Comment cannot be empty")
        return v.strip()


class CommentResponse(BaseModel):
    id: str
    ad_id: str
    user_id: str
    content: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}


# ── View schemas ──────────────────────────────────────────────────────────────

class AdViewResponse(BaseModel):
    ad_id: str
    total_views: int
    user_viewed: bool = False


# ── Campaign / Payment schemas ────────────────────────────────────────────────

class PaymentInitRequest(BaseModel):
    duration_days: int = 1


class PaymentInitResponse(BaseModel):
    checkout_url: str
    payment_ref: str


class PaymentVerifyResponse(BaseModel):
    status: str
    amount: Decimal
    transaction_ref: str


class CampaignResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    ad_id: Optional[str] = None
    duration_days: int
    amount_paid: Decimal
    status: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime
    model_config = {"from_attributes": True}


# ── Wallet / Reward schemas ───────────────────────────────────────────────────

class WalletResponse(BaseModel):
    id: str
    user_id: str
    balance: Decimal
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}


class UserRewardResponse(BaseModel):
    id: str
    user_id: str
    ad_id: str
    reward_type: str
    amount: Decimal
    created_at: datetime
    status: str
    model_config = {"from_attributes": True}
