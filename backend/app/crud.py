from sqlalchemy.orm import Session
from datetime import datetime, timezone
from . import models, schemas
from .report_id import generate_report_id
import uuid


def _ensure_unique_report_id(db: Session) -> str:
    while True:
        rid = generate_report_id()
        if db.query(models.Report).filter(models.Report.report_id == rid).first() is None:
            return rid
    return generate_report_id()


def create_report(db: Session, data: schemas.ReportCreate) -> models.Report:
    pk = str(uuid.uuid4())
    report_id = _ensure_unique_report_id(db)
    r = models.Report(
        id=pk,
        report_id=report_id,
        issue_type=data.issue_type,
        description=data.description,
        image_url=data.image_url,
        photo_path=data.photo_path,
        latitude=data.latitude,
        longitude=data.longitude,
        location_text=data.location_text,
        phone_number=data.phone_number.strip(),
        status=models.ReportStatus.RECEIVED,
        photo_verification_status=None,
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


def get_report_by_id(db: Session, report_id: str) -> models.Report | None:
    return db.query(models.Report).filter(models.Report.report_id == report_id).first()


def get_reports_by_phone(db: Session, phone: str) -> list[models.Report]:
    return db.query(models.Report).filter(models.Report.phone_number == phone.strip()).order_by(models.Report.created_at.desc()).all()


def get_report_by_pk(db: Session, pk: str) -> models.Report | None:
    return db.query(models.Report).filter(models.Report.id == pk).first()


def list_reports(
    db: Session,
    status_filter: models.ReportStatus | None = None,
    issue_type: models.IssueType | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[models.Report]:
    q = db.query(models.Report).order_by(models.Report.created_at.desc())
    if status_filter is not None:
        q = q.filter(models.Report.status == status_filter)
    if issue_type is not None:
        q = q.filter(models.Report.issue_type == issue_type)
    return q.offset(skip).limit(limit).all()


def update_report_status(
    db: Session, report_id: str, new_status: models.ReportStatus
) -> models.Report | None:
    r = get_report_by_id(db, report_id)
    if not r:
        return None
    now = datetime.now(timezone.utc)
    r.status = new_status
    if new_status == models.ReportStatus.APPROVED and r.approved_at is None:
        r.approved_at = now
    if new_status == models.ReportStatus.CLOSED or new_status == models.ReportStatus.IGNORED:
        r.closed_at = now
    db.commit()
    db.refresh(r)
    return r
