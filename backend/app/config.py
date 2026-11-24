"""Application configuration and constants for AlertIQ."""
from pydantic import BaseModel


class Settings(BaseModel):
    APP_NAME: str = "AlertIQ API"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DEBUG: bool = False
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]


settings = Settings()
