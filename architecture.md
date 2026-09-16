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

- id
- game_code
- status
- current_round
- created_at
- ended_at

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
- round_id
- selected_candidate
- response_time
- created_at

## fairness_responses

- id
- session_id
- player_id
- selected_factors
- created_at

Do not store unnecessary personal information.

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