# AlertIQ --- AI-Powered Scam Detection & Digital Safety

**Project type:** Web-based cybersecurity awareness and scam-message
analysis tool\
**Project status:** MVP planning document\
**Tagline:** Detect the warning signs. Understand the risk. Stay safe.

------------------------------------------------------------------------

## 1. Project overview

AlertIQ is a web application that helps people assess suspicious
messages they receive through SMS, email, messaging apps, or other
digital channels.

A user pastes a message into AlertIQ. The application analyses its
wording for possible scam indicators, presents a risk category and
score, highlights the warning signs it found, explains why those signs
matter, and recommends safer next steps.

AlertIQ is designed to make digital safety easier to understand,
especially for everyday users, senior citizens, and people who may not
be familiar with common online scams.

**Core principle:** AlertIQ should not merely label a message. It should
explain the evidence behind its assessment and help the user make a
safer decision.

> Important: AlertIQ is an assistive awareness tool, not a guarantee
> that a message is safe or fraudulent. Its results should be presented
> as an assessment, not a definitive verdict.

------------------------------------------------------------------------

## 2. Problem statement

Scam messages often imitate banks, delivery services, government
services, employers, or people the recipient trusts. They may use
urgency, fear, rewards, impersonation, suspicious links, or requests for
sensitive information to influence the recipient.

Many users find it difficult to recognise these warning signs. A simple
spam/not-spam label may not explain what is suspicious or what action
the recipient should take.

There is a need for an accessible tool that: - Analyses suspicious
message content. - Explains the warning signs in understandable
language. - Communicates risk without overstating certainty. -
Recommends safer actions. - Makes the experience easier to use for
people with different levels of digital literacy.

------------------------------------------------------------------------

## 3. Proposed solution

AlertIQ provides an explainable message-analysis experience.

### Main user journey

1.  The user opens the AlertIQ website.
2.  The user pastes a suspicious SMS, email, or message into the
    analysis box.
3.  The frontend sends the text to the backend.
4.  The backend checks the text for supported scam indicators.
5.  The risk engine calculates a risk score and assigns a risk category
    based on the indicators found.
6.  AlertIQ displays the result, evidence, explanation, and recommended
    next steps.
7.  If the user has enabled the optional trusted-contact feature,
    AlertIQ can demonstrate a consent-based alert containing a brief
    risk summary.

------------------------------------------------------------------------

## 4. Features agreed for AlertIQ

### Feature 1 --- Scam-message analysis

The user can paste message text into the application for analysis.

The first version should recognise a practical set of indicators, such
as: - Requests for OTPs, passwords, PINs, or banking details. - Urgent
demands to act immediately. - Claims of account suspension or unexpected
account problems. - Unexpected prize, reward, refund, or payment
claims. - Pressure to click a link or make a payment. - Impersonation
language or unusual requests for personal information.

The MVP can begin with a transparent, Python-based rule engine. A
machine-learning model can be added later if the team has suitable data
and time to evaluate it.

### Feature 2 --- Explainable risk assessment

Show the user: - A risk score. - A risk category, such as Low, Medium,
or High. - The warning signs detected in the message. - A short
explanation of why each warning sign matters.

The score must be calculated from the actual implemented analysis logic.
It must not be presented as a statistically validated probability unless
the team has built and evaluated such a model.

### Feature 3 --- Senior Citizen Safety Mode and trusted-contact alerts

**Senior Citizen Safety Mode** - Use simple, clear language. - Make the
result easy to read. - Explain technical terms in everyday language. -
Provide English explanations first; add basic Kannada explanations if
the team can test them properly.

**Trusted-contact alert** - Make this optional and consent-based. - Let
the user choose whether to share an alert. - For the MVP, demonstrate
the feature with a safe test contact or a simulated notification. -
Share only a brief risk summary, not the full private message, unless
there is a clear need and explicit consent.

Do not send alerts automatically or expose a user's private messages
without permission.

### Feature 4 --- Actionable safety recommendations

Recommendations should be based on the warning signs detected.
Examples: - Do not share OTPs, passwords, PINs, or banking details in
response to an unexpected message. - Do not rush to click a suspicious
link. - Verify the request using the organisation's official app,
website, or independently obtained contact details. - If a message
claims that an account has a problem, contact the organisation through a
known official channel. - If money or account access may be at risk,
contact the relevant bank or service provider through its official
support channel.

### Feature 5 --- Accessible web application

Build a responsive interface that works on a laptop and mobile browser.

The MVP should have: - A clear home page. - A large message input
area. - An Analyse button. - A results panel. - A clear reset or
analyse-another-message option. - An accessible layout with readable
text and understandable labels.

------------------------------------------------------------------------

## 5. MVP scope: what we will actually build first

The MVP should demonstrate one complete, reliable user journey rather
than many unfinished features.

### Must-have for the first working demo

1.  A responsive AlertIQ webpage.
2.  A message input box where users can paste sample text.
3.  A FastAPI backend endpoint that receives the text.
4.  A Python rule-based analysis engine.
5.  A risk score and Low / Medium / High category derived from
    implemented rules.
