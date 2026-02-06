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

    - Generates a unique report_id (SLP-YYYY-XXXXX)
    - Saves optional photo to /uploads/reports and stores relative path
    - Persists report with status RECEIVED
    """
    try:
        it = models.IssueType(issue_type)
    except ValueError:
        raise HTTPException(400, "Invalid issue_type")

    photo_path: Optional[str] = None
    image_url: Optional[str] = None
    if photo is not None:
        UPLOADS_ROOT.mkdir(parents=True, exist_ok=True)
        # Create a safe unique filename
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")
        suffix = Path(photo.filename).suffix or ".jpg"
        filename = f"{timestamp}{suffix}"
        dest = UPLOADS_ROOT / filename
        contents = await photo.read()
        dest.write_bytes(contents)
        # Store a relative path in DB; image_url is the public URL.
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
    report = crud.create_report(db, data)
    return schemas.ReportCreateResult(
        success=True,
        report_id=report.report_id,
        status=report.status,
    )


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
def get_report(report_id: str, db: Session = Depends(get_db)):
    r = crud.get_report_by_id(db, report_id)
    if not r:
        raise HTTPException(404, "Report not found")
    return r
