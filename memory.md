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
CASE 9 COMPLETE — Make It Fair Interactive Challenge (System Design, Rules, Audits & Reflection)

Overall Progress:
[ ] Not Started
[x] In Development
[ ] Testing
[ ] Presentation Ready

---

# 2. Current Phase

Current Phase:
CASE 9 COMPLETE — Make It Fair Interactive Challenge (Ready for Case 10: Final Results + Reflection)

Current Objective:
Guide students through hands-on decision-system design: selecting relevant factors, configuring explicit priority rules, testing against irrelevant variation and lack of transparency, and recognizing that "Fairness is not a button."

---

# 3. Current File Being Worked On

Currently Working On:
src/host/components/HostFairnessView.tsx, src/player/components/PlayerFairnessView.tsx, src/services/game/gameService.ts, src/shared/data/fairnessSteps.ts

Current Task:
Case 9 Complete: 10-step synchronized fairness challenge, host control console, mobile-first student priority builder, controlled system audits, classroom aggregate metrics, and production verification.

---

# 4. Recently Completed

- [x] **Database Migration for Fairness**: Added `fairness_step INTEGER NOT NULL DEFAULT 0` to `game_sessions` and created `fairness_responses` table with unique constraint `(session_id, player_id, stage)`, RLS policies, and Supabase Realtime publication.
- [x] **Shared Educational Scenario Data**: Created `fairnessSteps.ts` with 10 sequential step definitions, candidate factor metadata (qualifications, contextual, unrelated), and fictional Junior Software Developer evaluation scenarios.
- [x] **Host Projector-First Fairness Console**: Built `HostFairnessView.tsx` with high-contrast projector typography, stage progress tracker, live response counters, classroom aggregate displays, and authoritative navigation controls.
- [x] **Realtime Synchronized Mobile Experience**: Built `PlayerFairnessView.tsx` with touch-friendly factor selectors, 4-tier priority rule builder (`HIGH`, `MEDIUM`, `LOW`, `EXCLUDE`), dynamic rule preview, candidate decision selection, and audit test questions.
- [x] **Controlled System Audits**: Implemented controlled scenarios for Fairness Test (Unrelated Info), Consistency Test (Equal Quals), Transparency Test (Audit Legibility), and Human Oversight (Accountability).
- [x] **Anonymous Classroom Aggregation**: Implemented `getFairnessClassroomAggregates` in `gameService.ts` deriving real statistics from student responses without revealing individual student identities.
- [x] **Strict Non-Shaming & No Single Score Policy**: Maintained neutral design-focused tone; strictly omitted arbitrary 0-100% "Fairness Scores" and student rankings.
- [x] **Integration & Build Verification**: TypeScript type-checked and verified with automated integration test `test_case9_fairness.cjs`. Production build passed in 405ms.
- [x] **Reconnection Resilience**: Host and student reloads restore active game sessions, current fairness step, prior submitted answers, and live aggregate stats.
- [x] **Documentation & Production Testing**: Updated `memory.md`, `design.md`, `phases.md`, and `architecture.md`.

---

# 5. In Progress

- [x] Case 8 completed and verified
- [x] Case 9 completed and verified
- [ ] Prepare Case 10 (Final Results + Reflection)

---

# 6. Next Tasks

1. Case 10: Final classroom results, cumulative game summary, and student reflection.
2. Case 10: Final presentation rehearsal and presentation mode polish.

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
- [x] Mobile-friendly layout with minimal scrolling

## Phase 5 — Live Results & Host Dashboard (Case 7)
- [x] Live response counter and accessible progress bar
- [x] Authoritative results reveal (`results_visible`)
- [x] Projector-first Host control center at `/host/game`
- [x] Large-format comparative result visualization
- [x] Mobile-first Player result screen
- [x] Multi-player synchronization and reconnection handling

## Phase 6 & 7 — Bias Reveal & Educational Sequence (Case 8)
- [x] 9-step synchronized educational reveal sequence
- [x] Authoritative presenter progression
- [x] DATA → ALGORITHM → DECISION → IMPACT pipeline
- [x] Non-shaming framing and zero individual identification

## Phase 8 — Make It Fair Challenge (Case 9)
- [x] 10-step interactive decision system design challenge
- [x] Host readiness room & authoritative challenge launch
- [x] Relevant factor selection & explicit priority rule builder
- [x] Candidate application evaluation with intentional criteria
- [x] Controlled system audits (Fairness, Consistency, Transparency, Oversight)
- [x] Real-time classroom aggregate choices & process comparison
- [x] Key reflection: "Fairness is not a button"

---

# 8. Important Technical Decisions

- **No Single Fairness Score**: To avoid moral shaming or superficial gamification, students are never assigned a "fairness percentage" or ranked.
- **Authoritative Stage Progression**: The session Host controls global progression through challenge steps; player devices synchronize instantly via Supabase Realtime.
- **Flexible JSONB Response Storage**: Responses for different challenge stages are stored in `fairness_responses` with unique constraint `(session_id, player_id, stage)` to prevent duplicates.
- **Reconnection Resilience**: On reload, `getPlayerFairnessResponse` restores previous selections so students can resume seamlessly.
- **Anonymous Classroom Aggregation**: Aggregate frequencies (e.g. factors selected, test answers) are computed on the server/service layer without exposing student identities.

---

# 9. Latest Git Commit

Commit:
`feat: add make it fair challenge`

Date:
2026-09-17