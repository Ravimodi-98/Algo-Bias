# THE DECISION — Design System

## 1. Design Philosophy

THE DECISION should feel like an interactive AI decision system rather than a normal college website.

The visual style communicates:

- Futuristic
- Intelligent
- Minimal
- Clean & Tech-focused
- Professional
- Interactive
- Educational

The design must remain easy to understand and accessible.

Visual effects should never reduce usability.

---

# 2. Permanent Theme

Primary theme (Case 5 onward):

**LIGHT FUTURISTIC AI CONTROL ROOM**

The interface feels modern, clean, futuristic, premium, educational, and technology-focused.

Use a light background rather than dark panels:
- White cards
- Subtle shadows
- Soft borders
- Clean spacing
- Restrained accent gradients
- Modern typography
- Subtle futuristic decorative grid overlays

---

# 3. Color Direction & Tokens

```css
Background:
#F6F8FC

Surface (Cards, Panels):
#FFFFFF

Secondary Surface:
#F8FAFC

Elevated Surface:
#FFFFFF

Primary Text:
#0F172A

Secondary Text:
#475569

Muted Text:
#64748B

Border Subtle:
#E2E8F0

Primary Accent (Electric Blue / Cyan):
#0284C7 (Text/Icons) / #0369A1 (Hover)

Secondary Accent (Violet / Purple):
#7C3AED / #6D28D9

Success:
#15803D

Warning:
#B45309

Error:
#DC2626
```

### Important Accessibility Rules

- Maintain strong readability with WCAG AA compliance (4.5:1 text contrast).
- Never communicate important information using color alone; use icons, badges, labels, and text.
- Form inputs, buttons, and badges must have clear interactive focus and hover states.

---

# 4. Visual Hierarchy

Every screen should have:

1. Main title / Scenario header
2. Context explanation
3. Main interaction (Candidate cards comparison & decision buttons)
4. Supporting information / details
5. Progress indicator (Round X / 5)

The primary action must be visually dominant.

---

# 5. Typography

Modern sans-serif typography:

- Primary: `Inter`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Monospace (Codes, Metrics, Callouts): `JetBrains Mono`, monospace

Scale:
- Main Game Title: 36–48px desktop, 28–36px mobile
- Section Heading: 20–26px
- Card Titles: 18–20px
- Body Text: 15–16px
- Supporting / Muted: 12–14px
- Button Labels: 15–16px bold

---

# 6. Compact Candidate Cards (Case 6)

Candidate information must be scannable at a glance to prioritize decision-making over reading mini-resumes.

### Content Density Principles
- **Scannable at a glance**: Candidates should be understood in seconds, not read like long resumes.
- **Strict Content Limits**:
  - Name: 1 short line
  - Role: 1 short line
  - Skills: 3–4 items presented inline (`Python · SQL · React`)
  - Experience: 1 short sentence
  - Projects: 1–2 short names (only when relevant)
  - Education / Location / Details: Rendered strictly when relevant to that specific round.
- **Max 2–4 Information Groups**: Never overcrowd candidate cards with unnecessary properties.
- **Mobile-First Height**: Cards are compact so both candidates and decision controls remain visible with minimal scrolling on mobile.

# 7. Countdown Timer Design

The timer provides synchronized decision pacing for classroom gameplay:
- Clear visual countdown display (`TIME REMAINING: 00:24`).
- Progress bar indicator showing time elapsed.
- Accessible low-time indicator (<10s) with pulsing icon and text label (never color alone).
- Authoritative calculation anchored to the database `round_started_at` timestamp to prevent refresh resets.
- Decision locks instantly on submission, pausing the player's countdown.


# 7. Mobile Decision Experience

Mobile is the primary player experience.

Recommended layout:

```text
ROUND 3 / 5
━━━━━━━━━━━━━━━━━━━

Scenario & Question

Candidate A
[card]

VS

Candidate B
[card]

WHO WOULD YOU SELECT?

[ SELECT CANDIDATE A ]
[ SELECT CANDIDATE B ]

[ CONFIRM & SELECT CANDIDATE ... ]
```

Decision controls feature minimum 44px touch targets with instant visual feedback upon selection.

---

# 8. Tone & Educational Framing

- **No Shaming**: Never display "You are biased", "Bad decision", "Wrong choice", or "You failed".
- **Neutral Language**:
  - "Decision recorded."
  - "Interesting choice. Your decision has been recorded."
  - "Your selection for Candidate A has been logged for Round 1."
- **No Correct/Wrong Labels**: Decisions are part of an educational simulation exploring data influence.

---

# 9. Host Projector-First Dashboard (Case 7)

