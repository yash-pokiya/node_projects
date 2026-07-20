const timetableService = require('../services/timetableService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Schedule a new class slot cycle
 */
exports.createTimetableEntry = asyncHandler(async (req, res) => {
  const entry = await timetableService.createTimetableEntry(req.user._id, req.body);
  res.status(201).json({
    success: true,
    message: 'Timetable slot scheduled successfully',
    data: {
      entry,
    },
  });
});

/**
 * Fetch all timetable slots (raw and grouped by cycles)
 */
exports.getTimetable = asyncHandler(async (req, res) => {
  const data = await timetableService.getTimetable(req.user._id);
  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * Update timetable slot cycle configurations
 */
exports.updateTimetableEntry = asyncHandler(async (req, res) => {
  const entry = await timetableService.updateTimetableEntry(req.user._id, req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Timetable slot configuration updated successfully',
    data: {
      entry,
    },
  });
});

/**
 * Remove scheduled class slot cycle
 */
exports.deleteTimetableEntry = asyncHandler(async (req, res) => {
  await timetableService.deleteTimetableEntry(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    message: 'Timetable slot deleted successfully',
  });
});
