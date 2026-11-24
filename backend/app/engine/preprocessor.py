"""Text normalization and entity extraction preprocessor."""
import re
from typing import List, Dict, Any


URL_PATTERN = re.compile(
    r'(?:https?://|www\.)[^\s<>"]+|(?:\b[a-zA-Z0-9-]+\.(?:xyz|top|online|vip|pw|work|cc|ru|tk|ga|cf|gq|club|icu|site|buzz|app|info)\b[^\s<>"]*)',
    re.IGNORECASE
)

SHORTENER_PATTERN = re.compile(
    r'\b(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|rb\.gy|shorturl\.at|wa\.me|t\.me)\b',
    re.IGNORECASE
)

PHONE_PATTERN = re.compile(
    r'(?:\+?91[\s-]?)?[6-9]\d{9}\b|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b'
)

APK_APP_PATTERN = re.compile(
    r'\b(?:anydesk|teamviewer|quicksupport|rustdesk|zoho\s*assist|\.apk|download\s+app)\b',
    re.IGNORECASE
)


class PreprocessedMessage:
    def __init__(self, raw_text: str):
        self.raw_text: str = raw_text.strip()
        self.normalized_text: str = " ".join(raw_text.split())
        self.lower_text: str = self.normalized_text.lower()
        self.urls: List[str] = URL_PATTERN.findall(self.raw_text)
        self.shortened_urls: List[str] = [u for u in self.urls if SHORTENER_PATTERN.search(u)]
        self.phones: List[str] = PHONE_PATTERN.findall(self.raw_text)
        self.apk_mentions: List[str] = APK_APP_PATTERN.findall(self.lower_text)
        self.word_count: int = len(self.normalized_text.split())
        self.caps_ratio: float = self._compute_caps_ratio()

    def _compute_caps_ratio(self) -> float:
        letters = [c for c in self.raw_text if c.isalpha()]
        if not letters:
            return 0.0
        caps = [c for c in letters if c.isupper()]
        return len(caps) / len(letters)


def preprocess_message(text: str) -> PreprocessedMessage:
    return PreprocessedMessage(text)
