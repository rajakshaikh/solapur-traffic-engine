from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timezone
from . import models, schemas
from .database import engine
from .report_id import report_id_format
import uuid


def get_next_report_id(db: Session) -> str:
    """
    Atomically get next report ID in format SLP-YYYY-XXXX.
    Uses report_id_counter table for safe increment.
    """
    year = datetime.now(timezone.utc).year
    is_sqlite = engine.url.get_backend_name() == "sqlite"
    if is_sqlite:
        db.execute(
            text(
                "INSERT INTO report_id_counter (year, next_num) VALUES (:y, 1) "
                "ON CONFLICT(year) DO UPDATE SET next_num = next_num + 1"
            ),
            {"y": year},
        )
    else:
        db.execute(
            text(
                "INSERT INTO report_id_counter (year, next_num) VALUES (:y, 1) "
                "ON CONFLICT(year) DO UPDATE SET next_num = report_id_counter.next_num + 1"
            ),
            {"y": year},
        )
    row = db.execute(
        text("SELECT next_num FROM report_id_counter WHERE year = :y"),
        {"y": year},
    ).fetchone()
    num = row[0] if row else 1
    return report_id_format(year, num)


def create_report(
    db: Session, data: schemas.ReportCreate, report_id: str | None = None
) -> models.Report:
    pk = str(uuid.uuid4())
    if report_id is None:
        report_id = get_next_report_id(db)
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
    if new_status in (models.ReportStatus.ACTION_PLANNED, models.ReportStatus.APPROVED) and r.approved_at is None:
        r.approved_at = now
    if new_status in (models.ReportStatus.CLOSED, models.ReportStatus.IGNORED):
        r.closed_at = now
    db.commit()
    db.refresh(r)
    return r
