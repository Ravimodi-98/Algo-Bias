# THE DECISION — Architecture

## 1. Architecture Overview

THE DECISION is a mobile-first interactive web application.

The architecture consists of:

PLAYER DEVICE
        |
        v
FRONTEND APPLICATION
        |
        v
SUPABASE
        |
        +---- Database
        +---- Realtime
        +---- Authentication / Anonymous Sessions
        +---- Backend Services

HOST DASHBOARD
        |
        v
SUPABASE
        |
        v
PLAYER DEVICES

GitHub is used for source control and project versioning.

---

# 2. Application Flow

## Player Flow

Landing
↓
Join Game
↓
Create Anonymous Session
↓
Lobby
↓
Wait for Host
↓
Round 1
↓
Decision
↓
Round 2
↓
Decision
↓
Round 3
↓
Decision
↓
Round 4
↓
Decision
↓
Round 5
↓
Decision
↓
Bias Reveal
↓
AI/Data Explanation
↓
Fairness Challenge
↓
Final Reflection
↓
Results

---

# 3. Host Flow

Host Login
↓
Host Dashboard
↓
Create Game
↓
Generate Game Code / QR
↓
Wait for Players
↓
Start Game
↓
Control Round
↓
Monitor Responses
↓
Display Results
↓
Trigger Bias Reveal
↓
Start Fairness Challenge
↓
Display Final Results
↓
End Game

---

# 4. Frontend Architecture

Recommended architecture:

Presentation Layer
        |
        v
Page / Component Layer
        |
        v
Game Logic Layer
        |
        v
Data / Supabase Layer

Keep UI components separate from game logic and database operations.

---

# 5. Suggested Folder Structure

src/
│
├── components/
│   ├── common/
│   ├── game/
│   ├── player/
│   ├── host/
│   └── ui/
│
├── pages/
│   ├── Landing/
│   ├── Join/
│   ├── Lobby/
│   ├── Game/
│   ├── Reveal/
│   ├── Fairness/
│   ├── Results/
│   └── Host/
│
├── layouts/
│
├── hooks/
│
├── services/
│   ├── supabase/
│   ├── game/
│   └── analytics/
│
├── lib/
│
├── types/
│
├── data/
│
├── utils/
│
├── constants/
│
├── styles/
│
└── main application files

---

# 6. Component Organization

## Common Components

Examples:

- Button
- Card
- Modal
- ProgressBar
- Timer
- LoadingScreen
- ErrorMessage

## Player Components

Examples:

- PlayerHeader
- CandidateCard
- DecisionButton
- RoundProgress
- WaitingRoom

## Host Components

Examples:

- HostSidebar
- PlayerCount
- RoundController
- LiveResults
- QRDisplay
- ResultsChart

---

# 7. Supabase Data Model

Suggested tables:

## game_sessions

- id (UUID, PK)
- host_id (VARCHAR)
- game_code (VARCHAR 6)
- status ('waiting' | 'active' | 'completed')
- current_round (INTEGER 1..7)
- round_started_at (TIMESTAMPTZ)
- results_visible (BOOLEAN)
- game_stage ('round' | 'reveal' | 'fairness' | 'completed')
- reveal_step (INTEGER 0..9)
- fairness_step (INTEGER 0..9)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
- ended_at (TIMESTAMPTZ)

## Reveal System Architecture (Case 8)

The Bias Reveal is an authoritative 9-step progression synchronized in real time between the Host projector dashboard and Player mobile devices:

1. **The Transition**: Pause & reset cognitive context ("WAIT. Something interesting happened.")
2. **Classroom Decisions**: Anonymized summary of classroom percentages across key rounds.
3. **What Changed?**: Side-by-side comparison isolating core qualifications vs framing variations.
4. **Relevant vs. Less-Relevant Information**: Objective breakdown of skills/experience vs location/name/format.
5. **The Question**: Factual inquiry: "DID THE INFORMATION INFLUENCE THE DECISION?"
6. **Scale**: Visualizing how 1 decision becomes 100, then 10,000 algorithmic training points.
7. **The Algorithm**: Concrete flow diagram: `DATA → ALGORITHM → DECISION`.
8. **Impact & Automation ≠ Fairness**: Societal pipeline: `DATA → ALGORITHM → DECISION → IMPACT`.
9. **Toward Solutions**: Bridge to responsible design and the Stage 2 Fairness Challenge.

