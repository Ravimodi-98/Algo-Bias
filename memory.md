# THE DECISION — Project Memory

⚠️ IMPORTANT:

This file must be updated REGULARLY.

This file is the short-term memory of the development process.

Before making major changes, AI coding agents should read this file.

After completing meaningful work, update this file.

Do not allow this file to become outdated.

---

# 1. Project Status

Project:

THE DECISION — Algorithmic Bias & Fairness Simulator

Purpose:

Interactive educational game for demonstrating algorithmic bias, data influence, and algorithmic fairness.

Current Status:

PHASE 2 COMPLETE — Multiplayer Lobby, QR Joining & Live Sync (Case 3 Complete)

Overall Progress:

[ ] Not Started
[x] In Development
[ ] Testing
[ ] Presentation Ready

---

# 2. Current Phase

Current Phase:

PHASE 3 PREPARATION (Case 4 — Candidate Decision Rounds & Engine)

Current Objective:

Lobby & Realtime synchronization complete. Next objective is Candidate Decision Rounds (scenarios, evaluation cards, timer, duplicate response prevention).

---

# 3. Current File Being Worked On

⚠️ UPDATE THIS EVERY TIME THE MAIN DEVELOPMENT TASK CHANGES.

Currently Working On:

src/host/pages/HostLobbyPage.tsx

Current Task:

Case 3 Complete: Host game creation, QR code generation, player joining via QR URL pre-fill, live Supabase Realtime synchronization, host ownership enforcement, and transition to /play.

---

# 4. Recently Completed

Update this section after every meaningful feature.

- [x] Host game creation on `/host/dashboard` with unique 6-character room code generation
- [x] High-contrast Projector Mode on `/host/lobby` with `qrcode.react` generating dynamic QR code pointing to deployed `/join?game=CODE`
- [x] Game code copy button with one-click clipboard interaction and visual `COPIED!` feedback
- [x] Direct join URL display for classroom presentation
- [x] Player join (`/join`) supporting URL query parameters (`?game=CODE`), automatically pre-filling and validating room state
- [x] Anonymous callsign assignment with optional custom name (e.g. `STUDENT-RAVI-01`), zero personal data collected
- [x] Prevented duplicate player records in database on refresh or reconnect via existing player ID matching
- [x] Isolated Player Waiting Room (`/lobby`) with radar pulse animation, room code, callsign, and live player count
- [x] Supabase Realtime subscription on `players` table updating live player count and roster on host and player screens without refresh
- [x] Host session ownership verification: `updateGameState` strictly enforces `session.host_id === hostId`, preventing unauthorized mutations
- [x] Host `START GAME` button updates database `status = 'active'` and `current_round = 1`
- [x] Realtime listener on `game_sessions` automatically transitions all waiting players to `/play`
- [x] Host Route Guard strictly protects `/host/*` from unauthorized student access
- [x] Active game handling on `/host/dashboard` prevents orphaned sessions (offers `OPEN HOST LOBBY` and `CLOSE & CREATE NEW`)
- [x] Fully deployed and verified on Vercel production: https://algobias.vercel.app
- [x] All 9 multi-device tests passed successfully (host create, player QR join, live count sync, multi-player join, start game transition, security rejection, refresh restoration)

---

# 5. In Progress

List the features currently being implemented.

- [x] Case 3 completed and verified
- [ ] Prepare Case 4 (Candidate Decision Rounds & Scenarios)

---

# 6. Next Tasks

List the next tasks in priority order.

1. Case 4: Candidate decision rounds (5–7 educational scenarios)
2. Case 4: Candidate evaluation cards & comparative decision UI
3. Case 4: Decision timer & response submission without duplicates
4. Case 5: Collective results & aggregate visualizer
5. Case 6: Digital ethics & algorithmic bias reveal module

---

# 7. Completed Phases

## Phase 1

Status:

COMPLETED

Completed:

- [x] Vite + React 19 + TypeScript Project Foundation
- [x] Futuristic Dark Theme & Design Tokens
- [x] Strict Player and Host Route Separation
- [x] Host Route Authorization Guard

---

## Phase 2

Status:

COMPLETED (Case 2 & Case 3 Full Flow Complete)

Completed:

