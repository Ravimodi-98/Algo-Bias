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
CASE 7 COMPLETE — Live Host Dashboard + Classroom Collective Results & Realtime Sync

Overall Progress:
[ ] Not Started
[x] In Development
[ ] Testing
[ ] Presentation Ready

---

# 2. Current Phase

Current Phase:
CASE 7 COMPLETE — Live Host Dashboard + Classroom Results (Preparing Case 8)

Current Objective:
Upgrade Host live game control center, implement projector-friendly aggregate results visualization, authoritative results reveal state, live response progress tracking, and mobile-first student results screen.

---

# 3. Current File Being Worked On

Currently Working On:
src/host/pages/HostGamePage.tsx, src/host/components/AggregateResultsView.tsx, src/player/pages/PlayPage.tsx, src/player/components/PlayerResultsCard.tsx

Current Task:
Case 7 Complete: Live player and response counts, projector-optimized large stat displays, concealed vs revealed results states, dual-color comparative distribution bar, neutral educational feedback, and zero student identification.

---

# 4. Recently Completed

- [x] **Projector-First Host Control Center**: Upgraded `/host/game` with large high-contrast metrics: Room Code (2.5rem monospace), Connected Players (2.5rem), Live Responses (2.5rem `X / Y`), and Round Timer (`00:14`).
- [x] **Live Response Counter & Progress**: High-visibility 18px progress bar with percentage and text counter (`15 of 18 players responded (83%)`), updated instantly via Supabase Realtime without polling.
- [x] **Concealed vs Revealed Results Architecture**: Concealed state on projector prevents classroom bias during voting; Host triggers `SHOW RESULTS` to reveal results synchronously across projector and student phones.
- [x] **Authoritative Aggregate Calculations**: Backend aggregation in `gameService.getRoundAggregates` returns anonymized vote counts and percentages for Candidate A and Candidate B.
- [x] **High-Contrast Result Visualization**: Big percentage displays (4.25rem), majority choice badge, and animated dual-color split distribution bar (Electric Blue `#0284c7` vs Royal Violet `#7c3aed`).
- [x] **Mobile-First Student Results Screen**: `PlayerResultsCard` displays class percentages with animated bars, personal selection indicator ("Your pick"), and neutral reflection quote (*"Interesting... The classroom decision pattern has been recorded."*).
- [x] **Zero Student Identification**: Anonymized classroom aggregates only. Individual student identities and decision mappings are strictly concealed.
- [x] **Button Safety & Double-Click Protection**: Host actions are secured with `actionLockRef` and `isActionInProgress` to prevent duplicate requests or skipped rounds.
- [x] **Reconnection Resilience**: Host and student reloads restore active game sessions, current round, response count, remaining timer, and results visibility from Supabase.
- [x] **Documentation & Production Testing**: Updated `memory.md`, `design.md`, `phases.md`, verified build, and deployed to Vercel.

---

# 5. In Progress

- [x] Case 7 completed and verified
- [ ] Prepare Case 8 (Bias Reveal — DATA → ALGORITHM → DECISION → IMPACT)

---

# 6. Next Tasks

1. Case 8: Digital ethics and algorithmic bias reveal sequence (DATA → ALGORITHM → DECISION → IMPACT)
2. Case 8: Interactive information categorization (Relevant vs Irrelevant factors)
3. Case 9: Fairness Challenge simulation
4. Case 10: Final presentation rehearsal and polish

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

---

# 8. Important Technical Decisions

- **Concealed Projector State**: Results remain hidden on projector while students vote to prevent groupthink/influence before reveal.
- **Authoritative Aggregation**: Votes and percentages are calculated on server queries without exposing individual student identifiers.
- **Double-Click Protection**: Controller buttons are guarded by `actionLockRef` to avoid accidental round skipping.
- **Neutral Framing**: Strictly avoid accusing students ("You are biased"). Language is neutral and reflective.

---

# 9. Latest Git Commit

Commit:
`feat: add live host dashboard and classroom results`

Date:
2026-09-17