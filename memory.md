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

PHASE 1 — Project Foundation & Login (Case 1 Complete)

Overall Progress:

[ ] Not Started
[x] In Development
[ ] Testing
[ ] Presentation Ready

---

# 2. Current Phase

Current Phase:

PHASE 1 — Project Foundation & Login

Current Objective:

Set up project foundation and establish strict architectural separation between Player Experience and Host Experience.

---

# 3. Current File Being Worked On

⚠️ UPDATE THIS EVERY TIME THE MAIN DEVELOPMENT TASK CHANGES.

Currently Working On:

src/App.tsx

Current Task:

Case 1 Foundation Complete: Player & Host separation established, verified, and committed.

---

# 4. Recently Completed

Update this section after every meaningful feature.

- Supabase connected & CLI linked (Project `fcrdrcqbrkzznnnwimje`)
- GitHub repository connected (Ravimodi-98/Algo-Bias)
- Vite + React 19 + TypeScript framework foundation initialized
- Dark futuristic AI control room design system implemented (`src/styles/index.css`)
- Shared component layer built (`Button`, `Card`, `Badge`, `LoadingState`, `ErrorMessage`)
- Anonymous player ID generator & safe storage created (`src/shared/utils/`)
- Mobile-first Player layout & header created (`src/player/layout/`, `src/player/components/`)
- Functional Player Landing page (`/`), Join page (`/join`), and Lobby page (`/lobby`) created
- Player placeholder pages created (`/play`, `/reveal`, `/fairness`, `/results`)
- Desktop/projector-optimized Host layout & console header created (`src/host/`)
- Functional Host Entry page (`/host`) and Host Dashboard (`/host/dashboard`) created
- Host placeholder pages created (`/host/create`, `/host/lobby`, `/host/game`, `/host/results`, `/host/settings`)
- HostRouteGuard authorization boundary implemented to prevent players from accessing host dashboard controls
- End-to-end routing and isolation tested with Vite build & browser subagent

---

# 5. In Progress

List the features currently being implemented.

- [ ] Complete Case 1 handover
- [ ] Prepare for Case 2 (Host session creation, game lobby & Supabase realtime sync)

---

# 6. Next Tasks

List the next tasks in priority order.

1. Case 2: Create game session & room code generation in Supabase
2. Case 2: Presenter lobby with high-res QR code and live player count
3. Case 2: Supabase Realtime channel subscription for instant player-host synchronization
4. Case 3: Candidate decision round engine & data structures

---

# 7. Completed Phases

## Phase 1

Status:

IN PROGRESS (Foundation & Player/Host Separation Complete)

Completed:

- [x] Vite + React-TS Project Initialization
- [x] Environment & Supabase Client Setup
- [x] Design System & Dark Futuristic AI Theme
- [x] Player Flow (`/`, `/join`, `/lobby`)
- [x] Host Flow (`/host`, `/host/dashboard`)
- [x] Host Route Authorization Guard
- [x] Production Build Verification

---

## Phase 2

Status:

NOT STARTED

Completed:

- [ ]

---

## Phase 3

Status:

NOT STARTED

Completed:

- [ ]

---

# 8. Important Technical Decisions

Record important decisions here.

- Stack: React 19 + TypeScript + Vite + Vanilla CSS tokens (no heavy external CSS frameworks).
- Supabase is the backend database and realtime synchronization engine.
- Strict directory separation: `src/player/`, `src/host/`, `src/shared/`, `src/services/`.
- The player layout is strictly mobile-first (max 480px viewport container) with zero host controls.
- The host layout is optimized for desktop and high-contrast projector displays.
- Host authorization boundary: `HostRouteGuard` validates host authentication session before granting access to `/host/dashboard` and other host routes.
- Anonymity: Player IDs are generated anonymously (e.g. `PLAYER-4821`). No personal data, email, or IDs are collected.

---

# 9. Database Status

