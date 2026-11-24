import React from 'react';
import { SampleScenario } from '../types';
import { Zap, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

interface SampleSelectorProps {
  samples: SampleScenario[];
  onSelectSample: (sample: SampleScenario) => void;
  selectedId?: string;
  seniorMode: boolean;
  language: string;
}

export const SampleSelector: React.FC<SampleSelectorProps> = ({
  samples,
  onSelectSample,
  selectedId,
  seniorMode,
  language,
}) => {
  const getRiskBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100/90 px-2 py-0.5 rounded-full border border-red-200">
            <Flame className="w-3 h-3 text-red-600" /> High Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Medium Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Legit / Low
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <h3 className={`font-semibold text-slate-800 ${seniorMode ? 'text-base' : 'text-sm'}`}>
            {language === 'kn'
              ? 'ಪರೀಕ್ಷಿಸಲು ಉದಾಹರಣೆ ಸಂದೇಶವನ್ನು ಆರಿಸಿ (1-ಕ್ಲಿಕ್)'
              : 'Try Sample Messages (1-Click Instant Test)'}
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {language === 'kn' ? 'ನೈಜ ಹಾಗೂ ವಂಚನೆ ಮಾದರಿಗಳು' : 'Real-world scams & legitimate alerts'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {samples.map((sample) => {
          const isSelected = selectedId === sample.id;
          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className={`text-left p-3 rounded-lg border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-semibold text-xs text-slate-900 line-clamp-1">
                  {sample.title}
                </span>
                {getRiskBadge(sample.expected_risk)}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {sample.text}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