## Make It Fair System Architecture (Case 9)

The Make It Fair Challenge is an authoritative 10-step interactive workflow where students design decision rules and evaluate systemic properties:

0. **Challenge Launch & Readiness**: Host controls launch; students submit readiness (`{ ready: true }`).
1. **Choose Relevant Information (Round 1)**: Students select criteria (`skills`, `experience`, `projects`, `education`, `location`, `name`, `presentation_style`). Principle: Relevance Matters.
2. **Build the Decision Rule (Round 2)**: Students set priority tiers (`HIGH`, `MEDIUM`, `LOW`, `EXCLUDE`) yielding readable, transparent rules.
3. **Apply the Rule (Round 3)**: Students evaluate Candidate A vs Candidate B based on their designed priorities.
4. **Fairness Test A (Unrelated Info)**: Controlled scenario evaluating if irrelevant details should swing outcomes (`YES` / `NO` / `DEPENDS ON CONTEXT`).
5. **Consistency Test B**: Verifying outcome robustness across non-job-relevant variations.
6. **Transparency Test C**: Demonstrating why documented, auditable inputs are required for explainability.
7. **Human Oversight D**: Accountability in automated pipelines (`NO (Need Review)` vs `YES (Accept)`).
8. **Classroom Aggregate Results & Comparison**: Descriptive statistics showing classroom distribution of factors and comparing *Original Approach* vs *Designed Approach*.
9. **The Key Reflection & Case 9 Message**: Synthesis of design choices and core thesis: *"Fairness is not a button."* Bridge to Case 10: The Final Decision.

## players

- id
- session_id
- anonymous_name
- joined_at
- last_seen

## rounds

- id
- session_id
- round_number
- round_type
- status

## candidates

- id
- round_id
- candidate_label
- candidate_data

## responses

- id
- session_id
- player_id
- round_number
- selected_candidate
- response_time
- created_at

## fairness_responses

- id (UUID, PK)
- session_id (UUID, FK -> game_sessions.id)
- player_id (UUID, FK -> players.id)
- stage (VARCHAR 64: 'ready' | 'factors' | 'rule' | 'apply' | 'fairness_test' | 'consistency_test' | 'transparency_test' | 'human_oversight')
- response (JSONB: flexible payload with duplicate prevention via unique constraint `(session_id, player_id, stage)`)
- submitted_at (TIMESTAMPTZ)

Do not store unnecessary personal information.

### Security & RLS Policies:
- Only authenticated Host with matching `host_id` can update `game_stage` and `fairness_step`.
- Players can only insert or update their own response for `(session_id, player_id, stage)`.
- RLS permits public SELECT on `fairness_responses` for calculating classroom aggregates.
- Realtime publication on `game_sessions` broadcasts step advancements to player smartphones instantly.

---

# 8. Realtime Architecture

Supabase Realtime may be used for:

- Player joining
- Lobby updates
- Host starting rounds
- Round changes
- Response counts
- Live aggregate results
- Game completion

Players should not need to constantly refresh the page.

---

# 9. State Management

Keep state divided into:

## Local UI State

Examples:

- Selected candidate
- Timer
- Modal visibility
- Animation state

## Game State

Examples:

- Current round
- Game status
- Player session
- Submitted answer

## Server State

Examples:

- Players
- Responses
- Round configuration
- Host state

Avoid unnecessary global state.

---

# 10. Routing

Suggested routes:

/

 /join

 /lobby

 /game

 /reveal

 /fairness

 /results

 /host

 /host/game/:id

Routes should be protected where required.

---

# 11. Security Architecture

Never trust the frontend.

Validate important operations on the backend.

Examples:

- Game state transitions
- Host privileges
- Session ownership
- Response submission
- Round progression

Never expose Supabase service-role credentials in frontend code.

Only public client configuration may exist in the frontend.

---

# 12. Error Flow

Frontend error:

UI error message
↓
Retry
↓
Fallback state

