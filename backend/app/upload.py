import base64
import uuid
from fastapi import UploadFile
from .config import settings

try:
    import cloudinary
    import cloudinary.uploader
    CLOUDINARY_AVAILABLE = bool(
        settings.CLOUDINARY_CLOUD_NAME
        and settings.CLOUDINARY_API_KEY
        and settings.CLOUDINARY_API_SECRET
    )
    if CLOUDINARY_AVAILABLE:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
        )
except Exception:
    CLOUDINARY_AVAILABLE = False


async def upload_image(file: UploadFile) -> str | None:
    """Upload image to Cloudinary. Returns URL or None if not configured."""
    if not CLOUDINARY_AVAILABLE:
        return None
    try:
        contents = await file.read()
        result = cloudinary.uploader.upload(
            contents,
            folder="solapur_reports",
            public_id=str(uuid.uuid4())[:8],
            overwrite=True,
        )
        return result.get("secure_url")
    except Exception:
        return None


async def upload_image_base64(data_url: str) -> str | None:
    """Upload from base64 data URL (from canvas/camera). Returns URL or None."""
    if not CLOUDINARY_AVAILABLE:
        return None
    try:
        if "," in data_url:
            payload = data_url.split(",", 1)[1]
        else:
            payload = data_url
        result = cloudinary.uploader.upload(
            f"data:image/jpeg;base64,{payload}",
            folder="solapur_reports",
            public_id=str(uuid.uuid4())[:8],
            overwrite=True,
        )
        return result.get("secure_url")
    except Exception:
        return None
