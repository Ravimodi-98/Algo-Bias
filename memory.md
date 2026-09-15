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

PHASE 2 — Host Dashboard & Game Lobby (Case 2 Complete)

Overall Progress:

[ ] Not Started
[x] In Development
[ ] Testing
[ ] Presentation Ready

---

# 2. Current Phase

Current Phase:

PHASE 2 — Host Dashboard & Game Lobby

Current Objective:

Backend game session foundation with Supabase, dedicated host authentication, anonymous player sessions, and Vercel production deployment preparation.

---

# 3. Current File Being Worked On

⚠️ UPDATE THIS EVERY TIME THE MAIN DEVELOPMENT TASK CHANGES.

Currently Working On:

src/services/game/gameService.ts

Current Task:

Case 2 Complete: Supabase database foundation, host session creation, player join flow, and Vercel configuration established.

---

# 4. Recently Completed

Update this section after every meaningful feature.

- Supabase Database migration created & applied: `game_sessions` and `players` tables
- Row Level Security (RLS) policies configured and enforced on remote database
- Supabase Realtime publication enabled for `game_sessions` and `players`
- Unambiguous 6-character game code generator (`generateGameCode()`, e.g. `N35NEZ`)
- Game service layer built (`src/services/game/gameService.ts`)
- Host session management & dedicated authentication flow with persistent host identifier
- Host "CREATE GAME" action with active game code generation on `/host/dashboard`
- Player join flow with database verification and anonymous registration on `/join`
- Player lobby session restoration and heartbeat reconnect on refresh at `/lobby`
- Vercel production deployment configuration (`vercel.json` SPA fallback rewrites)
- End-to-end integration verified using automated browser subagent (Tests A, B, C, and Step 11 reconnect passed)

---

# 5. In Progress

List the features currently being implemented.

- [ ] Complete Case 2 handover
- [ ] Prepare for Case 3 (Game Engine & Candidate Decision Rounds)

---

# 6. Next Tasks

List the next tasks in priority order.

1. Case 3: Candidate decision round system & data structures
2. Case 3: Candidate cards & comparative decision UI
3. Case 3: Decision timer & response submission without duplicates
4. Case 4: Candidate decision rounds (5–7 educational scenarios)
5. Case 5: Collective results & aggregate visualizer

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

IN PROGRESS (Case 2 Backend Foundation & Sessions Complete)

Completed:

- [x] Supabase Database Schema (`game_sessions`, `players`)
- [x] Remote Migration Applied via Supabase CLI
- [x] RLS Policies and Realtime Publication
- [x] Host Authentication & Session Creation
- [x] Player Join & Anonymous Registration Flow
- [x] Player Reconnect & Session Restoration on Refresh
- [x] Vercel SPA Routing (`vercel.json`)

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

feat: add supabase sessions and host authentication

Date:

2026-09-16

---

# 16. Last Update

Last Updated:

2026-09-16 00:50 IST

Updated By:

AI Assistant

Summary:

Completed Case 2: Created and pushed Supabase migrations for game_sessions and players tables with RLS and Realtime, built gameService for session handling, integrated Host "CREATE GAME" action with 6-char code generation, connected player /join and /lobby with session restoration on refresh, verified end-to-end security and flows with browser subagent, and prepared vercel.json for deployment.

---

# 17. Current Development Snapshot

Date:

2026-09-16

Current Phase:

PHASE 2

Current File:

src/services/game/gameService.ts

Current Task:

Case 2 Complete — Backend Foundation & Sessions Established

Completed:

Database tables & RLS, Realtime publication, Host game creation, Player join & lobby refresh restoration, Browser subagent verification

In Progress:

Ready for Case 3

Next:

Case 3 — Core Game Engine & Candidate Rounds

Known Issues:

None

Last Git Commit:

feat: add supabase sessions and host authentication