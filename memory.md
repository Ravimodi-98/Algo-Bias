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

PHASE 3 IN PROGRESS — Player Game Interface & Basic Game Engine (Case 4 Complete)

Overall Progress:

[ ] Not Started
[x] In Development
[ ] Testing
[ ] Presentation Ready

---

# 2. Current Phase

Current Phase:

PHASE 3 — Game Engine (Case 4 Complete, Preparing Case 5)

Current Objective:

Player gameplay interface and game engine shell established. Next objective is Case 5: Full 5–7 educational candidate scenarios, round timer, and response database persistence.

---

# 3. Current File Being Worked On

⚠️ UPDATE THIS EVERY TIME THE MAIN DEVELOPMENT TASK CHANGES.

Currently Working On:

src/player/pages/PlayPage.tsx

Current Task:

Case 4 Complete: Player game interface, GameProgressBar, CandidateCard shell, DecisionPanel, reusable decision submitted waiting state, Host round controller with next-round realtime progression, and Vercel production deployment.

---

# 4. Recently Completed

Update this section after every meaningful feature.

- [x] Player `/play` gameplay route built, replacing placeholder with full game shell
- [x] `GameProgressBar` component: non-color dependent accessibility, visual timeline nodes (Round X / 7), room code badge
- [x] `CandidateCard` component: structured sections for Experience, Education, Skills, and Projects, mobile-friendly cards
- [x] `DecisionPanel` component: large touch-friendly candidate selection buttons with confirmation state
- [x] Reusable `Decision Submitted` waiting state with radar animation and locked-in response display
- [x] Realtime game state synchronization via Supabase: automatic transition from Lobby → Play on game start
- [x] Zero-refresh round progression: when Host clicks `NEXT ROUND`, player screen updates to next round with clean selection state
- [x] Session restoration on refresh: refreshing `/play` restores active round and submitted decision without creating duplicate player records
- [x] Invalid session recovery: friendly screens for `SESSION NOT FOUND`, `GAME NOT STARTED`, and `GAME ENDED`
- [x] Host `/host/game` live controller: displays room code, live connected player count, `[ NEXT ROUND ]`, and `[ END SIMULATION ]`
- [x] Vercel production deployment verified: https://algobias.vercel.app
- [x] Strict Host/Player separation maintained: HostRouteGuard blocks unauthorized access to `/host/*`

---

# 5. In Progress

List the features currently being implemented.

- [x] Case 4 completed and verified
- [ ] Prepare Case 5 (5–7 Educational Scenarios, Decision Timer & Response Persistence)

---

# 6. Next Tasks

List the next tasks in priority order.

1. Case 5: Educational candidate scenarios dataset (5–7 fictional hiring rounds)
2. Case 5: Synchronized round countdown timer
3. Case 5: Response recording in Supabase database (`responses` table)
4. Case 6: Collective results & aggregate visualizer
5. Case 7: Digital ethics & algorithmic bias reveal module

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

feat: add player game interface and basic game engine

Date:

2026-09-16

---

# 16. Last Update

Last Updated:

2026-09-16 11:05 IST

Updated By:

AI Assistant

Summary:

Completed Case 4: Built core player gameplay experience on /play with GameProgressBar, CandidateCard shell with structured sections, DecisionPanel with confirmation and submitted waiting state, Supabase Realtime synchronization, Host live round controller on /host/game with next-round progression, and Vercel production deployment.

---

# 17. Current Development Snapshot

Date:

2026-09-16

Current Phase:

PHASE 3 (Preparing Case 5 — 5-7 Scenarios & Decision Timer)

Current File:

src/player/pages/PlayPage.tsx

Current Task:

Case 4 Complete — Player Game Interface & Basic Game Engine Operational

Completed:

Player gameplay interface (/play), GameProgressBar (Round X / 7), CandidateCard, DecisionPanel with confirmation, Decision Submitted waiting state, Supabase Realtime auto-transition from Lobby to Play, Host round advancement (/host/game), session persistence on refresh, Vercel production deployment

In Progress:

Ready for Case 5

Next:

Case 5 — 5-7 Candidate Decision Scenarios, Round Timer & Response Persistence

Known Issues:

None

Last Git Commit:

feat: add player game interface and basic game engine