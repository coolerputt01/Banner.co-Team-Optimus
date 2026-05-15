from sqlalchemy import Boolean, Column, Float, Integer, String, Text, ForeignKey, ARRAY,UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id                    = Column(String, primary_key=True)
    email                 = Column(String, nullable=False, unique=True)
    business_name         = Column(String, nullable=False, default="")
    profile_picture       = Column(String, nullable=True)
    banner_picture        = Column(String, nullable=True)
    bio                   = Column(Text, nullable=True)
    number_of_ads_watched = Column(Integer, nullable=False, default=0)
    total_ads_watch_time  = Column(Float, nullable=False, default=0.0)
    verified              = Column(Boolean, nullable=False, default=False)
    ads                   = relationship("Ad", back_populates="owner", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    ad_views = relationship("AdView", back_populates="user", cascade="all, delete-orphan")

class Ad(Base):
    __tablename__ = "ads"
    id          = Column(String, primary_key=True)        # uuid
    user_id     = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title       = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    media_url   = Column(String, nullable=True)           # Cloudinary URL (image or video)
    tags        = Column(ARRAY(String), nullable=False, default=[])
    owner       = relationship("User", back_populates="ads")
    likes = relationship("Like", back_populates="ad", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="ad", cascade="all, delete-orphan")
    views_count = Column(Integer, nullable=False, default=0)
    views = relationship("AdView", back_populates="ad", cascade="all, delete-orphan")


class Like(Base):
    __tablename__ = "likes"
    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id    = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    ad_id      = Column(String, ForeignKey("ads.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint("user_id", "ad_id", name="unique_user_ad_like"),)

    user = relationship("User", back_populates="likes")
    ad   = relationship("Ad", back_populates="likes")


class Comment(Base):
    __tablename__ = "comments"
    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    ad_id      = Column(String, ForeignKey("ads.id", ondelete="CASCADE"), nullable=False)
    user_id    = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content    = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="comments")
    ad   = relationship("Ad", back_populates="comments")

class AdView(Base):
    __tablename__ = "ad_views"
    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    ad_id      = Column(String, ForeignKey("ads.id", ondelete="CASCADE"), nullable=False)
    user_id    = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)   # null for anonymous
    viewed_at  = Column(DateTime(timezone=True), server_default=func.now())
    ip_address = Column(String, nullable=True)   # optional, for dedup without login

    __table_args__ = (UniqueConstraint("ad_id", "user_id", name="unique_ad_user_view"),)

    ad   = relationship("Ad", back_populates="views")
    user = relationship("User", back_populates="ad_views")