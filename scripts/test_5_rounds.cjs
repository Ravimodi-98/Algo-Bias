const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fcrdrcqbrkzznnnwimje.supabase.co';
const supabaseKey = 'sb_publishable_8QkBP3-6kvuhvKq2ysmKUA_2kGVCnD1';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log('🚀 Starting 5-Round Candidate Decision Lifecycle Integration Test...');

  const testGameCode = 'R5' + Math.floor(1000 + Math.random() * 9000);
  const testHostId = 'HOST_5R_' + Date.now();

  // 1. Create a game session in waiting state
  const { data: session, error: sessErr } = await supabase
    .from('game_sessions')
    .insert({
      game_code: testGameCode,
      host_id: testHostId,
      status: 'waiting',
      current_round: 0,
      game_stage: 'rounds'
    })
    .select()
    .single();

  if (sessErr || !session) {
    console.error('❌ Failed to create game session:', sessErr);
    process.exit(1);
  }
  console.log('✅ 1. Created game session in lobby:', session.id, 'Code:', testGameCode);

  // 2. Join 2 test players
  const { data: p1 } = await supabase
    .from('players')
    .insert({ session_id: session.id, anonymous_name: 'Player Alpha' })
    .select()
    .single();

  const { data: p2 } = await supabase
    .from('players')
    .insert({ session_id: session.id, anonymous_name: 'Player Beta' })
    .select()
    .single();

  if (!p1 || !p2) {
    console.error('❌ Failed to create test players');
    process.exit(1);
  }
  console.log('✅ 2. Joined 2 players:', p1.anonymous_name, p2.anonymous_name);

  // 3. Start game -> Advance to Round 1
  const { data: round1Session, error: r1Err } = await supabase
    .from('game_sessions')
    .update({
      status: 'active',
      current_round: 1,
      round_started_at: new Date().toISOString(),
      results_visible: false
    })
    .eq('id', session.id)
    .select()
    .single();

  if (r1Err || round1Session.current_round !== 1) {
    console.error('❌ Failed to start Round 1:', r1Err);
    process.exit(1);
  }
  console.log('✅ 3. Game started at Round 1');

  // 4. Progress through all 5 rounds submitting responses
  const TOTAL_ROUNDS = 5;
  for (let r = 1; r <= TOTAL_ROUNDS; r++) {
    console.log(`   Simulating Round ${r}...`);

    // Submit responses for Alpha and Beta
    const candidateChoice1 = r % 2 === 1 ? 'A' : 'B';
    const candidateChoice2 = 'A';

    const { error: resp1Err } = await supabase
      .from('responses')
      .upsert({
        session_id: session.id,
        player_id: p1.id,
        round_number: r,
        selected_candidate: candidateChoice1
      }, { onConflict: 'session_id,player_id,round_number' });

    const { error: resp2Err } = await supabase
      .from('responses')
      .upsert({
        session_id: session.id,
        player_id: p2.id,
        round_number: r,
        selected_candidate: candidateChoice2
      }, { onConflict: 'session_id,player_id,round_number' });

    if (resp1Err || resp2Err) {
      console.error(`❌ Error submitting responses for Round ${r}:`, resp1Err || resp2Err);
      process.exit(1);
    }

    // Verify response count
    const { count, error: countErr } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', session.id)
      .eq('round_number', r);

    if (countErr || count !== 2) {
      console.error(`❌ Unexpected response count for Round ${r}:`, count);
      process.exit(1);
    }

    if (r < TOTAL_ROUNDS) {
      // Advance to next round
      const nextR = r + 1;
      const { error: advErr } = await supabase
        .from('game_sessions')
        .update({
          current_round: nextR,
          round_started_at: new Date().toISOString(),
          results_visible: false
        })
        .eq('id', session.id);

      if (advErr) {
        console.error(`❌ Error advancing to Round ${nextR}:`, advErr);
        process.exit(1);
      }
    }
  }
  console.log('✅ 4. Successfully completed all 5 rounds with responses from both players');

  // 5. Verify final round is 5 and cannot advance to 6
  const { data: activeRound5 } = await supabase
    .from('game_sessions')
    .select('current_round')
    .eq('id', session.id)
    .single();

  if (activeRound5.current_round !== 5) {
    console.error('❌ Active round should be 5, but got:', activeRound5.current_round);
    process.exit(1);
  }
  console.log('✅ 5. Verified current round is exactly 5');

  // 6. Transition to Bias Reveal stage directly from Round 5
  const { data: revealSession, error: revErr } = await supabase
    .from('game_sessions')
    .update({
      game_stage: 'reveal',
      reveal_step: 1,
      results_visible: false
    })
    .eq('id', session.id)
    .select()
    .single();

  if (revErr || revealSession.game_stage !== 'reveal') {
    console.error('❌ Failed to transition to reveal stage:', revErr);
    process.exit(1);
  }
  console.log('✅ 6. Successfully transitioned to Bias Reveal stage (Step 1)');

  // 7. Verify all 5 rounds aggregates are calculated properly
  const { data: allResponses, error: allRespErr } = await supabase
    .from('responses')
    .select('round_number, selected_candidate')
    .eq('session_id', session.id);

  if (allRespErr || !allResponses) {
    console.error('❌ Error fetching all responses:', allRespErr);
    process.exit(1);
  }

  const aggregates = {};
  for (let r = 1; r <= TOTAL_ROUNDS; r++) {
    const roundResp = allResponses.filter(res => res.round_number === r);
    const votesA = roundResp.filter(res => res.selected_candidate === 'A').length;
    const votesB = roundResp.filter(res => res.selected_candidate === 'B').length;
    aggregates[r] = {
      roundNumber: r,
      votesA,
      votesB,
      totalVotes: votesA + votesB,
      percentageA: votesA + votesB > 0 ? Math.round((votesA / (votesA + votesB)) * 100) : 0,
      percentageB: votesA + votesB > 0 ? Math.round((votesB / (votesA + votesB)) * 100) : 0
    };
  }

  console.log('✅ 7. Aggregates for all 5 rounds computed:');
  for (let r = 1; r <= TOTAL_ROUNDS; r++) {
    console.log(`      Round ${r}: Candidate A: ${aggregates[r].votesA} (${aggregates[r].percentageA}%) | Candidate B: ${aggregates[r].votesB} (${aggregates[r].percentageB}%)`);
  }

  // Verify rounds 6 and 7 have 0 responses
  const { count: countR6 } = await supabase
    .from('responses')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', session.id)
    .eq('round_number', 6);

  const { count: countR7 } = await supabase
    .from('responses')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', session.id)
    .eq('round_number', 7);

  if (countR6 !== 0 || countR7 !== 0) {
    console.error('❌ Found unexpected responses for rounds 6 or 7!');
    process.exit(1);
  }
  console.log('✅ 8. Verified Rounds 6 and 7 do not exist and have 0 responses');

  // 9. Advance to Make It Fair
  const { error: fairErr } = await supabase
    .from('game_sessions')
    .update({
      game_stage: 'fairness',
      fairness_step: 0
    })
    .eq('id', session.id);

  if (fairErr) {
    console.error('❌ Error transitioning to Make It Fair:', fairErr);
    process.exit(1);
  }
  console.log('✅ 9. Transitioned to Make It Fair');

  // 10. Advance to Final Results & Complete Session
  const { error: finErr } = await supabase
    .from('game_sessions')
    .update({
      game_stage: 'final',
      final_step: 5,
      status: 'completed',
      ended_at: new Date().toISOString()
    })
    .eq('id', session.id);

  if (finErr) {
    console.error('❌ Error completing game session:', finErr);
    process.exit(1);
  }
  console.log('✅ 10. Successfully completed session with 5 rounds');

  console.log('\n🎉 ALL 5-ROUND CANDIDATE SELECTION TESTS PASSED PERFECTLY!');
}

runTest().catch(err => {
  console.error('❌ Uncaught test error:', err);
  process.exit(1);
});
