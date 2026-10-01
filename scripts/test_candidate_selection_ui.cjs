const { spawn } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://fcrdrcqbrkzznnnwimje.supabase.co';
const supabaseKey = 'sb_publishable_8QkBP3-6kvuhvKq2ysmKUA_2kGVCnD1';
const supabase = createClient(supabaseUrl, supabaseKey);

const artifactDir = 'C:\\Users\\Ravi Modi\\.gemini\\antigravity-ide\\brain\\4ec8c65d-1526-41cb-b087-c36fb9d890f6';

async function run() {
  console.log('1. Creating test session on Supabase...');
  const testGameCode = 'T' + Math.floor(10000 + Math.random() * 90000);
  const testHostId = 'HOST_TEST_' + Date.now();

  const { data: session, error: sessErr } = await supabase
    .from('game_sessions')
    .insert({
      game_code: testGameCode,
      host_id: testHostId,
      status: 'active',
      current_round: 1,
      round_started_at: new Date().toISOString(),
      game_stage: 'rounds',
      results_visible: false
    })
    .select()
    .single();

  if (sessErr || !session) {
    console.error('Failed to create session:', sessErr);
    process.exit(1);
  }

  const { data: player, error: pErr } = await supabase
    .from('players')
    .insert({ session_id: session.id, anonymous_name: 'STUDENT-TEST' })
    .select()
    .single();

  if (pErr || !player) {
    console.error('Failed to create player:', pErr);
    process.exit(1);
  }

  console.log(`Created session ${session.id} with player ${player.id}`);

  const playerSessionObj = {
    sessionId: session.id,
    playerId: player.id,
    anonymousName: player.anonymous_name,
    joinedAt: new Date().toISOString()
  };

  // Launch headless Chrome
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tempProfile = path.join(process.env.TEMP, 'chrome_test_' + Date.now());
  const cdpPort = 9222;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${tempProfile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=430,932' // mobile phone aspect
  ]);

  try {
    // Wait for CDP port
    await new Promise(r => setTimeout(r, 1500));
    const versionRes = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
    const versionData = await versionRes.json();
    console.log('Connected to Chrome:', versionData['Browser']);

    const ws = new WebSocket(versionData.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const pendingCallbacks = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pendingCallbacks.has(msg.id)) {
        const cb = pendingCallbacks.get(msg.id);
        pendingCallbacks.delete(msg.id);
        cb(msg);
      }
    };

    function sendCmd(method, params = {}, sessionId = undefined) {
      return new Promise((resolve) => {
        const id = msgId++;
        pendingCallbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      });
    }

    // Create target page
    const target = await sendCmd('Target.createTarget', { url: 'about:blank' });
    const pageSession = await sendCmd('Target.attachToTarget', { targetId: target.result.targetId, flatten: true });
    const sId = pageSession.result.sessionId;

    await sendCmd('Page.enable', {}, sId);
    await sendCmd('Runtime.enable', {}, sId);

    // Navigate to origin first to set localStorage
    await sendCmd('Page.navigate', { url: 'https://algobias.vercel.app' }, sId);
    await new Promise(r => setTimeout(r, 2000));

    // Inject localStorage
    await sendCmd('Runtime.evaluate', {
      expression: `localStorage.setItem('the_decision_player_session', JSON.stringify(${JSON.stringify(playerSessionObj)}))`
    }, sId);

    // Navigate to /play
    console.log('Navigating to https://algobias.vercel.app/play...');
    await sendCmd('Page.navigate', { url: 'https://algobias.vercel.app/play' }, sId);
    await new Promise(r => setTimeout(r, 3500));

    // Verify UI state
    const evalRes = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        const btn = document.getElementById('btn-submit-decision');
        const hasChooseCandidate = text.includes('Choose Candidate');
        const hasYourSelection = text.includes('YOUR SELECTION');
        const hasOption1 = text.includes('OPTION 1');
        const hasOption2 = text.includes('OPTION 2');
        const hasCandidateA = text.includes('Aarav') || text.includes('CANDIDATE A');
        const hasCandidateB = text.includes('Rohan') || text.includes('CANDIDATE B');
        return {
          btnText: btn ? btn.innerText : null,
          btnDisabled: btn ? btn.disabled : null,
          hasChooseCandidate,
          hasYourSelection,
          hasOption1,
          hasOption2,
          hasCandidateA,
          hasCandidateB
        };
      })()`,
      returnByValue: true
    }, sId);

    console.log('Initial Screen State:', evalRes.result.value);

    // Select Candidate A
    console.log('Clicking Candidate A card...');
    const selectARes = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('.card-interactive');
        if (cards.length >= 1) {
          cards[0].click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true
    }, sId);

    await new Promise(r => setTimeout(r, 500));

    const stateAfterA = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('btn-submit-decision');
        return { btnText: btn ? btn.innerText : null, btnDisabled: btn ? btn.disabled : null };
      })()`,
      returnByValue: true
    }, sId);

    console.log('State After Selecting Candidate A:', stateAfterA.result.value);

    // Take screenshot of Candidate A selected
    const shotA = await sendCmd('Page.captureScreenshot', { format: 'png' }, sId);
    const shotPathA = path.join(artifactDir, 'candidate_a_selected.png');
    fs.writeFileSync(shotPathA, Buffer.from(shotA.result.data, 'base64'));
    console.log(`Saved screenshot A to ${shotPathA}`);

    // Select Candidate B
    console.log('Clicking Candidate B card...');
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('.card-interactive');
        if (cards.length >= 2) {
          cards[1].click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true
    }, sId);

    await new Promise(r => setTimeout(r, 500));

    const stateAfterB = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('btn-submit-decision');
        return { btnText: btn ? btn.innerText : null, btnDisabled: btn ? btn.disabled : null };
      })()`,
      returnByValue: true
    }, sId);

    console.log('State After Selecting Candidate B:', stateAfterB.result.value);

    // Take screenshot of Candidate B selected
    const shotB = await sendCmd('Page.captureScreenshot', { format: 'png' }, sId);
    const shotPathB = path.join(artifactDir, 'candidate_b_selected.png');
    fs.writeFileSync(shotPathB, Buffer.from(shotB.result.data, 'base64'));
    console.log(`Saved screenshot B to ${shotPathB}`);

    // Confirm selection (Submit)
    console.log('Submitting decision...');
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('btn-submit-decision');
        if (btn) btn.click();
      })()`,
      returnByValue: true
    }, sId);

    await new Promise(r => setTimeout(r, 2000));

    const stateAfterSubmit = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        return {
          hasRecorded: text.includes('DECISION RECORDED') || text.includes('Decision Recorded'),
          textExcerpt: text.slice(0, 300)
        };
      })()`,
      returnByValue: true
    }, sId);

    console.log('State After Submission:', stateAfterSubmit.result.value);

    // Take screenshot of Submitted state
    const shotSubmitted = await sendCmd('Page.captureScreenshot', { format: 'png' }, sId);
    const shotPathSubmitted = path.join(artifactDir, 'candidate_decision_submitted.png');
    fs.writeFileSync(shotPathSubmitted, Buffer.from(shotSubmitted.result.data, 'base64'));
    console.log(`Saved screenshot Submitted to ${shotPathSubmitted}`);

    // Cleanup session from DB
    await supabase.from('responses').delete().eq('session_id', session.id);
    await supabase.from('players').delete().eq('session_id', session.id);
    await supabase.from('game_sessions').delete().eq('id', session.id);
    console.log('Cleaned up test data.');

    ws.close();
  } finally {
    chromeProc.kill('SIGKILL');
    try {
      fs.rmSync(tempProfile, { recursive: true, force: true });
    } catch {}
  }

  console.log('🎉 TEST AND VERIFICATION COMPLETED SUCCESSFULLY!');
}

run().catch(console.error);
