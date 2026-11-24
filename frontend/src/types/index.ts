export interface DetectedIndicator {
  id: string;
  category: string;
  name: string;
  severity: 'high' | 'medium' | 'low';
  weight: number;
  evidence: string;
  explanation: string;
  why_it_matters: string;
}

export interface SafetyRecommendation {
  priority: number;
  action: string;
  detail: string;
}

export interface TrustedContactSummary {
  risk_level: string;
  risk_score: number;
  headline: string;
  safeguard_text: string;
  suggested_message: string;
}

export interface MessageAnalysisResponse {
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  risk_level_localized: string;
  summary: string;
  detected_indicators: DetectedIndicator[];
  recommendations: SafetyRecommendation[];
  trusted_contact_summary: TrustedContactSummary;
  disclaimer: string;
  processing_time_ms: number;
  language: string;
  senior_mode: boolean;
}

export interface SampleScenario {
  id: string;
  title: string;
  category: string;
  expected_risk: string;
  text: string;
  description: string;
}
