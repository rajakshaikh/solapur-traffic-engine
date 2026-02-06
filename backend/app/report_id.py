import random
from datetime import datetime


def generate_report_id() -> str:
    """Generate unique report ID: SLP-YYYY-NNNNN (e.g. SLP-2026-24059)"""
    year = datetime.utcnow().year
    num = random.randint(10000, 99999)
    return f"SLP-{year}-{num}"
