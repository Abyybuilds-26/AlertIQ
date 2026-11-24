"""Pre-configured sample messages for repeatable demonstration."""
from app.models.response import SampleScenario

SAMPLE_SCENARIOS = [
    SampleScenario(
        id="electricity_scam",
        title="Electricity Disconnection Threat",
        category="Utility Scam (Bescom/Power Board)",
        expected_risk="High",
        text=(
            "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from BESCOM office "
            "because your previous month bill was not updated. Please immediately contact our electricity officer "
            "at 9845123456 to update your bill."
        ),
        description="Threatens utility disconnection, creates urgent panic, and provides an unofficial 10-digit mobile number."
    ),
    SampleScenario(
        id="bank_kyc_otp_scam",
        title="Bank KYC & OTP Harvesting",
        category="Banking Phishing",
        expected_risk="High",
        text=(
            "SBI Alert: Your SBI NetBanking account will be suspended today due to pending KYC verification. "
            "Click http://bit.ly/sbi-kyc-verify immediately and share the OTP received on your phone to unblock your account."
        ),
        description="Demonstrates brand impersonation, account freeze threat, shortened link, and direct OTP solicitation."
    ),
    SampleScenario(
        id="part_time_job_scam",
        title="Part-Time Job & Telegram Task",
        category="Financial Bait",
        expected_risk="Medium",
        text=(
            "Congratulations! Selected for Part Time Job. Earn Rs. 5000 daily by simply liking YouTube videos. "
            "Work from home 1 hour daily. Contact our HR manager on Telegram @EarnDailyTask now to claim your first bonus."
        ),
        description="Exploits financial greed using unrealistic daily income promises for trivial online tasks."
    ),
    SampleScenario(
        id="legit_bank_txn",
        title="Authentic Bank Debit Notification",
        category="Legitimate Banking Notification",
        expected_risk="Low",
        text=(
            "Rs. 450.00 debited from your HDFC Bank A/c ending XX4912 on 19-Nov-26 at CAFE COFFEE DAY. "
            "Avl Bal: Rs. 28,450.00. If not done by you, call 18002664332 or SMS BLOCK to 5676712."
        ),
        description="Standard debit receipt showing masked account number, merchant name, and balance without pressure."
    ),
    SampleScenario(
        id="legit_delivery_otp",
        title="Authentic Order Delivery & OTP Caution",
        category="Legitimate E-Commerce",
        expected_risk="Low",
        text=(
            "Your Amazon package with tracking #AMZ89210 is out for delivery today. "
            "Your delivery OTP is 492011. Strictly confidential. Never share this OTP with anyone over the phone; "
            "share only in person with delivery agent upon receiving the package."
        ),
        description="Authentic delivery notice explicitly telling recipient never to share OTP over the phone."
    )
]
