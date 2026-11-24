# AlertIQ — AI-Powered Scam Detection & Digital Safety

> **Tagline:** Detect the warning signs. Understand the risk. Stay safe.  
> **Aesthetic:** Clean, high-contrast, accessible **Pure Light Theme**.

---

## 1. Project Overview

**AlertIQ** is an assistive cybersecurity awareness web application designed to help everyday citizens, senior citizens, and non-technical users evaluate suspicious digital messages (SMS, WhatsApp, emails, job offers, banking alerts).

Instead of providing a cryptic, black-box label, AlertIQ unpacks the psychological triggers used by scammers, calculates an explainable risk score (0–100), highlights exact evidence snippets from the text, and delivers plain-language safety recommendations.

---

## 2. Core Implemented Features

### 1. Scam-Message Risk Analysis Engine
- Detects 8 major threat categories:
  - **Credential Harvesting:** Solicitation of OTPs, passwords, ATM PINs, CVV.
  - **Artificial Urgency & Panic:** False deadlines ("immediately", "within 24 hrs", "today only").
  - **Threat of Disconnection:** Power cutoff, bank account freezing, SIM deactivation.
  - **Brand & Authority Impersonation:** Banks (SBI, HDFC), Utilities (BESCOM), India Post, Police.
  - **Financial Bait & Fake Rewards:** Unsolicited lotteries, part-time jobs, Telegram tasks.
  - **Malicious Vectors:** Shortened URLs (`bit.ly`, `tinyurl`), APK downloads, AnyDesk remote-access prompts.
  - **KYC Verification Pretexts:** Mandatory PAN/Aadhaar linking under duress.
  - **Unofficial Contact Prompts:** Personal 10-digit mobile numbers for official utilities.
- **False-Positive Dampening:** Authentic transactional debits and legitimate inbound OTP security notices (containing explicit *"Do not share"* instructions) are recognized and not falsely penalized.

### 2. Explainable Assessment & Calibrated Score
- **0 – 29: Low Risk (Emerald)** — Few or no indicators detected.
- **30 – 69: Medium Risk (Amber)** — Caution required; suspicious signs detected.
- **70 – 100: High Risk (Crimson)** — Immediate danger; severe credential or threat patterns.

### 3. Senior Citizen Safety Mode & Regional Accessibility
- **Senior Safety Mode Switch:** Toggles larger typography, high-contrast borders, and friendly, comforting, non-technical advice.
- **Dual-Language Localization (English & Kannada):**
  - Instant toggle between English and **ಕನ್ನಡ (Kannada)**.
  - Fully translated categories (e.g. *ಹೆಚ್ಚಿನ ಅಪಾಯ*), warning sign descriptions, and action checklists.

### 4. Consent-Based Trusted-Contact Alert Simulation
- Optional feature allowing users to share an assistive risk summary with a family member or caregiver.
- **Privacy-Safe:** Raw message text is *never* exposed; only the risk level and safety advice are transmitted.

### 5. 1-Click Instant Demo Scenarios
- **Electricity Disconnection Threat (High Risk)**
- **Bank KYC & OTP Harvesting Phishing (High Risk)**
- **Part-Time Telegram Job Offer (Medium Risk)**
- **Authentic Bank Debit Transaction (Low Risk)**
- **Authentic Amazon Delivery & OTP Caution (Low Risk)**

---

## 3. Quick Start Guide

### Prerequisites
- Python 3.10+ (tested on Python 3.13)
- Node.js 18+ (tested on Node v24)

### Method A: One-Click Launch (Windows)
Double-click:
```bat
start_alertiq.bat
```
This launches the FastAPI backend on `http://127.0.0.1:8000` and the React frontend on `http://localhost:5173`.

---

### Method B: Manual Startup

#### 1. Backend Server
```powershell
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Health: `http://127.0.0.1:8000/api/health`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

#### 2. Frontend Development Server
```powershell
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 4. Running Backend Automated Tests

AlertIQ includes a suite of 13 unit and integration tests verifying scam detection, legitimate message dampening, Senior Citizen Mode, Kannada localization, and API endpoints.

```powershell
$env:PYTHONPATH='backend'
.\backend\venv\Scripts\pytest.exe .\backend\app\tests
```

**Results:**
```text
backend\app\tests\test_api_endpoints.py .....  [ 38%]
backend\app\tests\test_legit_samples.py ...   [ 61%]
backend\app\tests\test_scam_samples.py .....   [100%]
====================== 13 passed in 0.69s ======================
```

---

## 5. Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React (Light Themed).
- **Backend:** Python 3.13, FastAPI, Uvicorn, Pydantic v2.
- **Engine:** Explainable Regex & Heuristics with non-linear scoring and contextual dampeners.
- **Privacy:** In-memory stateless processing; zero database storage of submitted messages.
