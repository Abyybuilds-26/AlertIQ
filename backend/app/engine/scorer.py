"""Calibrated scoring algorithm for AlertIQ scam indicator engine."""
from typing import List, Tuple
from app.engine.rules import RuleMatch, check_legitimate_dampeners
from app.engine.preprocessor import PreprocessedMessage
from app.localization import RISK_LEVELS_KN


def calculate_risk(
    msg: PreprocessedMessage,
    matches: List[RuleMatch],
    language: str = "en"
) -> Tuple[int, str, str, str]:
    """Calculates risk score (0-100), risk category, localized category, and summary."""
    if not matches:
        score = 0
    else:
        # Base score from matched weights
        raw_score = sum(match.weight for match in matches)
        rule_ids = {m.rule_id for m in matches}

        # High-risk compounding & synergy thresholds:
        # 1. Any Credential/OTP solicitation -> High Risk baseline
        if "IND_OTP_REQUEST" in rule_ids:
            raw_score = max(raw_score, 80)
            if any(r in rule_ids for r in ["IND_URGENCY", "IND_SUSPICIOUS_LINK_APP", "IND_IMPERSONATION"]):
                raw_score = max(raw_score, 90)

        # 2. Service Threat + (Contact OR Link OR Impersonation OR Urgency) -> High Risk
        if "IND_SERVICE_THREAT" in rule_ids:
            if any(r in rule_ids for r in ["IND_UNOFFICIAL_CONTACT", "IND_SUSPICIOUS_LINK_APP", "IND_IMPERSONATION", "IND_URGENCY"]):
                raw_score = max(raw_score, 85)

        # 3. KYC Pretext + (Link OR Threat OR Impersonation OR Urgency) -> High Risk
        if "IND_KYC_PRETEXT" in rule_ids:
            if any(r in rule_ids for r in ["IND_SUSPICIOUS_LINK_APP", "IND_SERVICE_THREAT", "IND_IMPERSONATION", "IND_URGENCY"]):
                raw_score = max(raw_score, 82)

        # 4. Financial Bait + (Link OR Telegram/Contact OR Urgency) -> High Risk
        if "IND_FINANCIAL_BAIT" in rule_ids:
            if any(r in rule_ids for r in ["IND_SUSPICIOUS_LINK_APP", "IND_UNOFFICIAL_CONTACT", "IND_URGENCY"]):
                raw_score = max(raw_score, 78)

        # 5. Remote access tools (AnyDesk, TeamViewer, APK) or Suspicious Link + Brand -> High Risk
        if "IND_SUSPICIOUS_LINK_APP" in rule_ids and "IND_IMPERSONATION" in rule_ids:
            raw_score = max(raw_score, 76)

        if getattr(msg, 'apk_mentions', None) or any("anydesk" in m.evidence.lower() or "apk" in m.evidence.lower() for m in matches):
            raw_score = max(raw_score, 88)

        # Deduct legitimate pattern dampeners (if legitimate warnings/receipts present)
        dampener = check_legitimate_dampeners(msg)
        final_score = max(0, raw_score - dampener)
        score = min(100, final_score)

    # Determine Risk Category
    if score >= 70:
        risk_level = "High"
    elif score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    # Localized risk category
    if language == "kn":
        risk_level_localized = RISK_LEVELS_KN.get(risk_level, risk_level)
    else:
        risk_level_localized = f"{risk_level} Risk"

    # Plain-language summary
    if risk_level == "High":
        if language == "kn":
            summary = "ಎಚ್ಚರಿಕೆ: ಈ ಸಂದೇಶದಲ್ಲಿ ಗಂಭೀರ ವಂಚನೆಯ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿವೆ. ಯಾವುದೇ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ ಅಥವಾ ಒಟಿಪಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ."
        else:
            summary = "High Alert: Multiple serious scam indicators detected. The sender is attempting to extract sensitive credentials, panic you, or compromise your accounts."
    elif risk_level == "Medium":
        if language == "kn":
            summary = "ಗಮನಿಸಿ: ಈ ಸಂದೇಶದಲ್ಲಿ ಕೆಲವು ಸಂಶಯಾಸ್ಪದ ಲಕ್ಷಣಗಳಿವೆ. ಕ್ರಮ ಕೈಗೊಳ್ಳುವ ಮುನ್ನ ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಪರಿಶೀಲಿಸಿ."
        else:
            summary = "Caution Advised: Suspicious warning signs detected. Verify the request through official channels before acting or replying."
    else:
        if language == "kn":
            summary = "ಕಡಿಮೆ ಅಪಾಯ: ಯಾವುದೇ ಪ್ರಮುಖ ವಂಚನೆಯ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಆದರೂ ಅಪರಿಚಿತ ಸಂದೇಶಗಳ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆ ಇರಲಿ."
        else:
            summary = "Low Risk: Few or no scam indicators detected. Standard digital safety practices still apply."

    return score, risk_level, risk_level_localized, summary
