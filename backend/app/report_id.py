"""
Report ID generation: SLP-YYYY-XXXX (e.g. SLP-2026-00421).
Atomic increment is done in crud.get_next_report_id() using report_id_counter table.
"""

from datetime import datetime


def report_id_format(year: int, num: int) -> str:
    """Format as SLP-YYYY-XXXX (4-digit zero-padded)."""
    return f"SLP-{year}-{num:04d}"
