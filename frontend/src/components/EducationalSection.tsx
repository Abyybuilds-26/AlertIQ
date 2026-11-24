import React from 'react';
import { BookOpen, AlertOctagon, Smartphone, Award, Landmark } from 'lucide-react';

interface EducationalSectionProps {
  seniorMode: boolean;
  language: string;
}

export const EducationalSection: React.FC<EducationalSectionProps> = ({
  seniorMode,
  language,
}) => {
  const scamCards = [
    {
      icon: AlertOctagon,
      title: language === 'kn' ? 'ವಿದ್ಯುತ್ ಬಿಲ್ ವಂಚನೆ' : 'Electricity Disconnection Scam',
      badge: 'Urgent Threat',
      desc:
        language === 'kn'
          ? 'ರಾತ್ರಿ ವಿದ್ಯುತ್ ಕಡಿತಗೊಳ್ಳಲಿದೆ ಎಂದು ಬೆದರಿಸಿ ಖಾಸಗಿ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡುವಂತೆ ಒತ್ತಾಯಿಸುತ್ತಾರೆ.'
          : 'Threatens power supply cutoff at night. Provides an unofficial personal mobile number to pay bills.',
    },
    {
      icon: Landmark,
      title: language === 'kn' ? 'ಬ್ಯಾಂಕ್ ಕೆವೈಸಿ (KYC) ವಂಚನೆ' : 'Bank KYC & NetBanking Phishing',
      badge: 'Account Freeze',
      desc:
        language === 'kn'
          ? 'ಖಾತೆ ಬ್ಲಾಕ್ ಆಗಿದೆ ಎಂದು ನಕಲಿ ಲಿಂಕ್ ಕಳುಹಿಸಿ ಒಟಿಪಿ ಮತ್ತು ಗೌಪ್ಯ ವಿವರಗಳನ್ನು ಕದಿಯುತ್ತಾರೆ.'
          : 'Fake links claiming account deactivation. Harvests NetBanking passwords, debit card PINs, and OTPs.',
    },
    {
      icon: Award,
      title: language === 'kn' ? 'ಉದ್ಯೋಗ ಮತ್ತು ಲಾಟರಿ ಆಮಿಷ' : 'Part-Time Job & Telegram Tasks',
      badge: 'Financial Bait',
      desc:
        language === 'kn'
          ? 'ಯೂಟ್ಯೂಬ್ ಲೈಕ್ ಮಾಡಿದರೆ ದಿನಕ್ಕೆ 5000 ರೂ. ಎಂದು ಆಸೆ ತೋರಿಸಿ ಠೇವಣಿ ಹಣ ಕಟ್ಟಿಸಿಕೊಳ್ಳುತ್ತಾರೆ.'
          : 'Promises high daily pay for liking videos. Traps victims into paying upfront registration deposits.',
    },
    {
      icon: Smartphone,
      title: language === 'kn' ? 'AnyDesk ಪರದೆ ಹಂಚಿಕೆ ವಂಚನೆ' : 'AnyDesk / Screen Sharing Scam',
      badge: 'Device Takeover',
      desc:
        language === 'kn'
          ? 'ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿ ಎಂದು ನಂಬಿಸಿ AnyDesk ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಸಿ ಮೊಬೈಲ್ ಪರದೆಯನ್ನು ನಿಯಂತ್ರಿಸುತ್ತಾರೆ.'
          : 'Instructs victims to install remote desktop apps, giving scammers full visibility of typed PINs.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 mb-8 shadow-xs light-card">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
          {language === 'kn' ? 'ಸಾಮಾನ್ಯ ಆನ್‌ಲೈನ್ ವಂಚನೆಗಳ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ' : 'Common Digital Scams Awareness Guide'}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {scamCards.map((scam, i) => {
          const IconComp = scam.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center">
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {scam.badge}
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 mb-1">{scam.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{scam.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
