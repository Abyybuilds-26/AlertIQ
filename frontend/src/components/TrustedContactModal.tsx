import React, { useState } from 'react';
import { TrustedContactSummary } from '../types';
import { X, ShieldCheck, Send, CheckCircle2, Lock } from 'lucide-react';

interface TrustedContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: TrustedContactSummary;
  seniorMode: boolean;
  language: string;
}

export const TrustedContactModal: React.FC<TrustedContactModalProps> = ({
  isOpen,
  onClose,
  summary,
  seniorMode,
  language,
}) => {
  const [contactName, setContactName] = useState('Son / Daughter');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSendSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) return;
    setIsSent(true);
  };

  const handleReset = () => {
    setIsSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden light-card">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                {language === 'kn' ? 'ವಿಶ್ವಾಸಾರ್ಹ ಸಂಪರ್ಕ ಎಚ್ಚರಿಕೆ (ಡೆಮೊ)' : 'Trusted-Contact Alert (Consent Demo)'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'kn' ? 'ಗೌಪ್ಯತೆ-ರಕ್ಷಿತ ಎಚ್ಚರಿಕೆ ಹಂಚಿಕೆ' : 'Privacy-safe alert simulation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                {language === 'kn' ? 'ಎಚ್ಚರಿಕೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!' : 'Safe Alert Successfully Sent!'}
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6">
                {language === 'kn'
                  ? `${contactName} (${contactPhone}) ಗೆ ಸುರಕ್ಷತಾ ಸಾರಾಂಶವನ್ನು ತಲುಪಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಖಾಸಗಿ ಸಂದೇಶವನ್ನು ಹಂಚಿಕೊಳ್ಳಲಾಗಿಲ್ಲ.`
                  : `A sanitized risk summary was sent to ${contactName} (${contactPhone}). Your private message text was never exposed.`}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                {language === 'kn' ? 'ಮುಕ್ತಾಯಗೊಳಿಸಿ' : 'Close Window'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendSimulation} className="space-y-4">
              {/* Privacy Guarantee Pill */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <strong>Privacy Safeguard:</strong> AlertIQ never transmits your raw message content. Only the calculated risk score and standard safety advice are sent.
                </div>
              </div>

              {/* Contact Information Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trusted Contact Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* Simulated Message Preview Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preview of Notification to be Shared:
                </label>
                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed">
                  {summary.suggested_message}
                </div>
              </div>

              {/* Explicit User Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 font-medium">
                    I explicitly consent to sending this sanitized safety summary to my trusted contact.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!consentGiven}
                  className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    consentGiven
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Simulated Alert</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