The Host live control center (`/host/game`) is optimized for classroom projector and large monitor displays:
- **Projector-Optimized Scale**:
  - Room Code: 2.5rem monospace with cyan glow.
  - Connected Players: 2.5rem bold count.
  - Live Responses: 2.5rem count with total (`15 / 18`).
  - Round Timer: 2.5rem countdown (`00:14`) with warning status when low.
- **Dynamic State Indicators**:
  - `ROUND ACTIVE`: Realtime badge with pulse indicating students are voting.
  - `ALL RESPONSES RECEIVED`: Success badge with pulse indicating all active students have submitted.
  - `DECISION WINDOW CLOSED`: Warning badge when countdown expires before full submission.
  - `RESULTS REVEALED TO CLASSROOM`: Success indicator when collective data is broadcast.
- **Live Response Progress Bar**:
  - High-visibility 18px progress bar with smooth transition.
  - Dual feedback: visual track plus explicit projector text label (`15 of 18 players responded (83%)`).
- **Button Safety**:
  - Protected against double-clicks and rapid re-triggers (`actionLockRef` + `isActionInProgress`).
  - Clear visual hierarchy: `SHOW RESULTS` is prominent during response gathering; `NEXT ROUND` glows as primary action once results are revealed.

---

# 10. Aggregate Results Visualization & Classroom Display

The collective result screen provides immediate, high-contrast classroom comprehension:
- **Concealed State during Voting**:
  - To preserve experimental integrity, candidate vote tallies are concealed on the projector until the presenter clicks `SHOW RESULTS`.
  - Presenter has an optional private peek toggle for previewing on private monitors.
- **Revealed Classroom Distribution**:
  - **Option 1 & 2 Cards**: Candidate names, 4.25rem bold percentage values, and vote counts.
  - **Majority Choice Badge**: Automatic highlight for the prevailing candidate without value judgments.
  - **Split Stacked Distribution Bar**: 28px dual-color bar (Electric Blue `#0284c7` vs Royal Violet `#7c3aed`) with 0.8s cubic bezier animation.
  - **Presenter Guidance Box**: Educational prompt inviting discussion on decision patterns before round advancement.

---

# 11. Mobile Player Result Screen

When results are broadcast by the host, student mobile devices transition in real time:
- **Minimal & Scannable**: Shows Round X result with percentage bars for Candidate A and Candidate B.
- **Personal Touch**: Subtly indicates "Your pick" next to the candidate chosen by the student.
- **Reflection Tone**: "Interesting... The classroom decision pattern has been recorded."
- **Waiting Cue**: Animated status indicator showing "Standing by for host to begin Round X+1..."
- **Zero Identity Leakage**: Completely anonymous; no individual scores, leaderboard, or student comparisons.

---

# 12. Bias Reveal Visual Design (Case 8)

The Bias Reveal transitions the classroom from gameplay to theoretical comprehension across 9 structured steps:

- **Step Tracker**:
  - Clean numbered indicator `STEP X OF 9` with active progress dots.
  - Distinct purple/violet accent gradient (`#7C3AED` to `#6D28D9`) to denote the educational phase transition.
- **Hero Presentation Elements (Projector)**:
  - Step 1: Dramatic high-contrast "WAIT." hero text (5rem) with subtle scale entrance animation.
  - Step 2: Grid of all 5 completed rounds with classroom percentage split bars and delta callouts.
  - Step 3: Clear side-by-side comparison tables highlighting "Identical Qualifications" vs "Contextual Variation".
  - Step 4: Two-column classification cards (Relevant in Emerald `#059669` vs Less Relevant in Slate `#64748B`).
  - Step 5: Large projector prompt card ("DID THE INFORMATION INFLUENCE THE DECISION?") with presenter discussion cues.
  - Step 6: Visual scale progression (1 decision → 100 decisions → 10,000 algorithmic training inputs).
  - Step 7: Animated interactive pipeline flowchart: `DATA → ALGORITHM → DECISION`.
  - Step 8: Extended societal impact flowchart: `DATA → ALGORITHM → DECISION → IMPACT` with high-emphasis "AUTOMATION ≠ FAIRNESS" alert card.
  - Step 9: Action-oriented summary card ("Make the decision process more thoughtful") with seamless bridge button to the Stage 2 Fairness Challenge.
- **Mobile Device Synchronization**:
  - Students see the exact same educational slides and diagrams formatted for mobile touchscreens.
  - Step transitions are controlled strictly by the presenter, keeping the entire room aligned in real time.

---

# 13. Educational Tone & Non-Shaming Ethics

