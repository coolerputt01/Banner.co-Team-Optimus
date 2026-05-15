from sqlalchemy import Boolean, Column, Float, Integer, String, Text, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
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

class Ad(Base):
    __tablename__ = "ads"
    id          = Column(String, primary_key=True)        # uuid
    user_id     = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title       = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    media_url   = Column(String, nullable=True)           # Cloudinary URL (image or video)
    tags        = Column(ARRAY(String), nullable=False, default=[])
    owner       = relationship("User", back_populates="ads")