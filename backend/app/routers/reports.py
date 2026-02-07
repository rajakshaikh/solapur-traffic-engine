from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from typing import Optional
from pathlib import Path
from datetime import datetime, timezone

from ..database import get_db
from .. import crud, schemas, models

router = APIRouter(prefix="/api/reports", tags=["reports"])

UPLOADS_ROOT = Path("uploads") / "reports"


@router.post("", response_model=schemas.ReportCreateResult)
async def create_report(
    issue_type: str = Form(...),
    description: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    location: Optional[str] = Form(None),
    phone_number: str = Form(...),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """
    Citizen report submission.

    - Generates a unique report_id (SLP-YYYY-XXXX) on the backend
    - Saves optional photo to /uploads/reports as report_id.jpg (or same extension)
    - Persists report with status RECEIVED
    """
    try:
        it = models.IssueType(issue_type)
    except ValueError:
        raise HTTPException(400, "Invalid issue_type")

    photo_path: Optional[str] = None
    image_url: Optional[str] = None
    report_id_for_file: Optional[str] = None

    if photo is not None:
        report_id_for_file = crud.get_next_report_id(db)
        UPLOADS_ROOT.mkdir(parents=True, exist_ok=True)
        suffix = (Path(photo.filename).suffix or ".jpg").lower()
        if suffix not in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"}:
            suffix = ".jpg"
        filename = f"{report_id_for_file}{suffix}"
        dest = UPLOADS_ROOT / filename
        contents = await photo.read()
        dest.write_bytes(contents)
        photo_path = f"uploads/reports/{filename}"
        image_url = f"/uploads/reports/{filename}"

    data = schemas.ReportCreate(
        issue_type=it,
        description=description,
        image_url=image_url,
        photo_path=photo_path,
        latitude=latitude,
        longitude=longitude,
        location_text=location,
        phone_number=phone_number,
    )
    report = crud.create_report(db, data, report_id=report_id_for_file)
    return schemas.ReportCreateResult(
        success=True,
        report_id=report.report_id,
        status=report.status,
    )


@router.get("", response_model=list[schemas.ReportResponse])
def list_all_reports(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    List all citizen reports (for SMC Dashboard). Sorted by latest first.
    Includes photo URL for each report.
    """
    reports = (
        db.query(models.Report)
        .order_by(models.Report.created_at.desc())
        .all()
    )
    base_url = str(request.base_url).rstrip("/")
    out: list[schemas.ReportResponse] = []
    for r in reports:
        # Ensure image_url is absolute when needed for cross-origin frontend
        image_url = r.image_url
        if image_url and not image_url.startswith("http"):
            image_url = f"{base_url}{image_url}" if image_url.startswith("/") else f"{base_url}/{image_url}"
        out.append(
            schemas.ReportResponse(
                id=r.id,
                report_id=r.report_id,
                issue_type=r.issue_type,
                description=r.description,
                image_url=image_url or r.image_url,
                photo_path=r.photo_path,
                latitude=r.latitude,
                longitude=r.longitude,
                location_text=r.location_text,
                phone_number=r.phone_number,
                status=r.status,
                created_at=r.created_at,
                approved_at=r.approved_at,
                closed_at=r.closed_at,
                updated_at=r.updated_at,
                photo_verification_status=r.photo_verification_status,
            )
        )
    return out


@router.get("/photos", response_model=list[schemas.PhotoReportItem])
def list_photo_reports_for_verification(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    List reports that have an associated photo for SMC verification.
    """
    reports = (
        db.query(models.Report)
        .filter(models.Report.photo_path.isnot(None))
        .order_by(models.Report.created_at.desc())
        .all()
    )
    base_url = str(request.base_url).rstrip("/")
    items: list[schemas.PhotoReportItem] = []
    for r in reports:
        # If image_url is already absolute, use it; otherwise build from base URL.
        if r.image_url and r.image_url.startswith("http"):
            photo_url = r.image_url
        else:
            rel = r.photo_path or r.image_url or ""
            if rel.startswith("uploads/"):
                rel = rel[len("uploads/") :]
            photo_url = f"{base_url}/uploads/{rel.replace('uploads/', '').lstrip('/')}"

        status = r.photo_verification_status.value if r.photo_verification_status else "Pending"

        items.append(
            schemas.PhotoReportItem(
                report_id=r.report_id,
                issue_type=r.issue_type,
                location=r.location_text,
                photo_url=photo_url,
                submitted_at=r.created_at,
                photo_status=status,
            )
        )
    return items


@router.put("/{report_id}/photo-status", response_model=schemas.ReportResponse)
def update_photo_status(
    report_id: str,
    body: schemas.PhotoStatusUpdate,
    db: Session = Depends(get_db),
):
    """
    Update photo verification status for a report.
    """
    r = crud.get_report_by_id(db, report_id)
    if not r:
        raise HTTPException(404, "Report not found")
    r.photo_verification_status = body.photo_status
    db.commit()
    db.refresh(r)
    return r


@router.get("/search", response_model=list[schemas.ReportResponse])
def search_reports(
    report_id: Optional[str] = None,
    phone: Optional[str] = None,
    db: Session = Depends(get_db),
):
    if report_id:
        r = crud.get_report_by_id(db, report_id.strip())
        return [r] if r else []
    if phone:
        return crud.get_reports_by_phone(db, phone)
    raise HTTPException(400, "Provide report_id or phone")


@router.get("/{report_id}", response_model=schemas.ReportResponse)
def get_report(
    request: Request,
    report_id: str,
    db: Session = Depends(get_db),
):
    r = crud.get_report_by_id(db, report_id)
    if not r:
        raise HTTPException(404, "Report not found")
    image_url = r.image_url
    if image_url and not image_url.startswith("http"):
        base_url = str(request.base_url).rstrip("/")
        image_url = f"{base_url}{image_url}" if image_url.startswith("/") else f"{base_url}/{image_url}"
    return schemas.ReportResponse(
        id=r.id,
        report_id=r.report_id,
        issue_type=r.issue_type,
        description=r.description,
        image_url=image_url or r.image_url,
        photo_path=r.photo_path,
        latitude=r.latitude,
        longitude=r.longitude,
        location_text=r.location_text,
        phone_number=r.phone_number,
        status=r.status,
        created_at=r.created_at,
        approved_at=r.approved_at,
        closed_at=r.closed_at,
        updated_at=r.updated_at,
        photo_verification_status=r.photo_verification_status,
    )


@router.patch("/{report_id}", response_model=schemas.ReportResponse)
def update_report_status(
    report_id: str,
    body: schemas.ReportStatusUpdate,
    db: Session = Depends(get_db),
):
    """Update report status (e.g. from SMC Dashboard)."""
    try:
        new_status = models.ReportStatus(body.status)
    except ValueError:
        raise HTTPException(400, "Invalid status")
    r = crud.update_report_status(db, report_id, new_status)
    if not r:
        raise HTTPException(404, "Report not found")
    return r
