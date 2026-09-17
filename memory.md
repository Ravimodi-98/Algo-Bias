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
CASE 8 COMPLETE — Bias Reveal + Educational Bias Explanation (DATA → ALGORITHM → DECISION → IMPACT)

Overall Progress:
[ ] Not Started
[x] In Development
[ ] Testing
[ ] Presentation Ready

---

# 2. Current Phase

Current Phase:
CASE 8 COMPLETE — Bias Reveal + Educational Bias Explanation (Ready for Case 9: Fairness Challenge)

Current Objective:
Transition classroom from "Here are the decisions you made" to "Why did those decisions happen?" through a synchronized 9-step educational sequence connecting human choices to training data, algorithms, and real-world societal impact.

---

# 3. Current File Being Worked On

Currently Working On:
src/host/components/HostRevealView.tsx, src/player/components/PlayerRevealView.tsx, src/shared/data/revealSteps.ts, src/services/game/gameService.ts

Current Task:
Case 8 Complete: 9-step authoritative educational reveal, projector-first presenter mode, synchronized mobile experience, Realtime step broadcasting, neutral non-shaming tone, and zero student identification.

---

# 4. Recently Completed

- [x] **Database Migration for Reveal**: Added `game_stage VARCHAR(32) NOT NULL DEFAULT 'round'` and `reveal_step INTEGER NOT NULL DEFAULT 0` to `game_sessions`.
- [x] **Shared Educational Sequence Data**: Authored structured 9-step reveal configuration in `revealSteps.ts` with `ROUND_COMPARISON_FACTS` directly tying into the 7 candidate scenarios.
- [x] **Host Projector-First Reveal Center**: Built `HostRevealView.tsx` with high-contrast projector typography, stage progress indicator, side-by-side comparison tables, interactive pipeline diagrams, and presenter discussion prompts.
- [x] **Realtime Synchronized Mobile Experience**: Built `PlayerRevealView.tsx` and integrated it in `PlayPage.tsx` and `RevealPlaceholderPage.tsx`, allowing player devices to mirror the presenter's active reveal step instantly.
- [x] **Authoritative Stage Progression**: Implemented `startBiasReveal`, `setRevealStep`, `transitionToFairnessStage`, and `getSessionAllRoundsAggregates` in `gameService.ts`.
- [x] **DATA → ALGORITHM → DECISION → IMPACT Pipeline**: Interactive flowcharts visually demonstrating how human decisions scale from 1 to 10,000 to train algorithms that automate outcomes, highlighting "Automation ≠ Fairness".
- [x] **Non-Shaming Educational Ethics**: Strictly maintained objective framing ("The decisions changed when the information changed") with zero individual student shaming, labeling, or identity leakage.
- [x] **Integration & Build Verification**: TypeScript type-checked and verified with automated integration test `test_case8_reveal.cjs`. Production build passed.
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