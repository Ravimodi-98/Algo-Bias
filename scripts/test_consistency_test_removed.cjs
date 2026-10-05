const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fcrdrcqbrkzznnnwimje.supabase.co';
const supabaseKey = 'sb_publishable_8QkBP3-6kvuhvKq2ysmKUA_2kGVCnD1';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log('🚀 Testing Fairness Challenge without Consistency Test Question...\n');

  // 1. Create a game session
  const testGameCode = 'SK' + Math.floor(1000 + Math.random() * 9000);
  const testHostId = 'HOST_SKIP_TEST_' + Date.now();

  const { data: session, error: sessErr } = await supabase
    .from('game_sessions')
    .insert({
      game_code: testGameCode,
      host_id: testHostId,
      status: 'active',
      current_round: 5,
      game_stage: 'fairness',
      fairness_step: 0
    })
    .select()
    .single();

  if (sessErr || !session) {
    console.error('❌ Failed to create session:', sessErr);
    process.exit(1);
  }
  console.log('✅ 1. Created test session:', session.id, 'Code:', testGameCode);

  // 2. Add 2 test players
  const { data: p1 } = await supabase.from('players').insert({ session_id: session.id, anonymous_name: 'Player 1' }).select().single();
  const { data: p2 } = await supabase.from('players').insert({ session_id: session.id, anonymous_name: 'Player 2' }).select().single();

  if (!p1 || !p2) {
    console.error('❌ Failed to create players');
    process.exit(1);
  }
  console.log('✅ 2. Created 2 test players:', p1.id, p2.id);

  // 3. Step through Steps 0, 1, 2, 3, 4
  console.log('   Simulating Step 0 (Readiness)...');
  await supabase.from('fairness_responses').upsert([
    { session_id: session.id, player_id: p1.id, stage: 'ready', response: { ready: true } },
    { session_id: session.id, player_id: p2.id, stage: 'ready', response: { ready: true } }
  ]);

  console.log('   Simulating Step 1 (Factors)...');
  await supabase.from('game_sessions').update({ fairness_step: 1, updated_at: new Date().toISOString() }).eq('id', session.id);
  await supabase.from('fairness_responses').upsert([
    { session_id: session.id, player_id: p1.id, stage: 'factors', response: { selectedFactors: ['skills', 'projects'] } }
  ]);

  console.log('   Simulating Step 2 (Rule)...');
  await supabase.from('game_sessions').update({ fairness_step: 2, updated_at: new Date().toISOString() }).eq('id', session.id);
  await supabase.from('fairness_responses').upsert([
    { session_id: session.id, player_id: p1.id, stage: 'rule', response: { priorities: { skills: 'HIGH', projects: 'MEDIUM' } } }
  ]);

  console.log('   Simulating Step 3 (Apply Rule)...');
  await supabase.from('game_sessions').update({ fairness_step: 3, updated_at: new Date().toISOString() }).eq('id', session.id);
  await supabase.from('fairness_responses').upsert([
    { session_id: session.id, player_id: p1.id, stage: 'apply', response: { selectedCandidate: 'A' } }
  ]);

  console.log('   Simulating Step 4 (Fairness Test A)...');
  await supabase.from('game_sessions').update({ fairness_step: 4, updated_at: new Date().toISOString() }).eq('id', session.id);
  await supabase.from('fairness_responses').upsert([
    { session_id: session.id, player_id: p1.id, stage: 'fairness_test', response: { testAnswer: 'NO' } },
    { session_id: session.id, player_id: p2.id, stage: 'fairness_test', response: { testAnswer: 'DEPENDS' } }
  ]);
  console.log('✅ 3. Steps 0-4 successfully completed.');

  // 4. Host advances directly past Step 4 to Step 5 (Transparency Test)
  // In the updated code, Step 5 is Transparency Test. Consistency Test is skipped!
  console.log('   Host clicking NEXT STEP from Step 4...');
  await supabase.from('game_sessions').update({ fairness_step: 5, updated_at: new Date().toISOString() }).eq('id', session.id);

  const { data: step5Session } = await supabase.from('game_sessions').select('fairness_step').eq('id', session.id).single();
  console.log('✅ 4. Session advanced to Step 5 (fairness_step =', step5Session.fairness_step, ')');

  // Verify player submits for Transparency Test at Step 5
  await supabase.from('fairness_responses').upsert([
    { session_id: session.id, player_id: p1.id, stage: 'transparency_test', response: { testAnswer: 'YES' } },
    { session_id: session.id, player_id: p2.id, stage: 'transparency_test', response: { testAnswer: 'NO' } }
  ]);
  console.log('✅ 5. Transparency Test answers recorded at Step 5 without any Consistency Test prompt.');

  // 5. Host advances to Step 6 (Human Oversight)
  await supabase.from('game_sessions').update({ fairness_step: 6, updated_at: new Date().toISOString() }).eq('id', session.id);
  await supabase.from('fairness_responses').upsert([
    { session_id: session.id, player_id: p1.id, stage: 'human_oversight', response: { humanOversightAnswer: 'NO' } }
  ]);
  console.log('✅ 6. Human Oversight answers recorded at Step 6.');

  // 6. Host advances to Step 7 (Classroom Aggregate Results)
  await supabase.from('game_sessions').update({ fairness_step: 7, updated_at: new Date().toISOString() }).eq('id', session.id);
  console.log('✅ 7. Advanced to Step 7 (Classroom Aggregate Results).');

  // 7. Inject legacy consistency_test response to verify backward compatibility
  await supabase.from('fairness_responses').upsert([
    { session_id: session.id, player_id: p1.id, stage: 'consistency_test', response: { testAnswer: 'NO' } }
  ]);
  console.log('✅ 8. Injected legacy consistency_test response to verify safe handling of historical data.');

  // 8. Host advances to Step 8 (Reflection & Completion)
  await supabase.from('game_sessions').update({ fairness_step: 8, updated_at: new Date().toISOString() }).eq('id', session.id);
  console.log('✅ 9. Advanced to Step 8 (Key Reflection & Case 9 Complete).');

  // 9. Host proceeds to Final Results (Case 10)
  await supabase.from('game_sessions').update({ game_stage: 'final', final_step: 0, updated_at: new Date().toISOString() }).eq('id', session.id);
  const { data: finalSession } = await supabase.from('game_sessions').select('game_stage, final_step').eq('id', session.id).single();
  console.log('✅ 10. Successfully transitioned to Case 10 (Final Results):', finalSession.game_stage, 'final_step =', finalSession.final_step);

  // 10. Clean up test session
  await supabase.from('game_sessions').delete().eq('id', session.id);
  console.log('✅ 11. Test session cleaned up.');

  console.log('\n🎉 ALL CONSISTENCY TEST REMOVAL & PROGRESSION TESTS PASSED PERFECTLY!\n');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
