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

- [x] **100-Player Simultaneous Load Testing Across 5 Progressive Tiers & Repeatability Run**: Executed end-to-end stress tests on live production architecture (Supabase + Vercel backend) for 25, 50, 70, 85, and 100 simultaneous players in a single session, followed by an independent 100-player repeatability verification run. All tiers achieved 100% success rate with zero errors, zero dropped connections, and zero data corruption.
- [x] **High-Concurrency Write Spike Benchmark**: Tested 100 simultaneous candidate submissions across all 5 candidate rounds. In Round 4 peak burst, 100 concurrent writes completed in 482ms (average latency 243.2ms, p95 281ms). Database handled peak concurrent throughput without rate-limiting or timeouts.
- [x] **Duplicate Submission Protection Under Load**: Tested rapid concurrent duplicate submissions (50 attempts across 5 rounds). Postgres UNIQUE constraints caught 100% of duplicate attempts (`code: '23505'`) with zero double-counting.
- [x] **Multi-Stage Disconnect & Reconnect Resilience**: Simulated 25 player disconnects and reconnects across 5 distinct game phases (Lobby, Candidate Selection, Bias Reveal, Make It Fair, Case 10). All 25/25 players successfully restored player identity, session state, and previous responses without creating duplicate records.
- [x] **Candidate Selection UI Simplified Across All 5 Rounds**: Candidate-selection UI simplified across all 5 rounds. Exactly 10 unique candidate first names verified.
- [x] **Bias Reveal & Make It Fair Verified Under Load**: 9-step educational Bias Reveal progression and 9-step Make It Fair challenge executed with 100 players. Removed Consistency Test question confirmed skipped.
- [x] **Case 10 & Reflections**: Verified immediate entry into Classroom Metrics (redundant player reflection intro screen removed), 100/100 reflections persisted, and session cleanly locked.
- [x] **Automated Reporting**: Machine-readable `reports/100_player_stress_test_results.json` and comprehensive `reports/100_player_stress_test_report.md` generated with official PASS verdict.

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
- [x] Candidate names across all 5 candidate-selection rounds are now unique to prevent player confusion while preserving candidate IDs, game logic, and simulation behavior
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
- [x] Independent 100-player repeatability verification run passed 100%
- [x] Burst join spike: 100 players joined in 621ms (avg: 380.3ms, p95: 564ms)
- [x] Burst submission spike (Round 4): 100 decisions submitted in 482ms (avg: 243.2ms, p95: 281ms)
- [x] Repeatability run: 100 decisions submitted in 293ms (avg: 240.4ms, p95: 284ms)
- [x] End-to-end 5-round gameplay, Bias Reveal, Make It Fair, and Final Results verified
- [x] Multi-stage disconnect/reconnect: 25/25 players restored across 5 distinct phases
- [x] Comprehensive 100-player stress test report generated (`reports/100_player_stress_test_report.md`)

---

# 8. Important Technical Decisions

- **No Single Fairness Score**: To avoid moral shaming or superficial gamification, students are never assigned a "fairness percentage" or ranked.
- **Authoritative Stage Progression**: The session Host controls global progression through challenge steps; player devices synchronize instantly via Supabase Realtime.
- **Flexible JSONB Response Storage**: Responses for different challenge stages are stored in `fairness_responses` with unique constraint `(session_id, player_id, stage)` to prevent duplicates.
- **Reconnection Resilience**: On reload, `getPlayerFairnessResponse` restores previous selections so students can resume seamlessly. Multi-stage reconnect verified across 5 distinct game phases.
- **Anonymous Classroom Aggregation**: Aggregate frequencies (e.g. factors selected, test answers) are computed on the server/service layer without exposing student identities.
- **Streamlined Case 10 Player Flow**: The redundant Player-facing "The Decision: Reflection" intro interstitial screen was removed so students enter Classroom Metrics & Results immediately upon Host transitioning to Case 10. Realtime step synchronization is 1:1 aligned across all 6 steps (0: Classroom Metrics, 1: Key Lessons, 2: The Complete Chain, 3: Automation ≠ Fairness, 4: Personal Reflection, 5: Game Complete).
- **Unique Candidate Names Across All 5 Rounds**: Candidate names across all 5 candidate-selection rounds are now unique to prevent player confusion while preserving candidate IDs, game logic, and simulation behavior.
- **Load-Tested Capacity**: All capacity claims are backed by measured, progressive load test results against live production architecture.

---

# 9. 100-Player Load Test Benchmark & Capacity Status

```text
100-PLAYER TEST: PASSED

The production simulation successfully handled
100 concurrent players under the tested workload.

Test Date: 2026-10-15
Architecture: Live Supabase Backend + Vercel Production Environment
Target Capacity: 100 Concurrent Players in One Game Session

CAPACITY LADDER RESULTS:
| Load Tier                    | Attempted | Successful | Error Rate | Duration | Result |
| ---------------------------- | --------- | ---------- | ---------- | -------- | ------ |
| Level 1 (25 Players)         | 25        | 25 (100%)  | 0.00%      | 41.02s   | PASS   |
| Level 2 (50 Players)         | 50        | 50 (100%)  | 0.00%      | 45.05s   | PASS   |
| Level 3 (70 Players)         | 70        | 70 (100%)  | 0.00%      | 39.02s   | PASS   |
| Level 4 (85 Players)         | 85        | 85 (100%)  | 0.00%      | 56.28s   | PASS   |
| Level 5 (100 Players Run 1)  | 100       | 100 (100%) | 0.00%      | 40.34s   | PASS   |
| Level 5 (100 Players Run 2)  | 100       | 100 (100%) | 0.00%      | 39.68s   | PASS   |

KEY 100-PLAYER METRICS:
- Join Spike: 100 players joined in 621ms (avg: 380.3ms, p95: 564ms, max: 621ms)
- Submission Spike (Round 4): 100 submissions in 482ms (avg: 243.2ms, p95: 281ms)
- Repeatability Run Join: 100 players joined in 682ms (avg: 357.1ms, p95: 624ms, max: 681ms)
- Repeatability Run Write: 100 submissions in 293ms (avg: 240.4ms, p95: 284ms)
- Total Response Accuracy: 100/100 valid responses across all 5 candidate rounds (500/500 total)
- Aggregate Verification: Option A + Option B = 100 votes (Zero NaN/Infinity values)
- Duplicate Prevention: 50/50 duplicate attempts caught by Postgres UNIQUE constraint (100% blocked)
- Disconnect/Reconnect: 25/25 disconnected players across 5 stages successfully restored active state without duplication
- Security Audit: Host isolation, student anonymity, constraint enforcement, and zero secrets leaked
- Total HTTP/DB Errors: 0 errors across 100 simulated players
- Official Report: reports/100_player_stress_test_report.md
```

---

# 10. Current State & Latest Commit

100-Player Capacity Certified & Verified across Progressive Concurrency Tiers and Repeatability Runs.
All 12 Cases of THE DECISION are fully implemented, verified, stress-tested to 100 concurrent players, and presentation-ready.

Latest Commit:
`test: certify 100 player concurrent capacity and repeatability`

Date:
2026-10-15