import React, { useState } from 'react';
import { SafetyRecommendation } from '../types';
import { ShieldCheck, Copy, Check, PhoneCall, Share2 } from 'lucide-react';

interface SafetyRecommendationsProps {
  recommendations: SafetyRecommendation[];
  onOpenTrustedContact: () => void;
  seniorMode: boolean;
  language: string;
}

export const SafetyRecommendations: React.FC<SafetyRecommendationsProps> = ({
  recommendations,
  onOpenTrustedContact,
  seniorMode,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAdvice = () => {
    const text = recommendations
      .map((r, i) => `${i + 1}. ${r.action}\n   ${r.detail}`)
      .join('\n\n');
    navigator.clipboard.writeText(`AlertIQ Safety Advice:\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 mb-6 shadow-xs light-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
            {language === 'kn' ? 'ನೀವು ಕೈಗೊಳ್ಳಬೇಕಾದ ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು' : 'Actionable Safety Steps'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAdvice}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (language === 'kn' ? 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ' : 'Copied!') : (language === 'kn' ? 'ಸಲಹೆ ಕಾಪಿ ಮಾಡಿ' : 'Copy Advice')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenTrustedContact}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{language === 'kn' ? 'ಕುಟುಂಬದವರಿಗೆ ತಿಳಿಸಿ' : 'Alert Trusted Contact'}</span>
          </button>
        </div>
      </div>

      {/* Recommendations checklist */}
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 flex items-start gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              {idx + 1}
            </div>
            <div>
              <h4 className={`font-bold text-slate-900 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                {rec.action}
              </h4>
              <p className={`text-slate-600 mt-0.5 ${seniorMode ? 'text-base' : 'text-xs leading-relaxed'}`}>
                {rec.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cyber Helpline Emergency Banner */}
      <div className="mt-5 p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold">
            <PhoneCall className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h5 className="font-bold text-xs text-slate-900">
              {language === 'kn' ? 'ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಅಪರಾಧ ಸಹಾಯವಾಣಿ' : 'National Cyber Crime Helpline (India)'}
            </h5>
            <p className="text-[11px] text-slate-500">
              {language === 'kn'
                ? 'ಹಣ ಕಳೆದುಕೊಂಡಿದ್ದರೆ ಅಥವಾ ವಂಚನೆಯಾಗಿದ್ದರೆ ತಕ್ಷಣ 1930 ಗೆ ಕರೆ ಮಾಡಿ.'
                : 'Dial 1930 immediately or visit cybercrime.gov.in to report cyber fraud.'}
            </p>
          </div>
        </div>

        <a
          href="tel:1930"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 1930</span>
        </a>
      </div>
    </div>
  );
};
