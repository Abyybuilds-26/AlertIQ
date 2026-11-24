import { MessageAnalysisResponse, SampleScenario, DetectedIndicator, SafetyRecommendation } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function analyzeMessage(
  message: string,
  language: string = 'en',
  seniorMode: boolean = false
): Promise<MessageAnalysisResponse> {
  // 1. Attempt calling the FastAPI backend first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
        senior_mode: seniorMode,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('FastAPI backend offline or unreachable. Utilizing AlertIQ client-side analysis engine fallback.', err);
  }

  // 2. Fallback to client-side scam detection engine
  return analyzeMessageClientSide(message, language, seniorMode);
}

export async function fetchSampleScenarios(): Promise<SampleScenario[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/samples`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend samples API unavailable, using local sample suite:', err);
  }
  return getFallbackSamples();
}

export function getFallbackSamples(): SampleScenario[] {
  return [
    {
      id: 'electricity_scam',
      title: 'Electricity Disconnection Threat',
      category: 'Utility Scam (Bescom)',
      expected_risk: 'High',
      text: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from BESCOM office because your previous month bill was not updated. Please immediately contact our electricity officer at 9845123456 to update your bill.',
      description: 'Threatens utility disconnection, creates artificial urgency, and provides an unofficial 10-digit mobile number.'
    },
    {
      id: 'bank_kyc_otp_scam',
      title: 'Bank KYC & OTP Harvesting',
      category: 'Banking Phishing',
      expected_risk: 'High',
      text: 'SBI Alert: Your SBI NetBanking account will be suspended today due to pending KYC verification. Click http://bit.ly/sbi-kyc-verify immediately and share the OTP received on your phone to unblock your account.',
      description: 'Demonstrates brand impersonation, account freeze threat, shortened link, and direct OTP solicitation.'
    },
    {
      id: 'part_time_job_scam',
      title: 'Part-Time Job & Telegram Task',
      category: 'Financial Bait',
      expected_risk: 'High',
      text: 'Congratulations! Selected for Part Time Job. Earn Rs. 5000 daily by simply liking YouTube videos. Work from home 1 hour daily. Contact our HR manager on Telegram @EarnDailyTask now to claim your first bonus.',
      description: 'Preys on financial temptation using unrealistic daily income promises for trivial online tasks.'
    },
    {
      id: 'legit_bank_txn',
      title: 'Authentic Bank Debit Notification',
      category: 'Legitimate Banking Notification',
      expected_risk: 'Low',
      text: 'Rs. 450.00 debited from your HDFC Bank A/c ending XX4912 on 19-Nov-26 at CAFE COFFEE DAY. Avl Bal: Rs. 28,450.00. If not done by you, call 18002664332 or SMS BLOCK to 5676712.',
      description: 'Standard debit receipt showing masked account number, merchant name, and balance without pressure.'
    },
    {
      id: 'legit_delivery_otp',
      title: 'Authentic Order Delivery & OTP Caution',
      category: 'Legitimate E-Commerce',
      expected_risk: 'Low',
      text: 'Your Amazon package with tracking #AMZ89210 is out for delivery today. Your delivery OTP is 492011. Strictly confidential. Never share this OTP with anyone over the phone; share only in person with delivery agent upon receiving the package.',
      description: 'Authentic delivery notice explicitly telling recipient never to share OTP over the phone.'
    }
  ];
}

/**
 * High-accuracy client-side scam detection & scoring engine.
 * Ensures the web app functions with 100% reliability even if the backend is offline.
 */
function analyzeMessageClientSide(
  rawText: string,
  language: string,
  seniorMode: boolean
): MessageAnalysisResponse {
  const startTime = performance.now();
  const text = rawText.trim();

  // Threat Vector Regex Patterns
  const OTP_SOLICIT = /\b(?:(?:share|send|provide|give|enter|submit|reply\s+with|forward|tell|type|verify|confirm)\s+(?:the\s+|your\s+)?(?:otp|one\s*time\s*password|pin|cvv|password|passcode|mpin|upi\s*pin|debit\s*card|credit\s*card|card\s*number|card\s*details|bank\s*details|banking\s*credentials|netbanking\s*password)|(?:verify|confirm|validate|update)\s+(?:your\s+)?(?:otp|password|pin|cvv|credentials|bank\s*details)\s+(?:immediately|to\s+unblock|to\s+claim|here|by\s+clicking|below|now))\b/i;
  const LEGIT_OTP_WARNING = /\b(?:do\s*not\s*share|never\s*share|strictly\s*confidential|alert:\s*never\s*tell|neither\s*bank\s*nor\s*anyone\s*asks)\b/i;
  const URGENCY = /\b(?:immediately|urgent(?:ly)?|within\s+(?:24|12|6|2|1|hour|hrs|mins?|\d+\s*(?:hours?|minutes?|mins?))|today\s+only|today\b|tonight\b|last\s+chance|final\s+notice|final\s+warning|act\s+now|action\s+required|account\s+will\s+be\s+(?:blocked|suspended|closed)|expir(?:es?|ing|ed)|without\s+delay|immediate\s+action|asap|within\s+today|deadline|overdue)\b/i;
  const SUSPENSION = /\b(?:electricity\s+(?:power\s+)?will\s+be\s+(?:disconnected|cut\s*off)|power\s+supply\s+will\s+be\s+disconnected|power\s+(?:will\s+be\s+)?cut|bill\s+(?:not\s+updated|unpaid)|account\s+(?:has\s+been|is|will\s+be)\s+(?:suspended|blocked|frozen|disabled|deactivated|locked)|card\s+(?:has\s+been|is|will\s+be)\s+(?:blocked|deactivated|suspended)|netbanking\s+(?:blocked|suspended)|sim\s+(?:card\s+)?(?:will\s+be\s+deactivated|blocked|terminated)|pan\s+(?:card\s+)?is\s+blocked|warrant\s+issued|legal\s+notice|police\s+case|arrest\s+(?:order|warrant)|digital\s+arrest|cbi\s+inquiry|customs\s+(?:parcel\s+seized|fine|held)|package\s+seized|tax\s+penalty)\b/i;
  const IMPERSONATION = /\b(?:sbi|state\s*bank\s*of\s*india|hdfc|icici|axis\s*bank|punjab\s*national\s*bank|pnb|bank\s*of\s*baroda|bob|canara\s*bank|kotak|bescom|tneb|mseb|electricity\s*department|power\s*corporation|india\s*post|post\s*office|income\s*tax\s*(?:department|dept)?|it\s*department|gst\s*department|cbi|cyber\s*crime\s*cell|cyber\s*police|reserve\s*bank\s*of\s*india|rbi|trai|telecom\s*department|fedex|bluedart|dhl|delhivery|amazon\s*pay|paytm|phonepe|gpay)\b/i;
  const FINANCIAL_BAIT = /\b(?:you\s+have\s+won|lottery|lucky\s+draw|cash\s*prize|congratulations|selected\s+for\s+(?:job|part\s*time)|part\s*time\s*job|earn\s+(?:rs\.?|inr|\$)?\s*\d{3,6}\s*(?:per\s*day|daily|weekly|hourly)|daily\s+income|telegram\s+task|like\s+(?:youtube\s+)?videos\s+(?:and\s+)?earn|work\s+from\s+home\s+earning|refund\s+of\s+(?:rs|inr|\$)|cashback\s+(?:credited|waiting)|crypto\s+(?:airdrop|bonus)|free\s+gift|reward\s+points\s+expire)\b/i;
  const SUSPICIOUS_LINK = /\b(?:click\s+(?:here|on|link|below|to\s+verify|to\s+update)|update\s+(?:via|at)\s*https?:\/\/|download\s+(?:app|file|apk)|install\s+(?:anydesk|teamviewer|quicksupport|rustdesk|app)|open\s+link|visit\s+link|https?:\/\/[^\s<>"]+|bit\.ly|tinyurl|t\.me|wa\.me)\b/i;
  const KYC_PRETEXT = /\b(?:kyc\s+(?:pending|expired|incomplete|suspended|verification|update|mandatory)|update\s+(?:your\s+)?(?:pan|aadhaar|pan\s*card|kyc|identity|documents)|link\s+pan\s+with\s+(?:aadhaar|bank)|submit\s+documents\s+immediately|verify\s+(?:your\s+)?(?:details|identity|account)\s+to\s+continue)\b/i;
  const UNOFFICIAL_CONTACT = /\b(?:(?:contact|call|reach|whatsapp)\s+(?:our\s+)?(?:electricity\s+|bank\s+|nodal\s+|customer\s+|hr\s+)?(?:officer|executive|manager|agent|sir|person)?\s*(?:at|on|number)?\s*[:\s-]?\s*[6-9]\d{9}|(?:contact|reach|message)\s+(?:our\s+)?(?:hr\s+|team\s+)?(?:manager|executive|officer)?\s*(?:on|via|at)\s*(?:telegram|whatsapp)|send\s+whatsapp\s+message\s+to\s+[6-9]\d{9}|send\s+message\s+on\s+telegram|telegram\s+@[a-zA-Z0-9_]+)\b/i;
  const LEGIT_TRANSACTION = /\b(?:debited\s+by\s+(?:rs|inr)|credited\s+with\s+(?:rs|inr)|avl\s*bal|available\s*balance|order\s+(?:has\s+been\s+)?(?:dispatched|shipped|delivered|confirmed)|tracking\s+id|track\s+your\s+order)\b/i;

  const indicators: DetectedIndicator[] = [];
  const ruleIds = new Set<string>();

  // 1. OTP Solicit
  const matchOtp = text.match(OTP_SOLICIT);
  if (matchOtp) {
    ruleIds.add('IND_OTP_REQUEST');
    indicators.push({
      id: 'IND_OTP_REQUEST',
      category: 'Credential Harvesting',
      name: language === 'kn' ? 'ಒಟಿಪಿ (OTP) ಅಥವಾ ಗೌಪ್ಯ ಪಿನ್ ಕೇಳುವಿಕೆ' : 'Urgent Request for OTP or Password',
      severity: 'high',
      weight: 35,
      evidence: matchOtp[0],
      explanation: seniorMode
        ? (language === 'kn' ? 'ಯಾರೊಂದಿಗೂ ಒಟಿಪಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ! ಬ್ಯಾಂಕ್‌ನವರು ಎಂದಿಗೂ ಒಟಿಪಿ ಕೇಳುವುದಿಲ್ಲ.' : 'DO NOT share any OTP or code! Banks NEVER ask for your OTP over phone or SMS.')
        : (language === 'kn' ? 'ಅಧಿಕೃತ ಬ್ಯಾಂಕ್‌ಗಳು ಎಂದಿಗೂ ಒಟಿಪಿ ಕೇಳುವುದಿಲ್ಲ.' : 'The message pressures you to reveal an OTP. Authentic banks never solicit OTPs.'),
      why_it_matters: language === 'kn' ? 'ಒಟಿಪಿ ಹಂಚಿಕೊಂಡರೆ ತಕ್ಷಣ ಹಣ ಲೂಟಿಯಾಗಬಹುದು.' : 'OTPs are your final defense. Sharing allows attackers to authorize transfers instantly.'
    });
  }

  // 2. Service Threat / Suspension
  const matchSuspension = text.match(SUSPENSION);
  if (matchSuspension) {
    ruleIds.add('IND_SERVICE_THREAT');
    indicators.push({
      id: 'IND_SERVICE_THREAT',
      category: 'Coercion & Intimidation',
      name: language === 'kn' ? 'ವಿದ್ಯುತ್ ಕಡಿತ ಅಥವಾ ಖಾತೆ ಸ್ಥಗಿತದ ಬೆದರಿಕೆ' : 'Threat of Disconnection or Account Freezing',
      severity: 'high',
      weight: 30,
      evidence: matchSuspension[0],
      explanation: seniorMode
        ? (language === 'kn' ? 'ವಿದ್ಯುತ್ ಕಡಿತ ಅಥವಾ ಖಾತೆ ಮುಚ್ಚುವ ಬೆದರಿಕೆ ಹಾಕಿ ಹೆದರಿಸುತ್ತಿದ್ದಾರೆ. ಆತುರಪಡಬೇಡಿ.' : 'They are threatening to cut your power or freeze your account to panic you. Do not rush.')
        : (language === 'kn' ? 'ಭಯ ಸೃಷ್ಟಿಸಿ ಜನರಿಂದ ಹಣ ಅಥವಾ ಮಾಹಿತಿ ಪಡೆಯುವ ತಂತ್ರ.' : 'Claims power or bank access will be disconnected to induce compliance through panic.'),
      why_it_matters: language === 'kn' ? 'ಭಯದಿಂದ ಜನರು ಪರಿಶೀಲಿಸದೆ ಹಣ ಪಾವತಿಸುತ್ತಾರೆ.' : 'Threat of losing essential utilities triggers instant compliance.'
    });
  }

  // 3. Urgency
  const matchUrgency = text.match(URGENCY);
  if (matchUrgency) {
    ruleIds.add('IND_URGENCY');
    indicators.push({
      id: 'IND_URGENCY',
      category: 'Psychological Manipulation',
      name: language === 'kn' ? 'ಕೃತಕ ತುರ್ತು ಮತ್ತು ಆತಂಕ ಸೃಷ್ಟಿ' : 'Artificial Urgency & Panic Pressure',
      severity: indicators.length === 0 ? 'medium' : 'high',
      weight: 25,
      evidence: matchUrgency[0],
      explanation: seniorMode
        ? (language === 'kn' ? 'ಸಂದೇಶವು ನಿಮ್ಮನ್ನು ಗಾಬರಿಗೊಳಿಸಲು ಯತ್ನಿಸುತ್ತಿದೆ. ಶಾಂತರಾಗಿರಿ.' : 'The message is trying to rush you so you don’t speak to family or your bank first.')
        : (language === 'kn' ? 'ತಕ್ಷಣ ಕ್ರಮ ಕೈಗೊಳ್ಳುವಂತೆ ಒತ್ತಾಯಿಸಿ ಯೋಚಿಸಲು ಸಮಯ ನೀಡದಿರುವುದು.' : 'Demands immediate action within hours, aiming to bypass cautious verification.'),
      why_it_matters: language === 'kn' ? 'ಗಾಬರಿಯಲ್ಲಿ ಜನರು ತಪ್ಪು ನಿರ್ಧಾರ ಮಾಡುತ್ತಾರೆ.' : 'Scammers use tight deadlines so victims act impulsively without verification.'
    });
  }

  // 4. Financial Bait
  const matchBait = text.match(FINANCIAL_BAIT);
  if (matchBait) {
    ruleIds.add('IND_FINANCIAL_BAIT');
    indicators.push({
      id: 'IND_FINANCIAL_BAIT',
      category: 'Financial Bait',
      name: language === 'kn' ? 'ಅವಾಸ್ತವಿಕ ಆರ್ಥಿಕ ಆಮಿಷ / ಸುಲಭ ಉದ್ಯೋಗ' : 'Unrealistic Financial Bait or Reward',
      severity: 'high',
      weight: 35,
      evidence: matchBait[0],
      explanation: seniorMode
        ? (language === 'kn' ? 'ಯಾರೂ ಉಚಿತ ಲಾಟರಿ ಹಣ ನೀಡುವುದಿಲ್ಲ. ಇಂತಹ ಆಸೆಗಳಿಗೆ ಬೀಳಬೇಡಿ.' : 'Nobody gives free lottery money or high daily job pay via SMS. It is always a trap.')
        : (language === 'kn' ? 'ಲಾಟರಿ ಅಥವಾ ದಿನಕ್ಕೆ ಸಾವಿರಾರು ರೂಪಾಯಿ ಗಳಿಕೆಯ ಸುಳ್ಳು ಭರವಸೆ.' : 'Promises unexpected prizes or high daily income for trivial online tasks.'),
      why_it_matters: language === 'kn' ? 'ಆಸೆ ತೋರಿಸಿ ಮುಂಗಡ ಠೇವಣಿ ಹಣ ವಸೂಲಿ ಮಾಡುತ್ತಾರೆ.' : 'Lures victims into paying registration fees or sharing banking credentials.'
    });
  }

  // 5. Impersonation
  const matchImpersonation = text.match(IMPERSONATION);
  if (matchImpersonation) {
    ruleIds.add('IND_IMPERSONATION');
    indicators.push({
      id: 'IND_IMPERSONATION',
      category: 'Impersonation',
      name: language === 'kn' ? `ಪ್ರಸಿದ್ಧ ಸಂಸ್ಥೆಯ ಹೆಸರು (${matchImpersonation[0].toUpperCase()})` : `Brand / Authority Reference (${matchImpersonation[0].toUpperCase()})`,
      severity: 'medium',
      weight: 20,
      evidence: matchImpersonation[0],
      explanation: seniorMode
        ? (language === 'kn' ? 'ಹೆಸರಾಂತ ಬ್ಯಾಂಕ್ ಅಥವಾ ಕಚೇರಿಯ ಹೆಸರಿನಲ್ಲಿ ನಕಲಿ ಸಂದೇಶ ಬಂದಿದೆ.' : 'They are pretending to be from a well-known bank or department. Check in person.')
        : (language === 'kn' ? 'ವಿಶ್ವಾಸಾರ್ಹ ಬ್ಯಾಂಕ್ ಅಥವಾ ಸರ್ಕಾರದ ಹೆಸರು ದುರ್ಬಳಕೆ.' : 'Forges well-known brand names to hijack established consumer trust.'),
      why_it_matters: language === 'kn' ? 'ಜನರ ನಂಬಿಕೆಯನ್ನು ದುರುಪಯೋಗಪಡಿಸಿಕೊಳ್ಳುವುದು.' : 'Criminals rely on brand trust to lower skepticism.'
    });
  }

  // 6. Suspicious Link / Remote Access
  const matchLink = text.match(SUSPICIOUS_LINK);
  if (matchLink) {
    ruleIds.add('IND_SUSPICIOUS_LINK_APP');
    indicators.push({
      id: 'IND_SUSPICIOUS_LINK_APP',
      category: 'Malicious Vector',
      name: language === 'kn' ? 'ಅನುಮಾನಾಸ್ಪದ ಲಿಂಕ್ ಅಥವಾ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್' : 'Suspicious Web Link or App Prompt',
      severity: 'high',
      weight: 25,
      evidence: matchLink[0],
      explanation: seniorMode
        ? (language === 'kn' ? 'ಅಪರಿಚಿತ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ ಮತ್ತು AnyDesk ನಂತಹ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಬೇಡಿ!' : 'Never click unknown links and NEVER install AnyDesk or apps told by strangers!')
        : (language === 'kn' ? 'ವಂಚನೆ ವೆಬ್‌ಸೈಟ್‌ಗಳಿಗೆ ಲಿಂಕ್ ಮಾಡುವುದು.' : 'Directs recipient to unknown web portals or remote control apps like AnyDesk.'),
      why_it_matters: language === 'kn' ? 'ಪರದೆ ಹಂಚಿಕೆ ಆ್ಯಪ್ ಮೂಲಕ ಮೊಬೈಲ್ ನಿಯಂತ್ರಣ ಪಡೆಯುತ್ತಾರೆ.' : 'Remote desktop apps allow attackers to view typed PINs and passwords in real time.'
    });
  }

  // 7. KYC Pretext
  const matchKyc = text.match(KYC_PRETEXT);
  if (matchKyc) {
    ruleIds.add('IND_KYC_PRETEXT');
    indicators.push({
      id: 'IND_KYC_PRETEXT',
      category: 'Identity Harvesting',
      name: language === 'kn' ? 'ಕೆವೈಸಿ (KYC) ಅಥವಾ ಪ್ಯಾನ್ ಕಾರ್ಡ್ ನೆಪ' : 'Urgent KYC / Document Verification Pretext',
      severity: 'medium',
      weight: 20,
      evidence: matchKyc[0],
      explanation: seniorMode
        ? (language === 'kn' ? 'ಲಿಂಕ್ ಮೂಲಕ ಆಧಾರ್ ಅಥವಾ ಪ್ಯಾನ್ ವಿವರಗಳನ್ನು ಎಂದಿಗೂ ಕಳುಹಿಸಬೇಡಿ.' : 'Do not send PAN or Aadhaar card details through SMS links. Visit your bank.')
        : (language === 'kn' ? 'ಗುರುತಿನ ದಾಖಲೆಗಳನ್ನು ಕದಿಯುವ ನೆಪ.' : 'Demands urgent document submission under threat of account blocking.'),
      why_it_matters: language === 'kn' ? 'ಖಾತೆ ಹ್ಯಾಕ್ ಮಾಡಲು ಪ್ಯಾನ್ ವಿವರ ಕದಿಯುತ್ತಾರೆ.' : 'KYC pretexts are the primary vector used to harvest banking identity files.'
    });
  }

  // 8. Unofficial Mobile Contact
  const matchContact = text.match(UNOFFICIAL_CONTACT);
  if (matchContact) {
    ruleIds.add('IND_UNOFFICIAL_CONTACT');
    indicators.push({
      id: 'IND_UNOFFICIAL_CONTACT',
      category: 'Suspicious Contact',
      name: language === 'kn' ? 'ಅಧಿಕೃತ ಸೇವೆಗೆ ಖಾಸಗಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Personal Mobile Number for Official Utility',
      severity: 'medium',
      weight: 15,
      evidence: matchContact[0],
      explanation: seniorMode
        ? (language === 'kn' ? 'ಇದು ವಂಚಕರ ವೈಯಕ್ತಿಕ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ. ಇದಕ್ಕೆ ಕರೆ ಮಾಡಬೇಡಿ.' : 'The phone number in the message is a stranger’s private mobile number. Do not call.')
        : (language === 'kn' ? 'ಅಧಿಕೃತ ಗ್ರಾಹಕ ಸೇವಾ ಸಂಖ್ಯೆಯ ಬದಲು ಖಾಸಗಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ.' : 'Official utilities never use personal 10-digit mobile numbers for billing disputes.'),
      why_it_matters: language === 'kn' ? 'ಕರೆ ಮಾಡಿದರೆ ವಂಚಕರೇ ಅಧಿಕಾರಿಗಳಂತೆ ಮಾತನಾಡಿ ಮೋಸ ಮಾಡುತ್ತಾರೆ.' : 'Directs callers directly to fraudsters posing as utility managers or police.'
    });
  }

  // High Risk Compounding Logic
  let rawScore = indicators.reduce((acc, curr) => acc + curr.weight, 0);

  // 1. Any Credential/OTP request -> Minimum 80
  if (ruleIds.has('IND_OTP_REQUEST')) {
    rawScore = Math.max(rawScore, 80);
    if (ruleIds.has('IND_URGENCY') || ruleIds.has('IND_SUSPICIOUS_LINK_APP') || ruleIds.has('IND_IMPERSONATION')) {
      rawScore = Math.max(rawScore, 92);
    }
  }

  // 2. Service Threat + Contact / Link / Urgency / Impersonation -> Minimum 85
  if (ruleIds.has('IND_SERVICE_THREAT')) {
    if (ruleIds.has('IND_UNOFFICIAL_CONTACT') || ruleIds.has('IND_SUSPICIOUS_LINK_APP') || ruleIds.has('IND_URGENCY') || ruleIds.has('IND_IMPERSONATION')) {
      rawScore = Math.max(rawScore, 88);
    }
  }

  // 3. KYC Pretext + Link / Threat / Urgency -> Minimum 82
  if (ruleIds.has('IND_KYC_PRETEXT')) {
    if (ruleIds.has('IND_SUSPICIOUS_LINK_APP') || ruleIds.has('IND_SERVICE_THREAT') || ruleIds.has('IND_URGENCY')) {
      rawScore = Math.max(rawScore, 84);
    }
  }

  // 4. Financial Bait + Telegram / Link / Contact -> Minimum 78
  if (ruleIds.has('IND_FINANCIAL_BAIT')) {
    if (ruleIds.has('IND_UNOFFICIAL_CONTACT') || ruleIds.has('IND_SUSPICIOUS_LINK_APP') || ruleIds.has('IND_URGENCY')) {
      rawScore = Math.max(rawScore, 80);
    }
  }

  // 5. Suspicious Link + Brand -> Minimum 76
  if (ruleIds.has('IND_SUSPICIOUS_LINK_APP') && ruleIds.has('IND_IMPERSONATION')) {
    rawScore = Math.max(rawScore, 78);
  }

  // Deduct dampeners for authentic transactional messages
  let dampener = 0;
  if (LEGIT_OTP_WARNING.test(text) && !ruleIds.has('IND_OTP_REQUEST')) {
    dampener += 30;
  }
  if (LEGIT_TRANSACTION.test(text) && !ruleIds.has('IND_SERVICE_THREAT')) {
    dampener += 20;
  }

  const finalScore = Math.min(100, Math.max(0, rawScore - dampener));

  // Determine Risk Category
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (finalScore >= 70) {
    riskLevel = 'High';
  } else if (finalScore >= 30) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'Low';
  }

  const riskLevelLocalized = language === 'kn'
    ? (riskLevel === 'High' ? 'ಹೆಚ್ಚಿನ ಅಪಾಯ (High Risk)' : riskLevel === 'Medium' ? 'ಮಧ್ಯಮ ಅಪಾಯ (Medium Risk)' : 'ಕಡಿಮೆ ಅಪಾಯ (Low Risk)')
    : `${riskLevel} Risk`;

  // Summary
  let summary = '';
  if (riskLevel === 'High') {
    summary = language === 'kn'
      ? 'ಎಚ್ಚರಿಕೆ: ಈ ಸಂದೇಶದಲ್ಲಿ ಗಂಭೀರ ವಂಚನೆಯ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿವೆ. ಯಾವುದೇ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ ಅಥವಾ ಒಟಿಪಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.'
      : 'High Alert: Multiple serious scam indicators detected. The sender is attempting to extract sensitive credentials, create panic, or compromise your accounts.';
  } else if (riskLevel === 'Medium') {
    summary = language === 'kn'
      ? 'ಗಮನಿಸಿ: ಈ ಸಂದೇಶದಲ್ಲಿ ಕೆಲವು ಸಂಶಯಾಸ್ಪದ ಲಕ್ಷಣಗಳಿವೆ. ಕ್ರಮ ಕೈಗೊಳ್ಳುವ ಮುನ್ನ ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಪರಿಶೀಲಿಸಿ.'
      : 'Caution Advised: Suspicious warning signs detected. Verify the request through official channels before acting or replying.';
  } else {
    summary = language === 'kn'
      ? 'ಕಡಿಮೆ ಅಪಾಯ: ಯಾವುದೇ ಪ್ರಮುಖ ವಂಚನೆಯ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಆದರೂ ಅಪರಿಚಿತ ಸಂದೇಶಗಳ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆ ಇರಲಿ.'
      : 'Low Risk: Few or no scam indicators detected. Standard digital safety practices still apply.';
  }

  // Recommendations
  const recommendations: SafetyRecommendation[] = [];
  if (ruleIds.has('IND_OTP_REQUEST')) {
    recommendations.push({
      priority: 1,
      action: language === 'kn' ? 'ಯಾರೊಂದಿಗೂ ಒಟಿಪಿ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ' : 'Do not share OTP, PIN, or passwords',
      detail: language === 'kn' ? 'ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿ ಎಂದು ಹೇಳಿಕೊಂಡರೂ ಯಾವುದೇ ಗೌಪ್ಯ ಕೋಡ್ ಹೇಳಬೇಡಿ.' : 'Never forward or dictate any OTP or passwords to anyone, even bank callers.'
    });
  }

  if (ruleIds.has('IND_SUSPICIOUS_LINK_APP') || ruleIds.has('IND_FINANCIAL_BAIT')) {
    recommendations.push({
      priority: 2,
      action: language === 'kn' ? 'ಅಪರಿಚಿತ ಲಿಂಕ್‌ಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ' : 'Do not click links or install requested apps',
      detail: language === 'kn' ? 'ಸಂದೇಶದಲ್ಲಿರುವ ಲಿಂಕ್‌ಗಳನ್ನು ತೆರೆಯಬೇಡಿ ಅಥವಾ AnyDesk ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಡಿ.' : 'Avoid opening shortened links or installing remote screen-sharing tools like AnyDesk.'
    });
  }

  if (riskLevel === 'High' || riskLevel === 'Medium') {
    recommendations.push({
      priority: 3,
      action: language === 'kn' ? 'ಅಧಿಕೃತ ಗ್ರಾಹಕ ಸೇವೆ ಮೂಲಕ ಪರಿಶೀಲಿಸಿ' : 'Verify through an official independent channel',
      detail: language === 'kn' ? 'ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಕಾರ್ಡ್ ಹಿಂಭಾಗದಲ್ಲಿರುವ ಅಧಿಕೃತ ಸಂಖ್ಯೆಗೆ ಮಾತ್ರ ಕರೆ ಮಾಡಿ.' : 'Call the number printed on the back of your debit card or official electricity bill.'
    });
    recommendations.push({
      priority: 4,
      action: language === 'kn' ? 'ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಸಹಾಯವಾಣಿ 1930 ಗೆ ದೂರು ನೀಡಿ' : 'Report suspicious activity to National Cyber Helpline (1930)',
      detail: language === 'kn' ? 'ಹಣ ಕಳೆದುಕೊಂಡಿದ್ದರೆ ತಕ್ಷಣ 1930 ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ.' : 'In India, report digital scams immediately by dialing 1930 or via cybercrime.gov.in.'
    });
  } else {
    recommendations.push({
      priority: 1,
      action: language === 'kn' ? 'ಸಾಮಾನ್ಯ ಎಚ್ಚರಿಕೆ ವಹಿಸಿ' : 'Standard Caution Advised',
      detail: language === 'kn' ? 'ಈ ಸಂದೇಶದಲ್ಲಿ ಅಪಾಯ ಕಂಡುಬಂದಿಲ್ಲವಾದರೂ ಅಪರಿಚಿತ ಸಂದೇಶಗಳ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆ ಇರಲಿ.' : 'While no high-risk markers matched, always exercise standard digital care.'
    });
  }

  recommendations.sort((a, b) => a.priority - b.priority);

  // Trusted Contact Summary
  const trustedSummary = {
    risk_level: riskLevel,
    risk_score: finalScore,
    headline: riskLevel === 'High'
      ? (language === 'kn' ? 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ವಂಚನೆ ಪತ್ತೆಯಾಗಿದೆ' : 'High-Risk Scam Pattern Detected')
      : (language === 'kn' ? 'ಸುರಕ್ಷತಾ ಮೌಲ್ಯಮಾಪನ' : `${riskLevel} Risk Assessment`),
    safeguard_text: language === 'kn'
      ? 'ಯಾವುದೇ ಒಟಿಪಿ ಅಥವಾ ಗೌಪ್ಯ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಬೇಡಿ ಎಂದು ಸಲಹೆ ನೀಡಲಾಗಿದೆ.'
      : 'We advised the recipient not to share any credentials and to avoid clicking links.',
    suggested_message: language === 'kn'
      ? `AlertIQ Alert: ನಾನು ಸಂಶಯಾಸ್ಪದ ಸಂದೇಶವೊಂದನ್ನು ಪರೀಕ್ಷಿಸಿದ್ದು, ಇದು ${finalScore}/100 (${riskLevelLocalized}) ಅಪಾಯ ಸ್ಕೋರ್ ಪಡೆದಿದೆ. ಯಾವುದೇ ಒಟಿಪಿ ಅಥವಾ ಹಣ ಪಾವತಿಸದಂತೆ ಸಲಹೆ ನೀಡಲಾಗಿದೆ.`
      : `AlertIQ Safety Alert: I analyzed a suspicious message scored at ${finalScore}/100 (${riskLevel} Risk). AlertIQ advised verifying via official numbers before responding.`
  };

  const elapsed = Math.round((performance.now() - startTime) * 10) / 10;

  return {
    risk_score: finalScore,
    risk_level: riskLevel,
    risk_level_localized: riskLevelLocalized,
    summary,
    detected_indicators: indicators,
    recommendations,
    trusted_contact_summary: trustedSummary,
    disclaimer: 'AlertIQ provides an assistive awareness assessment, not a legal or forensic guarantee. Always verify through official channels.',
    processing_time_ms: Math.max(0.1, elapsed),
    language,
    senior_mode: seniorMode,
  };
}
