const fs = require('fs');
const path = require('path');

console.log('🚀 Running Candidate Dataset Unique Name Validation...\n');

// 1. Read rounds.ts directly to extract candidate names
const roundsFilePath = path.join(__dirname, '..', 'src', 'shared', 'data', 'rounds.ts');
const roundsContent = fs.readFileSync(roundsFilePath, 'utf8');

// Simple parser for candidate names in ROUNDS_DATA
const roundRegex = /(\d+):\s*\{\s*id:\s*'round-(\d+)'[\s\S]*?candidateA:\s*\{[\s\S]*?name:\s*'([^']+)'[\s\S]*?candidateB:\s*\{[\s\S]*?name:\s*'([^']+)'/g;

const rounds = {};
let match;
while ((match = roundRegex.exec(roundsContent)) !== null) {
  const roundNum = parseInt(match[1], 10);
  rounds[roundNum] = {
    roundNumber: roundNum,
    candidateA: match[3],
    candidateB: match[4]
  };
}

const totalRoundsFound = Object.keys(rounds).length;
console.log(`✅ Loaded ${totalRoundsFound} rounds from rounds.ts`);

if (totalRoundsFound !== 5) {
  console.error(`❌ Expected 5 rounds, but found ${totalRoundsFound}`);
  process.exit(1);
}

// 2. Collect all candidate names
const allNames = [];
const roundNamesMap = {};

for (let r = 1; r <= 5; r++) {
  const round = rounds[r];
  if (!round) {
    console.error(`❌ Missing round ${r}`);
    process.exit(1);
  }
  const nameA = round.candidateA;
  const nameB = round.candidateB;
  console.log(`   Round ${r}: Candidate A = "${nameA}", Candidate B = "${nameB}"`);
  allNames.push(nameA, nameB);
  roundNamesMap[r] = [nameA, nameB];
}

console.log(`\nTotal candidate names collected: ${allNames.length}`);
if (allNames.length !== 10) {
  console.error(`❌ Expected 10 candidate names across 5 rounds, found ${allNames.length}`);
  process.exit(1);
}

// 3. Normalized Duplicate Check
const seenNormalized = new Map();
const duplicates = [];

allNames.forEach((name, index) => {
  const normalized = name.trim().toLowerCase();
  const roundNum = Math.floor(index / 2) + 1;
  const candidateLetter = index % 2 === 0 ? 'A' : 'B';

  if (seenNormalized.has(normalized)) {
    const prior = seenNormalized.get(normalized);
    duplicates.push({
      name,
      current: `Round ${roundNum} Candidate ${candidateLetter}`,
      previous: prior
    });
  } else {
    seenNormalized.set(normalized, `Round ${roundNum} Candidate ${candidateLetter}`);
  }
});

if (duplicates.length > 0) {
  console.error('❌ DUPLICATES FOUND:');
  duplicates.forEach((d) => {
    console.error(`   - "${d.name}" in ${d.current} was already used in ${d.previous}`);
  });
  process.exit(1);
}

console.log('✅ Normalized Duplicate Check: 0 duplicates found across all 5 rounds.');
console.log('   All 10 candidate names are 100% unique.');

// 4. Verify case-insensitive detection logic (negative test assertion)
const testListWithDuplicates = ['Aarav', 'Rohan', 'Maya', 'aarav', 'Dev'];
const testSeen = new Set();
let testDupFound = false;
testListWithDuplicates.forEach((n) => {
  const norm = n.trim().toLowerCase();
  if (testSeen.has(norm)) testDupFound = true;
  testSeen.add(norm);
});

if (!testDupFound) {
  console.error('❌ Case-insensitivity test failed: "Aarav" and "aarav" should be detected as duplicates.');
  process.exit(1);
}
console.log('✅ Case-insensitivity logic verified (catches "Aarav" vs "aarav").');

// 5. Verify revealSteps.ts synchronization
const revealFilePath = path.join(__dirname, '..', 'src', 'shared', 'data', 'revealSteps.ts');
const revealContent = fs.readFileSync(revealFilePath, 'utf8');

const revealNameRegex = /roundNumber:\s*(\d+)[\s\S]*?candidateAName:\s*'([^']+)'[\s\S]*?candidateBName:\s*'([^']+)'/g;
const revealNames = [];
let revMatch;
while ((revMatch = revealNameRegex.exec(revealContent)) !== null) {
  revealNames.push({
    round: parseInt(revMatch[1], 10),
    nameA: revMatch[2],
    nameB: revMatch[3]
  });
}

console.log(`\n✅ Loaded ${revealNames.length} round comparison records from revealSteps.ts`);
const seenReveal = new Set();
let revealDup = false;
revealNames.forEach((rn) => {
  [rn.nameA, rn.nameB].forEach((fn) => {
    const norm = fn.trim().toLowerCase();
    if (seenReveal.has(norm)) {
      revealDup = true;
      console.error(`❌ Duplicate full name in revealSteps: ${fn}`);
    }
    seenReveal.add(norm);
  });
});

if (revealDup) {
  process.exit(1);
}
console.log('✅ All full candidate names in revealSteps.ts are also 100% unique across all 5 rounds.');

console.log('\n🎉 ALL CANDIDATE UNIQUE NAME VALIDATION TESTS PASSED PERFECTLY!\n');
