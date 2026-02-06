from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, Text, Float
from sqlalchemy.sql import func
from .database import Base
import enum


class IssueType(str, enum.Enum):
    parking = "parking"
    hawker = "hawker"
    blocked = "blocked"
    signal = "signal"


class ReportStatus(str, enum.Enum):
    RECEIVED = "RECEIVED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    IGNORED = "IGNORED"
    CLOSED = "CLOSED"


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
