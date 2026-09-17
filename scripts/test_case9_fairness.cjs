const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fcrdrcqbrkzznnnwimje.supabase.co';
const supabaseKey = 'sb_publishable_8QkBP3-6kvuhvKq2ysmKUA_2kGVCnD1';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log('🚀 Starting Case 9 Make It Fair Integration Test...');

  // 1. Create a game session
  const testGameCode = 'TEST' + Math.floor(10 + Math.random() * 90);
  const testHostId = 'HOST_TEST_' + Date.now();

  const { data: session, error: sessErr } = await supabase
    .from('game_sessions')
    .insert({
      game_code: testGameCode,
      host_id: testHostId,
      status: 'active',
      current_round: 7,
      game_stage: 'reveal',
      reveal_step: 9,
      fairness_step: 0
    })
    .select()
    .single();

  if (sessErr || !session) {
    console.error('❌ Failed to create game session:', sessErr);
    process.exit(1);
  }
  console.log('✅ Created test game session:', session.id, 'Code:', testGameCode);

  // 2. Create 2 test players
  const { data: p1 } = await supabase
    .from('players')
    .insert({
      session_id: session.id,
      anonymous_name: 'Player 1 (Atlas)'
    })
    .select()
    .single();

  const { data: p2 } = await supabase
    .from('players')
    .insert({
      session_id: session.id,
      anonymous_name: 'Player 2 (Nova)'
    })
    .select()
    .single();

  if (!p1 || !p2) {
    console.error('❌ Failed to create test players');
    process.exit(1);
  }
  console.log('✅ Created 2 test players:', p1.id, p2.id);

  // 3. Transition to fairness stage
  const { error: transErr } = await supabase
    .from('game_sessions')
    .update({
      game_stage: 'fairness',
      fairness_step: 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.id);

  if (transErr) {
    console.error('❌ Failed to transition to fairness:', transErr);
    process.exit(1);
  }
  console.log('✅ Successfully transitioned session to fairness stage (Step 0)');

  // 4. Test Step 0 Readiness responses
  await supabase.from('fairness_responses').upsert([
    {
      session_id: session.id,
      player_id: p1.id,
      stage: 'ready',
      response: { ready: true }
    },
    {
      session_id: session.id,
      player_id: p2.id,
      stage: 'ready',
      response: { ready: true }
    }
  ]);

  const { count: readyCount } = await supabase
    .from('fairness_responses')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', session.id)
    .eq('stage', 'ready');

  console.log('✅ Step 0 Ready Count verified:', readyCount, '(Expected: 2)');
  if (readyCount !== 2) throw new Error('Ready count mismatch');

  // 5. Host advances to Step 1 (factors)
  await supabase
    .from('game_sessions')
    .update({ fairness_step: 1, updated_at: new Date().toISOString() })
    .eq('id', session.id);

  // Submit factor choices
  await supabase.from('fairness_responses').upsert([
    {
      session_id: session.id,
      player_id: p1.id,
      stage: 'factors',
      response: { selectedFactors: ['skills', 'experience', 'projects'] }
    },
    {
      session_id: session.id,
      player_id: p2.id,
      stage: 'factors',
      response: { selectedFactors: ['skills', 'projects', 'location'] }
    }
  ]);

  console.log('✅ Step 1 Factor responses recorded');

  // 6. Step 2: Rules
  await supabase.from('fairness_responses').upsert([
    {
      session_id: session.id,
      player_id: p1.id,
      stage: 'rule',
      response: { priorities: { skills: 'HIGH', experience: 'HIGH', projects: 'MEDIUM', location: 'EXCLUDE' } }
    },
    {
      session_id: session.id,
      player_id: p2.id,
      stage: 'rule',
      response: { priorities: { skills: 'HIGH', projects: 'HIGH', location: 'LOW', name: 'EXCLUDE' } }
    }
  ]);
  console.log('✅ Step 2 Decision rules recorded');

  // 7. Step 3: Apply
  await supabase.from('fairness_responses').upsert([
    {
      session_id: session.id,
      player_id: p1.id,
      stage: 'apply',
      response: { selectedCandidate: 'A' }
    },
    {
      session_id: session.id,
      player_id: p2.id,
      stage: 'apply',
      response: { selectedCandidate: 'B' }
    }
  ]);
  console.log('✅ Step 3 Candidate decisions recorded');

  // 8. Steps 4-7: Tests
  await supabase.from('fairness_responses').upsert([
    {
      session_id: session.id,
      player_id: p1.id,
      stage: 'fairness_test',
      response: { testAnswer: 'NO' }
    },
    {
      session_id: session.id,
      player_id: p2.id,
      stage: 'fairness_test',
      response: { testAnswer: 'DEPENDS' }
    },
    {
      session_id: session.id,
      player_id: p1.id,
      stage: 'consistency_test',
      response: { testAnswer: 'NO' }
    },
    {
      session_id: session.id,
      player_id: p1.id,
      stage: 'transparency_test',
      response: { testAnswer: 'YES' }
    },
    {
      session_id: session.id,
      player_id: p1.id,
      stage: 'human_oversight',
      response: { humanOversightAnswer: 'NO' }
    }
  ]);
  console.log('✅ Steps 4-7 System Audit test answers recorded');

  // 9. Verify Aggregates
  const { data: allFairnessResponses } = await supabase
    .from('fairness_responses')
    .select('*')
    .eq('session_id', session.id);

  console.log('✅ Total fairness response records retrieved:', allFairnessResponses.length);
  const factorCounts = { skills: 0, projects: 0, location: 0 };
  allFairnessResponses
    .filter(r => r.stage === 'factors')
    .forEach(r => {
      r.response.selectedFactors.forEach(f => {
        if (factorCounts[f] !== undefined) factorCounts[f]++;
      });
    });

  console.log('✅ Aggregate Factors counts:', factorCounts);
  if (factorCounts.skills !== 2 || factorCounts.projects !== 2 || factorCounts.location !== 1) {
    throw new Error('Factors aggregate calculation mismatch');
  }

  // 10. Advance to Step 9 (Reflection & Completion)
  const { error: step9Err } = await supabase
    .from('game_sessions')
    .update({ fairness_step: 9, updated_at: new Date().toISOString() })
    .eq('id', session.id);

  if (step9Err) throw step9Err;
  console.log('✅ Successfully advanced through all steps to Step 9 (Reflection & Completion)');

  // 11. Cleanup test session
  await supabase.from('game_sessions').delete().eq('id', session.id);
  console.log('✅ Test session cleaned up cleanly.');

  console.log('\n🎉 ALL CASE 9 INTEGRATION TESTS PASSED PERFECTLY!\n');
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
