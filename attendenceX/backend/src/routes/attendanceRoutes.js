const express = require('express');
const { body, query } = require('express-validator');
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(
    [
      body('totalLectures')
        .notEmpty().withMessage('Total lectures is required')
        .isInt({ min: 0 }).withMessage('Total lectures must be a positive integer'),
      body('attendedLectures')
        .notEmpty().withMessage('Attended lectures is required')
        .isInt({ min: 0 }).withMessage('Attended lectures must be a positive integer'),
      body('date')
        .optional()
        .isISO8601().withMessage('Date must be in valid ISO8601 format'),
      validate,
    ],
    attendanceController.markAttendance
  );

router.route('/bulk')
  .post(attendanceController.bulkMarkAttendance);

router.route('/undo')
  .post(attendanceController.undoLastLog);

router.route('/calendar')
  .get(
    [
      query('start').notEmpty().withMessage('Start date query is required').isISO8601().withMessage('Start date must be in ISO8601 format'),
      query('end').notEmpty().withMessage('End date query is required').isISO8601().withMessage('End date must be in ISO8601 format'),
      validate,
    ],
    attendanceController.getCalendar
  );

router.route('/stats')
  .get(attendanceController.getStats);

module.exports = router;
