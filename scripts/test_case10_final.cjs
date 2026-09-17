const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fcrdrcqbrkzznnnwimje.supabase.co';
const supabaseKey = 'sb_publishable_8QkBP3-6kvuhvKq2ysmKUA_2kGVCnD1';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log('🚀 Starting Case 10 Final Results + Reflection Integration Test...');

  // 1. Create a game session in 'fairness' stage (step 9)
  const testGameCode = 'FN' + Math.floor(1000 + Math.random() * 9000);
  const testHostId = 'HOST_FINAL_' + Date.now();

  const { data: session, error: sessErr } = await supabase
    .from('game_sessions')
    .insert({
      game_code: testGameCode,
      host_id: testHostId,
      status: 'active',
      current_round: 7,
      game_stage: 'fairness',
      reveal_step: 9,
      fairness_step: 9,
      final_step: 0
    })
    .select()
    .single();

  if (sessErr || !session) {
    console.error('❌ Failed to create game session:', sessErr);
    process.exit(1);
  }
  console.log('✅ 1. Created test game session in fairness stage:', session.id, 'Code:', testGameCode);

  // 2. Create 2 test players
  const { data: p1 } = await supabase
    .from('players')
    .insert({
      session_id: session.id,
      anonymous_name: 'Player 1 (Echo)'
    })
    .select()
    .single();

  const { data: p2 } = await supabase
    .from('players')
    .insert({
      session_id: session.id,
      anonymous_name: 'Player 2 (Vega)'
    })
    .select()
    .single();

  if (!p1 || !p2) {
    console.error('❌ Failed to create test players');
    process.exit(1);
  }
  console.log('✅ 2. Created 2 test players:', p1.anonymous_name, p2.anonymous_name);

  // 3. Transition from fairness to final stage (Case 10 start)
  const { data: transSession, error: transErr } = await supabase
    .from('game_sessions')
    .update({
      game_stage: 'final',
      final_step: 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.id)
    .select()
    .single();

  if (transErr || transSession.game_stage !== 'final') {
    console.error('❌ Failed to transition to final stage:', transErr);
    process.exit(1);
  }
  console.log('✅ 3. Transitioned session to final stage. game_stage =', transSession.game_stage, 'final_step =', transSession.final_step);

  // 4. Test final_step progression (0 -> 1 -> 2 -> 3 -> 4 -> 5)
  for (let s = 1; s <= 5; s++) {
    const { data: stepSession, error: stepErr } = await supabase
      .from('game_sessions')
      .update({
        final_step: s,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.id)
      .select()
      .single();

    if (stepErr || stepSession.final_step !== s) {
      console.error(`❌ Failed to advance to final step ${s}:`, stepErr);
      process.exit(1);
    }
  }
  console.log('✅ 4. Stepped through final_step 0 -> 1 -> 2 -> 3 -> 4 -> 5 successfully.');

  // 5. Submit reflections from both players
  const p1Themes = ['data_used', 'who_accountable'];
  const p1Thought = 'An algorithm only mirrors what we feed it. We are responsible.';
  const { error: refErr1 } = await supabase
    .from('reflections')
    .upsert({
      session_id: session.id,
      player_id: p1.id,
      selected_themes: p1Themes,
      optional_response: p1Thought,
      submitted_at: new Date().toISOString()
    }, { onConflict: 'session_id,player_id' });

  if (refErr1) {
    console.error('❌ Failed to submit p1 reflection:', refErr1);
    process.exit(1);
  }

  const p2Themes = ['system_tested', 'info_matters'];
  const p2Thought = 'Testing must happen across diverse groups before deployment.';
  const { error: refErr2 } = await supabase
    .from('reflections')
    .upsert({
      session_id: session.id,
      player_id: p2.id,
      selected_themes: p2Themes,
      optional_response: p2Thought,
      submitted_at: new Date().toISOString()
    }, { onConflict: 'session_id,player_id' });

  if (refErr2) {
    console.error('❌ Failed to submit p2 reflection:', refErr2);
    process.exit(1);
  }
  console.log('✅ 5. Submitted reflections from Player 1 and Player 2.');

  // 6. Test duplicate submission protection (Player 1 updating reflection)
  const p1UpdatedThemes = ['data_used', 'who_accountable', 'decision_explained'];
  const { error: updateErr } = await supabase
    .from('reflections')
    .upsert({
      session_id: session.id,
      player_id: p1.id,
      selected_themes: p1UpdatedThemes,
      optional_response: p1Thought,
      submitted_at: new Date().toISOString()
    }, { onConflict: 'session_id,player_id' });

  if (updateErr) {
    console.error('❌ Failed to update p1 reflection with upsert:', updateErr);
    process.exit(1);
  }
  console.log('✅ 6. Verified idempotent reflection upsert for reconnect/reload resiliency.');

  // 7. Test getPlayerReflection
  const { data: p1Reflection, error: p1FetchErr } = await supabase
    .from('reflections')
    .select('*')
    .eq('session_id', session.id)
    .eq('player_id', p1.id)
    .single();

  if (p1FetchErr || !p1Reflection || p1Reflection.selected_themes.length !== 3) {
    console.error('❌ Failed to retrieve p1 reflection:', p1FetchErr);
    process.exit(1);
  }
  console.log('✅ 7. Retrieved player reflection:', p1Reflection.selected_themes, p1Reflection.optional_response);

  // 8. Test aggregate calculation
  const { data: allReflections, error: allErr } = await supabase
    .from('reflections')
    .select('selected_themes, optional_response')
    .eq('session_id', session.id);

  if (allErr || !allReflections || allReflections.length !== 2) {
    console.error('❌ Aggregate fetch failed:', allErr);
    process.exit(1);
  }

  const themeCounts = {};
  allReflections.forEach((r) => {
    r.selected_themes.forEach((t) => {
      themeCounts[t] = (themeCounts[t] || 0) + 1;
    });
  });

  console.log('✅ 8. Aggregate reflection count:', allReflections.length, 'Themes distribution:', themeCounts);

  // 9. Complete game session (END GAME)
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
    console.error('❌ Failed to complete game session:', compErr);
    process.exit(1);
  }
  console.log('✅ 9. Concluded game session gracefully: status =', completedSession.status, 'game_stage =', completedSession.game_stage);

  // 10. Clean up test data
  await supabase.from('reflections').delete().eq('session_id', session.id);
  await supabase.from('players').delete().eq('session_id', session.id);
  await supabase.from('game_sessions').delete().eq('id', session.id);
  console.log('🧹 10. Cleaned up test session, players, and reflections from database.');

  console.log('\n🎉 ALL CASE 10 INTEGRATION TESTS PASSED SUCCESSFULLY!');
}

runTest().catch((err) => {
  console.error('Fatal error running test:', err);
  process.exit(1);
});
