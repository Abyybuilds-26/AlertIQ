"""FastAPI main application for AlertIQ."""
import time
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models.request import MessageAnalysisRequest
from app.models.response import MessageAnalysisResponse, SampleScenario
from app.engine import (
    preprocess_message,
    evaluate_rules,
    calculate_risk,
    build_indicators_and_recommendations,
)
from app.data.samples import SAMPLE_SCENARIOS

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Explainable Scam Detection & Digital Safety API",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "tagline": "Detect the warning signs. Understand the risk. Stay safe.",
        "docs": "/docs",
    }


@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}


@app.get("/api/samples", response_model=list[SampleScenario])
def get_sample_scenarios():
    """Returns curated demo scenarios covering high, medium, and low risk examples."""
    return SAMPLE_SCENARIOS


@app.post("/api/analyze", response_model=MessageAnalysisResponse)
def analyze_message(payload: MessageAnalysisRequest):
    """Analyzes message text, detects scam indicators, and returns calibrated explainable assessment."""
    start_time = time.perf_counter()
    raw_text = payload.message.strip()

    if not raw_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty."
        )

    # 1. Preprocess message
    preprocessed = preprocess_message(raw_text)

    # 2. Evaluate rule matches
    matches = evaluate_rules(preprocessed)

    # 3. Calculate calibrated risk score & category
    score, risk_level, risk_level_localized, summary = calculate_risk(
        msg=preprocessed,
        matches=matches,
        language=payload.language
    )

    # 4. Generate explainable indicators, recommendations & trusted contact summary
    indicators, recommendations, trusted_contact_summary = build_indicators_and_recommendations(
        matches=matches,
        risk_level=risk_level,
        risk_score=score,
        language=payload.language,
        senior_mode=payload.senior_mode
    )

    elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

    return MessageAnalysisResponse(
        risk_score=score,
        risk_level=risk_level,
        risk_level_localized=risk_level_localized,
        summary=summary,
        detected_indicators=indicators,
        recommendations=recommendations,
        trusted_contact_summary=trusted_contact_summary,
        processing_time_ms=elapsed_ms,
        language=payload.language,
        senior_mode=payload.senior_mode
    )
