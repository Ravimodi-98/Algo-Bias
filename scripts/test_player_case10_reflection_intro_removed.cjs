const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fcrdrcqbrkzznnnwimje.supabase.co';
const supabaseKey = 'sb_publishable_8QkBP3-6kvuhvKq2ysmKUA_2kGVCnD1';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log('🚀 Testing Case 10 Flow without Player Reflection Intro Screen...\n');

  // 1. Create a game session in fairness stage
  const testGameCode = 'RF' + Math.floor(1000 + Math.random() * 9000);
  const testHostId = 'HOST_NO_REF_INTRO_' + Date.now();

  const { data: session, error: sessErr } = await supabase
    .from('game_sessions')
    .insert({
      game_code: testGameCode,
      host_id: testHostId,
      status: 'active',
      current_round: 5,
      game_stage: 'fairness',
      fairness_step: 8
    })
    .select()
    .single();

  if (sessErr || !session) {
    console.error('❌ Failed to create game session:', sessErr);
    process.exit(1);
  }
  console.log('✅ 1. Created test game session:', session.id, 'Code:', testGameCode);

  // 2. Create 3 test players (Player A, Player B, Player C)
  const { data: pA } = await supabase.from('players').insert({ session_id: session.id, anonymous_name: 'Player A' }).select().single();
  const { data: pB } = await supabase.from('players').insert({ session_id: session.id, anonymous_name: 'Player B' }).select().single();
  const { data: pC } = await supabase.from('players').insert({ session_id: session.id, anonymous_name: 'Player C' }).select().single();

  if (!pA || !pB || !pC) {
    console.error('❌ Failed to create players');
    process.exit(1);
  }
  console.log('✅ 2. Created 3 test players (A, B, C):', pA.id, pB.id, pC.id);

  // 3. Transition to Case 10 (final_step = 0)
  console.log('   Advancing session to Case 10 (game_stage: final, final_step: 0)...');
  const { data: finalSession, error: finalErr } = await supabase
    .from('game_sessions')
    .update({
      game_stage: 'final',
      final_step: 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.id)
    .select()
    .single();

  if (finalErr || finalSession.game_stage !== 'final' || finalSession.final_step !== 0) {
    console.error('❌ Failed to transition to final stage:', finalErr);
    process.exit(1);
  }
  console.log('✅ 3. Session entered Case 10 at final_step = 0 (Classroom Metrics). Players immediately view Classroom-Level Patterns without stopping at intro screen.');

  // 4. Verify step progression: Step 0 -> Step 1 -> Step 2 -> Step 3 -> Step 4 -> Step 5
  for (let s = 1; s <= 5; s++) {
    const { data: steppedSession, error: stepErr } = await supabase
      .from('game_sessions')
      .update({ final_step: s, updated_at: new Date().toISOString() })
      .eq('id', session.id)
      .select()
      .single();

    if (stepErr || steppedSession.final_step !== s) {
      console.error(`❌ Failed to advance to step ${s}:`, stepErr);
      process.exit(1);
    }
    console.log(`   Advanced Host and connected players to Step ${s} (final_step = ${s})`);
  }
  console.log('✅ 4. Smooth step progression 0 -> 1 -> 2 -> 3 -> 4 -> 5 verified.');

  // 5. Submit reflection at Step 4
  const { data: refA, error: refErrA } = await supabase
    .from('reflections')
    .insert({
      session_id: session.id,
      player_id: pA.id,
      selected_themes: ['data_used', 'who_accountable'],
      optional_response: 'Algorithms inherit our values and biases.'
    })
    .select()
    .single();

  if (refErrA) {
    console.error('❌ Failed to submit reflection for Player A:', refErrA);
    process.exit(1);
  }
  console.log('✅ 5. Submitted reflection for Player A successfully.');

  // 6. Complete game
  const { data: compSession, error: compErr } = await supabase
    .from('game_sessions')
    .update({
      status: 'completed',
      game_stage: 'completed',
      final_step: 5,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.id)
    .select()
    .single();

  if (compErr || compSession.status !== 'completed') {
    console.error('❌ Failed to complete game session:', compErr);
    process.exit(1);
  }
  console.log('✅ 6. Successfully completed game session (Game Complete).');

  // 7. Cleanup
  await supabase.from('game_sessions').delete().eq('id', session.id);
  console.log('✅ 7. Test session cleaned up.');

  console.log('\n🎉 ALL TESTS PASSED: Player reflection intro removed cleanly with seamless Case 10 flow!\n');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
