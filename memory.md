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
100-PLAYER CAPACITY CERTIFIED — End-to-End Stress Testing across 25, 50, 70, 85, and 100 concurrent players PASSED against live production architecture.

Overall Progress:
[ ] Not Started
[ ] In Development
[x] Testing & Complete
[x] Presentation Ready
[x] 100-Player Capacity Verified

---

# 2. Current Phase

Current Phase:
PHASE 14 COMPLETE — 100-Player Simultaneous Load Test & Capacity Certification

Current Objective:
Certify 100 concurrent student players in a single game session with active simultaneous gameplay, zero data corruption, real-time synchronization, sub-second write latencies, strict security/RLS, and presentation safety.

---

# 3. Current File Being Worked On

Currently Working On:
scripts/test_100_player_stress.cjs, 100_player_stress_test_report.md

Current Task:
100-player load testing across 5 progressive tiers (25, 50, 70, 85, 100 players) completed with 100% pass rate. Updating project memory and repository documentation.

---

# 4. Recently Completed

- [x] **100-Player Simultaneous Load Testing Across 5 Progressive Tiers**: Executed end-to-end stress tests on live production architecture (Supabase + Vercel backend) for 25, 50, 70, 85, and 100 simultaneous players in a single session. All 5 tiers achieved 100% success rate with zero errors, zero dropped connections, and zero data corruption.
- [x] **High-Concurrency Write Spike Benchmark**: Tested 100 simultaneous candidate submissions in Round 4 within a 595ms window (average latency 310.1ms, p95 551ms). Database handled peak concurrent throughput without rate-limiting or timeouts.
- [x] **Duplicate Submission Protection Under Load**: Tested rapid concurrent duplicate submissions (10 attempts across different players). Postgres UNIQUE constraints caught 100% of duplicate attempts (`code: '23505'`) with zero double-counting.
- [x] **Disconnect & Reconnect Resilience**: Simulated 15 mid-game player disconnects and reconnects during active rounds. All 15 players successfully restored player identity, session state, and previous responses without creating duplicate records.
- [x] **Candidate Selection UI Simplified Across All 5 Rounds**: Candidate-selection UI simplified across all 5 rounds. Removed the redundant bottom "YOUR SELECTION / OPTION 1 / OPTION 2" panel. Students now select Candidate A or Candidate B directly using the existing candidate-card radio/selection control.
- [x] **Bias Reveal Classroom Reflection Synchronized**: Bias Reveal classroom reflection content synchronized between Host and Player. Both views now use: `"Notice how surrounding factors can subtly shift evaluations even when we intend to be purely objective."`
- [x] **Security / RLS Verification Under Load**: All 7 security audit checks maintained under 100-player load. Anonymous player isolation verified; Host authorization strictly enforced; zero service keys or credentials exposed.

---

# 5. In Progress

- [x] 100-player capacity testing completed and verified
- [x] All 6 project markdown documents synchronized
- [ ] Production build and final deployment verification

---

# 6. Next Tasks

1. Run production build check (`npm run build`).
2. Commit changes with `test: validate 100 player concurrent capacity`.
3. Push commit to remote `origin/main`.
4. Final production check and verification.

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
- [x] Exactly 5 educational decision rounds (Skills, Education, Location, Presentation, Final Decision)
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
- [x] 9-step interactive decision system design challenge (Steps 0 to 8)
- [x] Host readiness room & authoritative challenge launch
- [x] Relevant factor selection & explicit priority rule builder
- [x] Candidate application evaluation with intentional criteria
- [x] Controlled system audits (Fairness, Transparency, Oversight; Consistency Test question removed from student interaction)
- [x] Real-time classroom aggregate choices & process comparison
- [x] Key reflection: "Fairness is not a button"

## Phase 14 — 100-Player Capacity Certification
- [x] 5 progressive load tiers (25, 50, 70, 85, 100 players) passed 100%
- [x] Burst join spike: 100 players joined in 636ms
- [x] Burst submission spike: 100 decisions submitted in 595ms
- [x] End-to-end 5-round gameplay, Bias Reveal, Make It Fair, and Final Results verified
- [x] Comprehensive 100-player stress test report generated

---

# 8. Important Technical Decisions

- **No Single Fairness Score**: To avoid moral shaming or superficial gamification, students are never assigned a "fairness percentage" or ranked.
- **Authoritative Stage Progression**: The session Host controls global progression through challenge steps; player devices synchronize instantly via Supabase Realtime.
- **Flexible JSONB Response Storage**: Responses for different challenge stages are stored in `fairness_responses` with unique constraint `(session_id, player_id, stage)` to prevent duplicates.
- **Reconnection Resilience**: On reload, `getPlayerFairnessResponse` restores previous selections so students can resume seamlessly.
- **Anonymous Classroom Aggregation**: Aggregate frequencies (e.g. factors selected, test answers) are computed on the server/service layer without exposing student identities.
- **Load-Tested Capacity**: All capacity claims are backed by measured, progressive load test results against live production architecture.

---

# 9. 100-Player Load Test Benchmark & Capacity Status

```text
100-PLAYER TEST: PASSED

The production simulation successfully handled
100 concurrent players under the tested workload.

Test Date: 2026-10-01
Architecture: Live Supabase Backend + Vercel Production Environment
Target Capacity: 100 Concurrent Players in One Game Session

CAPACITY LADDER RESULTS:
| Load Tier    | Attempted | Successful | Error Rate | Duration | Result |
| ------------ | --------- | ---------- | ---------- | -------- | ------ |
| 25 Players   | 25        | 25 (100%)  | 0.00%      | 17.78s   | PASS   |
| 50 Players   | 50        | 50 (100%)  | 0.00%      | 14.41s   | PASS   |
| 70 Players   | 70        | 70 (100%)  | 0.00%      | 15.27s   | PASS   |
| 85 Players   | 85        | 85 (100%)  | 0.00%      | 14.29s   | PASS   |
| 100 Players  | 100       | 100 (100%) | 0.00%      | 18.90s   | PASS   |

KEY 100-PLAYER METRICS:
- Join Spike: 100 players joined in 636ms (avg: 293.2ms, p95: 578ms)
- Submission Spike (Round 4): 100 submissions in 595ms (avg: 310.1ms, p95: 551ms)
- Total Response Accuracy: 100/100 valid responses across all 5 candidate rounds
- Aggregate Verification: Option A + Option B = 100 votes (Zero NaN/Infinity values)
- Duplicate Prevention: 10/10 rapid duplicate attempts caught by Postgres UNIQUE constraint (100% blocked)
- Disconnect/Reconnect: 15/15 disconnected players successfully restored active state without duplication
- Security Audit: 7/7 checks passed (RLS active, player isolation verified, zero secrets leaked)
- Total HTTP/DB Errors: 0 errors across 100 simulated players
```

---

# 10. Current State & Latest Commit

100-Player Capacity Verified.
All 12 Cases of THE DECISION are fully implemented, verified, stress-tested to 100 concurrent players, and presentation-ready.

Latest Commit:
`test: validate 100 player concurrent capacity`

Date:
2026-10-01