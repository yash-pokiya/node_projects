const Timetable = require('../models/Timetable');
const Subject = require('../models/Subject');

/**
 * Schedule a new class slot cycle
 */
const createTimetableEntry = async (userId, data) => {
  // Verify course subject exists and belongs to this student
  const subject = await Subject.findOne({ _id: data.subjectId, userId, isActive: true });
  if (!subject) {
    const error = new Error('Subject not found or has been deleted');
    error.statusCode = 404;
    throw error;
  }

  const entry = new Timetable({
    ...data,
    userId,
  });

  return await entry.save();
};

/**
 * Get all timetable scheduled slots grouped by day of week and cycle week numbers
 */
const getTimetable = async (userId) => {
  const entries = await Timetable.find({ userId })
    .populate('subjectId', 'name color code')
    .sort({ period: 1 });

  // Initialize unified week structures
  const initWeekStructure = () => ({
    0: [], // Sunday
    1: [], // Monday
    2: [], // Tuesday
    3: [], // Wednesday
    4: [], // Thursday
    5: [], // Friday
    6: [], // Saturday
  });

  const grouped = {
    weeklyOnly: initWeekStructure(),
    week1: initWeekStructure(), // Combines weekly + Week 1 bi-weekly
    week2: initWeekStructure(), // Combines weekly + Week 2 bi-weekly
  };

  entries.forEach((entry) => {
    const day = entry.dayOfWeek;
    
    if (entry.cycleType === 'weekly') {
      grouped.weeklyOnly[day].push(entry);
      grouped.week1[day].push(entry);
      grouped.week2[day].push(entry);
    } else if (entry.cycleType === 'biweekly') {
      if (entry.weekNumber === 1) {
        grouped.week1[day].push(entry);
      } else if (entry.weekNumber === 2) {
        grouped.week2[day].push(entry);
      }
    }
  });

  // Sort periods in ascending order
  const sortPeriodFn = (a, b) => a.period - b.period;
  for (let d = 0; d <= 6; d++) {
    grouped.weeklyOnly[d].sort(sortPeriodFn);
    grouped.week1[d].sort(sortPeriodFn);
    grouped.week2[d].sort(sortPeriodFn);
  }

  return { grouped, raw: entries };
};

/**
 * Update timetable cycle configurations
 */
const updateTimetableEntry = async (userId, entryId, updateData) => {
  const entry = await Timetable.findOne({ _id: entryId, userId });
  if (!entry) {
    const error = new Error('Timetable entry not found');
    error.statusCode = 404;
    throw error;
  }

  // If changing subject, ensure student owns the target subject
  if (updateData.subjectId && updateData.subjectId.toString() !== entry.subjectId.toString()) {
    const subject = await Subject.findOne({ _id: updateData.subjectId, userId, isActive: true });
    if (!subject) {
      const error = new Error('New subject not found or has been deleted');
      error.statusCode = 404;
      throw error;
    }
    entry.subjectId = updateData.subjectId;
  }

  // Assign updates
  const allowedFields = ['cycleType', 'weekNumber', 'dayOfWeek', 'period', 'startTime', 'endTime', 'classroom', 'instructorName'];
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      entry[field] = updateData[field];
    }
  });

  return await entry.save();
};

/**
 * Remove class slot cycle from database
 */
const deleteTimetableEntry = async (userId, entryId) => {
  const entry = await Timetable.findOneAndDelete({ _id: entryId, userId });
  if (!entry) {
    const error = new Error('Timetable entry not found');
    error.statusCode = 404;
    throw error;
  }
  return entry;
};

module.exports = {
  createTimetableEntry,
  getTimetable,
  updateTimetableEntry,
  deleteTimetableEntry,
};
