const express = require('express');
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(profileController.getProfile)
  .patch(
    [
      body('minimumAttendancePercent')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Minimum attendance percentage must be a number between 0 and 100'),
      body('averageLecturesPerDay')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Average lectures per day must be an integer between 1 and 20'),
      body('startingTotalLectures')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Starting total lectures must be a positive integer'),
      body('startingAttendedLectures')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Starting attended lectures must be a positive integer'),
      body('weeklyPattern')
        .optional()
        .isArray()
        .withMessage('Weekly pattern must be an array of daily capacity values'),
      body('theme')
        .optional()
        .isIn(['light', 'dark'])
        .withMessage("Theme must be 'light' or 'dark'"),
      validate,
    ],
    profileController.updateProfile
  );

module.exports = router;
