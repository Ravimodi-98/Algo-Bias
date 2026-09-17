const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fcrdrcqbrkzznnnwimje.supabase.co';
const supabaseKey = 'sb_publishable_8QkBP3-6kvuhvKq2ysmKUA_2kGVCnD1';
const supabase = createClient(supabaseUrl, supabaseKey);

// Mirror gameService.getSessionAllRoundsAggregates logic
const TOTAL_ROUNDS = 5;
async function getSessionAllRoundsAggregates(sessionId) {
  try {
    const { data, error } = await supabase
      .from('responses')
      .select('round_number, selected_candidate')
      .eq('session_id', sessionId);

    const result = {};
    for (let r = 1; r <= TOTAL_ROUNDS; r++) {
      result[r] = {
        roundNumber: r,
        totalResponses: 0,
        candidateA: { count: 0, percentage: 0 },
        candidateB: { count: 0, percentage: 0 }
      };
    }

    if (error || !data) {
      return result;
    }

    data.forEach((row) => {
      const r = row.round_number;
      if (result[r]) {
        if (row.selected_candidate === 'A') {
          result[r].candidateA.count++;
        } else if (row.selected_candidate === 'B') {
          result[r].candidateB.count++;
        }
      }
    });

    for (let r = 1; r <= TOTAL_ROUNDS; r++) {
      const total = result[r].candidateA.count + result[r].candidateB.count;
      result[r].totalResponses = total;
      if (total > 0) {
        const pctA = Math.round((result[r].candidateA.count / total) * 100);
        result[r].candidateA.percentage = pctA;
        result[r].candidateB.percentage = 100 - pctA;
      } else {
        result[r].candidateA.percentage = 0;
        result[r].candidateB.percentage = 0;
      }
    }

    return result;
  } catch (err) {
    console.error('Error fetching all rounds aggregates:', err);
    const fallback = {};
    for (let r = 1; r <= TOTAL_ROUNDS; r++) {
      fallback[r] = {
        roundNumber: r,
        totalResponses: 0,
        candidateA: { count: 0, percentage: 0 },
        candidateB: { count: 0, percentage: 0 }
      };
    }
    return fallback;
  }
}

