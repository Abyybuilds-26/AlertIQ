"""Request models for AlertIQ API."""
from pydantic import BaseModel, Field


class MessageAnalysisRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="The suspicious message text to analyze"
    )
    language: str = Field(
        default="en",
        description="Target language for explanations ('en' for English, 'kn' for Kannada)"
    )
    senior_mode: bool = Field(
        default=False,
        description="Enable simplified high-clarity Senior Citizen Safety Mode"
    )