- [x] Supabase Database Schema (`game_sessions`, `players`)
- [x] Remote Migration Applied via Supabase CLI
- [x] RLS Policies and Realtime Publication
- [x] Host Authentication & Session Creation
- [x] Player Join & Anonymous Registration Flow
- [x] High-Resolution QR Code Generation & Display
- [x] Projector-Ready Host Lobby (`/host/lobby`)
- [x] Live Realtime Player Roster & Counter
- [x] Player Lobby (`/lobby`) & Automatic Advance to `/play`
- [x] Host Ownership Enforcement & Late Join Rejection
- [x] Vercel Production Deployment (https://algobias.vercel.app)

---

## Phase 3

Status:

NOT STARTED

Completed:

- [ ]

---

# 8. Important Technical Decisions

Record important decisions here.

- Database Schema:
  - `game_sessions`: `id` (UUID), `game_code` (VARCHAR 12, unique), `host_id` (TEXT), `status` ('waiting' | 'active' | 'completed'), `current_round` (INTEGER), timestamps.
  - `players`: `id` (UUID), `session_id` (UUID FK), `anonymous_name` (VARCHAR 64), `joined_at`, `last_seen`.
- RLS Policies:
  - `game_sessions`: Public SELECT; Host INSERT and UPDATE. Normal players cannot alter host_id, status, or current_round.
  - `players`: Public SELECT and INSERT; UPDATE allowed for `last_seen` heartbeat.
- Game Codes: 6-character uppercase alphanumeric omitting ambiguous characters (`0`, `O`, `1`, `I`) to ensure legibility when projected in classrooms.
- Realtime: Enabled on both tables via `supabase_realtime` publication.
- Vercel: Single Page Application fallback rewrite configured in [vercel.json](file:///d:/AlgoBias/vercel.json).

---

# 9. Database Status

Supabase:

CONNECTED (Project: `fcrdrcqbrkzznnnwimje`, Region: `ap-northeast-1`)

Tables:

- [x] game_sessions (Created & RLS enabled)
- [x] players (Created & RLS enabled)
- [ ] rounds (Queued for Phase 3)
- [ ] candidates (Queued for Phase 3)
- [ ] responses (Queued for Phase 3)
- [ ] fairness_responses (Queued for Phase 8)

Realtime:

- [x] Configured (`game_sessions`, `players`)
- [x] Tested

Row Level Security:

- [x] Configured
- [x] Tested

---

# 10. Authentication Status

Host Auth:

DEDICATED HOST GATEWAY (`/host` with persistent `hostId`)

Host Protection:

HOST ROUTE GUARD (`HostRouteGuard.tsx` protects `/host/dashboard` and subroutes)

Player Auth:

ANONYMOUS SESSIONS (Temporary UUID + callsign `PLAYER-XXXX`, zero personal data collected)

---

# 11. Vercel & Deployment Status

GitHub Repository:

https://github.com/Ravimodi-98/Algo-Bias.git

Vercel Config:

vercel.json (SPA rewrite rules configured)

Required Production Environment Variables:

- `VITE_SUPABASE_URL`: `https://fcrdrcqbrkzznnnwimje.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `sb_publishable_8QkBP3-6kvuhvKq2ysmKUA_2kGVCnD1`

Production Status:

Repository prepared for automatic Vercel git deployment

---

# 12. Known Bugs

No active bugs.

---

# 13. Known Limitations

Record temporary limitations.

- Round progression logic (actual candidate comparisons and response recording) is scheduled for Case 3.
- Vercel CLI interactive login prompt requires git-push deployment hook or CLI token.

---

# 14. Important Files

Keep track of important project files.

Documentation:

prd.md
architecture.md
rules.md
phases.md
design.md
memory.md

Database Migrations:

supabase/migrations/20260916000000_create_game_sessions_and_players.sql

Source:

src/services/game/gameService.ts
src/services/supabase/client.ts
src/player/pages/JoinPage.tsx
src/player/pages/LobbyPage.tsx
src/host/pages/HostDashboardPage.tsx
src/host/pages/HostEntryPage.tsx
src/host/components/HostRouteGuard.tsx
src/shared/utils/idGenerator.ts
src/shared/utils/storage.ts
vercel.json

---

# 15. Latest Git Commit

Update after meaningful commits.

Commit:

feat: add multiplayer game lobby and qr joining

Date:

2026-09-16

---

# 16. Last Update

Last Updated:

2026-09-16 10:30 IST

Updated By:

AI Assistant

Summary:

Completed Case 3: Built complete multiplayer lobby experience with host game creation, high-contrast projector mode with QR code (qrcode.react), pre-filled QR player join flow, Supabase Realtime synchronization for live student count and roster, host session ownership enforcement, host start-game action with automatic player transition to /play, and multi-device automated testing on live Vercel production URL (https://algobias.vercel.app).

---

# 17. Current Development Snapshot

Date:

2026-09-16

Current Phase:

PHASE 3 PREPARATION (Case 4 — Candidate Decision Rounds)

Current File:

src/host/pages/HostLobbyPage.tsx

Current Task:

Case 3 Complete — Multiplayer Lobby & Realtime Sync Fully Operational

Completed:

Host game creation, unique code generator, QR joining, player waiting lobby, live player count, host ownership security, Supabase Realtime broadcast, start-game transition to /play, Vercel production deployment

In Progress:

Ready for Case 4

Next:

Case 4 — Candidate Decision Rounds & Engine

Known Issues:

None

Last Git Commit:

feat: add multiplayer game lobby and qr joining