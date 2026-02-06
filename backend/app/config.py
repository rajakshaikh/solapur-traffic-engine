from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Default to SQLite for out-of-the-box local development.
    # Can be overridden with a PostgreSQL URL in the environment.
    DATABASE_URL: str = "sqlite:///./solapur_traffic.db"
    ADMIN_USERNAME: str = "smc_admin"
    ADMIN_PASSWORD: str = "change_me"
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    CORS_ORIGINS: str = "http://localhost:8080,http://localhost:5173,https://solapur-traffic-engine-main.vercel.app"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
