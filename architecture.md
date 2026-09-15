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