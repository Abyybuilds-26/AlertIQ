"""Unit tests verifying that legitimate messages are not falsely classified as scams."""
from app.engine import preprocess_message, evaluate_rules, calculate_risk


def test_legit_bank_debit():
    text = (
        "Rs. 450.00 debited from your HDFC Bank A/c ending XX4912 on 19-Nov-26 at CAFE COFFEE DAY. "
        "Avl Bal: Rs. 28,450.00. If not done by you, call 18002664332 or SMS BLOCK to 5676712."
    )
    pre = preprocess_message(text)
    matches = evaluate_rules(pre)
    score, level, _, _ = calculate_risk(pre, matches, "en")
    assert score < 35
    assert level == "Low"


def test_legit_otp_security_warning():
    text = (
        "Your Amazon verification code is 492011. Strictly confidential. "
        "Do not share this OTP with anyone, including customer service agents."
    )
    pre = preprocess_message(text)
    matches = evaluate_rules(pre)
    # The message says "do not share", so it should NOT be flagged as OTP harvesting
    rule_ids = [m.rule_id for m in matches]
    assert "IND_OTP_REQUEST" not in rule_ids
    score, level, _, _ = calculate_risk(pre, matches, "en")
    assert score < 35
    assert level == "Low"


def test_legit_ecommerce_delivery():
    text = (
        "Your order #921820 from Flipkart has been dispatched and is arriving tomorrow. "
        "Track package on the Flipkart app."
    )
    pre = preprocess_message(text)
    matches = evaluate_rules(pre)
    score, level, _, _ = calculate_risk(pre, matches, "en")
    assert score < 35
    assert level == "Low"
