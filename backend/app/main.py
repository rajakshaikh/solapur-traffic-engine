from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .database import Base, engine
from .routers import reports, admin
from sqlalchemy import text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "https://solapur-traffic-engine.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and is served at /uploads
UPLOADS_DIR = Path("uploads")
(UPLOADS_DIR / "reports").mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

app.include_router(reports.router)
app.include_router(admin.router)


def _run_simple_migrations() -> None:
    """
    Minimal, SQLite-friendly migrations so older local DBs don't crash
    when new columns are added.
    """
    if engine.url.get_backend_name() != "sqlite":
        return
    with engine.connect() as conn:
        cols = conn.execute(text("PRAGMA table_info(reports);")).fetchall()
        existing = {row[1] for row in cols}  # type: ignore[index]
        if "photo_path" not in existing:
            conn.execute(text("ALTER TABLE reports ADD COLUMN photo_path VARCHAR(500);"))
        if "photo_verification_status" not in existing:
            conn.execute(text("ALTER TABLE reports ADD COLUMN photo_verification_status VARCHAR(50);"))
        conn.commit()


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    _run_simple_migrations()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
