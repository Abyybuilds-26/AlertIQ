import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SampleSelector } from './components/SampleSelector';
import { MessageInput } from './components/MessageInput';
import { RiskMeter } from './components/RiskMeter';
import { IndicatorList } from './components/IndicatorList';
import { SafetyRecommendations } from './components/SafetyRecommendations';
import { TrustedContactModal } from './components/TrustedContactModal';
import { EducationalSection } from './components/EducationalSection';
import { MessageAnalysisResponse, SampleScenario } from './types';
import { analyzeMessage, fetchSampleScenarios } from './services/api';
import { RotateCcw, ShieldCheck, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [seniorMode, setSeniorMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [samples, setSamples] = useState<SampleScenario[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<MessageAnalysisResponse | null>(null);
  const [isTrustedContactOpen, setIsTrustedContactOpen] = useState(false);

  // Load sample scenarios on mount
  useEffect(() => {
    fetchSampleScenarios().then(setSamples).catch(console.error);
  }, []);

  // Core analysis executor
  const executeAnalysis = async (
    textToAnalyze: string,
    targetLang: 'en' | 'kn' = language,
    mode: boolean = seniorMode
  ) => {
    const trimmed = textToAnalyze.trim();
    if (!trimmed) {
      setErrorMessage(
        targetLang === 'kn'
          ? 'ದಯವಿಟ್ಟು ವಿಶ್ಲೇಷಿಸಲು ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ.'
          : 'Please enter or paste a message to analyze.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await analyzeMessage(trimmed, targetLang, mode);
      setResult(response);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete risk assessment.');
    } finally {
      setIsLoading(false);
    }
  };

  // When user selects a sample scenario, immediately trigger analysis
  const handleSelectSample = (sample: SampleScenario) => {
    setSelectedSampleId(sample.id);
    setMessage(sample.text);
    executeAnalysis(sample.text, language, seniorMode);
  };

  // Perform Analysis from button
  const handleAnalyze = () => {
    executeAnalysis(message, language, seniorMode);
  };

  // Re-run analysis when Senior Mode or Language changes if a result is already shown
  const handleToggleSeniorMode = () => {
    const nextMode = !seniorMode;
    setSeniorMode(nextMode);
    if (result && message.trim()) {
      executeAnalysis(message, language, nextMode);
    }
  };

  const handleChangeLanguage = (newLang: string) => {
    const lang = newLang as 'en' | 'kn';
    setLanguage(lang);
    if (result && message.trim()) {
      executeAnalysis(message, lang, seniorMode);
    }
  };

  const handleReset = () => {
    setMessage('');
    setResult(null);
    setSelectedSampleId(undefined);
    setErrorMessage(null);
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-900 ${seniorMode ? 'senior-mode' : ''}`}>
      {/* App Header */}
      <Header
        seniorMode={seniorMode}
        onToggleSeniorMode={handleToggleSeniorMode}
        language={language}
        onChangeLanguage={handleChangeLanguage}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Sub-hero description */}
        <div className="mb-6 text-center max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {language === 'kn' ? (
              <>ಸೈಬರ್ ವಂಚನೆ ಪತ್ತೆ ಮತ್ತು <span className="text-blue-600">ಡಿಜಿಟಲ್ ಸುರಕ್ಷತೆ</span></>
            ) : (
              <>AI-Powered Scam Detection & <span className="text-blue-600">Digital Safety</span></>
            )}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {language === 'kn'
              ? 'ಅಪರಿಚಿತ ಸಂದೇಶಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ, ಅಪಾಯದ ಲಕ್ಷಣಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿರಿ.'
              : 'Paste any suspicious SMS, email, or message. AlertIQ unpacks deceptive tactics, calculates risk, and guides safe decisions.'}
          </p>
        </div>

        {/* 1-Click Sample Scenarios */}
        <SampleSelector
          samples={samples}
          onSelectSample={handleSelectSample}
          selectedId={selectedSampleId}
          seniorMode={seniorMode}
          language={language}
        />

        {/* Message Input Station */}
        <MessageInput
          message={message}
          onChangeMessage={(val) => {
            setMessage(val);
            setSelectedSampleId(undefined);
          }}
          onAnalyze={handleAnalyze}
          onClear={() => {
            setMessage('');
            setSelectedSampleId(undefined);
          }}
          isLoading={isLoading}
          seniorMode={seniorMode}
          language={language}
          errorMessage={errorMessage}
        />

        {/* Results Presentation */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Top Bar with Reset / Analyze Another */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  {language === 'kn' ? 'ಮೌಲ್ಯಮಾಪನ ಫಲಿತಾಂಶ' : 'Risk Assessment Results'}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'kn' ? 'ಮತ್ತೊಂದು ಸಂದೇಶ ಪರೀಕ್ಷಿಸಿ' : 'Analyze Another Message'}</span>
              </button>
            </div>

            {/* Risk Meter Gauge */}
            <RiskMeter
              score={result.risk_score}
              level={result.risk_level}
              levelLocalized={result.risk_level_localized}
              summary={result.summary}
              processingTimeMs={result.processing_time_ms}
              seniorMode={seniorMode}
              language={language}
            />

            {/* Warning Signs / Indicators */}
            <IndicatorList
              indicators={result.detected_indicators}
              seniorMode={seniorMode}
              language={language}
            />

            {/* Safety Recommendations */}
            <SafetyRecommendations
              recommendations={result.recommendations}
              onOpenTrustedContact={() => setIsTrustedContactOpen(true)}
              seniorMode={seniorMode}
              language={language}
            />

            {/* Mandatory Responsible AI Disclaimer */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5 mb-8">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>{language === 'kn' ? 'ಗಮನಿಸಿ:' : 'Disclaimer:'}</strong> {result.disclaimer}
              </span>
            </div>
          </div>
        )}

        {/* Educational Guide */}
        <EducationalSection seniorMode={seniorMode} language={language} />

        {/* Trusted Contact Modal */}
        {result && (
          <TrustedContactModal
            isOpen={isTrustedContactOpen}
            onClose={() => setIsTrustedContactOpen(false)}
            summary={result.trusted_contact_summary}
            seniorMode={seniorMode}
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-semibold text-slate-700">
            AlertIQ — Assistive Scam Detection & Digital Safety
          </p>
          <p className="mt-1 text-slate-400">
            Designed for non-technical users, senior citizens, and digital safety awareness. Light Themed.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
