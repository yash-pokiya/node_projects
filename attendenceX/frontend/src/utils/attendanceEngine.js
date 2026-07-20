/**
 * Attendance Planning Engine (APE) — Pure Functional Calculation Boundary
 * Frontend ESM mirror of backend/src/services/attendanceEngine.js
 *
 * All functions are pure: no database access, no side-effects.
 * This module is the single source of truth for every attendance formula.
 */

// ─────────────────────────────────────────────
// CORE PRIMITIVES
// ─────────────────────────────────────────────

export const calculateAttendancePercent = (attended, total) => {
  if (!total || total <= 0) return 0;
  return Math.round((attended / total) * 10000) / 100;
};

export const calculateSafeBunks = (attended, total, minPercent) => {
  if (!total || total <= 0) return 0;
  if (!minPercent || minPercent <= 0) return 0;

  const currentPercent = (attended / total) * 100;
  if (currentPercent < minPercent) return 0;

  const limitRatio = minPercent / 100;
  const cushion = Math.floor(attended / limitRatio - total);
  return Math.max(0, Math.min(cushion, 99));
};

export const calculateRequiredAttendance = (attended, total, minPercent, remainingLectures = 30) => {
  if (!minPercent || minPercent <= 0) {
    return { mustAttend: 0, canMiss: remainingLectures, isAchievable: true };
  }
  if (remainingLectures < 0) remainingLectures = 0;

  const limitRatio = minPercent / 100;

  const neededRightNow = Math.ceil((limitRatio * total - attended) / (1 - limitRatio));
  const mustAttendConsecutive = Math.max(0, neededRightNow);

  const targetTotal = total + remainingLectures;
  const targetRequired = Math.ceil(limitRatio * targetTotal);
  const needed = targetRequired - attended;
  const mustAttendFractional = Math.max(0, needed);

  if (mustAttendFractional > remainingLectures) {
    return {
      mustAttend: mustAttendConsecutive,
      fractionalMustAttend: remainingLectures,
      canMiss: 0,
      isAchievable: false,
    };
  }

  return {
    mustAttend: mustAttendConsecutive,
    fractionalMustAttend: mustAttendFractional,
    canMiss: remainingLectures - mustAttendFractional,
    isAchievable: true,
  };
};

export const simulateWhatIf = (currentState, hypotheticalEvents) => {
  let attended = currentState.attended || 0;
  let total = currentState.total || 0;
  const minPercent = currentState.minPercent || 75;

  if (Array.isArray(hypotheticalEvents)) {
    hypotheticalEvents.forEach((ev) => {
      const count = ev.count || 1;
      if (ev.status === 'present') {
        attended += count;
        total += count;
      } else if (ev.status === 'absent') {
        total += count;
      } else if (ev.status === 'half') {
        attended += Math.floor(0.5 * count);
        total += count;
      }
    });
  }

  const percent = calculateAttendancePercent(attended, total);

  return {
    attended,
    total,
    percent,
    safeBunks: calculateSafeBunks(attended, total, minPercent),
    status: getAttendanceStatus(percent, minPercent),
  };
};

// ─────────────────────────────────────────────
// PREDICTION ENGINE — MODULES
// ─────────────────────────────────────────────

const _getDayCapacity = (dayIndex, weeklyPattern, averageDaily) => {
  if (weeklyPattern && weeklyPattern.length > dayIndex && weeklyPattern[dayIndex] !== undefined) {
    return weeklyPattern[dayIndex];
  }
  return averageDaily || 4;
};

const _toDayIndex = (jsDate) => {
  return (jsDate.getDay() + 6) % 7;
};

export const forecastWalk = (attended, total, averageDaily, weeklyPattern, daysCount = 30) => {
  if (daysCount <= 0) {
    return {
      expectedLectures: 0,
      bestCasePercent: calculateAttendancePercent(attended, total),
      trendCasePercent: calculateAttendancePercent(attended, total),
      worstCasePercent: calculateAttendancePercent(attended, total),
      dailyBreakdown: [],
    };
  }

  const currentRate = total > 0 ? (attended / total) : 1.0;
  const now = new Date();

  let cumulativeCapacity = 0;
  const dailyBreakdown = [];

  for (let i = 1; i <= daysCount; i++) {
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + i);
    const dayIndex = _toDayIndex(futureDate);
    const capacity = _getDayCapacity(dayIndex, weeklyPattern, averageDaily);

    cumulativeCapacity += capacity;

    const projTotal = total + cumulativeCapacity;
    const bestAttended = attended + cumulativeCapacity;
    const trendAttended = attended + (cumulativeCapacity * currentRate);
    const worstAttended = attended;

    dailyBreakdown.push({
      date: futureDate.toISOString().split('T')[0],
      dayIndex,
      capacity,
      cumulativeLectures: cumulativeCapacity,
      bestPercent: calculateAttendancePercent(bestAttended, projTotal),
      trendPercent: calculateAttendancePercent(trendAttended, projTotal),
      worstPercent: calculateAttendancePercent(worstAttended, projTotal),
    });
  }

  const lastDay = dailyBreakdown[dailyBreakdown.length - 1];

  return {
    expectedLectures: cumulativeCapacity,
    bestCasePercent: lastDay.bestPercent,
    trendCasePercent: lastDay.trendPercent,
    worstCasePercent: lastDay.worstPercent,
    dailyBreakdown,
  };
};

