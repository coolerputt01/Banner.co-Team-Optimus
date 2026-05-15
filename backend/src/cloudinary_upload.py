import cloudinary
import cloudinary.uploader
from config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/quicktime", "video/webm"}
MAX_IMAGE_SIZE = 10 * 1024 * 1024   # 10MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB


async def upload_media(file_bytes: bytes, content_type: str, folder: str = "ads") -> str:
    """
    Uploads image or video to Cloudinary and returns the secure URL.
    Raises ValueError for unsupported types or oversized files.
    """
    is_image = content_type in ALLOWED_IMAGE_TYPES
    is_video = content_type in ALLOWED_VIDEO_TYPES

    if not is_image and not is_video:
        raise ValueError(f"Unsupported file type: {content_type}")

    if is_image and len(file_bytes) > MAX_IMAGE_SIZE:
        raise ValueError("Image must be under 10MB")

    if is_video and len(file_bytes) > MAX_VIDEO_SIZE:
        raise ValueError("Video must be under 100MB")

    resource_type = "video" if is_video else "image"

    result = cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        resource_type=resource_type,
        overwrite=False,
    )

    return result["secure_url"]