# THE DECISION — Development Phases

## Development Strategy

Build the project incrementally.

Do not attempt to build the entire application at once.

Each phase should produce a working part of the application.

---

# PHASE 1 — Project Foundation & Login

## Goal

Create the basic application structure and player entry system.

## Tasks

- Initialize project structure
- Configure existing frontend
- Verify Supabase connection
- Verify GitHub connection
- Create environment configuration
- Create landing page
- Create Join Game screen
- Generate anonymous player/session ID
- Create basic routing

## Result

A user can open the application and enter the game.

---

# PHASE 2 — Host Dashboard & Game Lobby

## Goal

Allow the presenter to create and control a game session.

## Tasks

- [x] Host dashboard
- [x] Create game session
- [x] Generate game code
- [x] Generate QR-friendly join URL
- [x] Player lobby
- [x] Live player count
- [x] Waiting state
- [x] Start Game button
- [x] Supabase Realtime synchronization

## Result

Host creates a game and students join using their phones via QR or code. Realtime synchronization, projector mode, and host ownership verified.

---

# PHASE 3 — Game Engine

## Goal

Build the core round system.

## Tasks

- [x] Round system shell
- [x] Candidate data structure
- [x] Compact candidate cards
- [x] Decision buttons
- [x] Synchronized Countdown Timer (Case 6)
- [x] Submit response to database
- [x] Prevent duplicate responses
- [x] Round progression (Host control & Realtime sync)
- [x] Player progress indicator

## Result

Students can enter gameplay, view candidate profiles, make decisions, see progress indicators, and transition between rounds in real time.

---

# PHASE 4 — Candidate Decision Rounds

## Goal

Implement the educational decision scenarios.

## Tasks

- [x] Create Candidate data model & types
- [x] Create Central Round configuration (`rounds.ts`)
- [x] Round 1: Core Technical Skills (Aarav [Python/React] vs Rohan [Java/Linux])
- [x] Round 2: Institutional Background / College Pedigree (Maya [Apex Tech] vs Ishita [Metro Poly])
- [x] Round 3: Geographic Location (Kabir [Ahmedabad] vs Dev [Pune])
- [x] Round 4: Name / Presentation Style (Nisha [Structured] vs Anaya [Narrative])
- [x] Round 5: Final Multi-factor Decision Comparison (Dev vs Ishita)
- [x] Transition entire application to permanent Light Theme
- [x] Mobile-friendly VS layout & neutral non-shaming decision feedback

## Result

Players experience how presented information can influence decisions across 5 structured educational scenarios in a light futuristic AI control room interface.


---

# PHASE 5 — Live Results (CASE 7)

## Goal

Show collective player decisions without identifying individual students.

## Tasks

- [x] Response counting (Realtime response counter `X / Y`)
- [x] Candidate percentages (Authoritative calculation in `getRoundAggregates`)
- [x] Host live results (Projector-optimized control center at `/host/game`)
- [x] Player aggregate results (Mobile-first `PlayerResultsCard` with neutral tone)
- [x] Animated result visualization (Dual-color comparative split bar)
- [x] Anonymous statistics (Zero student identification; protects participants)
- [x] Authoritative results reveal (`results_visible` state controlled by Host)
- [x] Button safety & double-click protection

## Result

The presenter can control the classroom presentation flow (Start Round → Collect Responses → Show Results → Next Round) with real-time synchronization, high contrast projector UI, and instant mobile updates.

---

# PHASE 6 — Bias Reveal (CASE 8)

## Goal

Create the central educational reveal experience connecting classroom decisions to algorithmic data pipelines.

## Tasks

- [x] Database migration: `game_stage` ('round' | 'reveal' | 'fairness') and `reveal_step` (1 to 9) in `game_sessions`
- [x] Shared data: Complete 9-step educational sequence in `revealSteps.ts` with `ROUND_COMPARISON_FACTS`
- [x] Host control center: Projector-first `HostRevealView` with navigation controls (PREV, NEXT, CONTINUE TO FAIRNESS)
- [x] Mobile synchronized view: Responsive `PlayerRevealView` synchronized via Supabase Realtime
- [x] Step 1: The Transition ("WAIT. Something interesting happened.")
- [x] Step 2: Classroom Decisions Summary (Aggregate session percentages without individual labels)
- [x] Step 3: What Changed? (Side-by-side core qualifications vs contextual variations)
- [x] Step 4: Relevant vs Less-Relevant Information (Factual classification of skills vs names/location)
- [x] Step 5: The Central Question ("DID THE INFORMATION INFLUENCE THE DECISION?")
- [x] Step 6: Human Decisions Become Data (Scaling 1 → 100 → 10,000 decisions into training pipelines)
- [x] Step 7: The Algorithm (`DATA → ALGORITHM → DECISION` flow)
- [x] Step 8: Impact & Automation ≠ Fairness (`DATA → ALGORITHM → DECISION → IMPACT`)
- [x] Step 9: Toward Responsible Design ("SO WHAT CAN WE DO?" → transition to Fairness Challenge)
- [x] Non-shaming educational tone: Zero student labeling, accusing, or individual voting exposure

