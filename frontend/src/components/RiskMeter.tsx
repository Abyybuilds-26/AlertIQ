import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Clock, Flame } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  level: 'Low' | 'Medium' | 'High';
  levelLocalized: string;
  summary: string;
  processingTimeMs: number;
  seniorMode: boolean;
  language: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  level,
  levelLocalized,
  summary,
  processingTimeMs,
  seniorMode,
  language,
}) => {
  // Config based on risk level
  const getConfig = () => {
    switch (level) {
      case 'High':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          cardShadow: 'shadow-red-500/10',
          text: 'text-red-950',
          scoreColor: 'text-red-600',
          badgeBg: 'bg-red-600',
          badgeText: 'text-white',
          barColor: 'bg-red-600',
          subtext: 'text-red-900',
          icon: ShieldAlert,
          iconColor: 'text-red-600',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          cardShadow: 'shadow-amber-500/10',
          text: 'text-amber-950',
          scoreColor: 'text-amber-600',
          badgeBg: 'bg-amber-500',
          badgeText: 'text-white',
          barColor: 'bg-amber-500',
          subtext: 'text-amber-900',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
        };
      default:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-300',
          cardShadow: 'shadow-emerald-500/10',
          text: 'text-emerald-950',
          scoreColor: 'text-emerald-600',
          badgeBg: 'bg-emerald-600',
          badgeText: 'text-white',
          barColor: 'bg-emerald-600',
          subtext: 'text-emerald-900',
          icon: ShieldCheck,
          iconColor: 'text-emerald-600',
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`rounded-2xl border-2 ${config.border} ${config.bg} p-6 mb-6 transition-all shadow-md ${config.cardShadow}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Risk Score & Category Badge */}
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl bg-white border-2 ${config.border} flex items-center justify-center shadow-xs shrink-0`}
          >
            <IconComponent className={`w-9 h-9 ${config.iconColor}`} />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${config.badgeBg} ${config.badgeText} shadow-xs`}
              >
                {level === 'High' && <Flame className="w-3.5 h-3.5" />}
                {levelLocalized}
              </span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200">
                <Clock className="w-3 h-3 text-slate-400" /> {processingTimeMs} ms
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1.5">
              <span
                className={`font-black tracking-tight ${config.scoreColor} ${
                  seniorMode ? 'text-5xl' : 'text-4xl'
                }`}
              >
                {score}
              </span>
              <span className="text-sm font-bold text-slate-500">/ 100</span>
              <span className="text-xs text-slate-600 font-semibold ml-1">
                ({language === 'kn' ? 'ಅಪಾಯ ಸ್ಕೋರ್' : 'Scam Risk Score'})
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar & Score Bands */}
        <div className="w-full md:max-w-md bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
            <span className={score < 30 ? 'text-emerald-700 font-black' : ''}>Low (0-29)</span>
            <span className={score >= 30 && score < 70 ? 'text-amber-700 font-black' : ''}>Medium (30-69)</span>
            <span className={score >= 70 ? 'text-red-700 font-black' : ''}>High (70-100)</span>
          </div>

          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex">
            <div
              className={`h-full rounded-full transition-all duration-700 ${config.barColor}`}
              style={{ width: `${Math.max(6, Math.min(100, score))}%` }}
            />
          </div>

          <div className="mt-2 text-right">
            <span className={`text-xs font-bold ${config.scoreColor}`}>
              {level === 'High'
                ? (language === 'kn' ? 'ತೀವ್ರ ಅಪಾಯದ ಸ್ಥಿತಿ' : 'Critical Scam Warning')
                : level === 'Medium'
                ? (language === 'kn' ? 'ಸಂಶಯಾಸ್ಪದ ವಿನಂತಿ' : 'Suspicious Request')
                : (language === 'kn' ? 'ಸುರಕ್ಷಿತ' : 'Normal / Transactional')}
            </span>
          </div>
        </div>
      </div>

      {/* Plain Language Summary */}
      <div className="mt-5 pt-4 border-t border-slate-200/80">
        <p
          className={`font-bold ${config.subtext} ${
            seniorMode ? 'text-lg leading-relaxed' : 'text-sm leading-normal'
          }`}
        >
          {summary}
        </p>
      </div>
    </div>
  );
};
