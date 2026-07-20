const attendanceService = require('../services/attendanceService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Mark a single attendance slot
 */
exports.markAttendance = asyncHandler(async (req, res) => {
  const record = await attendanceService.markAttendance(req.user._id, req.body);
  res.status(200).json({
    success: true,
    message: 'Attendance marked successfully',
    data: {
      record,
    },
  });
});

/**
 * Revert the last logged attendance count
 */
exports.undoLastLog = asyncHandler(async (req, res) => {
  const stats = await attendanceService.revertLastLog(req.user._id);
  res.status(200).json({
    success: true,
    message: 'Last update successfully reverted',
    data: stats,
  });
});

/**
 * Bulk mark multiple attendance slots
 */
exports.bulkMarkAttendance = asyncHandler(async (req, res) => {
  const entries = Array.isArray(req.body) ? req.body : (req.body.entries || []);
  const records = await attendanceService.bulkMarkAttendance(req.user._id, entries);
  res.status(200).json({
    success: true,
    message: 'Bulk attendance marked successfully',
    data: {
      records,
    },
  });
});

/**
 * Get attendance records for calendar view date ranges
 */
exports.getCalendar = asyncHandler(async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    const error = new Error('Start date and End date queries are required');
    error.statusCode = 400;
    throw error;
  }

  const records = await attendanceService.getAttendanceForDateRange(
    req.user._id,
    start,
    end
  );

  res.status(200).json({
    success: true,
    data: {
      records,
    },
  });
});

/**
 * Fetch calculated statistical summaries
 */
exports.getStats = asyncHandler(async (req, res) => {
  const stats = await attendanceService.getAttendanceStats(req.user._id);

  res.status(200).json({
    success: true,
    data: stats,
  });
});
