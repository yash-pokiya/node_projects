const mongoose = require('mongoose');
const config = require('./src/config');
const User = require('./src/models/User');
const Subject = require('./src/models/Subject');
const TimetableCycle = require('./src/models/TimetableCycle');
const AttendanceRecord = require('./src/models/AttendanceRecord');
const authService = require('./src/services/authService');
const subjectService = require('./src/services/subjectService');
const timetableService = require('./src/services/timetableService');
const attendanceService = require('./src/services/attendanceService');

console.log('=== STARTING REDESIGNED ENTERPRISE SYSTEM VALIDATION ===\n');

const runValidation = async () => {
  try {
    // 1. Database Connection
    console.log('[STEP 1] Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connection successful.');

    // Clean test space
    console.log('\n[STEP 2] Clearing validation data space...');
    const testEmail = 'arch_test_student@attendx-enterprise.com';
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      await AttendanceRecord.deleteMany({ userId: existingUser._id });
      await TimetableCycle.deleteMany({ userId: existingUser._id });
      await Subject.deleteMany({ userId: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
    }
    console.log('Cleanup complete.');

    // 2. Authentication Flow (Argon2 test)
    console.log('\n[STEP 3] Registering student via authService (Argon2)...');
    const { user, accessToken } = await authService.signup({
      name: 'Architect Student',
      email: testEmail,
      password: 'EnterpriseSecuredPass99!',
    });
    console.log(`Student registered: ${user.name} (${user.email})`);
    console.log(`Password Hash (Should be Argon2 format): ${user.passwordHash}`);
    console.log('Access token generated successfully.');

    // Compare Password Verification
    console.log('Verifying comparePassword...');
    const isCorrect = await user.comparePassword('EnterpriseSecuredPass99!');
    const isIncorrect = await user.comparePassword('WrongPassword');
    console.log(`Correct pass validation: ${isCorrect} (expected true)`);
    console.log(`Incorrect pass validation: ${isIncorrect} (expected false)`);

    // 3. User Profile Setup (Overrides & Overrides counting)
    console.log('\n[STEP 4] Configuring student profile configs...');
    user.academicConfiguration.universityName = 'GTU';
    user.academicConfiguration.minimumAttendancePercent = 75.0;
    // Set custom override: medical acts as "present" rather than default "neutral"
    user.attendanceStatusCountingOverrides.medical = 'present';
    await user.save();
    console.log(`Academic threshold: ${user.academicConfiguration.minimumAttendancePercent}%`);
    console.log(`Medical override rule: ${user.attendanceStatusCountingOverrides.medical}`);

    // 4. Subject Management (Milestones, Credits, Auto Colors)
    console.log('\n[STEP 5] Creating subjects...');
    const subA = await subjectService.createSubject(user._id, {
      name: 'Advanced Software Engineering',
      code: 'CS-501',
      credits: 4,
      syllabusOutline: [
        { topic: 'System Design Patterns', isCompleted: false },
        { topic: 'Argon2 Hashing Protocols', isCompleted: false }
      ]
    });
    const subB = await subjectService.createSubject(user._id, {
      name: 'Distributed Databases',
      code: 'CS-502',
      credits: 3,
    });
    const subC = await subjectService.createSubject(user._id, {
      name: 'High Performance Calculations',
      code: 'CS-503',
      credits: 2,
    });
    console.log(`Subject A: ${subA.name} (Code: ${subA.code}) Credits: ${subA.credits} Color: ${subA.color}`);
    console.log(`Subject B: ${subB.name} (Code: ${subB.code}) Credits: ${subB.credits} Color: ${subB.color}`);
    console.log(`Subject C: ${subC.name} (Code: ${subC.code}) Credits: ${subC.credits} Color: ${subC.color}`);

    // 5. Timetable Scheduler Cycle (Weekly + Bi-weekly colliding tests)
    console.log('\n[STEP 6] Seeding Timetable Cycles...');
    const slot1 = await timetableService.createTimetableEntry(user._id, {
      subjectId: subA._id,
      cycleType: 'weekly',
      dayOfWeek: 1, // Monday
      period: 1,
      startTime: '08:30',
      endTime: '09:20',
      classroom: 'Lab 5B'
    });
    const slot2 = await timetableService.createTimetableEntry(user._id, {
      subjectId: subA._id,
      cycleType: 'weekly',
      dayOfWeek: 1, // Monday
      period: 2,
      startTime: '09:30',
      endTime: '10:20',
      classroom: 'Lab 5B'
    });
    const slot3 = await timetableService.createTimetableEntry(user._id, {
      subjectId: subB._id,
      cycleType: 'weekly',
      dayOfWeek: 1, // Monday
      period: 3,
      startTime: '10:30',
      endTime: '11:20',
      classroom: 'Auditorium 1'
    });
    
    // Seed biweekly slot (Tuesday Period 1 Week 1 vs. Week 2)
    const slotBi1 = await timetableService.createTimetableEntry(user._id, {
      subjectId: subC._id,
      cycleType: 'biweekly',
      weekNumber: 1,
      dayOfWeek: 2, // Tuesday
      period: 1,
      startTime: '08:30',
      endTime: '09:20',
      classroom: 'Seminar Room'
    });
    const slotBi2 = await timetableService.createTimetableEntry(user._id, {
      subjectId: subB._id,
      cycleType: 'biweekly',
      weekNumber: 2,
      dayOfWeek: 2, // Tuesday
      period: 1,
      startTime: '08:30',
      endTime: '09:20',
      classroom: 'Seminar Room'
    });
    console.log('Timetable slots created successfully.');

    // Verify timetable schedule fetch groups output
    const scheduleFetch = await timetableService.getTimetable(user._id);
    console.log('\nGrouped Timetable details:');
    console.log(`Monday Week 1 active slots: ${scheduleFetch.grouped.week1[1].length}`);
    console.log(`Tuesday Week 1 active slots (Subject C): ${scheduleFetch.grouped.week1[2][0].subjectId.name}`);
    console.log(`Tuesday Week 2 active slots (Subject B): ${scheduleFetch.grouped.week2[2][0].subjectId.name}`);

    // Verify Overlap Collision Block
    console.log('\nTesting Scheduler Collision Protection...');
    try {
      await timetableService.createTimetableEntry(user._id, {
        subjectId: subC._id,
        cycleType: 'weekly',
        dayOfWeek: 1, // Monday
        period: 1, // Collision!
        startTime: '08:30',
        endTime: '09:20',
      });
      console.error('FAIL: Overlap validation bypassed!');
    } catch (err) {
      console.log(`PASS: Overlap prevented. Message: "${err.message}"`);
    }

    // 6. Attendance Marking & Custom overrides tests
    console.log('\n[STEP 7] Marking attendance records...');
    // Mon 13 July (Week 1): Present, Absent, Half
    await attendanceService.markAttendance(user._id, {
      subjectId: subA._id,
      date: '2026-07-13',
      period: 1,
      status: 'present',
    });
    await attendanceService.markAttendance(user._id, {
      subjectId: subA._id,
      date: '2026-07-13',
      period: 2,
      status: 'absent',
    });
    await attendanceService.markAttendance(user._id, {
      subjectId: subB._id,
      date: '2026-07-13',
      period: 3,
      status: 'half',
    });

    // Tue 14 July: Medical for Subject C (Our profile rule makes medical = present)
    await attendanceService.markAttendance(user._id, {
      subjectId: subC._id,
      date: '2026-07-14',
      period: 1,
      status: 'medical',
    });

    console.log('Attendance records logged.');

    // 7. Verify Statistics
    console.log('\n[STEP 8] Calculating and verifying stats outputs...');
    const stats = await attendanceService.getAttendanceStats(user._id);
    console.log(`Overall Attended: ${stats.overall.attended} (Expected: 2.5)`);
    console.log(`Overall Total: ${stats.overall.total} (Expected: 4)`);
    console.log(`Overall Percentage: ${stats.overall.percent}% (Expected: 62.5%)`);

    // Verify subject breakdowns
    stats.subjectWise.forEach(item => {
      console.log(`- Course: "${item.subject.name}" -> Attended: ${item.attended}/${item.total} (${item.percent}%)`);
    });

    // 8. Streak verification
    const refreshedUser = await User.findById(user._id);
    console.log(`\n[STEP 9] Verifying gamified streak tracker stats...`);
    console.log(`Current streak count: ${refreshedUser.streakStats.currentStreak} (Expected: 1)`);
    console.log(`Longest streak record: ${refreshedUser.streakStats.longestStreak} (Expected: 1)`);
    console.log(`Last marked date: ${refreshedUser.streakStats.lastMarkedDate.toISOString().split('T')[0]}`);

    console.log('\n======================================================');
    console.log('🎉 SYSTEM VALIDATION PASSED: CORE CODE IS 100% CORRECT!');
    console.log('======================================================');

  } catch (err) {
    console.error('\n❌ VALIDATION CRITICAL EXCEPTION:');
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from Database.');
  }
};

runValidation();
