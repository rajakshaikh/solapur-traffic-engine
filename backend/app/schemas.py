from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .models import IssueType, ReportStatus, PhotoVerificationStatus


class ReportCreate(BaseModel):
    issue_type: IssueType
    description: Optional[str] = None
    image_url: Optional[str] = None
    # Relative filesystem path of saved photo, e.g. "uploads/reports/xyz.jpg"
    photo_path: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    # Free-text location string from citizen form.
    location_text: Optional[str] = None
    phone_number: str


class ReportResponse(BaseModel):
    id: str
    report_id: str
    issue_type: IssueType
    description: Optional[str] = None
    image_url: Optional[str] = None
    photo_path: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_text: Optional[str] = None
    phone_number: str
    status: ReportStatus
    created_at: datetime
    approved_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    photo_verification_status: Optional[PhotoVerificationStatus] = None

    class Config:
        from_attributes = True


class ReportStatusUpdate(BaseModel):
    status: ReportStatus


class UploadResponse(BaseModel):
    url: str
    public_id: Optional[str] = None


class PhotoReportItem(BaseModel):
    report_id: str
    issue_type: IssueType
    location: Optional[str]
    photo_url: str
    submitted_at: datetime
    photo_status: str


class PhotoStatusUpdate(BaseModel):
    photo_status: PhotoVerificationStatus


class ReportCreateResult(BaseModel):
    success: bool
    report_id: str
    status: ReportStatus