- **Strict Non-Shaming Language**: Never accuse students of bias. Avoid phrases like "You failed," "Wrong choice," or "You are biased."
- **Objective Structural Focus**: Frame shifts as "The decisions changed when the information changed."
- **Data-Driven Grounding**: All reveal stats are derived directly from actual classroom submissions in Supabase, keeping the discussion authentic and participatory.

---

# 14. Make It Fair Visual Design (Case 9)

The **MAKE IT FAIR** interactive challenge empowers students to actively design, configure, and audit an algorithmic decision process:

- **Aesthetic Continuity**:
  - Maintained light futuristic AI experience: clean white cards (`#ffffff`), light canvas (`#f6f8fc`), high-contrast slate typography (`#0f172a`), cyan accent (`#0284c7`), and violet secondary accent (`#7c3aed`).
- **Challenge Progress System**:
  - 10 structured steps (Step 0 to 9) with interactive step progress pills.
  - Synchronized across the session Host and all connected student smartphones via Supabase Realtime.
- **Factor Selection System (Round 1)**:
  - Multi-select card list with instant visual feedback and selection checkmarks.
  - Clear taxonomy badges: `QUALIFICATION` (green), `CONTEXTUAL` (amber), `UNRELATED` (red).
  - Principle callout: *"RELEVANCE MATTERS: Information should have a clear connection to the decision being made. Relevance is contextual."*
- **Decision Rule Builder (Round 2)**:
  - Accessible 4-tier priority selector (`HIGH`, `MEDIUM`, `LOW`, `EXCLUDE`) with tap-friendly button groups.
  - Real-time readable rule synthesis: *"1. Relevant Skills, 2. Relevant Experience... Other unrelated information is not used."*
- **Candidate Application Evaluation (Round 3)**:
  - Side-by-side comparative candidate profiles with explicit trade-offs (Technical Skills vs Industry Experience).
- **Controlled System Audits (Steps 4 to 7)**:
  - **Fairness Test A (Unrelated Info)**: 3-way choice (`NO` / `DEPENDS ON CONTEXT` / `YES`).
  - **Consistency Test B**: Evaluating robustness against irrelevant variations.
  - **Transparency Test C**: Explaining decisions through documented factors vs uninterpretable black boxes.
  - **Human Oversight D**: Accountability in automated pipelines (`NO (Need Review)` vs `YES (Accept)`).
- **Classroom Aggregate Results & Comparison (Step 8)**:
  - Visual distribution bars displaying actual student selection frequencies without exposing individual names.
  - Comparative card layout: *Original Approach* (unconstrained info) vs *Designed Approach* (relevance prioritized).
- **Key Reflection & Synthesis (Step 9)**:
  - Multi-column prompt cards: What to include? What to leave out? How to test it?
  - Highlighted thesis banner: *"FAIRNESS IS NOT A BUTTON. It is an ongoing process of designing, testing, monitoring, and improving decisions."*
- **Responsive Layout**:
  - Mobile-first student UI with large touch targets, single-column scrolling, and instant feedback.
  - Projector-first presenter UI with large typography (2.5rem+), live submission counters, and authoritative navigation.

---

# 15. Final Results & Reflection Visual Design (Case 10)

The **FINAL RESULTS & REFLECTION** brings the entire educational journey together into a cohesive, presentation-ready conclusion:

- **Aesthetic Continuity**:
  - Light Futuristic AI Experience maintained consistently: `#f6f8fc` crisp light background, pure white `#ffffff` elevated cards with soft borders (`#e2e8f0`), deep slate typography (`#0f172a`), electric cyan (`#0284c7`), and royal violet (`#7c3aed`).
- **6 Synchronized Steps (Step 0 to 5)**:
  - **Step 0: Final Classroom Results**:
    - Projector displays total players, decision rounds, total votes logged, and Make It Fair participation.
    - No winners, losers, or fairness rankings. All metrics represent classroom aggregate participation.
  - **Step 1: What Did We Learn?**:
    - 5 Core Educational Principles presented as high-contrast cards with distinct numbering and accent badges:
      1. *Information Matters*: Adding or removing information changes decisions.
      2. *Relevance Matters*: Information should have a legitimate connection to the decision.
      3. *Data Matters*: Algorithms learn from past human choices and replicate their patterns.
      4. *Testing Matters*: Systems must be audited for consistency across groups before deployment.
      5. *Accountability Matters*: Humans design, deploy, and remain accountable for automated outcomes.
  - **Step 2: The Complete Chain**:
    - Interactive visual flowchart: `DATA → ALGORITHM → DECISION → IMPACT`.
    - Golden rule callout: `FAIRNESS` must encircle every step of the pipeline, not just the algorithm.
  - **Step 3: Automation ≠ Fairness (The Four Pillars)**:
    - 4 architectural pillars: *1. Data Quality*, *2. Regular Audits*, *3. Explainability*, *4. Human Oversight*.
    - Thesis banner: *"AUTOMATION ≠ FAIRNESS: Automating a biased decision simply produces biased outcomes faster and at scale."*
  - **Step 4: Classroom Reflection ("ONE LAST QUESTION")**:
    - Host view displays live frequency distribution of the 5 key reflection themes selected by students.
    - Player view gives students multi-select theme chips and an optional 140-character single-sentence takeaway.
    - Submitting shows celebratory acknowledgment and the core takeaway mantra:
      *"YOU DIDN'T JUST MAKE A DECISION. You examined how decisions are made. DATA → ALGORITHM → DECISION → IMPACT. THINK BEFORE YOU AUTOMATE."*
  - **Step 5: Simulation Complete & Final Discussion**:
    - Large projector discussion prompt:
      *"IF AN ALGORITHM MAKES A DECISION FOR US... WHO IS RESPONSIBLE FOR MAKING SURE IT IS FAIR?"*
    - Host controls `END THIS SESSION` with a confirmation modal that cleanly locks submissions and updates session status to `completed`.
