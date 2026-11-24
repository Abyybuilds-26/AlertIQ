"""Response models for AlertIQ API."""
from typing import List
from pydantic import BaseModel, Field


class DetectedIndicator(BaseModel):
    id: str = Field(..., description="Unique indicator identifier")
    category: str = Field(..., description="Classification category (e.g., Credential Theft, Urgency)")
    name: str = Field(..., description="Human-readable title of the warning sign")
    severity: str = Field(..., description="Severity level: 'high', 'medium', or 'low'")
    weight: int = Field(..., description="Assigned score contribution")
    evidence: str = Field(..., description="Exact matched wording or pattern from the input message")
    explanation: str = Field(..., description="Plain-language explanation of this tactic")
    why_it_matters: str = Field(..., description="Why scammers rely on this psychological trigger")


class SafetyRecommendation(BaseModel):
    priority: int = Field(..., description="Execution priority (1 = highest urgency)")
    action: str = Field(..., description="Direct, actionable advice headline")
    detail: str = Field(..., description="Additional actionable clarification or steps")


class TrustedContactSummary(BaseModel):
    risk_level: str
    risk_score: int
    headline: str
    safeguard_text: str
    suggested_message: str


class MessageAnalysisResponse(BaseModel):
    risk_score: int = Field(..., ge=0, le=100, description="Calibrated risk score between 0 and 100")
    risk_level: str = Field(..., description="'Low', 'Medium', or 'High'")
    risk_level_localized: str = Field(..., description="Localized risk level name (e.g. Kannada)")
    summary: str = Field(..., description="Plain-language assessment summary")
    detected_indicators: List[DetectedIndicator] = Field(default_factory=list)
    recommendations: List[SafetyRecommendation] = Field(default_factory=list)
    trusted_contact_summary: TrustedContactSummary
    disclaimer: str = Field(
        default="AlertIQ provides an assistive awareness assessment, not a legal or forensic guarantee. Always verify through official channels."
    )
    processing_time_ms: float = Field(..., description="Time taken to analyze the text in milliseconds")
    language: str = Field(default="en")
    senior_mode: bool = Field(default=False)


class SampleScenario(BaseModel):
    id: str
    title: str
    category: str
    expected_risk: str
    text: str
    description: str
