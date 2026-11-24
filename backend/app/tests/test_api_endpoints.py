"""Direct integration test for FastAPI endpoint functions."""
import pytest
from fastapi import HTTPException
from app.main import health_check, get_sample_scenarios, analyze_message
from app.models.request import MessageAnalysisRequest


def test_health_endpoint():
    res = health_check()
    assert res["status"] == "ok"
    assert "AlertIQ" in res["app"]


def test_samples_endpoint():
    samples = get_sample_scenarios()
    assert len(samples) >= 4
    sample_ids = [s.id for s in samples]
    assert "electricity_scam" in sample_ids
    assert "bank_kyc_otp_scam" in sample_ids


def test_analyze_electricity_scam():
    req = MessageAnalysisRequest(
        message=(
            "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from BESCOM office "
            "because your previous month bill was not updated. Please immediately contact our electricity officer "
            "at 9845123456 to update your bill."
        ),
        language="en",
        senior_mode=False
    )
    res = analyze_message(req)
    assert res.risk_score >= 70
    assert res.risk_level == "High"
    assert len(res.detected_indicators) >= 2
    assert len(res.recommendations) >= 2
    assert res.trusted_contact_summary.risk_level == "High"


def test_analyze_senior_mode_kannada():
    req = MessageAnalysisRequest(
        message="Click this link to share OTP and unblock your account immediately.",
        language="kn",
        senior_mode=True
    )
    res = analyze_message(req)
    assert res.risk_score >= 70
    assert res.language == "kn"
    assert res.senior_mode is True
    assert "ಅಪಾಯ" in res.risk_level_localized


def test_analyze_empty_message():
    with pytest.raises((HTTPException, Exception)):
        req = MessageAnalysisRequest(message="   ")
        analyze_message(req)
