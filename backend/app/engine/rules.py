"""Scam indicator rule definitions and detection heuristics."""
import re
from typing import List, Optional, Dict, Any
from app.engine.preprocessor import PreprocessedMessage


class RuleMatch:
    def __init__(
        self,
        rule_id: str,
        category: str,
        name: str,
        severity: str,
        weight: int,
        evidence: str,
        explanation_key: str,
    ):
        self.rule_id = rule_id
        self.category = category
        self.name = name
        self.severity = severity
        self.weight = weight
        self.evidence = evidence
        self.explanation_key = explanation_key


# Regex Patterns for Indicators

# 1. OTP / Credential Harvesting (solicitation)
OTP_SOLICIT_REGEX = re.compile(
    r'\b(?:(?:share|send|provide|give|enter|submit|reply\s+with|forward|tell|type|verify|confirm)\s+(?:the\s+|your\s+)?(?:otp|one\s*time\s*password|pin|cvv|password|passcode|mpin|upi\s*pin|debit\s*card|credit\s*card|card\s*number|card\s*details|bank\s*details|banking\s*credentials|netbanking\s*password)|'
    r'(?:verify|confirm|validate|update)\s+(?:your\s+)?(?:otp|password|pin|cvv|credentials|bank\s*details)\s+(?:immediately|to\s+unblock|to\s+claim|here|by\s+clicking|below|now))\b',
    re.IGNORECASE
)

# Check if OTP is in a legitimate "do not share" warning
LEGIT_OTP_WARNING_REGEX = re.compile(
    r'\b(?:do\s*not\s*share|never\s*share|strictly\s*confidential|alert:\s*never\s*tell|neither\s*bank\s*nor\s*anyone\s*asks)\b',
    re.IGNORECASE
)

# 2. Urgency & Panic Induction
URGENCY_REGEX = re.compile(
    r'\b(?:immediately|urgent(?:ly)?|within\s+(?:24|12|6|2|1|hour|hrs|mins?|\d+\s*(?:hours?|minutes?|mins?))|'
    r'today\s+only|today\b|tonight\b|last\s+chance|final\s+notice|final\s+warning|'
    r'act\s+now|action\s+required|account\s+will\s+be\s+(?:blocked|suspended|closed)|expir(?:es?|ing|ed)|'
    r'without\s+delay|immediate\s+action|asap|within\s+today|deadline|overdue)\b',
    re.IGNORECASE
)

# 3. Disconnection / Account Threat
SUSPENSION_REGEX = re.compile(
    r'\b(?:electricity\s+(?:power\s+)?will\s+be\s+(?:disconnected|cut\s*off)|power\s+supply\s+will\s+be\s+disconnected|power\s+(?:will\s+be\s+)?cut|bill\s+(?:not\s+updated|unpaid)|'
    r'account\s+(?:has\s+been|is|will\s+be)\s+(?:suspended|blocked|frozen|disabled|deactivated|locked)|'
    r'card\s+(?:has\s+been|is|will\s+be)\s+(?:blocked|deactivated|suspended)|netbanking\s+(?:blocked|suspended)|'
    r'sim\s+(?:card\s+)?(?:will\s+be\s+deactivated|blocked|terminated)|pan\s+(?:card\s+)?is\s+blocked|'
    r'warrant\s+issued|legal\s+notice|police\s+case|arrest\s+(?:order|warrant)|digital\s+arrest|cbi\s+inquiry|'
    r'customs\s+(?:parcel\s+seized|fine|held)|package\s+seized|tax\s+penalty)\b',
    re.IGNORECASE
)

# 4. Institutional Impersonation
IMPERSONATION_REGEX = re.compile(
    r'\b(?:sbi|state\s*bank\s*of\s*india|hdfc|icici|axis\s*bank|punjab\s*national\s*bank|pnb|bank\s*of\s*baroda|bob|canara\s*bank|kotak|'
    r'bescom|tneb|mseb|electricity\s*department|power\s*corporation|india\s*post|post\s*office|'
    r'income\s*tax\s*(?:department|dept)?|it\s*department|gst\s*department|cbi|cyber\s*crime\s*cell|cyber\s*police|'
    r'reserve\s*bank\s*of\s*india|rbi|trai|telecom\s*department|fedex|bluedart|dhl|delhivery|amazon\s*pay|paytm|phonepe|gpay)\b',
    re.IGNORECASE
)

