"""Unit tests for AlertIQ scam detection and scoring."""
import pytest
from app.engine import preprocess_message, evaluate_rules, calculate_risk, build_indicators_and_recommendations


def test_electricity_scam():
    text = (
        "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from BESCOM office "
        "because your previous month bill was not updated. Please immediately contact our electricity officer "
        "at 9845123456 to update your bill."
    )
    pre = preprocess_message(text)
    matches = evaluate_rules(pre)
    assert len(matches) >= 3
    rule_ids = [m.rule_id for m in matches]
    assert "IND_SERVICE_THREAT" in rule_ids
    assert "IND_URGENCY" in rule_ids
    assert "IND_UNOFFICIAL_CONTACT" in rule_ids

    score, level, _, summary = calculate_risk(pre, matches, "en")
    assert score >= 70
    assert level == "High"


def test_bank_kyc_otp_scam():
    text = (
        "SBI Alert: Your SBI NetBanking account will be suspended today due to pending KYC verification. "
        "Click http://bit.ly/sbi-kyc-verify immediately and share the OTP received on your phone to unblock your account."
    )
    pre = preprocess_message(text)
    matches = evaluate_rules(pre)
    rule_ids = [m.rule_id for m in matches]
    assert "IND_OTP_REQUEST" in rule_ids
    assert "IND_URGENCY" in rule_ids
    assert "IND_SUSPICIOUS_LINK_APP" in rule_ids
    assert "IND_KYC_PRETEXT" in rule_ids

    score, level, _, _ = calculate_risk(pre, matches, "en")
    assert score >= 75
    assert level == "High"


def test_part_time_job_scam():
    text = (
        "Congratulations! Selected for Part Time Job. Earn Rs. 5000 daily by simply liking YouTube videos. "
        "Work from home 1 hour daily. Contact our HR manager on Telegram @EarnDailyTask now to claim your first bonus."
    )
    pre = preprocess_message(text)
    matches = evaluate_rules(pre)
    rule_ids = [m.rule_id for m in matches]
    assert "IND_FINANCIAL_BAIT" in rule_ids

    score, level, _, _ = calculate_risk(pre, matches, "en")
    assert score >= 30
    assert level in ["Medium", "High"]


def test_senior_citizen_mode():
    text = "Share the OTP immediately to prevent your account from being suspended."
    pre = preprocess_message(text)
    matches = evaluate_rules(pre)
    score, level, _, _ = calculate_risk(pre, matches, "en")
    indicators, recs, _ = build_indicators_and_recommendations(
        matches=matches,
        risk_level=level,
        risk_score=score,
        language="en",
        senior_mode=True
    )
    assert len(indicators) > 0
    # In senior mode, explanation contains simplified warning text
    otp_ind = next(ind for ind in indicators if ind.id == "IND_OTP_REQUEST")
    assert "DO NOT share any OTP" in otp_ind.explanation


def test_kannada_localization():
    text = "Share the OTP immediately to prevent your account from being suspended."
    pre = preprocess_message(text)
    matches = evaluate_rules(pre)
    score, level, level_kn, summary_kn = calculate_risk(pre, matches, "kn")
    assert "ಅಪಾಯ" in level_kn

    indicators, recs, _ = build_indicators_and_recommendations(
        matches=matches,
        risk_level=level,
        risk_score=score,
        language="kn",
        senior_mode=False
    )
    assert len(indicators) > 0
    otp_ind = next(ind for ind in indicators if ind.id == "IND_OTP_REQUEST")
    assert "ಒಟಿಪಿ" in otp_ind.name
