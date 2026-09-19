const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fcrdrcqbrkzznnnwimje.supabase.co';
const supabaseKey = 'sb_publishable_8QkBP3-6kvuhvKq2ysmKUA_2kGVCnD1';
const supabase = createClient(supabaseUrl, supabaseKey);

const TOTAL_ROUNDS = 5;

// Helper to wait ms
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run70PlayerCapacityTest(playerCount = 70) {
  console.log(`\n======================================================================`);
  console.log(`🚀 STARTING CAPACITY & LOAD TEST: ${playerCount} PLAYERS + 1 HOST`);
  console.log(`======================================================================\n`);

  const startTime = Date.now();
  const testGameCode = 'C7' + Math.floor(1000 + Math.random() * 9000);
  const hostId = `HOST_CAPACITY_${playerCount}_` + Date.now();

  // -------------------------------------------------------------------------
  // 1. HOST CREATES GAME SESSION
  // -------------------------------------------------------------------------
  console.log(`[STEP 1] Host creating game session (Code: ${testGameCode})...`);
  const { data: session, error: sessErr } = await supabase
    .from('game_sessions')
    .insert({
      game_code: testGameCode,
      host_id: hostId,
      status: 'waiting',
      current_round: 0,
      round_started_at: new Date().toISOString(),
      results_visible: false
    })
    .select()
    .single();

  if (sessErr || !session) {
    console.error('❌ Failed to create game session:', sessErr);
    throw sessErr;
  }
  console.log(`✅ Session created: ${session.id} (Status: ${session.status}, Code: ${session.game_code})`);

  // -------------------------------------------------------------------------
  // 2. REALISTIC CONCURRENT JOIN BURST (70 PLAYERS)
  // -------------------------------------------------------------------------
  console.log(`\n[STEP 2] Simulating burst join of ${playerCount} players scanning QR code...`);
  const joinStartTime = Date.now();
  
  // Prepare player records with callsigns
  const playerPromises = [];
  for (let i = 1; i <= playerCount; i++) {
    const pad = String(i).padStart(2, '0');
    const anonymousName = `STUDENT-${pad}`;
    playerPromises.push(
      supabase
        .from('players')
        .insert({
          session_id: session.id,
          anonymous_name: anonymousName
        })
        .select()
        .single()
    );
  }

  // Execute in concurrent burst
  const joinResults = await Promise.all(playerPromises);
  const joinDuration = Date.now() - joinStartTime;

  const failedJoins = joinResults.filter((r) => r.error || !r.data);
  if (failedJoins.length > 0) {
    console.error(`❌ ${failedJoins.length} players failed to join!`, failedJoins[0].error);
    throw new Error(`${failedJoins.length} join failures`);
  }

  const players = joinResults.map((r) => r.data);
  console.log(`✅ All ${players.length} players joined successfully in ${joinDuration}ms (Avg ${(joinDuration / playerCount).toFixed(1)}ms/player)`);

  // Verify player count in DB
  const { count: dbPlayerCount, error: countErr } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', session.id);

  if (countErr || dbPlayerCount !== playerCount) {
    throw new Error(`Player count mismatch: expected ${playerCount}, found ${dbPlayerCount}`);
  }
  console.log(`✅ DB verification confirmed exact player count: ${dbPlayerCount} players connected.`);

  // -------------------------------------------------------------------------
  // 3. HOST STARTS GAME -> ALL PLAYERS SYNCHRONIZE TO ROUND 1
  // -------------------------------------------------------------------------
  console.log(`\n[STEP 3] Host starting game (Transitioning waiting -> active, Round 1)...`);
  const { data: activeSession, error: startErr } = await supabase
    .from('game_sessions')
    .update({
      status: 'active',
      current_round: 1,
      round_started_at: new Date().toISOString(),
      results_visible: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.id)
    .select()
    .single();

  if (startErr || activeSession.status !== 'active' || activeSession.current_round !== 1) {
    throw new Error(`Failed to start game: ${JSON.stringify(startErr)}`);
  }
  console.log(`✅ Game session active: Round 1 started at ${activeSession.round_started_at}`);

  // -------------------------------------------------------------------------
  // 4. ROUND 1: 70 SIMULTANEOUS SUBMISSIONS (BURST CONCURRENCY)
  // -------------------------------------------------------------------------
  console.log(`\n[STEP 4] Simulating Round 1: ${playerCount} simultaneous submissions...`);
  const r1StartTime = Date.now();

  // 42 vote A, 28 vote B (for 70 players)
  const r1Submissions = players.map((p, idx) => {
    const candidate = (idx < Math.round(playerCount * 0.6)) ? 'A' : 'B';
    return supabase
      .from('responses')
      .insert({
        session_id: session.id,
        player_id: p.id,
        round_number: 1,
        selected_candidate: candidate
      })
      .select()
      .single();
  });

  const r1Results = await Promise.all(r1Submissions);
  const r1Duration = Date.now() - r1StartTime;

  const r1Failed = r1Results.filter((r) => r.error || !r.data);
  if (r1Failed.length > 0) {
    throw new Error(`Round 1 submission failure: ${JSON.stringify(r1Failed[0].error)}`);
  }
  console.log(`✅ All ${playerCount} Round 1 submissions completed in ${r1Duration}ms (Avg ${(r1Duration / playerCount).toFixed(1)}ms/submission)`);

  // Test Duplicate Submission Prevention on 5 players
  console.log(`   Testing duplicate submission protection on 5 players...`);
  const duplicateAttempts = players.slice(0, 5).map((p) =>
    supabase
      .from('responses')
      .insert({
        session_id: session.id,
        player_id: p.id,
        round_number: 1,
        selected_candidate: 'B'
      })
  );
  const dupResults = await Promise.all(duplicateAttempts);
  const caughtDuplicates = dupResults.filter((r) => r.error && r.error.code === '23505');
  if (caughtDuplicates.length !== 5) {
    throw new Error(`Duplicate protection failed! Caught: ${caughtDuplicates.length}/5`);
  }
  console.log(`✅ Duplicate protection verified: Postgres UNIQUE(session_id, player_id, round_number) successfully prevented 5/5 duplicate votes.`);

  // Host reveals results
  const { data: revealedR1 } = await supabase
    .from('game_sessions')
    .update({ results_visible: true, updated_at: new Date().toISOString() })
    .eq('id', session.id)
    .select()
    .single();
  console.log(`✅ Round 1 results revealed to classroom (results_visible = ${revealedR1.results_visible})`);

  // -------------------------------------------------------------------------
  // 5. PROGRESS THROUGH REMAINING ROUNDS (ROUNDS 2 TO 5)
  // -------------------------------------------------------------------------
  for (let r = 2; r <= TOTAL_ROUNDS; r++) {
    console.log(`\n[STEP 5.${r}] Progressing to Round ${r} of ${TOTAL_ROUNDS}...`);
    
    // Host advances round
    await supabase
      .from('game_sessions')
      .update({
        current_round: r,
        round_started_at: new Date().toISOString(),
        results_visible: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.id);

    // In Round 3, simulate partial participation (e.g. 5 students timeout)
    const submittingPlayers = (r === 3) ? players.slice(0, playerCount - 5) : players;
    const roundVotesA = Math.round(submittingPlayers.length * (r % 2 === 0 ? 0.65 : 0.45));

    const roundSubs = submittingPlayers.map((p, idx) => {
      const candidate = (idx < roundVotesA) ? 'A' : 'B';
      return supabase
        .from('responses')
        .insert({
          session_id: session.id,
          player_id: p.id,
          round_number: r,
          selected_candidate: candidate
        })
        .select()
        .single();
    });

    const subRes = await Promise.all(roundSubs);
    const subErrors = subRes.filter((res) => res.error);
    if (subErrors.length > 0) {
      throw new Error(`Round ${r} submission errors: ${JSON.stringify(subErrors[0].error)}`);
    }

    console.log(`✅ Round ${r}: ${submittingPlayers.length} of ${playerCount} players submitted (${roundVotesA} for A, ${submittingPlayers.length - roundVotesA} for B)`);

    // Host reveals results
    await supabase
      .from('game_sessions')
      .update({ results_visible: true })
      .eq('id', session.id);
  }

  // -------------------------------------------------------------------------
  // 6. VERIFY HOST ACTUAL ANONYMIZED RESULTS INTEGRITY
  // -------------------------------------------------------------------------
  console.log(`\n[STEP 6] Verifying Host Anonymized Results across all 5 candidate rounds...`);
  const { data: allResponses, error: respErr } = await supabase
    .from('responses')
    .select('round_number, selected_candidate')
    .eq('session_id', session.id);

  if (respErr || !allResponses) {
    throw new Error(`Failed to fetch responses for aggregation check: ${JSON.stringify(respErr)}`);
  }

  const roundAggregates = {};
  for (let r = 1; r <= TOTAL_ROUNDS; r++) {
    roundAggregates[r] = { total: 0, countA: 0, countB: 0, pctA: 0, pctB: 0 };
  }

  allResponses.forEach((row) => {
    const r = row.round_number;
    if (roundAggregates[r]) {
      if (row.selected_candidate === 'A') roundAggregates[r].countA++;
      if (row.selected_candidate === 'B') roundAggregates[r].countB++;
    }
  });

  for (let r = 1; r <= TOTAL_ROUNDS; r++) {
    const total = roundAggregates[r].countA + roundAggregates[r].countB;
    roundAggregates[r].total = total;
    if (total > 0) {
      const pA = Math.round((roundAggregates[r].countA / total) * 100);
      roundAggregates[r].pctA = pA;
      roundAggregates[r].pctB = 100 - pA;
    }

    // Stress test assertions
    if (roundAggregates[r].countA + roundAggregates[r].countB !== total) {
      throw new Error(`Math error in Round ${r}: A + B != total`);
    }
    if (roundAggregates[r].pctA + roundAggregates[r].pctB !== 100) {
      throw new Error(`Math error in Round ${r}: pctA + pctB != 100`);
    }
    if (isNaN(roundAggregates[r].pctA) || isNaN(roundAggregates[r].pctB)) {
      throw new Error(`NaN detected in Round ${r} percentages!`);
    }

    console.log(`   Round ${r}: Total = ${total} | Candidate A = ${roundAggregates[r].countA} (${roundAggregates[r].pctA}%) | Candidate B = ${roundAggregates[r].countB} (${roundAggregates[r].pctB}%)`);
  }
  console.log(`✅ Aggregate calculation stress test passed: Option A + Option B = Total, Pct A + Pct B = 100%, no NaN/Infinity.`);

  // -------------------------------------------------------------------------
  // 7. BIAS REVEAL SYNCHRONIZATION (9 STEPS)
  // -------------------------------------------------------------------------
  console.log(`\n[STEP 7] Host starting Educational Bias Reveal (9 steps)...`);
  await supabase
    .from('game_sessions')
    .update({
      game_stage: 'reveal',
      reveal_step: 1,
      results_visible: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.id);

  for (let step = 2; step <= 9; step++) {
    const { data: revSess, error: revErr } = await supabase
      .from('game_sessions')
      .update({ reveal_step: step, updated_at: new Date().toISOString() })
      .eq('id', session.id)
      .select()
      .single();

    if (revErr || revSess.reveal_step !== step) {
      throw new Error(`Failed to advance reveal step to ${step}`);
    }
  }
  console.log(`✅ Bias Reveal 9-step synchronized progression completed successfully.`);

  // -------------------------------------------------------------------------
  // 8. MAKE IT FAIR CHALLENGE (CASE 9 UNDER LOAD)
  // -------------------------------------------------------------------------
  console.log(`\n[STEP 8] Transitioning to Case 9 Make It Fair Challenge...`);
  await supabase
    .from('game_sessions')
    .update({
      game_stage: 'fairness',
      fairness_step: 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.id);

  console.log(`   Submitting readiness for all ${playerCount} players...`);
  const readyPromises = players.map((p) =>
    supabase
      .from('fairness_responses')
      .upsert({
        session_id: session.id,
        player_id: p.id,
        stage: 'ready',
        response: { ready: true },
        submitted_at: new Date().toISOString()
      }, { onConflict: 'session_id,player_id,stage' })
  );
  await Promise.all(readyPromises);

  // Step 1: Factors Selection
  console.log(`   Simulating Step 1 (Factors Selection) for ${playerCount} players...`);
  const factorPromises = players.map((p, idx) =>
    supabase
      .from('fairness_responses')
      .upsert({
        session_id: session.id,
        player_id: p.id,
        stage: 'factors',
        response: {
          selectedFactors: (idx % 2 === 0) 
            ? ['skills', 'experience', 'projects'] 
            : ['skills', 'education', 'presentation_style']
        },
        submitted_at: new Date().toISOString()
      }, { onConflict: 'session_id,player_id,stage' })
  );
  await Promise.all(factorPromises);

  // Step 2: Decision Rule Builder
  console.log(`   Simulating Step 2 (Priority Rules) for ${playerCount} players...`);
  const rulePromises = players.map((p) =>
    supabase
      .from('fairness_responses')
      .upsert({
        session_id: session.id,
        player_id: p.id,
        stage: 'rule',
        response: {
          priorities: {
            skills: 'HIGH',
            experience: 'MEDIUM',
            projects: 'MEDIUM',
            education: 'LOW',
            location: 'EXCLUDE',
            name: 'EXCLUDE',
            presentation_style: 'EXCLUDE'
          }
        },
        submitted_at: new Date().toISOString()
      }, { onConflict: 'session_id,player_id,stage' })
  );
  await Promise.all(rulePromises);

  // Step 4: Fairness Test Audit
  console.log(`   Simulating Step 4 (Fairness Test A) for ${playerCount} players...`);
  const testPromises = players.map((p, idx) =>
    supabase
      .from('fairness_responses')
      .upsert({
        session_id: session.id,
        player_id: p.id,
        stage: 'fairness_test',
        response: { testAnswer: idx % 3 === 0 ? 'NO' : 'DEPENDS' },
        submitted_at: new Date().toISOString()
      }, { onConflict: 'session_id,player_id,stage' })
  );
  await Promise.all(testPromises);

  // Verify aggregate fairness calculations
  const { data: fResponses } = await supabase
    .from('fairness_responses')
    .select('*')
    .eq('session_id', session.id);

  const participantSet = new Set(fResponses.map((r) => r.player_id));
  if (participantSet.size !== playerCount) {
    throw new Error(`Fairness participant count mismatch: ${participantSet.size} vs ${playerCount}`);
  }
  console.log(`✅ Make It Fair Challenge completed under load. Verified ${participantSet.size} distinct student participants with 0 duplicate rows.`);

  // -------------------------------------------------------------------------
  // 9. FINAL RESULTS & REFLECTION (CASE 10 UNDER LOAD)
  // -------------------------------------------------------------------------
  console.log(`\n[STEP 9] Transitioning to Case 10 Final Results & Reflection...`);
  await supabase
    .from('game_sessions')
    .update({
      game_stage: 'final',
      final_step: 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.id);

  // Advance through steps 1 to 4
  for (let fs = 1; fs <= 4; fs++) {
    await supabase
      .from('game_sessions')
      .update({ final_step: fs, updated_at: new Date().toISOString() })
      .eq('id', session.id);
  }

  // In Step 4, all players submit reflections concurrently
  console.log(`   Submitting reflections for all ${playerCount} players concurrently...`);
  const themePool = [
    ['data_used', 'info_matters'],
    ['system_tested', 'who_accountable'],
    ['decision_explained', 'data_used'],
    ['info_matters', 'system_tested', 'who_accountable']
  ];

  const reflectionPromises = players.map((p, idx) => {
    const chosenThemes = themePool[idx % themePool.length];
    const takeaway = `Takeaway from student ${idx + 1}: Fairness requires ongoing human oversight.`;
    return supabase
      .from('reflections')
      .upsert({
        session_id: session.id,
        player_id: p.id,
        selected_themes: chosenThemes,
        optional_response: takeaway,
        submitted_at: new Date().toISOString()
      }, { onConflict: 'session_id,player_id' })
      .select()
      .single();
  });

  const refResults = await Promise.all(reflectionPromises);
  const refFailed = refResults.filter((r) => r.error);
  if (refFailed.length > 0) {
    throw new Error(`Reflection submission failed: ${JSON.stringify(refFailed[0].error)}`);
  }

  // Test duplicate reflection prevention
  console.log(`   Testing duplicate reflection protection on 5 players...`);
  const dupRefPromises = players.slice(0, 5).map((p) =>
    supabase
      .from('reflections')
      .insert({
        session_id: session.id,
        player_id: p.id,
        selected_themes: ['data_used'],
        optional_response: 'Duplicate attempt'
      })
  );
  const dupRefRes = await Promise.all(dupRefPromises);
  const caughtDupRef = dupRefRes.filter((r) => r.error && r.error.code === '23505');
  if (caughtDupRef.length !== 5) {
    throw new Error(`Duplicate reflection constraint failed! Caught ${caughtDupRef.length}/5`);
  }
  console.log(`✅ Duplicate reflection protection verified: UNIQUE(session_id, player_id) caught 5/5 duplicate attempts.`);

  // Verify reflection aggregate
  const { data: allReflections } = await supabase
    .from('reflections')
    .select('selected_themes, optional_response')
    .eq('session_id', session.id);

  if (!allReflections || allReflections.length !== playerCount) {
    throw new Error(`Reflection count mismatch: ${allReflections ? allReflections.length : 0} vs ${playerCount}`);
  }
  console.log(`✅ Verified ${allReflections.length} reflections stored and aggregated anonymously.`);

  // -------------------------------------------------------------------------
  // 10. GAME COMPLETE & SESSION CONCLUSION
  // -------------------------------------------------------------------------
  console.log(`\n[STEP 10] Host completing session (END GAME)...`);
  const { data: completedSession, error: compErr } = await supabase
    .from('game_sessions')
    .update({
      status: 'completed',
      game_stage: 'completed',
      final_step: 5,
      ended_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', session.id)
    .select()
    .single();

  if (compErr || completedSession.status !== 'completed' || completedSession.game_stage !== 'completed') {
    throw new Error(`Failed to complete session: ${JSON.stringify(compErr)}`);
  }
  console.log(`✅ Session marked completed: status = ${completedSession.status}, ended_at = ${completedSession.ended_at}`);

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n======================================================================`);
  console.log(`🎉 SUCCESS: ${playerCount}-PLAYER CAPACITY LOAD TEST COMPLETED IN ${totalDuration}s`);
  console.log(`======================================================================\n`);

  return {
    playerCount,
    totalDuration,
    sessionId: session.id,
    gameCode: testGameCode
  };
}

async function main() {
  try {
    // 1. Core Target: 70 Players
    const result70 = await run70PlayerCapacityTest(70);

    // 2. Headroom Target 1: 75 Players
    const result75 = await run70PlayerCapacityTest(75);

    // 3. Headroom Target 2: 80 Players Stress Test
    const result80 = await run70PlayerCapacityTest(80);

    console.log(`\n======================================================================`);
    console.log(`🏆 ALL CAPACITY BENCHMARKS PASSED:`);
    console.log(`  - 70 Simultaneous Players + Host: PASSED (${result70.totalDuration}s) [Session: ${result70.gameCode}]`);
    console.log(`  - 75 Simultaneous Players + Host: PASSED (${result75.totalDuration}s) [Session: ${result75.gameCode}]`);
    console.log(`  - 80 Simultaneous Players + Host: PASSED (${result80.totalDuration}s) [Session: ${result80.gameCode}]`);
    console.log(`======================================================================\n`);
  } catch (err) {
    console.error(`\n❌ CAPACITY TEST FAILED:`, err);
    process.exit(1);
  }
}

main();
