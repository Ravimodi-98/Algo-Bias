# THE DECISION — Project Requirements Document

## 1. Project Overview

THE DECISION is an interactive, mobile-first educational web game designed to demonstrate the concepts of:

- Digital Ethics
- Algorithmic Bias
- Data Bias
- Decision Making
- Algorithmic Fairness
- Transparency
- Human Oversight
- Responsible AI

The project places students in the role of an "AI hiring algorithm."

Players are presented with fictional job candidates and asked to make hiring decisions.

The game intentionally provides a mixture of:

1. Relevant information
2. Irrelevant information
3. Potentially influential information

After several decisions, the game reveals how the information presented to the player may have influenced their choices.

The purpose is NOT to accuse players of being biased.

The purpose is to demonstrate how the information contained in data can influence decision-making and how an algorithm trained on similar data could learn and reproduce those patterns.

---

# 2. Problem Statement

People often assume:

"If an AI makes a decision, the decision must be objective."

This is not necessarily true.

Algorithms learn from data.

If the data contains historical patterns, incomplete information, human decisions, or unfair patterns, an algorithm may reproduce those patterns.

THE DECISION demonstrates this concept through an interactive experience rather than a traditional presentation.

---

# 3. Targeted Uses

## Primary Use

College classroom presentation for:

- Digital Ethics
- Artificial Intelligence Ethics
- Cybersecurity Ethics
- Responsible AI
- Computer Science seminars
- IT presentations

## Secondary Uses

The application should also work for:

- Workshops
- College exhibitions
- Hackathons
- Awareness programs
- AI ethics demonstrations
- Technology fairs
- Student demonstrations

---

# 4. Target Users

## Primary Users

College students.

## Secondary Users

- Teachers
- Professors
- Workshop participants
- Visitors
- Technology enthusiasts

The application should be understandable without requiring prior knowledge of AI or machine learning.

---

# 5. Core Experience

The experience should follow this basic story:

USER

↓

"You are the algorithm."

↓

Evaluate fictional candidates.

↓

Make several decisions.

↓

View collective decision patterns.

↓

Bias Reveal

↓

Understand how information influenced decisions.

↓

Learn how algorithms can learn patterns from data.

↓

Fairness Challenge

↓

Redesign the decision process.

↓

Final Reflection

---

# 6. Core Features

## 6.1 Landing Page

Display:

THE DECISION

"Would You Make a Fair Algorithm?"

Short explanation:

"You are about to make decisions as an AI hiring system."

Include:

- Start Game button
- QR-friendly layout
- Short instructions
- Presentation/project branding

---

# 6.2 Player Login

Players should be able to join quickly.

Requirements:

- No complicated registration
- Anonymous player identity
- Unique temporary player ID
- Optional nickname
- No unnecessary personal information

Example:

PLAYER-4821

---

# 6.3 Game Lobby

Players wait until the presenter starts the game.

Display:

- Game title
- Player status
- Round status
- Number of participants
- "Waiting for host..." message

---

# 6.4 Candidate Decision Rounds

Each round presents fictional candidates.

Example:

Candidate A

- Programming Skills: 9/10
- Experience: 2 years
- Projects: 4
- Interview Score: 8/10

Candidate B

- Programming Skills: 9/10
- Experience: 2 years
- Projects: 4
- Interview Score: 8/10

Additional information may be displayed.

Some information may be relevant.

Some information may be irrelevant.

Player selects:

"SELECT CANDIDATE A"

or

"SELECT CANDIDATE B"

---

# 6.5 Multiple Rounds

The game contains exactly 5 decision rounds.

Different rounds demonstrate different decision influences.

Possible factors:

- College background
- Location
- Resume presentation
- Name
- Experience
- Skills
- Projects
- Interview performance

The game must clearly distinguish between relevant and irrelevant information during the reveal.

---

# 6.6 Decision Timer

Each decision may have a limited amount of time.

Example:

15 seconds

The purpose is to simulate the pressure of automated decision-making.

The timer should never be stressful or punishing.

---

# 6.7 Live Results

After decisions are submitted, players may see:

Candidate A — 64%

