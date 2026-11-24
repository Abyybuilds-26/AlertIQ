import React from 'react';
import { Shield, Sparkles, HeartHandshake, Languages, Sun } from 'lucide-react';

interface HeaderProps {
  seniorMode: boolean;
  onToggleSeniorMode: () => void;
  language: string;
  onChangeLanguage: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  seniorMode,
  onToggleSeniorMode,
  language,
  onChangeLanguage,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Alert<span className="text-blue-600">IQ</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3 h-3" /> Digital Safety
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Detect warning signs. Understand the risk. Stay safe.
            </p>
          </div>
        </div>

        {/* Accessibility & Language Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Light Theme Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Light Safety Theme</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs font-medium">
            <Languages className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            <button
              onClick={() => onChangeLanguage('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onChangeLanguage('kn')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'kn'
                  ? 'bg-white text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ಕನ್ನಡ (Kannada)
            </button>
          </div>

          {/* Senior Citizen Safety Mode Toggle */}
          <button
            onClick={onToggleSeniorMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              seniorMode
                ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-400/30'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
            title="Simplified explanations with larger text for seniors"
          >
            <HeartHandshake className={`w-4 h-4 ${seniorMode ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Senior Safety Mode</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider ${
                seniorMode ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {seniorMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