6.  A list of detected warning signs.
7.  Plain-language explanations for those warning signs.
8.  Safety recommendations.
9.  A small set of prepared sample messages for a repeatable
    demonstration.

### Should-have if time permits

-   Senior Citizen Safety Mode with simpler explanations.
-   Basic English and Kannada explanation display, after checking
    translation quality.
-   A trusted-contact alert demonstration using a simulated notification
    or test contact, with explicit user consent.
-   A small history of results stored locally during the demo, only if
    privacy is handled appropriately.

### Later enhancements --- not required for the first MVP

-   A trained machine-learning scam classifier.
-   URL and domain reputation checking through a suitable
    threat-intelligence service.
-   Email-header authentication analysis.
-   Screenshot or image text extraction (OCR).
-   Voice input and voice explanations.
-   More Indian languages.
-   Improved threat intelligence and regularly updated scam patterns.
-   Production-grade account management, notifications, and deployment.

**Scope decision:** Do not try to build every future feature in the
first version. Complete and test the message-to-explanation workflow
first.

------------------------------------------------------------------------

## 6. Proposed technology stack

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React.js + TypeScript   User interface

  Styling                 Tailwind CSS            Responsive design

  Development tooling     Vite                    Frontend development
                                                  server and build

  Backend                 Python + FastAPI        API and application
                                                  logic

  Initial analysis        Python rule-based       Detect supported scam
                          engine                  indicators

  Optional later NLP/ML   Scikit-learn or Hugging Experiment with text
                          Face                    classification

  Version control         Git + GitHub            Team collaboration and
                                                  source control

  Optional database       Firebase or PostgreSQL  Store settings or
                                                  consented records if
                                                  needed

  Deployment              Vercel / Render         Hosting, if required
  -----------------------------------------------------------------------

Choose one database only if the MVP genuinely needs persistent data. The
first demo can work without storing submitted messages.

**Honest technology description:** If the first version uses rules,
describe it as a rule-based scam-indicator analysis engine. Do not claim
that a trained AI model is being used unless one is actually integrated
and tested.

------------------------------------------------------------------------

## 7. System architecture

``` text
                 USER
                   |
                   v
        React + TypeScript Frontend
                   |
          Submit message text
                   |
                   v
             FastAPI Backend
                   |
                   v
       Text Pre-processing / Checks
                   |
                   v
       Python Scam-Indicator Engine
                   |
                   v
            Risk Scoring Logic
                   |
                   v
        Explanation + Recommendation
                   |
                   v
          Structured API Response
                   |
                   v
       AlertIQ Results on Frontend
                   |
          Optional, consent-based
           trusted-contact demo
```

### Suggested backend response

The backend can return a structured response similar to this:

``` json
{
  "risk_score": 75,
  "risk_level": "High",
  "detected_indicators": [
    {
      "name": "Urgent action",
      "evidence": "The message pressures the recipient to act immediately.",
      "explanation": "Scam messages may use urgency to prevent careful verification."
    },
    {
      "name": "Sensitive information request",
      "evidence": "The message asks for an OTP.",
      "explanation": "An unexpected request for an OTP is a serious warning sign."
    }
  ],
  "recommendations": [
    "Do not share the OTP.",
    "Verify the request using the organisation's official channel."
  ],
  "disclaimer": "This is an automated assessment, not a guarantee."
}
```

This is an illustrative API shape, not a claim that the feature is
already implemented. The actual score and detected indicators must come
from the backend's real rules.

------------------------------------------------------------------------

## 8. Risk assessment design

Start with a small, explainable set of rules.

For each supported indicator: 1. Define what text pattern or condition
the rule checks. 2. Record which rule matched. 3. Assign a documented
weight to that indicator. 4. Combine matched weights using a documented
scoring method. 5. Map the result to a risk category. 6. Return the
matched evidence and a user-friendly explanation.

The team should test ordinary legitimate messages as well as suspicious
examples. A message containing one keyword should not automatically be
treated as a scam.

### Suggested result categories

  -----------------------------------------------------------------------
  Category                            Meaning shown to the user
  ----------------------------------- -----------------------------------
  Low                                 Few supported warning signs were
                                      detected. Still verify unexpected
                                      requests.

  Medium                              Some warning signs were detected.
                                      Check the request carefully before
                                      acting.

  High                                Multiple or serious warning signs
                                      were detected. Do not act until you
                                      verify through an official channel.
  -----------------------------------------------------------------------

The exact score ranges should be decided after the team defines and
tests its scoring rules. Avoid presenting a score as a probability of
fraud.

------------------------------------------------------------------------

## 9. Challenges and mitigation

  -----------------------------------------------------------------------
  Challenge                           Mitigation
  ----------------------------------- -----------------------------------
  False positives                     Show the exact warning signs and
                                      explain why they were flagged. Test
                                      against legitimate messages too.

  Limited training data               Begin with transparent rules and
                                      use suitable labelled datasets only
                                      if available and permitted.

  Language limitations                Start with English; add Kannada
                                      explanations only after checking
                                      their accuracy and clarity.

  Privacy concerns                    Avoid storing submitted messages by
                                      default. Obtain consent before any
                                      optional sharing.

  External API dependency             Keep the initial analysis engine
                                      local so the core demo can work
                                      without external services.

  Overly broad scope                  Prioritise the complete
                                      message-analysis journey; move
                                      advanced features to the roadmap.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 10. 24-hour build plan