Supabase:

CONNECTED (Project: `fcrdrcqbrkzznnnwimje`, Region: `ap-northeast-1`)

Client Service:

CONFIGURED (`src/services/supabase/client.ts`)

Tables:

- [ ] game_sessions (Queued for Phase 2)
- [ ] players (Queued for Phase 2)
- [ ] rounds (Queued for Phase 3)
- [ ] candidates (Queued for Phase 3)
- [ ] responses (Queued for Phase 3)
- [ ] fairness_responses (Queued for Phase 8)

Realtime:

- [ ] Configured (Queued for Phase 2)
- [ ] Tested

Row Level Security:

- [ ] Configured (Queued for Phase 2)
- [ ] Tested

---

# 10. Known Bugs

No active bugs.

---

# 11. Known Limitations

Record temporary limitations.

- Case 1 scope: Decision round voting engine and live Supabase table mutations are intentionally scheduled for subsequent phases (Case 2 & 3).
- Host passcode check currently validates against administrative key in memory/sessionStorage before backend Supabase role validation is attached in Case 2.

---

# 12. Important Files

Keep track of important project files.

Documentation:

prd.md
architecture.md
rules.md
phases.md
design.md
memory.md

Source:

src/App.tsx
src/main.tsx
src/styles/index.css
src/player/layout/PlayerLayout.tsx
src/player/pages/LandingPage.tsx
src/player/pages/JoinPage.tsx
src/player/pages/LobbyPage.tsx
src/host/layout/HostLayout.tsx
src/host/components/HostRouteGuard.tsx
src/host/pages/HostEntryPage.tsx
src/host/pages/HostDashboardPage.tsx
src/services/supabase/client.ts

Backend:

Supabase (`fcrdrcqbrkzznnnwimje`)

Repository:

GitHub (Ravimodi-98/Algo-Bias)

---

# 13. Latest Git Commit

Update after meaningful commits.

Commit:

f5a0936 (Supabase config) -> feat: establish separate player and host architecture

Message:

feat: establish separate player and host architecture

Date:

2026-09-16

---

# 14. Last Update

Last Updated:

2026-09-16 00:10 IST

Updated By:

AI Assistant

Summary:

Completed Case 1: Initialized React 19 + TypeScript + Vite project, built dark futuristic AI design system, established separate player and host route groups, layouts, and components, implemented HostRouteGuard authorization, and verified clean production build and browser flows.

---

# 15. AI Agent Instructions

Before starting work:

1. Read prd.md.
2. Read Architecture.md.
3. Read rules.md.
4. Read phases.md.
5. Read design.md.
6. Read memory.md.
7. Inspect the existing code.
8. Identify the current phase.
9. Identify the current file being worked on.
10. Continue from the existing implementation.
11. Do not unnecessarily rebuild completed features.

After completing work:

1. Test the feature.
2. Fix relevant errors.
3. Update memory.md.
4. Update the current file being worked on.
5. Update completed tasks.
6. Update known bugs.
7. Update phase status.
8. Commit meaningful changes to GitHub.

---

# 16. ⚠️ MEMORY UPDATE RULE

THIS SECTION IS CRITICAL.

Every time a meaningful feature is completed:

UPDATE:

- Current phase
- Current file
- Current task
- Recently completed
- In progress
- Next tasks
- Known bugs
- Technical decisions if changed
- Last update

Never leave memory.md describing an old state of the project.

---

# 17. Current Development Snapshot

Date:

2026-09-16

Current Phase:

PHASE 1

Current File:

src/App.tsx

Current Task:

Case 1 Complete — Separate Player and Host Architecture Established

Completed:

Foundation setup, Player flow, Host console, Route authorization guard, Production build & testing

In Progress:

Ready for Case 2

Next:

Case 2 — Host session creation & Supabase Realtime synchronization

Known Issues:

None

Last Git Commit:

feat: establish separate player and host architecture