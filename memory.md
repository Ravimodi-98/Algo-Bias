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
CASE 5 COMPLETE — Candidate System & Decision Rounds 1–7 (Light Theme)

Overall Progress:
[ ] Not Started
[x] In Development
[ ] Testing
[ ] Presentation Ready

---

# 2. Current Phase

Current Phase:
CASE 5 COMPLETE — Candidate System & 7 Decision Rounds (Preparing Case 6)

Current Objective:
Complete candidate data architecture, 7 fictional decision rounds, and permanent transition to the Light Theme (Futuristic AI Control Room — Light Edition).

---

# 3. Current File Being Worked On

Currently Working On:
src/shared/data/rounds.ts, src/player/pages/PlayPage.tsx, src/player/components/CandidateCard.tsx

Current Task:
Case 5 Complete: Full 7-round fictional candidate dataset, upgraded CandidateCard with dynamic sections, mobile-first VS layout, neutral non-shaming decision feedback, Light Theme design system tokens, and Host scenario controller.

---

# 4. Recently Completed

- [x] Permanent Light Theme transition across the entire application (Player, Host, Lobby, Game, Cards, Components)
- [x] Light theme tokens in `src/styles/index.css` (`#F6F8FC` backdrop, `#FFFFFF` surfaces, `#0F172A` text, `#0284C7` and `#7C3AED` accents)
- [x] Reusable data-driven candidate & round models in `src/shared/data/rounds.ts`
- [x] Exactly 7 fictional decision rounds implemented:
  - Round 1: Relevant Skills (Junior Software Developer — Aarav vs Rohan)
  - Round 2: Educational Background (Junior Cloud Engineer — Maya vs Ishita)
  - Round 3: Geographic Location (Systems Reliability Specialist — Kabir [Ahmedabad] vs Dev [Pune])
  - Round 4: Candidate Name (Data Platform Engineer — Aarav vs Maya)
  - Round 5: Presentation Style (API Integration Developer — Nisha [Structured] vs Anaya [Narrative])
  - Round 6: Relevant vs Irrelevant Info (Backend Developer — Rohan vs Kabir [Extraneous details])
  - Round 7: Comprehensive Final Decision (Full Stack Software Developer — Dev vs Ishita)
- [x] Upgraded `CandidateCard` with dynamic section rendering (skills, experience, projects, education, location, details)
- [x] Mobile-friendly decision layout (`Candidate A` -> `VS` divider -> `Candidate B` -> `DecisionPanel`)
- [x] Neutral decision feedback: "Decision recorded.", "Decision submitted." (Zero shaming or "correct/wrong" language)
- [x] Host game console (`/host/game`) updated for Light Theme with live round scenario info and progression controls
- [x] Visual verification via browser subagent across Landing, Host Console, Player Join, Round 1 decision, and Round 2 advance
- [x] Documentation updated: `design.md`, `memory.md`, `phases.md`

---

# 5. In Progress

- [x] Case 5 completed and verified
- [ ] Prepare Case 6 (Timer, answer submission persistence, and round progression)

---

# 6. Next Tasks

1. Case 6: Decision countdown timer and synchronized submission
2. Case 6: Response recording in Supabase database (`responses` table)
3. Case 7: Host live dashboard and collective classroom results
4. Case 8: Digital ethics and algorithmic bias reveal sequence

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
- [x] Polished `CandidateCard` component
- [x] Mobile-friendly VS decision layout
- [x] Neutral non-shaming decision feedback
- [x] Authoritative round synchronization via Supabase Realtime

---

# 8. Important Technical Decisions

- **Permanent Light Theme**: Clean `#F6F8FC` background, `#FFFFFF` elevated cards, `#0F172A` high-contrast typography, `#E2E8F0` soft borders, and `#0284C7`/`#7C3AED` technology accents.
- **Candidate Data Architecture**: Content is completely separated from UI inside `src/shared/data/rounds.ts` with typed interfaces (`Candidate`, `RoundData`). UI consumes `getRoundData(currentRound)`.
- **Fictional Candidates Only**: All profiles use fictional names (Aarav, Maya, Kabir, Nisha, Rohan, Ishita, Dev, Anaya) without real-world people, resumes, or companies.
- **Neutral Educational Framing**: No "correct" or "wrong" judgments, no shaming language. Decisions explore data influence.
- **Mobile-First Layout**: On mobile screens, Candidate A and Candidate B stack cleanly around a central `VS` indicator, followed by large touch-friendly decision buttons (>44px height).

---

# 9. Latest Git Commit

Commit:
`feat: add candidate system and seven decision rounds`

Date:
2026-09-16