- **Presentation Mode**:
  - Projector toggle (`PRESENTATION MODE` vs `STANDARD VIEW`) removes side margins and maximizes font sizes for auditorium and lecture hall visibility.

---

# 16. UI Polish, Animations, Accessibility & Responsive Design (Case 11)

### Visual Direction Summary
- **Permanent Light Theme**: Crisp light canvas (`#f6f8fc`), pure white cards (`#ffffff`), dark readable text (`#0f172a`), electric cyan primary accent (`#0284c7`), and royal violet secondary accent (`#7c3aed`).
- **Elimination of Legacy Dark Elements**: All headers (`PlayerHeader`, `HostHeader`), toast messages, error badges, and icons migrated to pure light theme tokens with zero low-contrast artifacts.
- **Mobile-First Player UX**:
  - Viewport-responsive (`320px`, `375px`, `390px`, `430px`) with iOS safe-area insets (`env(safe-area-inset-bottom)`).
  - Touch targets guaranteed at `44px+` (buttons `48px-56px`).
  - Tactile press micro-interactions (`:active { transform: scale(0.98); }`).
  - Clear 4-point hierarchy on `/play`: (1) Round indicator (2) Timer (3) Candidate card (4) Decision buttons.
- **Projector-First Host UX**:
  - Tested across `1366×768`, `1440×900`, and `1920×1080`.
  - High-contrast text legible from 5+ meters in lecture halls.
  - Large stat callouts (`2.5rem+`), clear round controls, and modal-shielded destructive actions.
- **Timer Visual Pacing**:
  - 3-tier non-jarring feedback: Normal (>15s, Cyan), Time getting low (6-15s, Amber), Final seconds (<=5s, Red).
  - Subtle bottom progress bar without distracting flashes.
- **Accessibility Standards**:
  - Global accessible `:focus-visible` rings with 2px cyan outline and 2px offset.
  - Screen reader utility `.sr-only` for accessible input labels and status announcements.
  - Full `@media (prefers-reduced-motion: reduce)` support instantly zeroing non-essential animations for vestibular comfort.
  - High-contrast mode support via `@media (forced-colors: active)`.
- **Loading & Error Polish**:
  - Non-blocking spinners with `role="status"` and `aria-live="polite"`.
  - Error cards with `role="alert"` and accessible high-contrast typography (`#b91c1c` on `#fef2f2`).

---

# 17. 70-Player Presentation Safety & High-Concurrency UI Design (Case 12)

### Presentation Safety Safeguards
- **Modal Guarded Termination**: Destructive host actions (`END SIMULATION`, `END THIS SESSION`) are protected by explicit modal dialogs requiring secondary confirmation to prevent accidental session termination during live lectures.
- **Accidental Navigation Protection**: Critical transitions (`SHOW RESULTS`, `START BIAS REVEAL`, `NEXT ROUND`) are prominent and context-aware, clearly indicating current session phase.

### High-Concurrency Roster & Aggregate Polish
- **Animation-Decoupled Roster Rendering**: Player list chip items render without re-triggering heavy CSS entrance animations during bursts of 70+ student joins, preserving 60fps smooth scrolling in the host lobby.
- **Projector Data Scaling**: Aggregate results, vote counts, and split-percentage bars scale cleanly from small screens up to 4K classroom projectors.
- **Instant Status Communication**: Accessible badges (`ROUND ACTIVE`, `ALL RESPONSES RECEIVED`, `DECISION WINDOW CLOSED`, `RESULTS REVEALED`) provide immediate feedback to the presenter without clutter.