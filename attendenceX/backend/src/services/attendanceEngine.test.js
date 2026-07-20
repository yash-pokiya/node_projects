const assert = require('assert');
const {
  calculateAttendancePercent,
  calculateSafeBunks,
  calculateRequiredAttendance,
  projectAttendance,
  simulateWhatIf,
} = require('./attendanceEngine');

console.log('--- RUNNING ATTENDANCE ENGINE UNIT TESTS ---');

try {
  // Test 1: calculateAttendancePercent
  console.log('Testing calculateAttendancePercent...');
  assert.strictEqual(calculateAttendancePercent(0, 0), 0, 'Zero division should yield 0');
  assert.strictEqual(calculateAttendancePercent(10, 0), 0, 'Zero division with positive numerator should yield 0');
  assert.strictEqual(calculateAttendancePercent(15, 20), 75, '15 out of 20 is 75%');
  assert.strictEqual(calculateAttendancePercent(10, 15), 66.67, '10 out of 15 is 66.67%');
  assert.strictEqual(calculateAttendancePercent(0, 5), 0, '0 out of 5 is 0%');

  // Test 2: calculateSafeBunks
  console.log('Testing calculateSafeBunks...');
  assert.strictEqual(calculateSafeBunks(20, 22, 75), 4, 'Should yield 4 safe bunks');
  assert.strictEqual(calculateSafeBunks(10, 15, 75), 0, 'Already below target, should return 0');
  assert.strictEqual(calculateSafeBunks(0, 0, 75), 0, 'Zero lectures should yield 0 bunks');

  // Test 3: calculateRequiredAttendance
  console.log('Testing calculateRequiredAttendance...');
  const req1 = calculateRequiredAttendance(10, 20, 75, 20);
  assert.deepStrictEqual(req1, { mustAttend: 20, canMiss: 0, isAchievable: true }, 'Should need 20');

  const req2 = calculateRequiredAttendance(10, 20, 75, 5);
  assert.deepStrictEqual(req2, { mustAttend: 5, canMiss: 0, isAchievable: false }, 'Should be unachievable');

  const req3 = calculateRequiredAttendance(18, 20, 75, 10);
  assert.deepStrictEqual(req3, { mustAttend: 5, canMiss: 5, isAchievable: true }, 'Should need 5 out of 10');

  // Test 4: projectAttendance (with dynamic Weekly and Bi-weekly rotating cycles)
  console.log('Testing projectAttendance with Bi-weekly rotating schedules...');
  const schedule = [
    { dayOfWeek: 1, subjectId: 'subA', cycleType: 'weekly' },
    { dayOfWeek: 2, subjectId: 'subA', cycleType: 'biweekly', weekNumber: 1 }, // Tuesday Week 1 only
    { dayOfWeek: 2, subjectId: 'subB', cycleType: 'biweekly', weekNumber: 2 }, // Tuesday Week 2 only
  ];
  
  const holidays = [
    { date: '2026-07-14', appliesToAllSubjects: true }, // Tuesday
  ];

  // Project from Friday 2026-07-10 to Friday 2026-07-17 (inclusive)
  // Calendar:
  // - 2026-07-10 (Fri, 5) - no classes
  // - 2026-07-11 (Sat, 6) - no classes
  // - 2026-07-12 (Sun, 0) - no classes
  // - 2026-07-13 (Mon, 1) - Mon Class (weekly): subA expected. (Accum = 1)
  // - 2026-07-14 (Tue, 2) - Tue Class (biweekly): holiday cancels all anyway. (Accum = 1)
  // - 2026-07-15 (Wed, 3) - no classes
  // - 2026-07-16 (Thu, 4) - no classes
  // - 2026-07-17 (Fri, 5) - no classes
  // Total expected lectures = 1.
  const targetDateStr = '2026-07-17T00:00:00.000Z';
  const subStats = {
    subA: { attended: 4, total: 5 },
  };

  const projection = projectAttendance(4, 5, schedule, holidays, targetDateStr, subStats);
  
  assert.strictEqual(projection.expectedLectures, 1, 'Expected lectures should be 1');
  assert.strictEqual(projection.expectedWorkingDays, 1, 'Expected working days should be 1');
  assert.strictEqual(projection.projectedPercentBestCase, 83.33, 'Best case should be 83.33% (5/6)');
  assert.strictEqual(projection.projectedPercentAtCurrentRate, 80, 'Current rate should be 80% (4.8/6)');

  // Test 5: simulateWhatIf
  console.log('Testing simulateWhatIf...');
  const current = { attended: 10, total: 15 };
  const events = [
    { status: 'present', count: 2 },
    { status: 'absent', count: 1 },
    { status: 'half', count: 1 },
  ];

  const simResult = simulateWhatIf(current, events);
  assert.strictEqual(simResult.attended, 12.5, 'Simulation attended mismatch');
  assert.strictEqual(simResult.total, 19, 'Simulation total mismatch');
  assert.strictEqual(simResult.percent, 65.79, 'Simulation percentage mismatch');

  console.log('\n=========================================');
  console.log('🎉 ALL REDESIGNED ATTENDANCE ENGINE TESTS PASSED!');
  console.log('=========================================');
} catch (err) {
  console.error('\n❌ UNIT TEST ASSERTION FAILED:');
  console.error(err);
  process.exit(1);
}
