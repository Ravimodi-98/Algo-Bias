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
CASE 6 COMPLETE — Timer, Decision Submission, Compact Candidate Cards, Round Progression & Vercel Deployment

Overall Progress:
[ ] Not Started
[x] In Development
[ ] Testing
[ ] Presentation Ready

---

# 2. Current Phase

Current Phase:
CASE 6 COMPLETE — Timer + Decision Submission + Round Progression (Preparing Case 7)

Current Objective:
Establish compact candidate UX, synchronized countdown timer, database-persisted single decision submission, timeout handling, host round progression, and production Vercel verification.

---

# 3. Current File Being Worked On

Currently Working On:
src/player/components/CandidateCard.tsx, src/player/components/CountdownTimer.tsx, src/player/pages/PlayPage.tsx, src/host/pages/HostGamePage.tsx

Current Task:
Case 6 Complete: Streamlined candidate data, compact CandidateCard, CountdownTimer anchored to authoritative timestamp, Supabase responses table with unique constraint and RLS, live Host responses counter, and Vercel deployment.

---

# 4. Recently Completed

- [x] **Compact Candidate Cards**: Reduced candidate content to 2–4 concise information groups per round (inline skills, 1-sentence experience, 1-line projects/education/details).
- [x] **Synchronized Countdown Timer**: Added `CountdownTimer` component with configurable `ROUND_TIME_LIMIT = 30` seconds, calculated from authoritative `round_started_at` timestamp.
- [x] **Database Responses Table**: Created and applied remote migration for `public.responses` with `UNIQUE(session_id, player_id, round_number)`, indexes, RLS, and Realtime publication.
- [x] **Authoritative Decision Submission**: Implemented `gameService.submitResponse` with automatic duplicate submission protection and fallback local storage.
- [x] **Neutral Timeout & Completion States**: Handled "TIME'S UP" window closure and Round 7 "All Rounds Completed" waiting state.
- [x] **Host Live Responses Counter**: Upgraded Host Game Console (`/host/game`) to track live responses (`Responses: X / Y`) in real time via Supabase Realtime.
- [x] **Host Round Progression**: Enforced host-authoritative round transitions that reset `round_started_at = now()` and automatically advance student screens.
- [x] **Multiplayer & Reconnection Testing**: Verified page reload restores the locked decision recorded state without duplicate submissions.
- [x] **Documentation Updates**: Updated `design.md`, `memory.md`, `phases.md`, and created `walkthrough.md`.
- [x] **Vercel Production Deployment**: Promoted and verified live deployment at `https://algobias.vercel.app`.

---

# 5. In Progress

- [x] Case 6 completed and verified
- [ ] Prepare Case 7 (Live Host Dashboard + Classroom Collective Results)

---

# 6. Next Tasks

1. Case 7: Realtime aggregate response charts and candidate percentage visualization
2. Case 7: Projector-optimized presenter display with large numbers
3. Case 8: Digital ethics and algorithmic bias reveal sequence (DATA → ALGORITHM → DECISION → IMPACT)
4. Case 9: Fairness Challenge simulation

---

# 7. Completed Phases

## Phase 1 — Foundation & Authentication
- [x] Vite + React 19 + TypeScript Project Foundation
- [x] Strict Player and Host Route Separation
- [x] Host Route Authorization Guard

## Phase 2 — Host Dashboard & Game Lobby
- [x] Supabase Database Schema (`game_sessions`, `players`)
- [x] Remote Migration Applied via Supabase CLI
- [x] RLS Policies and Realtime Publication
- [x] Host Session Creation & Game Code Generation
- [x] High-Resolution QR Code Generation
- [x] Live Realtime Player Roster & Counter

## Phase 3 — Game Engine & Candidate Decision Rounds
- [x] Player `/play` gameplay route built
- [x] Permanent Light Theme (Futuristic AI Control Room — Light Edition)
- [x] Candidate data architecture (`src/shared/data/rounds.ts`)
- [x] Exactly 7 educational decision rounds
- [x] Compact, scannable `CandidateCard` component
- [x] Synchronized `CountdownTimer` with authoritative timestamp
- [x] Supabase `responses` table with duplicate protection
- [x] Host live responses counter and round advancement controller
- [x] Mobile-friendly layout with minimal scrolling

---

# 8. Important Technical Decisions

- **Compact Candidate Information**: Candidates display strictly 2–4 concise information groups targeted to the specific educational focus of that round.
- **Authoritative Timing**: Timers are anchored to `round_started_at` in `game_sessions`. Browser refresh calculates remaining time from this timestamp, preventing students from resetting the clock.
- **Duplicate Submission Protection**: Database constraint `UNIQUE(session_id, player_id, round_number)` guarantees one decision per student per round.
- **Light Theme**: The entire application uses the permanent Light Futuristic AI Control Room aesthetic.

---

# 9. Latest Git Commit

Commit:
`feat: add decision timer submission and round progression`

Date:
2026-09-17