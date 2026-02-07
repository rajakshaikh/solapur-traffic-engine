from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, Text, Float, Integer
from sqlalchemy.sql import func
from .database import Base
import enum


class ReportIdCounter(Base):
    """Atomic counter for SLP-YYYY-XXXX report IDs (one row per year)."""
    __tablename__ = "report_id_counter"
    year = Column(Integer, primary_key=True)
    next_num = Column(Integer, nullable=False, default=1)


class IssueType(str, enum.Enum):
    parking = "parking"
    hawker = "hawker"
    blocked = "blocked"
    signal = "signal"


class ReportStatus(str, enum.Enum):
    RECEIVED = "RECEIVED"
    UNDER_REVIEW = "UNDER_REVIEW"
    ACTION_PLANNED = "ACTION_PLANNED"
    CLOSED = "CLOSED"
    # Legacy; map to ACTION_PLANNED/CLOSED in UI if needed
    APPROVED = "APPROVED"
    IGNORED = "IGNORED"


class PhotoVerificationStatus(str, enum.Enum):
    VALID = "Valid"
    UNCLEAR = "Unclear"
    POSSIBLY_FAKE = "Possibly Fake"


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, index=True)
    report_id = Column(String(20), unique=True, index=True, nullable=False)  # SLP-2026-24059
    issue_type = Column(SQLEnum(IssueType), nullable=False)
    description = Column(Text, nullable=True)
    # Public URL that the frontend can use to display the photo.
    image_url = Column(String(500), nullable=True)
    # Internal filesystem path relative to the application root, e.g. "uploads/reports/....jpg"
    photo_path = Column(String(500), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_text = Column(String(255), nullable=True)  # human-readable address
    phone_number = Column(String(20), nullable=False, index=True)
    status = Column(SQLEnum(ReportStatus), default=ReportStatus.RECEIVED, nullable=False)
    photo_verification_status = Column(
        SQLEnum(PhotoVerificationStatus),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
