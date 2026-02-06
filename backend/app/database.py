from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# Support both SQLite (default for easy local setup) and PostgreSQL/other URLs.
engine_kwargs: dict = {
    "pool_pre_ping": True,
}

if settings.DATABASE_URL.startswith("sqlite"):
    # SQLite needs special connect_args and does not use the same pooling params.
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # For PostgreSQL and others, keep a small but robust connection pool.
    engine_kwargs.update(
        {
            "pool_size": 5,
            "max_overflow": 10,
        }
    )

engine = create_engine(settings.DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
