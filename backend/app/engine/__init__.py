"""AlertIQ Scam Analysis Engine."""
from app.engine.preprocessor import preprocess_message, PreprocessedMessage
from app.engine.rules import evaluate_rules, check_legitimate_dampeners, RuleMatch
from app.engine.scorer import calculate_risk
from app.engine.recommendations import build_indicators_and_recommendations

__all__ = [
    "preprocess_message",
    "PreprocessedMessage",
    "evaluate_rules",
    "check_legitimate_dampeners",
    "RuleMatch",
    "calculate_risk",
    "build_indicators_and_recommendations",
]
