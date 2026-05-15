from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
import uuid
from datetime import datetime

class TokenData(BaseModel):
    sub: str
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None

class UserInfo(BaseModel):
    id: str
    email: EmailStr
    business_name: str
    profile_picture: Optional[str] = None
    banner_picture: Optional[str] = None
    bio: Optional[str] = None
    number_of_ads_watched: int = 0
    total_ads_watch_time: float = 0.0
    verified: bool = False
    model_config = {"from_attributes": True}

class UserUpdateRequest(BaseModel):
    business_name: Optional[str] = None
    profile_picture: Optional[str] = None
    banner_picture: Optional[str] = None
    bio: Optional[str] = None

    @field_validator("bio")
    @classmethod
    def bio_max_length(cls, v):
        if v and len(v) > 300:
            raise ValueError("Bio must be 300 characters or fewer")
        return v

    @field_validator("profile_picture", "banner_picture")
    @classmethod
    def must_be_cloudinary_url(cls, v):
        if v and "cloudinary.com" not in v:
            raise ValueError("Image URL must be a Cloudinary URL")
        return v

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfo

# ── Ad schemas ────────────────────────────────────────────────

class AdCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    tags: List[str] = []

    @field_validator("tags")
    @classmethod
    def max_five_tags(cls, v):
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
    model_config = {"from_attributes": True}


class AdFeedResponse(BaseModel):
    ads: List[AdResponse]
    total: int
    model_config = {"from_attributes": True}

class LikeResponse(BaseModel):
    user_id: str
    ad_id: str
    created_at: datetime

class CommentCreate(BaseModel):
    content: str

    @field_validator("content")
    @classmethod
    def content_not_empty(cls, v):
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
    user: Optional[UserInfo] = None   # optionally include user details

    model_config = {"from_attributes": True}

class AdViewResponse(BaseModel):
    ad_id: str
    total_views: int
    user_viewed: bool = False   # for current user

class ViewIncrementRequest(BaseModel):
    user_id: Optional[str] = None   # for optional user tracking

class PaymentInitRequest(BaseModel):
    ad_id: str
    duration_days: int = 1   # only 1 day as per your spec

class PaymentInitResponse(BaseModel):
    checkout_url: str
    payment_ref: str

class PaymentVerifyResponse(BaseModel):
    status: str
    amount: Decimal
    transaction_ref: str

class CampaignResponse(BaseModel):
    id: str
    user_id: str
    ad_id: str
    duration_days: int
    amount_paid: Decimal
    status: str   # pending, active, completed
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime
    model_config = {"from_attributes": True}

# ── Wallet / Reward schemas ──────────────────────────────────────

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
    reward_type: str   # VIEW, LIKE, COMMENT
    amount: Decimal
    created_at: datetime
    status: str
    model_config = {"from_attributes": True}