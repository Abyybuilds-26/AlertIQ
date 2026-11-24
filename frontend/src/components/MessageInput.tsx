import React from 'react';
import { Clipboard, Trash2, Search, Loader2, AlertCircle } from 'lucide-react';

interface MessageInputProps {
  message: string;
  onChangeMessage: (val: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isLoading: boolean;
  seniorMode: boolean;
  language: string;
  errorMessage?: string | null;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onChangeMessage,
  onAnalyze,
  onClear,
  isLoading,
  seniorMode,
  language,
  errorMessage,
}) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChangeMessage(text);
      }
    } catch {
      alert('Unable to access clipboard directly. Please press Ctrl+V / Cmd+V.');
    }
  };

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 mb-8 light-card">
      {/* Title & Prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h2
            className={`font-bold text-slate-900 ${
              seniorMode ? 'text-xl' : 'text-lg'
            }`}
          >
            {language === 'kn'
              ? 'ಸಂಶಯಾಸ್ಪದ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ'
              : 'Paste Suspicious Message for Risk Analysis'}
          </h2>
          <p className={`text-slate-500 ${seniorMode ? 'text-base mt-1' : 'text-xs'}`}>
            {language === 'kn'
              ? 'SMS, ವಾಟ್ಸಾಪ್, ಇಮೇಲ್ ಅಥವಾ ಬ್ಯಾಂಕ್ ಅಲರ್ಟ್ ಸಂದೇಶವನ್ನು ಕೆಳಗೆ ನಮೂದಿಸಿ.'
              : 'Enter SMS, WhatsApp text, email, banking alert, or job offer to evaluate scam indicators.'}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'kn' ? 'ಪೇಸ್ಟ್ ಮಾಡಿ' : 'Paste from Clipboard'}</span>
          </button>
          {message && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ಅಳಿಸಿ' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Message Textarea */}
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          placeholder={
            language === 'kn'
              ? 'ಉದಾಹರಣೆಗೆ: "ನಿಮ್ಮ ವಿದ್ಯುತ್ ಬಿಲ್ ಪಾವತಿಸದ ಕಾರಣ ಇಂದು ರಾತ್ರಿ ವಿದ್ಯುತ್ ಕಡಿತಗೊಳ್ಳಲಿದೆ. ಸಂಪರ್ಕಿಸಿ..."'
              : 'e.g. "Dear Customer, your electricity power will be disconnected tonight at 9:30 PM. Call officer at 9845123456..."'
          }
          rows={seniorMode ? 5 : 4}
          className={`w-full rounded-xl border border-slate-300 bg-slate-50/40 p-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-y ${
            seniorMode ? 'text-lg leading-relaxed' : 'text-sm leading-normal'
          }`}
        />
      </div>

      {/* Footer Info & Submit Button */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-3">
          <span>
            {message.length} {language === 'kn' ? 'ಅಕ್ಷರಗಳು' : 'characters'}
          </span>
          <span>•</span>
          <span>
            {wordCount} {language === 'kn' ? 'ಪದಗಳು' : 'words'}
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-slate-400">
            {language === 'kn' ? 'ಖಾಸಗಿ ಸಂದೇಶ ಉಳಿಸುವುದಿಲ್ಲ' : 'Zero message logging for privacy'}
          </span>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !message.trim()}
          className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold text-white shadow-md transition-all ${
            isLoading || !message.trim()
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-blue-600/20'
          } ${seniorMode ? 'px-8 py-3.5 text-base' : 'px-6 py-2.5 text-sm'}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{language === 'kn' ? 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...' : 'Analyzing Indicators...'}</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>{language === 'kn' ? 'ಅಪಾಯ ವಿಶ್ಲೇಷಿಸಿ' : 'Analyze Message Risk'}</span>
            </>
          )}
        </button>
      </div>

      {/* Error state alert */}
      {errorMessage && (
        <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