Backend error:

Detect error
↓
Log safe diagnostic information
↓
Return user-friendly error
↓
Allow retry

Network interruption:

Detect connection
↓
Show reconnecting state
↓
Attempt reconnection
↓
Restore game state

---

# 13. Deployment Architecture

GitHub
↓
Build / Deployment
↓
Web Application
↓
Users access through browser

Supabase remains the backend.

The application should not require installation.

---

# 14. Architecture Principle

Keep the project:

- Modular
- Maintainable
- Simple
- Mobile-first
- Secure
- Reusable
- Easy to extend

Do not create unnecessary abstractions.

---

# 15. Multiplayer & Realtime Synchronization Architecture (Case 3)

## 15.1 Game Session Flow
```text
HOST                             SUPABASE                             PLAYER
Create Game ----(insert)-----> game_sessions (waiting)
                                      ^
QR Generated <------------------------+
Scan QR / Join -----(insert)--> players (anonymous callsign)
                                      |
Live Roster <---(Realtime INSERT)-----+-----(Realtime INSERT)---> Player Counter
                                      |
Host Starts Game -(update active)----+
                                      |
Host Game View <----------------------+-----(Realtime UPDATE)---> Transition to /play
```

## 15.2 Host/Player Communication & Realtime
- **Database-Driven Authority**: Supabase `game_sessions` and `players` are the single source of truth.
- **State Broadcast**: Realtime publication on `game_sessions` notifies player clients on `UPDATE`. When `status` transitions to `active`, connected players immediately redirect from `/lobby` to `/play`.
- **Roster Broadcast**: Realtime publication on `players` notifies host clients on `INSERT` to update the connected student roster and count in real time without refreshing.
- **Heartbeat & Presence**: Periodic heartbeat every 20-25s updates `last_seen` timestamp in `players`.

## 15.3 Game Ownership & Authorization Model
- **Strict Host Ownership Verification**: All host game state mutations (`updateGameState`) verify that `session.host_id === caller.host_id`. Imposter hosts or players cannot mutate session state or trigger round advancements.
- **Frontend Route Isolation**: `HostRouteGuard` blocks unauthorized players attempting to access `/host/*` endpoints with an explicit access restriction screen.
- **Late Join Rejection**: Once a game session is marked `active` or `completed`, new player attempts to join via `/join` are rejected with clean status messaging.
- **Duplicate Prevention**: Reconnects and refreshes from existing player sessions restore existing records using `sessionId` and `playerId` rather than creating duplicate rows.

---

# 16. Player Gameplay Engine & Round Progression (Case 4)

## 16.1 Player Gameplay State Lifecycle
```text
[Lobby] 
   │ (Supabase Realtime status === 'active')
   ▼
[Game Starting Banner] 
   │
   ▼
[Round Screen]
   ├── GameProgressBar (Round X / 7, non-color accessible dots & track)
   ├── Candidate Comparison (CandidateCard A vs B)
   └── DecisionPanel (Selection A/B + Confirmation)
   │
   ▼ (Player confirms selection)
[Decision Submitted Waiting State] 
   │ (Saved to local session; prevents duplicate answers)
   │
   ▼ (Host advances round: game_sessions.current_round = X + 1 via Realtime)
[Next Round Screen] (Selection reset, candidates refreshed)
```

## 16.2 Candidate Evaluation Framework
- **Structured Representation**: Candidate data conforms to a typed contract (`CandidateProfile`): `id`, `name`, `role`, `experience`, `education`, `skills[]`, `projects`, and `highlightMetric`.
- **Modular Shell**: Designed so Case 5 can plug in the 5–7 educational bias scenarios without modifying UI or state management contracts.

## 16.3 Authoritative Round Controller
- **Single Source of Truth**: Round progression is controlled globally by the host on `/host/game` via `updateGameState(sessionId, hostId, 'active', nextRound)`.
- **Zero-Refresh Realtime Sync**: Connected student devices receive postgres changes on `game_sessions` and transition rounds automatically.
- **Session Restoration**: Refreshing `/play` checks `storage.getPlayerSession()` and verifies the player in Supabase, restoring them directly to their active round state without duplicate records.