export const safeBunkPlanner = (attended, total, minPercent, averageDaily, weeklyPattern) => {
  const now = new Date();
  const limitRatio = (minPercent || 75) / 100;

  const rightNow = calculateSafeBunks(attended, total, minPercent);

  const todayDayIndex = _toDayIndex(now);
  const daysUntilSunday = 6 - todayDayIndex;
  let weekRemainingLectures = 0;
  for (let i = 1; i <= daysUntilSunday; i++) {
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + i);
    weekRemainingLectures += _getDayCapacity(_toDayIndex(futureDate), weeklyPattern, averageDaily);
  }
  const weekEndAttended = attended + weekRemainingLectures;
  const weekEndTotal = total + weekRemainingLectures;
  const thisWeek = Math.max(0, Math.min(
    Math.floor(weekEndAttended / limitRatio - weekEndTotal),
    99
  ));

  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysUntilMonthEnd = Math.max(0, Math.floor((lastDayOfMonth - now) / 86400000));
  let monthRemainingLectures = 0;
  for (let i = 1; i <= daysUntilMonthEnd; i++) {
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + i);
    monthRemainingLectures += _getDayCapacity(_toDayIndex(futureDate), weeklyPattern, averageDaily);
  }
  const monthEndAttended = attended + monthRemainingLectures;
  const monthEndTotal = total + monthRemainingLectures;
  const thisMonth = Math.max(0, Math.min(
    Math.floor(monthEndAttended / limitRatio - monthEndTotal),
    99
  ));

  return { rightNow, thisWeek, thisMonth };
};

export const recoveryPlanner = (attended, total, minPercent, averageDaily, weeklyPattern) => {
  const percent = calculateAttendancePercent(attended, total);
  if (percent >= minPercent || total <= 0) return [];

  const limitRatio = minPercent / 100;
  const strategies = [];

  const consecutive = Math.max(0, Math.ceil((limitRatio * total - attended) / (1 - limitRatio)));
  strategies.push({
    id: 'consecutive',
    label: `Attend the next ${consecutive} lectures without missing any`,
    value: consecutive,
    unit: 'lectures',
    isAchievable: consecutive < 500,
  });

  const horizon = 30;
  const fractionalTarget = Math.ceil(limitRatio * (total + horizon));
  const fractionalNeeded = Math.max(0, fractionalTarget - attended);
  strategies.push({
    id: 'fractional',
    label: `Attend at least ${Math.min(fractionalNeeded, horizon)} out of the next ${horizon} lectures`,
    value: Math.min(fractionalNeeded, horizon),
    unit: `of ${horizon} lectures`,
    isAchievable: fractionalNeeded <= horizon,
  });

  const workingDaysInMonth = weeklyPattern
    ? weeklyPattern.filter(d => d > 0).length * 4
    : 20;
  const dailyTarget = Math.ceil(fractionalNeeded / Math.max(workingDaysInMonth, 1));
  strategies.push({
    id: 'daily_target',
    label: `Attend at least ${dailyTarget} lectures every working day for the next ${workingDaysInMonth} days`,
    value: dailyTarget,
    unit: 'lectures/day',
    isAchievable: fractionalNeeded <= horizon,
  });

  const now = new Date();
  let walkAttended = attended;
  let walkTotal = total;
  let recoveryDate = null;
  let daysToRecover = 0;

  for (let i = 1; i <= 365; i++) {
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + i);
    const dayIndex = _toDayIndex(futureDate);
    const capacity = _getDayCapacity(dayIndex, weeklyPattern, averageDaily);

    if (capacity <= 0) continue;

    walkAttended += capacity;
    walkTotal += capacity;
    daysToRecover = i;

    if ((walkAttended / walkTotal) * 100 >= minPercent) {
      recoveryDate = futureDate.toISOString().split('T')[0];
      break;
    }
  }

  strategies.push({
    id: 'date_recovery',
    label: recoveryDate
      ? `Attend every lecture — you will reach ${minPercent}% by ${recoveryDate}`
      : `Recovery to ${minPercent}% is not achievable within 1 year`,
    value: daysToRecover,
    unit: 'days',
    isAchievable: !!recoveryDate,
    recoveryDate,
  });

  return strategies;
};

