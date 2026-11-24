"""English localization and explanations for AlertIQ."""

INDICATOR_TEXTS_EN = {
    "otp_request": {
        "title": "Urgent Request for OTP or Password",
        "explanation": "The message pressures you to reveal an OTP, PIN, or password. Authentic banks and institutions will never ask for your credentials under any circumstances.",
        "why_it_matters": "OTPs are your final security defense. Surrendering an OTP permits attackers to instantly authorize fraudulent bank transfers.",
        "senior": "DO NOT share any OTP or security code with anyone! Real banks NEVER ask for your OTP. If shared, money will be stolen from your account."
    },
    "urgency": {
        "title": "Artificial Urgency & Panic Pressure",
        "explanation": "The message demands immediate action within hours, aiming to provoke anxiety and bypass cautious verification.",
        "why_it_matters": "Scammers fabricate time pressure so victims act impulsively without checking with family or the official institution.",
        "senior": "The message is trying to rush you. Scammers create panic so you don't talk to your family or bank first. Stay calm and do not rush."
    },
    "suspension": {
        "title": "Threat of Disconnection or Account Freezing",
        "explanation": "Claims that electricity power, SIM card, or bank accounts will be disconnected immediately.",
        "why_it_matters": "Fear of losing essential household utilities triggers compliance before the recipient can think rationally.",
        "senior": "They are threatening to cut your electricity or block your account to scare you. Real utility boards send registered letters, not sudden threat SMS."
    },
    "impersonation": {
        "title": "Institutional Impersonation",
        "explanation": "Refers to well-known brands (SBI, HDFC, Bescom, India Post, etc.) to falsely project legitimacy.",
        "why_it_matters": "Criminals rely on brand trust to lower the recipient's skepticism.",
        "senior": "They are pretending to be from a respected bank or government office. Always call the official branch number yourself."
    },
    "financial_bait": {
        "title": "Unrealistic Financial Bait / Lottery / Job",
        "explanation": "Promises unexpected prize money, lottery winnings, tax refunds, or daily earnings for online tasks.",
        "why_it_matters": "Unsolicited reward promises lure victims into paying 'advance processing fees' or sharing bank details.",
        "senior": "Nobody sends free lottery money or easy job income via SMS. If an offer sounds too good to be true, it is always a scam."
    },
    "suspicious_link_app": {
        "title": "Suspicious Link or Remote-Access App Prompt",
        "explanation": "Directs you to shortened URLs or asks you to install remote support tools like AnyDesk or TeamViewer.",
        "why_it_matters": "Remote desktop apps allow criminals full visibility and control of your smartphone screen and passwords.",
        "senior": "Never click unknown links and NEVER install AnyDesk or apps told by strangers over the phone. It allows strangers to control your phone."
    },
    "kyc_pretext": {
        "title": "Urgent KYC / Document Verification Pretext",
        "explanation": "Demands immediate PAN or Aadhaar card linking under threat of account deactivation.",
        "why_it_matters": "KYC updates are the single most common pretext used to harvest identity documents and bank login credentials.",
        "senior": "Do not submit your Aadhaar or PAN card details through SMS links. If your bank needs KYC, visit your local bank branch directly."
    },
    "unofficial_contact": {
        "title": "Personal Contact Number for Official Service",
        "explanation": "Instructs you to contact a personal 10-digit mobile number rather than an official toll-free customer helpline.",
        "why_it_matters": "Calling this number connects you directly to the scammer, who will impersonate a manager or police officer.",
        "senior": "The phone number given is a stranger's private mobile phone, not real customer care. Do not call this number."
    }
}

RECOMMENDATIONS_EN = {
    "do_not_share_credentials": {
        "priority": 1,
        "action": "Do not share OTP, PIN, or passwords",
        "detail": "Never forward or dictate any OTP, CVV, or passwords to anyone, even if they claim to be a bank manager or police officer."
    },
    "do_not_click_links": {
        "priority": 2,
        "action": "Do not click links or install requested apps",
        "detail": "Avoid opening links or installing screen-sharing applications (like AnyDesk or TeamViewer) requested in unexpected messages."
    },
    "verify_official_channel": {
        "priority": 3,
        "action": "Verify through an official, independent channel",
        "detail": "Call the customer care number printed on the back of your debit card or visit the organization's official website directly."
    },
    "report_cybercrime": {
        "priority": 4,
        "action": "Report suspicious activity to national authorities",
        "detail": "In India, report digital scams immediately by dialing 1930 or filing a complaint on the official portal at cybercrime.gov.in."
    },
    "legitimate_message_advice": {
        "priority": 1,
        "action": "Standard Caution Advised",
        "detail": "While this message does not exhibit blatant scam signs, always exercise standard digital caution with unexpected requests."
    }
}
