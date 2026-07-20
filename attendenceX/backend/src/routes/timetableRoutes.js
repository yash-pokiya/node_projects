const express = require('express');
const { body, param } = require('express-validator');
const timetableController = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Helper to convert 'HH:mm' string to minutes of the day
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const timetableValidationRules = [
  body('subjectId')
    .notEmpty()
    .withMessage('Subject ID is required')
    .isMongoId()
    .withMessage('Invalid subject ID format'),
  body('cycleType')
    .optional()
    .isIn(['weekly', 'biweekly'])
    .withMessage("Cycle type must be 'weekly' or 'biweekly'"),
  body('weekNumber')
    .optional()
    .isInt({ min: 1, max: 2 })
    .withMessage('Week number must be 1 (Week A) or 2 (Week B)'),
  body('dayOfWeek')
    .notEmpty()
    .withMessage('Day of week is required')
    .isInt({ min: 0, max: 6 })
    .withMessage('Day of week must be between 0 (Sunday) and 6 (Saturday)'),
  body('period')
    .notEmpty()
    .withMessage('Period slot number is required')
    .isInt({ min: 1 })
    .withMessage('Period slot must be a positive integer greater than 0'),
  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .matches(timeRegex)
    .withMessage('Start time must be in HH:mm 24-hour format'),
  body('endTime')
    .notEmpty()
    .withMessage('End time is required')
    .matches(timeRegex)
    .withMessage('End time must be in HH:mm 24-hour format')
    .custom((value, { req }) => {
      const start = req.body.startTime;
      if (start && value && timeToMinutes(value) <= timeToMinutes(start)) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  body('classroom')
    .optional()
    .trim(),
];

router.route('/')
  .get(timetableController.getTimetable)
  .post(
    [
      ...timetableValidationRules,
      validate,
    ],
    timetableController.createTimetableEntry
  );

router.route('/:id')
  .patch(
    [
      param('id').isMongoId().withMessage('Invalid entry ID format'),
      body('subjectId')
        .optional()
        .isMongoId()
        .withMessage('Invalid subject ID format'),
      body('cycleType')
        .optional()
        .isIn(['weekly', 'biweekly'])
        .withMessage("Cycle type must be 'weekly' or 'biweekly'"),
      body('weekNumber')
        .optional()
        .isInt({ min: 1, max: 2 })
        .withMessage('Week number must be 1 or 2'),
      body('dayOfWeek')
        .optional()
        .isInt({ min: 0, max: 6 })
        .withMessage('Day of week must be between 0 (Sunday) and 6 (Saturday)'),
      body('period')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Period slot must be a positive integer'),
      body('startTime')
        .optional()
        .matches(timeRegex)
        .withMessage('Start time must be in HH:mm format'),
      body('endTime')
        .optional()
        .matches(timeRegex)
        .withMessage('End time must be in HH:mm format')
        .custom((value, { req }) => {
          // In patch, if start/end times are provided, compare them.
          // Fallback comparison if only one is updated will be checked downstream or handled simply here.
          const start = req.body.startTime;
          if (start && value && timeToMinutes(value) <= timeToMinutes(start)) {
            throw new Error('End time must be after start time');
          }
          return true;
        }),
      body('classroom')
        .optional()
        .trim(),
      validate,
    ],
    timetableController.updateTimetableEntry
  )
  .delete(
    [
      param('id').isMongoId().withMessage('Invalid entry ID format'),
      validate,
    ],
    timetableController.deleteTimetableEntry
  );

module.exports = router;
