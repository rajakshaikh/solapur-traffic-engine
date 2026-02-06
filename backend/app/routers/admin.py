from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from .. import crud, schemas, models
from ..auth import verify_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/reports", response_model=list[schemas.ReportResponse])
def list_reports(
    status: Optional[str] = Query(None),
    issue_type: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: str = Depends(verify_admin),
):
    status_enum = None
    if status:
        try:
            status_enum = models.ReportStatus(status)
        except ValueError:
            raise HTTPException(400, "Invalid status")
    issue_enum = None
    if issue_type:
        try:
            issue_enum = models.IssueType(issue_type)
        except ValueError:
            raise HTTPException(400, "Invalid issue_type")
    return crud.list_reports(db, status_filter=status_enum, issue_type=issue_enum, skip=skip, limit=limit)


@router.patch("/reports/{report_id}/status", response_model=schemas.ReportResponse)
def update_report_status(
    report_id: str,
    body: schemas.ReportStatusUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(verify_admin),
):
    try:
        new_status = models.ReportStatus(body.status)
    except ValueError:
        raise HTTPException(400, "Invalid status")
    r = crud.update_report_status(db, report_id, new_status)
    if not r:
        raise HTTPException(404, "Report not found")
    return r
