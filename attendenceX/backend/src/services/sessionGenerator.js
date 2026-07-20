const Timetable = require('../models/Timetable');
const LectureSession = require('../models/LectureSession');
const Holiday = require('../models/Holiday');
const Attendance = require('../models/Attendance');

/**
 * Calculates the ISO Week Number of the year for a given Date
 */
const getISOWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

/**
 * Normalizes date to midnight UTC
 */
const normalizeToMidnightUTC = (date) => {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

/**
 * Ensures all scheduled lecture sessions are created in the ledger for a target date.
 * Returns the list of created or existing sessions for the day.
 */
exports.ensureSessionsForDate = async (userId, dateInput) => {
  const targetDate = normalizeToMidnightUTC(dateInput);
  const dayOfWeek = targetDate.getUTCDay();
  const isoWeek = getISOWeek(targetDate);
  const weekNumber = isoWeek % 2 === 0 ? 2 : 1; // ISO week even = Week B (2), odd = Week A (1)

  // 1. Fetch matching repeating timetable slots for this weekday and cycle week
  const scheduleSlots = await Timetable.find({
    userId,
    dayOfWeek,
    $or: [
      { cycleType: 'weekly' },
      { cycleType: 'biweekly', weekNumber }
    ]
  }).sort({ period: 1 });

  // If no classes are scheduled, return empty list
  if (scheduleSlots.length === 0) {
    return [];
  }

  // 2. Fetch any registered holidays for this day
  const holiday = await Holiday.findOne({
    userId,
    date: targetDate,
  });

  const sessions = [];

  // 3. For each slot, ensure a LectureSession exists
  for (const slot of scheduleSlots) {
    let session = await LectureSession.findOne({
      userId,
      date: targetDate,
      period: slot.period,
    });

    if (!session) {
      session = await LectureSession.create({
        userId,
        subjectId: slot.subjectId,
        date: targetDate,
        period: slot.period,
        type: 'regular',
      });

      // 4. If a holiday applies to this day, auto-mark attendance as 'holiday'
      if (holiday && (holiday.appliesToAllSubjects || String(holiday.subjectId) === String(slot.subjectId))) {
        await Attendance.findOneAndUpdate(
          { userId, lectureSessionId: session._id },
          { status: 'holiday', remarks: holiday.title },
          { upsert: true, new: true }
        );
      }
    }

    sessions.push(session);
  }

  return LectureSession.find({ userId, date: targetDate }).populate('subjectId').sort({ period: 1 });
};