# 5. Financial Bait / Unrealistic Gains
FINANCIAL_BAIT_REGEX = re.compile(
    r'\b(?:you\s+have\s+won|lottery|lucky\s+draw|cash\s*prize|congratulations|selected\s+for\s+(?:job|part\s*time)|'
    r'part\s*time\s*job|earn\s+(?:rs\.?|inr|\$)?\s*\d{3,6}\s*(?:per\s*day|daily|weekly|hourly)|'
    r'daily\s+income|telegram\s+task|like\s+(?:youtube\s+)?videos\s+(?:and\s+)?earn|work\s+from\s+home\s+earning|'
    r'refund\s+of\s+(?:rs|inr|\$)|cashback\s+(?:credited|waiting)|crypto\s+(?:airdrop|bonus)|free\s+gift|reward\s+points\s+expire)\b',
    re.IGNORECASE
)

# 6. Malicious Links / APK / Remote Access Takeover
SUSPICIOUS_LINK_REGEX = re.compile(
    r'\b(?:click\s+(?:here|on|link|below|to\s+verify|to\s+update)|update\s+(?:via|at)\s*https?://|download\s+(?:app|file|apk)|'
    r'install\s+(?:anydesk|teamviewer|quicksupport|rustdesk|app)|open\s+link|visit\s+link|http://|https://|bit\.ly|tinyurl|t\.me|wa\.me)\b',
    re.IGNORECASE
)

# 7. KYC / Document Extraction Pretext
KYC_PRETEXT_REGEX = re.compile(
    r'\b(?:kyc\s+(?:pending|expired|incomplete|suspended|verification|update|mandatory)|'
    r'update\s+(?:your\s+)?(?:pan|aadhaar|pan\s*card|kyc|identity|documents)|'
    r'link\s+pan\s+with\s+(?:aadhaar|bank)|submit\s+documents\s+immediately|'
    r'verify\s+(?:your\s+)?(?:details|identity|account)\s+to\s+continue)\b',
    re.IGNORECASE
)

# 8. Unofficial / Personal Contact Prompts for Official Matters or Telegram/WhatsApp HR
UNOFFICIAL_CONTACT_REGEX = re.compile(
    r'\b(?:(?:contact|call|reach|whatsapp)\s+(?:our\s+)?(?:electricity\s+|bank\s+|nodal\s+|customer\s+|hr\s+)?(?:officer|executive|manager|agent|sir|person)?\s*(?:at|on|number)?\s*[:\s-]?\s*[6-9]\d{9}|'
    r'(?:contact|reach|message)\s+(?:our\s+)?(?:hr\s+|team\s+)?(?:manager|executive|officer)?\s*(?:on|via|at)\s*(?:telegram|whatsapp)|'
    r'send\s+whatsapp\s+message\s+to\s+[6-9]\d{9}|send\s+message\s+on\s+telegram|telegram\s+@[a-zA-Z0-9_]+)\b',
    re.IGNORECASE
)

# 9. Legitimate Message Indicators (Dampeners)
LEGIT_TRANSACTION_REGEX = re.compile(
    r'\b(?:debited\s+by\s+(?:rs|inr)|credited\s+with\s+(?:rs|inr)|avl\s*bal|available\s*balance|'
    r'order\s+(?:has\s+been\s+)?(?:dispatched|shipped|delivered|confirmed)|tracking\s+id|track\s+your\s+order)\b',
    re.IGNORECASE
)


