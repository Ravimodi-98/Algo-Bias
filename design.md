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
5. Progress indicator (Round X / 7)

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

# 6. Candidate Cards

Candidate cards are the most important interactive component.

Each card displays:
- Candidate Name & ID Badge (A or B)
- Role Title
- Core Competencies (Skill chips)
- Professional Experience
- Project Portfolio
- Education & Credentials
- Optional contextual attributes (Location, Highlight Metrics, Profile details, Presentation style)

Cards are rendered in crisp `#FFFFFF` with soft `#E2E8F0` borders, subtle box shadows, and distinct accent highlights when selected.

---

# 7. Mobile Decision Experience

Mobile is the primary player experience.

Recommended layout:

```text
ROUND 3 / 7
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

# 9. Results & Host Dashboard

Host console acts as an AI Experiment Control Room (Light Edition):
- Projector-friendly contrast
- High-visibility room code & participant count
- Active round scenario and educational goal overview
- Seamless Next Round progression controls