export const goalPlanner = (attended, total, goalPercent, averageDaily, weeklyPattern) => {
  const currentPercent = calculateAttendancePercent(attended, total);

  if (currentPercent >= goalPercent) {
    return {
      alreadyAchieved: true,
      surplus: calculateSafeBunks(attended, total, goalPercent),
      lecturesRequired: 0,
      workingDaysRequired: 0,
      bestCaseDate: null,
      isAchievable: true,
    };
  }

  if (goalPercent >= 100) {
    return {
      alreadyAchieved: false,
      lecturesRequired: Infinity,
      workingDaysRequired: Infinity,
      bestCaseDate: null,
      isAchievable: total > 0 && attended === total,
    };
  }

  const limitRatio = goalPercent / 100;
  const lecturesRequired = Math.max(0, Math.ceil((limitRatio * total - attended) / (1 - limitRatio)));

  const now = new Date();
  let cumulativeCapacity = 0;
  let workingDaysRequired = 0;
  let bestCaseDate = null;

  for (let i = 1; i <= 365; i++) {
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + i);
    const dayIndex = _toDayIndex(futureDate);
    const capacity = _getDayCapacity(dayIndex, weeklyPattern, averageDaily);

    if (capacity <= 0) continue;
    workingDaysRequired++;
    cumulativeCapacity += capacity;

    if (cumulativeCapacity >= lecturesRequired) {
      bestCaseDate = futureDate.toISOString().split('T')[0];
      break;
    }
  }

  return {
    alreadyAchieved: false,
    lecturesRequired,
    workingDaysRequired,
    bestCaseDate,
    isAchievable: !!bestCaseDate,
  };
};

export const generateRecommendations = (attended, total, minPercent, averageDaily, weeklyPattern) => {
  const recommendations = [];
  const percent = calculateAttendancePercent(attended, total);
  const safeBunks = calculateSafeBunks(attended, total, minPercent);
  const hasPattern = weeklyPattern && weeklyPattern.some(d => d > 0);
  const hasSufficientData = total > 20;

  const confidence = hasPattern && hasSufficientData ? 'high'
    : hasPattern ? 'medium'
    : 'low';

  const now = new Date();
  const todayIndex = _toDayIndex(now);
  const todayCapacity = _getDayCapacity(todayIndex, weeklyPattern, averageDaily);

  if (todayCapacity > 0) {
    if (safeBunks >= todayCapacity) {
      recommendations.push({
        message: `You can safely skip all ${todayCapacity} of today's lectures.`,
        type: 'safe',
        confidence,
        priority: 1,
      });
    } else if (safeBunks > 0) {
      recommendations.push({
        message: `You can miss ${safeBunks} of today's ${todayCapacity} lectures, but not all.`,
        type: 'caution',
        confidence,
        priority: 2,
      });
    } else if (percent >= minPercent) {
      recommendations.push({
        message: 'Zero cushion. Attend every lecture today.',
        type: 'warning',
        confidence,
        priority: 1,
      });
    }
  }

  if (percent < minPercent) {
    const recovery = calculateRequiredAttendance(attended, total, minPercent, 30);
    recommendations.push({
      message: `You are below ${minPercent}%. Attend the next ${recovery.mustAttend} lectures to recover.`,
      type: 'danger',
      confidence,
      priority: 1,
    });
  }

  if (percent >= minPercent + 10) {
    recommendations.push({
      message: `Excellent standing. You have a comfortable cushion of ${safeBunks} safe bunks.`,
      type: 'success',
      confidence,
      priority: 3,
    });
  }

  if (percent >= minPercent && percent < minPercent + 3) {
    recommendations.push({
      message: `You are only ${(percent - minPercent).toFixed(1)}% above the minimum. Be careful.`,
      type: 'caution',
      confidence,
      priority: 2,
    });
  }

  if (safeBunks > 0 && safeBunks <= 3 && percent >= minPercent) {
    recommendations.push({
      message: `Only ${safeBunks} safe bunk${safeBunks === 1 ? '' : 's'} remaining. Plan carefully.`,
      type: 'caution',
      confidence,
      priority: 2,
    });
  }

  if (!hasPattern) {
    recommendations.push({
      message: 'Set your weekly schedule in Settings for more accurate predictions.',
      type: 'setup',
      confidence: 'low',
      priority: 5,
    });
  }

  if (total <= 10 && total > 0) {
    recommendations.push({
      message: 'Keep logging daily to improve prediction accuracy.',
      type: 'info',
      confidence: 'low',
      priority: 5,
    });
  }

  const confOrder = { high: 3, medium: 2, low: 1 };
  recommendations.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return (confOrder[b.confidence] || 0) - (confOrder[a.confidence] || 0);
  });

  return recommendations.slice(0, 5);
};

export const getAttendanceStatus = (percent, goalPercent) => {
  const diff = percent - goalPercent;
  if (diff >= 10) return 'excellent';
  if (diff >= 0) return 'safe';
  if (diff >= -5) return 'needs_attention';
  if (diff >= -15) return 'warning';
  if (diff >= -25) return 'critical';
  return 'danger';
};