## Result

Students experience a high-impact, projector-synchronized 9-step educational reveal that clearly links human decision patterns in the classroom to real-world algorithmic training data and systemic societal impacts without shaming participants.

---

# PHASE 7 — AI Explanation

## Goal

Connect the game experience to algorithmic systems.

## Tasks

Create interactive explanation:

DATA
↓
PATTERNS
↓
ALGORITHM
↓
DECISION
↓
IMPACT

Explain:

- Algorithms learn from data.
- Historical data may contain problematic patterns.
- Models can reproduce patterns.
- Automated decisions can scale those effects.

## Result

Students understand why algorithmic bias can occur.

---

# PHASE 8 / CASE 9 — Make It Fair Challenge

## Goal

Let students attempt to design and evaluate an intentional decision process.

## Tasks

- [x] Host control over challenge start (Readiness room & player ready status)
- [x] Choose Relevant Information (Junior Software Developer scenario, candidate attributes)
- [x] Educational principle: "Relevance Matters" (contextual dependence)
- [x] Decision Rule Builder (HIGH, MEDIUM, LOW, EXCLUDE priority tiers)
- [x] Understandable rule summary generated dynamically
- [x] Apply Decision Rule (Candidate A vs Candidate B with explicit trade-offs)
- [x] Fairness Test A (Evaluating impact of unrelated information)
- [x] Consistency Test B (Robustness against irrelevant variation)
- [x] Transparency Test C (Explainability and auditable inputs)
- [x] Human Oversight D (Automation vs institutional accountability)
- [x] Classroom Aggregate Results (Real session data without individual shaming)
- [x] Process Comparison (Original Approach vs Designed Approach)
- [x] Key Reflection: "Fairness is not a button" & bridge to Case 10
- [x] Database migration for `fairness_responses` with RLS & Realtime
- [x] Production build and automated integration test verified

## Result

Students experience hands-on system design and understand that algorithmic fairness is not a magic button, but an ongoing process of choosing relevant inputs, building transparent rules, auditing consistency, and maintaining human oversight.

---

# PHASE 9 — Host Presentation Mode

## Goal

Make the project presentation-ready.

## Tasks

- Full-screen dashboard
- Projector-friendly layout
- Large statistics
- QR code
- Current round display
- Live participant count
- Bias reveal controls
- Fairness results
- Final message

## Result

The presenter can run the complete classroom experience smoothly.

---

# PHASE 10 — Polish & UX

## Goal

Improve visual quality and usability.

## Tasks

- Animations
- Loading states
- Error states
- Mobile responsiveness
- Accessibility
- Button feedback
- Transitions
- Empty states
- Reconnection handling

## Result

The application feels polished and professional.

---

# PHASE 11 — Testing

## Goal

Make the game reliable.

## Test:

- Mobile browser
- Desktop browser
- Multiple players
- Multiple simultaneous submissions
- Slow internet
- Refresh during game
- Reconnection
- Invalid game code
- Duplicate submission
- Host disconnect
- Player disconnect
- Empty game
- Completed game

Fix critical bugs before presentation.

---

# PHASE 12 — Deployment

## Goal

Deploy the final project.

## Tasks

- Production build
- Environment variables
- Supabase production configuration
- GitHub final commit
- Deployment
- Test production URL
- Generate final QR code
- Full classroom simulation

## Result

A public URL that students can open directly from their phones.

---

# PHASE 13 — Presentation Rehearsal

## Goal

Test the complete presentation experience.

Run:

1. Presenter opens dashboard.
2. Display QR code.
3. Students join.
4. Start game.
5. Play all rounds.
6. Show live results.
7. Trigger reveal.
8. Explain algorithmic bias.
9. Run fairness challenge.
10. Show final results.
11. Deliver final message.

The complete flow should work without manual database intervention.

---

# Phase Completion Rule

Do not move to the next major phase until the current phase works reliably.

After each phase:

- Test
- Fix bugs
- Update memory.md
- Commit to GitHub
- Record what changed

---

# Current Phase
 
- CASE 10 COMPLETE — Final Results + Reflection (Full Educational Journey & Simulation Conclusion Complete)