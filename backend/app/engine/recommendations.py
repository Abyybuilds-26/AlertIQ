"""Generate explainable indicators, recommendations, and trusted contact summaries."""
from typing import List, Tuple
from app.engine.rules import RuleMatch
from app.models.response import DetectedIndicator, SafetyRecommendation, TrustedContactSummary
from app.localization import (
    INDICATOR_TEXTS_EN,
    INDICATOR_TEXTS_KN,
    RECOMMENDATIONS_EN,
    RECOMMENDATIONS_KN,
)


def build_indicators_and_recommendations(
    matches: List[RuleMatch],
    risk_level: str,
    risk_score: int,
    language: str = "en",
    senior_mode: bool = False
) -> Tuple[List[DetectedIndicator], List[SafetyRecommendation], TrustedContactSummary]:
    indicators: List[DetectedIndicator] = []
    texts_dict = INDICATOR_TEXTS_KN if language == "kn" else INDICATOR_TEXTS_EN
    recs_dict = RECOMMENDATIONS_KN if language == "kn" else RECOMMENDATIONS_EN

    rule_ids = set()

    for m in matches:
        rule_ids.add(m.rule_id)
        info = texts_dict.get(m.explanation_key, {})
        title = info.get("title", m.name)

        if senior_mode and "senior" in info:
            explanation = info["senior"]
            why_it_matters = info.get("why_it_matters", "")
        else:
            explanation = info.get("explanation", "Warning sign detected.")
            why_it_matters = info.get("why_it_matters", "Common psychological manipulation tactic.")

        indicators.append(
            DetectedIndicator(
                id=m.rule_id,
                category=m.category,
                name=title,
                severity=m.severity,
                weight=m.weight,
                evidence=m.evidence,
                explanation=explanation,
                why_it_matters=why_it_matters,
            )
        )

    # Build prioritized recommendations
    recommendations: List[SafetyRecommendation] = []
    added_keys = set()

    if "IND_OTP_REQUEST" in rule_ids:
        r = recs_dict["do_not_share_credentials"]
        recommendations.append(SafetyRecommendation(**r))
        added_keys.add("do_not_share_credentials")

    if "IND_SUSPICIOUS_LINK_APP" in rule_ids or "IND_FINANCIAL_BAIT" in rule_ids:
        r = recs_dict["do_not_click_links"]
        if "do_not_click_links" not in added_keys:
            recommendations.append(SafetyRecommendation(**r))
            added_keys.add("do_not_click_links")

    if risk_level in ["High", "Medium"]:
        r_ver = recs_dict["verify_official_channel"]
        if "verify_official_channel" not in added_keys:
            recommendations.append(SafetyRecommendation(**r_ver))
            added_keys.add("verify_official_channel")

        r_rep = recs_dict["report_cybercrime"]
        if "report_cybercrime" not in added_keys:
            recommendations.append(SafetyRecommendation(**r_rep))
            added_keys.add("report_cybercrime")
    else:
        r_legit = recs_dict["legitimate_message_advice"]
        recommendations.append(SafetyRecommendation(**r_legit))

    # Sort recommendations by priority
    recommendations.sort(key=lambda x: x.priority)

    # Build Trusted Contact Summary (Safe summary without private content exposure)
    if risk_level == "High":
        headline = "High-Risk Scam Pattern Detected" if language != "kn" else "ಹೆಚ್ಚಿನ ಅಪಾಯದ ವಂಚನೆ ಪತ್ತೆಯಾಗಿದೆ"
        safeguard_text = (
            "We advised the recipient not to share any OTP, passwords, or personal details, and to avoid clicking links."
            if language != "kn"
            else "ಯಾವುದೇ ಒಟಿಪಿ ಅಥವಾ ಗೌಪ್ಯ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಬೇಡಿ ಮತ್ತು ಲಿಂಕ್‌ಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ ಎಂದು ಸೂಚಿಸಲಾಗಿದೆ."
        )
        suggested_message = (
            f"AlertIQ Safety Alert: I analyzed a suspicious message that received a HIGH risk score ({risk_score}/100). "
            f"Key warning signs: {', '.join(m.name for m in matches[:2])}. "
            f"AlertIQ advised verifying through official numbers before acting. Sharing for your awareness."
        )
    elif risk_level == "Medium":
        headline = "Medium-Risk Message Detected" if language != "kn" else "ಮಧ್ಯಮ ಅಪಾಯದ ಸಂದೇಶ ಪತ್ತೆಯಾಗಿದೆ"
        safeguard_text = (
            "The message exhibits questionable warning signs. We recommended independent verification."
            if language != "kn"
            else "ಸಂದೇಶದಲ್ಲಿ ಅನುಮಾನಾಸ್ಪದ ಲಕ್ಷಣಗಳಿವೆ. ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಪರಿಶೀಲಿಸಲು ಸೂಚಿಸಲಾಗಿದೆ."
        )
        suggested_message = (
            f"AlertIQ Safety Alert: I analyzed a suspicious message scored at {risk_score}/100 (Medium Risk). "
            f"Please help me double check this before I respond."
        )
    else:
        headline = "Low-Risk Assessment" if language != "kn" else "ಕಡಿಮೆ ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ"
        safeguard_text = (
            "No aggressive scam indicators were detected. Standard verification is still recommended."
            if language != "kn"
            else "ಯಾವುದೇ ಪ್ರಮುಖ ವಂಚನೆಯ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ."
        )
        suggested_message = (
            f"AlertIQ Info: Message analyzed with score {risk_score}/100 (Low Risk). Standard caution observed."
        )

    trusted_contact_summary = TrustedContactSummary(
        risk_level=risk_level,
        risk_score=risk_score,
        headline=headline,
        safeguard_text=safeguard_text,
        suggested_message=suggested_message,
    )

    return indicators, recommendations, trusted_contact_summary