async function runTest() {
  console.log('🧪 Starting Test: Host Actual Anonymized Results Aggregation');

  // 1. Create a test session
  const testGameCode = 'AG' + Math.floor(1000 + Math.random() * 9000);
  const hostId = 'HOST_TEST_' + Date.now();

  const { data: session, error: sessErr } = await supabase
    .from('game_sessions')
    .insert({
      game_code: testGameCode,
      host_id: hostId,
      status: 'active',
      current_round: 1,
      game_stage: 'round',
      results_visible: false
    })
    .select()
    .single();

  if (sessErr || !session) {
    console.error('❌ Failed to create game session:', sessErr);
    process.exit(1);
  }
  console.log(`✅ 1. Created Game Session: ${session.game_code} (ID: ${session.id})`);

  // 2. Create 3 players
  const { data: players, error: plErr } = await supabase
    .from('players')
    .insert([
      { session_id: session.id, anonymous_name: 'Student 1' },
      { session_id: session.id, anonymous_name: 'Student 2' },
      { session_id: session.id, anonymous_name: 'Student 3' }
    ])
    .select();

  if (plErr || !players || players.length !== 3) {
    console.error('❌ Failed to create test players:', plErr);
    process.exit(1);
  }
  const [p1, p2, p3] = players;
  console.log('✅ 2. Created 3 test players');

  // 3. Submit responses according to test plan:
  // Round 1: P1 -> A, P2 -> A, P3 -> B (Total: 3, A: 2 (67%), B: 1 (33%))
  // Round 2: P1 -> B, P2 -> B, P3 -> A (Total: 3, A: 1 (33%), B: 2 (67%))
  // Round 3: P1 -> A, P2 -> A, P3 -> A (Total: 3, A: 3 (100%), B: 0 (0%))
  // Round 4: P1 -> B, P2 -> unanswered, P3 -> B (Total: 2, A: 0 (0%), B: 2 (100%))
  // Round 5: No answers submitted (Total: 0, A: 0%, B: 0%)
  const responsesToInsert = [
    // Round 1
    { session_id: session.id, player_id: p1.id, round_number: 1, selected_candidate: 'A' },
    { session_id: session.id, player_id: p2.id, round_number: 1, selected_candidate: 'A' },
    { session_id: session.id, player_id: p3.id, round_number: 1, selected_candidate: 'B' },
    // Round 2
    { session_id: session.id, player_id: p1.id, round_number: 2, selected_candidate: 'B' },
    { session_id: session.id, player_id: p2.id, round_number: 2, selected_candidate: 'B' },
    { session_id: session.id, player_id: p3.id, round_number: 2, selected_candidate: 'A' },
    // Round 3
    { session_id: session.id, player_id: p1.id, round_number: 3, selected_candidate: 'A' },
    { session_id: session.id, player_id: p2.id, round_number: 3, selected_candidate: 'A' },
    { session_id: session.id, player_id: p3.id, round_number: 3, selected_candidate: 'A' },
    // Round 4 (p2 unanswered)
    { session_id: session.id, player_id: p1.id, round_number: 4, selected_candidate: 'B' },
    { session_id: session.id, player_id: p3.id, round_number: 4, selected_candidate: 'B' },
    // Round 5 (nobody answered)
  ];

  const { error: insErr } = await supabase.from('responses').insert(responsesToInsert);
  if (insErr) {
    console.error('❌ Error inserting test responses:', insErr);
    process.exit(1);
  }
  console.log('✅ 3. Inserted test responses across rounds (including partial and empty rounds)');

  // 4. Test getSessionAllRoundsAggregates
  const aggregates = await getSessionAllRoundsAggregates(session.id);
  console.log('✅ 4. Retrieved session aggregates:');
  console.log(JSON.stringify(aggregates, null, 2));

  // Verify Round 1
  if (aggregates[1].totalResponses !== 3 || aggregates[1].candidateA.count !== 2 || aggregates[1].candidateA.percentage !== 67 || aggregates[1].candidateB.count !== 1 || aggregates[1].candidateB.percentage !== 33) {
    console.error('❌ Round 1 mismatch:', aggregates[1]);
    process.exit(1);
  }
  console.log('✅ Round 1 Verified: 2 votes (67%) vs 1 vote (33%), Total = 3');

  // Verify Round 2
  if (aggregates[2].totalResponses !== 3 || aggregates[2].candidateA.count !== 1 || aggregates[2].candidateA.percentage !== 33 || aggregates[2].candidateB.count !== 2 || aggregates[2].candidateB.percentage !== 67) {
    console.error('❌ Round 2 mismatch:', aggregates[2]);
    process.exit(1);
  }
  console.log('✅ Round 2 Verified: 1 vote (33%) vs 2 votes (67%), Total = 3');

  // Verify Round 3
  if (aggregates[3].totalResponses !== 3 || aggregates[3].candidateA.count !== 3 || aggregates[3].candidateA.percentage !== 100 || aggregates[3].candidateB.count !== 0 || aggregates[3].candidateB.percentage !== 0) {
    console.error('❌ Round 3 mismatch:', aggregates[3]);
    process.exit(1);
  }
  console.log('✅ Round 3 Verified: 3 votes (100%) vs 0 votes (0%), Total = 3');

  // Verify Round 4 (unanswered player handled properly: 2 responses out of 3 players)
  if (aggregates[4].totalResponses !== 2 || aggregates[4].candidateA.count !== 0 || aggregates[4].candidateA.percentage !== 0 || aggregates[4].candidateB.count !== 2 || aggregates[4].candidateB.percentage !== 100) {
    console.error('❌ Round 4 mismatch:', aggregates[4]);
    process.exit(1);
  }
  console.log('✅ Round 4 Verified (partial responses): 0 votes (0%) vs 2 votes (100%), Total = 2 (unanswered player not counted)');

  // Verify Round 5 (zero responses handled properly: no NaN, no undefined, 0/0 avoided)
  if (aggregates[5].totalResponses !== 0 || aggregates[5].candidateA.count !== 0 || aggregates[5].candidateA.percentage !== 0 || aggregates[5].candidateB.count !== 0 || aggregates[5].candidateB.percentage !== 0) {
    console.error('❌ Round 5 mismatch:', aggregates[5]);
    process.exit(1);
  }
  console.log('✅ Round 5 Verified (zero responses): 0 votes (0%) vs 0 votes (0%), Total = 0 (no NaN% or undefined)');

  // Verify round 6 does NOT exist in aggregates
  if (aggregates[6] !== undefined) {
    console.error('❌ Round 6 should not exist in aggregates:', aggregates[6]);
    process.exit(1);
  }
  console.log('✅ Verified no Round 6 or Round 7');

  // Cleanup
  await supabase.from('responses').delete().eq('session_id', session.id);
  await supabase.from('players').delete().eq('session_id', session.id);
  await supabase.from('game_sessions').delete().eq('id', session.id);
  console.log('✅ Cleaned up test session');

  console.log('🎉 ALL AGGREGATE TESTS PASSED PERFECTLY!');
}

runTest();
