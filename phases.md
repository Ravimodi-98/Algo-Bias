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
- [x] Round 1: Clearly relevant skill differences (Aarav vs Rohan)
- [x] Round 2: Same qualifications + different college background (Maya vs Ishita)
- [x] Round 3: Same qualifications + different location (Kabir [Ahmedabad] vs Dev [Pune])
- [x] Round 4: Same qualifications + different names (Aarav vs Maya)
- [x] Round 5: Different resume presentation (Nisha [Structured] vs Anaya [Narrative])
- [x] Round 6: Relevant vs irrelevant information mixed together (Rohan vs Kabir)
- [x] Round 7: Final decision scenario (Dev vs Ishita)
- [x] Transition entire application to permanent Light Theme
- [x] Mobile-friendly VS layout & neutral non-shaming decision feedback

## Result

Players experience how presented information can influence decisions across 7 structured educational scenarios in a light futuristic AI control room interface.


---

# PHASE 5 — Live Results

## Goal

Show collective player decisions.

## Tasks

- Response counting
- Candidate percentages
- Host live results
- Player aggregate results
- Animated result visualization
- Anonymous statistics

## Result

The presenter can show the classroom's collective decision pattern.

---

# PHASE 6 — Bias Reveal

## Goal

Create the main educational reveal.

## Tasks

Create reveal sequence:

1. Pause
2. "Something interesting happened."
3. Show decisions
4. Identify relevant information
5. Identify irrelevant information
6. Ask whether the information influenced decisions
7. Explain the connection to algorithmic bias

Important:

Do not accuse students.

The reveal should focus on information and decision-making.

## Result

Students understand the core concept before the theoretical explanation.

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

# PHASE 8 — Fairness Challenge

## Goal

Let students attempt to improve the decision process.

## Tasks

- Present candidate information
- Ask players to choose relevant factors
- Run the decision again
- Compare results
- Show class aggregate results

Possible factors:

- Skills
- Relevant experience
- Projects
- Technical assessment
- Interview performance

## Result

Students experience the idea of designing a more responsible decision system.

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
 
- CASE 6 COMPLETE — Timer, Decision Submission, Compact Cards & Round Progression (Preparing Case 7: Live Results)

Update this section whenever development progresses.