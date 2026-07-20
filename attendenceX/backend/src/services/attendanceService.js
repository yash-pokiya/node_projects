const DailyLog = require('../models/DailyLog');
const HistoryLog = require('../models/HistoryLog');
const User = require('../models/User');
const Settings = require('../models/Settings');
const attendanceEngine = require('./attendanceEngine');

/**
 * Normalizes any Date or String to midnight UTC Date
 */
const normalizeToUTCDate = (dateVal) => {
  const d = new Date(dateVal);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

/**
 * Dynamic Streak Tracking Updater
 */
const updateStreak = async (user, dateVal, attendedCount) => {
  if (attendedCount <= 0) return;

  const targetDate = normalizeToUTCDate(dateVal);
  const targetDateStr = targetDate.toISOString().split('T')[0];

  const lastMarkedDate = user.streakStats?.lastMarkedDate;
  if (lastMarkedDate) {
    const lastDateStr = new Date(lastMarkedDate).toISOString().split('T')[0];
    
    if (lastDateStr === targetDateStr) return;

    const yesterday = new Date(targetDate);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDateStr === yesterdayStr) {
      user.streakStats.currentStreak += 1;
    } else {
      user.streakStats.currentStreak = 1;
    }
  } else {
    user.streakStats = user.streakStats || {};
    user.streakStats.currentStreak = 1;
  }

  if (user.streakStats.currentStreak > user.streakStats.longestStreak) {
    user.streakStats.longestStreak = user.streakStats.currentStreak;
  }

  user.streakStats.lastMarkedDate = targetDate;
  await user.save();
};

/**
 * Record a single day's attendance counts and log audit trail delta
 */
const markAttendance = async (userId, data) => {
  const { totalLectures, attendedLectures, date } = data;
  const targetDate = normalizeToUTCDate(date || new Date());

  // Get current baseline statistics
  const currentStats = await getAttendanceStats(userId);
  const prevTotal = currentStats.overall.total;
  const prevAttended = currentStats.overall.attended;

  // Log today's counts to DailyLog
  const query = { userId, date: targetDate };
  const update = { 
    totalLectures: Number(totalLectures), 
    attendedLectures: Number(attendedLectures) 
  };
  const options = { upsert: true, new: true, runValidators: true };

  const record = await DailyLog.findOneAndUpdate(query, update, options);

  // Fetch updated stats to calculate delta
  const updatedStats = await getAttendanceStats(userId);
  const newTotal = updatedStats.overall.total;
  const newAttended = updatedStats.overall.attended;

  // Save entry in HistoryLog for rollbacks
  await HistoryLog.create({
    userId,
    date: targetDate,
    prevTotal,
    prevAttended,
    addedTotal: Number(totalLectures),
    addedAttended: Number(attendedLectures),
    newTotal,
    newAttended,
    complianceBefore: currentStats.overall.percent,
    complianceAfter: updatedStats.overall.percent,
    actionType: 'manual_update',
  });

  const user = await User.findById(userId);
  if (user) {
    await updateStreak(user, targetDate, Number(attendedLectures));
  }

  return record;
};

/**
 * Revert the last logged check-in
 */
const revertLastLog = async (userId) => {
  const lastLog = await HistoryLog.findOne({ userId }).sort({ createdAt: -1 });
  if (!lastLog) {
    const error = new Error('No historical log found to undo.');
    error.statusCode = 400;
    throw error;
  }

  // Remove corresponding DailyLog record
  await DailyLog.deleteOne({ userId, date: lastLog.date });

  // Delete this HistoryLog entry
  await HistoryLog.deleteOne({ _id: lastLog._id });

  // Return fresh statistics
  return await getAttendanceStats(userId);
};

/**
 * Bulk mark stubs
 */
const bulkMarkAttendance = async (userId, entries) => {
  const results = [];
  if (Array.isArray(entries)) {
    for (const entry of entries) {
      const r = await markAttendance(userId, entry);
      results.push(r);
    }
  }
  return results;
};

/**
 * Retrieve daily log Tallies within date ranges
 */
const getAttendanceForDateRange = async (userId, startDate, endDate) => {
  const start = normalizeToUTCDate(startDate);
  const end = normalizeToUTCDate(endDate);

  const logs = await DailyLog.find({
    userId,
    date: { $gte: start, $lte: end },
  }).sort({ date: 1 });

  return logs.map(log => ({
    _id: log._id,
    date: log.date,
    totalLectures: log.totalLectures,
    attendedLectures: log.attendedLectures,
    status: log.attendedLectures === log.totalLectures && log.totalLectures > 0 
      ? 'present' 
      : log.attendedLectures > 0 
      ? 'present' 
      : 'absent'
  }));
};

/**
 * Calculate statistical summaries and predictive outputs using the core pure engine
 */
const getAttendanceStats = async (userId) => {
  let settings = await Settings.findOne({ userId });
  if (!settings) {
    settings = await Settings.create({ userId });
  }

  const startingTotal = settings.startingTotalLectures || 0;
  const startingAttended = settings.startingAttendedLectures || 0;
  const targetGoal = settings.minimumAttendancePercent || 75;
  const averageDaily = settings.averageLecturesPerDay || 4;
  const weeklyPattern = settings.weeklyPattern || [4, 4, 4, 4, 4, 0, 0];

  // Fetch daily logs
  const logs = await DailyLog.find({ userId });
  
  let loggedTotal = 0;
  let loggedAttended = 0;

  logs.forEach((log) => {
    loggedTotal += log.totalLectures || 0;
    loggedAttended += log.attendedLectures || 0;
  });

  const overallTotal = startingTotal + loggedTotal;
  const overallAttended = startingAttended + loggedAttended;

  // Core primitives
  const overallPercent = attendanceEngine.calculateAttendancePercent(overallAttended, overallTotal);
  const overallSafeBunks = attendanceEngine.calculateSafeBunks(overallAttended, overallTotal, targetGoal);
  const overallRecovery = attendanceEngine.calculateRequiredAttendance(
    overallAttended, overallTotal, targetGoal, 30
  );

  // Prediction Engine outputs
  const status = attendanceEngine.getAttendanceStatus(overallPercent, targetGoal);
  const forecast = attendanceEngine.forecastWalk(
    overallAttended, overallTotal, averageDaily, weeklyPattern, 30
  );
  const safeBunkPlan = attendanceEngine.safeBunkPlanner(
    overallAttended, overallTotal, targetGoal, averageDaily, weeklyPattern
  );
  const recoveryPlan = overallPercent < targetGoal
    ? attendanceEngine.recoveryPlanner(overallAttended, overallTotal, targetGoal, averageDaily, weeklyPattern)
    : [];
  const recommendations = attendanceEngine.generateRecommendations(
    overallAttended, overallTotal, targetGoal, averageDaily, weeklyPattern
  );

  return {
    overall: {
      attended: overallAttended,
      total: overallTotal,
      percent: overallPercent,
      safeBunks: overallSafeBunks,
      recovery: overallRecovery,
      targetGoal,
      averageDaily,
      weeklyPattern,
      // Prediction Engine
      status,
      forecast,
      safeBunkPlan,
      recoveryPlan,
      recommendations,
    },
    subjectWise: [],
  };
};

module.exports = {
  markAttendance,
  revertLastLog,
  bulkMarkAttendance,
  getAttendanceForDateRange,
  getAttendanceStats,
};
