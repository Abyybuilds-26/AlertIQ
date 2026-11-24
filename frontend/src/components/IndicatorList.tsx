import React from 'react';
import { DetectedIndicator } from '../types';
import { AlertCircle, CheckCircle2, HelpCircle, Quote } from 'lucide-react';

interface IndicatorListProps {
  indicators: DetectedIndicator[];
  seniorMode: boolean;
  language: string;
}

export const IndicatorList: React.FC<IndicatorListProps> = ({
  indicators,
  seniorMode,
  language,
}) => {
  if (indicators.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-6 mb-6 shadow-xs light-card">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-lg' : 'text-base'}`}>
              {language === 'kn'
                ? 'ಯಾವುದೇ ಪ್ರಮುಖ ವಂಚನೆಯ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ'
                : 'No Blatant Scam Warning Signs Detected'}
            </h3>
            <p className={`text-slate-600 mt-1 ${seniorMode ? 'text-base' : 'text-xs'}`}>
              {language === 'kn'
                ? 'ಈ ಸಂದೇಶವು ಅಧಿಕೃತ ಬ್ಯಾಂಕಿಂಗ್ ಅಥವಾ ಆರ್ಡರ್ ಮಾಹಿತಿಯಂತೆ ಕಂಡುಬರುತ್ತದೆ. ಆದರೂ ಯಾವುದೇ ಅನಿರೀಕ್ಷಿತ ವಿನಂತಿಗಳ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆಯಿಂದಿರಿ.'
                : 'The message does not solicit OTPs, passwords, or threaten service disconnection. Standard digital caution is still recommended for unsolicited communications.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 mb-6 shadow-xs light-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
            {language === 'kn'
              ? `ಪತ್ತೆಯಾದ ಎಚ್ಚರಿಕೆಯ ಚಿಹ್ನೆಗಳು (${indicators.length})`
              : `Warning Signs Detected (${indicators.length})`}
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {language === 'kn' ? 'ಸ್ಪಷ್ಟ ಪುರಾವೆಗಳ ಆಧಾರದಲ್ಲಿ' : 'Explainable Evidence'}
        </span>
      </div>

      <div className="space-y-4">
        {indicators.map((ind, index) => (
          <div
            key={ind.id || index}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <h4 className={`font-bold text-slate-900 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  {ind.name}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                  {ind.category}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    ind.severity === 'high'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  +{ind.weight} pts
                </span>
              </div>
            </div>

            {/* Matched Evidence Excerpt */}
            {ind.evidence && (
              <div className="my-2.5 px-3 py-2 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-slate-500 font-medium mr-1.5">
                    {language === 'kn' ? 'ಸಂದೇಶದಲ್ಲಿ ಕಂಡ ಸಾಕ್ಷ್ಯ:' : 'Matched Evidence:'}
                  </span>
                  <span className="font-semibold text-slate-800 bg-amber-50 px-1 py-0.5 rounded">
                    "{ind.evidence}"
                  </span>
                </div>
              </div>
            )}

            {/* Plain Language Explanation */}
            <p className={`text-slate-700 ${seniorMode ? 'text-base font-medium' : 'text-xs leading-relaxed'}`}>
              {ind.explanation}
            </p>

            {/* Why it matters insight */}
            {!seniorMode && ind.why_it_matters && (
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-start gap-1.5 text-[11px] text-slate-500">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-700">
                    {language === 'kn' ? 'ವಂಚಕರ ಉದ್ದೇಶ: ' : 'Why scammers use this: '}
                  </strong>
                  {ind.why_it_matters}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