This is a suggested sprint sequence, not a promise that every optional
feature will be completed.

### Phase 1 --- Foundation

-   Create the GitHub repository and project structure.
-   Set up the React/Vite frontend.
-   Set up the FastAPI backend.
-   Agree on the request and response format.

### Phase 2 --- Core analysis

-   Implement the initial scam-indicator rules.
-   Implement documented scoring and risk categories.
-   Return matched indicators and explanations.
-   Test with prepared legitimate and suspicious sample messages.

### Phase 3 --- User interface

-   Build the message input page.
-   Connect the frontend to the backend.
-   Display the score, category, warning signs, and recommendations.
-   Add loading, empty-input, and error states.

### Phase 4 --- Accessibility and demo extras

-   Add Senior Citizen Safety Mode if the core flow is stable.
-   Add basic Kannada explanations only if the team can verify them.
-   Demonstrate trusted-contact alerts using a simulated or test
    notification with consent.

### Phase 5 --- Testing and presentation

-   Test the full flow from message submission to results.
-   Check mobile and desktop layouts.
-   Prepare a small set of repeatable demo examples.
-   Fix major bugs and prepare a short explanation of limitations.

------------------------------------------------------------------------

## 11. Demo plan

A short demonstration can follow this sequence:

1.  **Introduce the problem:** Explain how scam messages use urgency,
    impersonation, suspicious links, or requests for sensitive
    information.
2.  **Open AlertIQ:** Show the message-analysis interface.
3.  **Submit a prepared suspicious example:** Use a fictional sample
    message, not a real person's private message.
4.  **Show the result:** Point out the risk category, score, and
    detected warning signs.
5.  **Explain the result:** Show how AlertIQ explains each warning sign
    in simple language.
6.  **Show safety recommendations:** Explain what the user should do
    instead of responding immediately.
7.  **Show Senior Citizen Safety Mode:** If implemented, demonstrate the
    simpler explanation.
8.  **Show trusted-contact alert:** If implemented, demonstrate the
    opt-in flow using a test or simulated notification.
9.  **State limitations:** Explain that AlertIQ assists users and cannot
    guarantee that every scam will be detected.

### Example fictional demo message

> Your account will be suspended today. Verify immediately by sharing
> the OTP sent to your phone.

Expected demonstration points: - Urgency or pressure to act. - Request
for an OTP. - Explanation of why these are warning signs. -
Recommendation not to share the OTP and to verify through the official
service channel.

This example is for awareness and demonstration only.

------------------------------------------------------------------------

## 12. Privacy, safety, and responsible use

-   Do not ask users to enter real passwords, OTPs, PINs, or full
    banking details.
-   Use fictional or sanitised messages for demonstrations.
-   Do not store submitted text by default.
-   If storage is added, explain what is stored and why, and obtain
    appropriate consent.
-   Do not share message contents with trusted contacts by default.
-   Make trusted-contact sharing optional and clearly explain what will
    be shared.
-   Do not claim a message is definitely safe just because no warning
    signs were detected.
-   Show uncertainty and encourage verification through official
    channels.
-   Do not use AlertIQ to target, test, or send messages to people.

------------------------------------------------------------------------

## 13. Success criteria for the MVP

The MVP is ready for demonstration when:

-   [ ] The frontend runs and accepts message text.
-   [ ] The frontend successfully communicates with the FastAPI backend.
-   [ ] The backend detects the supported indicators.
-   [ ] The risk score and category are generated by documented logic.
-   [ ] The result shows the warning signs that triggered the
    assessment.
-   [ ] The explanations are understandable to a non-technical user.
-   [ ] The recommendations are safe and relevant.
-   [ ] Legitimate sample messages are included in testing.
-   [ ] Empty input and backend errors are handled.
-   [ ] The team can explain the limitations honestly.
-   [ ] The demo can be repeated reliably.

------------------------------------------------------------------------

## 14. Future scope

After the MVP is stable, AlertIQ can be expanded with: - OCR to analyse
text from screenshots. - URL and domain reputation checks. -
Email-header and sender-authentication analysis. - Improved
machine-learning models evaluated on suitable datasets. - Kannada and
other Indian-language support. - Voice-based explanations and
accessibility improvements. - More detailed scam-pattern information. -
Optional, privacy-conscious trusted-contact notifications.

------------------------------------------------------------------------

## 15. Final project pitch

**AlertIQ is an explainable digital-safety platform that helps users
recognise potential scam messages. It analyses message content,
identifies warning signs, explains the reasons behind its risk
assessment, and recommends safer next steps. With an accessible Senior
Citizen Safety Mode and optional consent-based trusted-contact alerts,
AlertIQ aims to make scam awareness easier for individuals and
families.**

**Our MVP goal:** Build one complete and reliable experience: paste a
suspicious message, understand the warning signs, and know how to
respond safely.