def evaluate_rules(msg: PreprocessedMessage) -> List[RuleMatch]:
    matches: List[RuleMatch] = []
    text = msg.normalized_text
    lower = msg.lower_text

    # Rule 1: Solicitation of OTP / Credentials
    otp_solicit = OTP_SOLICIT_REGEX.search(text)
    if otp_solicit:
        matches.append(
            RuleMatch(
                rule_id="IND_OTP_REQUEST",
                category="Credential Harvesting",
                name="Urgent Request for OTP or Password",
                severity="high",
                weight=35,
                evidence=otp_solicit.group(0),
                explanation_key="otp_request"
            )
        )

    # Rule 2: Urgency / Time Pressure
    urgency_match = URGENCY_REGEX.search(text)
    if urgency_match:
        matches.append(
            RuleMatch(
                rule_id="IND_URGENCY",
                category="Psychological Manipulation",
                name="Artificial Urgency & Time Pressure",
                severity="medium" if len(matches) == 0 else "high",
                weight=25,
                evidence=urgency_match.group(0),
                explanation_key="urgency"
            )
        )

    # Rule 3: Threat of Suspension / Disconnection
    suspension_match = SUSPENSION_REGEX.search(text)
    if suspension_match:
        matches.append(
            RuleMatch(
                rule_id="IND_SERVICE_THREAT",
                category="Coercion & Intimidation",
                name="Threat of Disconnection or Legal Action",
                severity="high",
                weight=30,
                evidence=suspension_match.group(0),
                explanation_key="suspension"
            )
        )

    # Rule 4: Institutional Impersonation
    impersonation_match = IMPERSONATION_REGEX.search(text)
    # Impersonation is significant if combined with threats, KYC, or links
    if impersonation_match:
        matches.append(
            RuleMatch(
                rule_id="IND_IMPERSONATION",
                category="Impersonation",
                name=f"Brand or Authority Reference ({impersonation_match.group(0).upper()})",
                severity="medium",
                weight=20,
                evidence=impersonation_match.group(0),
                explanation_key="impersonation"
            )
        )

    # Rule 5: Financial Bait / Lottery / Work From Home
    bait_match = FINANCIAL_BAIT_REGEX.search(text)
    if bait_match:
        matches.append(
            RuleMatch(
                rule_id="IND_FINANCIAL_BAIT",
                category="Financial Bait",
                name="Unrealistic Financial Bait or Reward",
                severity="high",
                weight=35,
                evidence=bait_match.group(0),
                explanation_key="financial_bait"
            )
        )

    # Rule 6: Malicious Links / Shorteners / APK / Remote Desktop
    if msg.shortened_urls or msg.apk_mentions or SUSPICIOUS_LINK_REGEX.search(text):
        evidence_items = []
        if msg.shortened_urls:
            evidence_items.append(f"Shortened link ({msg.shortened_urls[0]})")
        if msg.apk_mentions:
            evidence_items.append(f"Remote access or APK ({msg.apk_mentions[0]})")
        link_action = SUSPICIOUS_LINK_REGEX.search(text)
        if link_action and not evidence_items:
            evidence_items.append(link_action.group(0))

        matches.append(
            RuleMatch(
                rule_id="IND_SUSPICIOUS_LINK_APP",
                category="Malicious Vector",
                name="Suspicious Link or Software Download",
                severity="high",
                weight=25,
                evidence=", ".join(evidence_items) if evidence_items else "Suspicious web or app link",
                explanation_key="suspicious_link_app"
            )
        )

    # Rule 7: KYC Verification Pretext
    kyc_match = KYC_PRETEXT_REGEX.search(text)
    if kyc_match:
        matches.append(
            RuleMatch(
                rule_id="IND_KYC_PRETEXT",
                category="Identity Harvesting",
                name="KYC / Account Verification Pretext",
                severity="medium",
                weight=20,
                evidence=kyc_match.group(0),
                explanation_key="kyc_pretext"
            )
        )

    # Rule 8: Unofficial Personal Phone / Contact for Official Business
    unofficial_match = UNOFFICIAL_CONTACT_REGEX.search(text)
    if unofficial_match:
        matches.append(
            RuleMatch(
                rule_id="IND_UNOFFICIAL_CONTACT",
                category="Suspicious Contact",
                name="Personal Mobile Number for Official Utility / Bank Service",
                severity="medium",
                weight=15,
                evidence=unofficial_match.group(0),
                explanation_key="unofficial_contact"
            )
        )

    return matches


def check_legitimate_dampeners(msg: PreprocessedMessage) -> int:
    """Computes risk reduction points if the message exhibits classic legitimate patterns."""
    text = msg.normalized_text
    dampener = 0

    # Case A: An authentic security OTP notification that explicitly says "Do not share"
    if LEGIT_OTP_WARNING_REGEX.search(text) and not OTP_SOLICIT_REGEX.search(text):
        dampener += 30

    # Case B: Standard transactional alert (bank debit/credit with available balance)
    if LEGIT_TRANSACTION_REGEX.search(text) and not SUSPENSION_REGEX.search(text):
        dampener += 20

    return dampener