Candidate B — 36%

The host dashboard should be able to display aggregate class results.

No individual player's identity should be publicly displayed.

---

# 6.8 Bias Reveal

After the decision rounds:

Display:

"WAIT."

"Something interesting happened."

Then explain:

"You were given information."

"Some of that information was relevant."

"Some of it wasn't."

"The information may have influenced your decision."

Avoid saying:

"You were biased."

Instead explain:

"This experiment demonstrates how the information used during decision-making can influence outcomes."

---

# 6.9 AI Connection

The game should then connect the experience to AI.

Display:

DATA
↓
ALGORITHM
↓
DECISION
↓
IMPACT

Explain:

"An algorithm learns from the data it receives."

"If the data contains problematic patterns, the algorithm may learn those patterns."

"At scale, these patterns can affect many people."

---

# 6.10 Fairness Challenge

Players are presented with candidate information and asked:

"Which information should an algorithm use when evaluating candidates?"

Players select relevant factors such as:

- Skills
- Relevant experience
- Projects
- Technical assessment
- Interview performance

The system should discourage irrelevant factors when they do not meaningfully predict job performance.

---

# 6.11 Final Reflection

The game ends with a reflection.

Example:

"Should we trust an AI decision simply because a computer made it?"

Final message:

"AI does not automatically make decisions fair."

"Fairness requires thoughtful data, testing, transparency, accountability, and human oversight."

---

# 7. Host / Presenter Dashboard

The presenter should have a separate dashboard.

Dashboard should show:

- Game status
- Number of players
- Current round
- Response count
- Candidate selection percentages
- Round results
- Aggregate decision patterns
- Fairness challenge results

The dashboard should be suitable for displaying on a projector.

---

# 8. Supabase Backend

Supabase is the primary backend.

Use Supabase for:

- Anonymous player sessions
- Game sessions
- Player IDs
- Game rounds
- Candidate data
- Player responses
- Aggregate results
- Host/game state
- Session synchronization

Do NOT store unnecessary personal information.

---

# 9. GitHub

GitHub is the source-control repository.

All meaningful development changes should be committed regularly.

Use clear commit messages.

Example:

feat: add candidate decision screen

fix: resolve lobby synchronization issue

feat: add bias reveal screen

---

# 10. Responsive Requirements

The application must work primarily on mobile phones.

Supported layouts:

- Mobile
- Tablet
- Desktop
- Projector/dashboard

The player interface should prioritize mobile.

The host dashboard should prioritize desktop/projector.

---

# 11. Performance & Presentation Capacity Requirements

The application must support:

- **Minimum Required Presentation Capacity**: 70 simultaneous Players + 1 Host in a single session.
- **Concurrent Burst Joins**: Up to 70+ students scanning the QR code and entering within seconds.
- **Simultaneous Decision Submissions**: High concurrency without race conditions or dropped votes.
- **Realtime Synchronization**: Zero desynchronization across rounds, Bias Reveal, Make It Fair, and Final Results.
- **Stress-Tested Headroom**: Benchmarked up to 80 concurrent players with 100% data integrity.
- **Fast Load Time & Lightweight Assets**: Smooth mobile rendering without unnecessary animation overhead.
- **Graceful Error Recovery**: Resilient reconnects and session restorations.

---

# 12. Privacy Requirements

The game should not require:

- Real names
- Email addresses
- Phone numbers
- College IDs
- Passwords unless absolutely necessary

Player data should be minimal and temporary where possible.

---

# 13. Success Criteria

The project is successful if a student can:

1. Join using a phone.
2. Understand the game without external explanation.
3. Make decisions.
4. See aggregate results.
5. Understand the bias reveal.
6. Understand the connection between data and algorithmic decisions.
7. Participate in the fairness challenge.
8. Leave with a clear understanding that AI decisions are not automatically fair.

---

# 14. Non-Goals

Do NOT build:

- A real recruitment system
- Real employment decisions
- Real candidate evaluation
- Facial recognition
- Real-world profiling
- A production HR platform
- A real machine-learning hiring model
- A system that labels individual students as biased

This is an educational simulation.