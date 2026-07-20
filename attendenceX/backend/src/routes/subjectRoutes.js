const express = require('express');
const { body, param } = require('express-validator');
const subjectController = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

const colorRegex = /^#([A-Fa-f0-9]{6})$/;

const subjectValidationRules = [
  body('name')
    .notEmpty()
    .withMessage('Subject name is required')
    .trim(),
  body('code')
    .optional()
    .trim(),
  body('credits')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Credits must be a non-negative integer'),
  body('minimumAttendanceOverride')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 100 })
    .withMessage('Minimum attendance override percentage must be between 0 and 100'),
  body('color')
    .optional()
    .matches(colorRegex)
    .withMessage('Color must be a valid 6-character hex string (e.g. #10b981)'),
  body('syllabusOutline')
    .optional()
    .isArray()
    .withMessage('Syllabus outline must be an array of topics'),
  body('syllabusOutline.*.topic')
    .optional()
    .notEmpty()
    .withMessage('Syllabus topic name cannot be empty')
    .trim(),
  body('syllabusOutline.*.isCompleted')
    .optional()
    .isBoolean()
    .withMessage('Topic completion status must be a boolean'),
];

router.route('/')
  .get(subjectController.getSubjects)
  .post(
    [
      ...subjectValidationRules,
      validate,
    ],
    subjectController.createSubject
  );

router.route('/:id')
  .get(
    [
      param('id').isMongoId().withMessage('Invalid subject ID format'),
      validate,
    ],
    subjectController.getSubjectById
  )
  .patch(
    [
      param('id').isMongoId().withMessage('Invalid subject ID format'),
      body('name')
        .optional()
        .notEmpty()
        .withMessage('Subject name cannot be empty')
        .trim(),
      body('code')
        .optional()
        .trim(),
      body('credits')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Credits must be a non-negative integer'),
      body('minimumAttendanceOverride')
        .optional({ nullable: true })
        .isFloat({ min: 0, max: 100 })
        .withMessage('Minimum attendance override percentage must be between 0 and 100'),
      body('color')
        .optional()
        .matches(colorRegex)
        .withMessage('Color must be a valid 6-character hex string'),
      body('syllabusOutline')
        .optional()
        .isArray()
        .withMessage('Syllabus outline must be an array'),
      body('syllabusOutline.*.topic')
        .optional()
        .notEmpty()
        .withMessage('Syllabus topic name cannot be empty')
        .trim(),
      body('syllabusOutline.*.isCompleted')
        .optional()
        .isBoolean()
        .withMessage('Topic completion status must be a boolean'),
      validate,
    ],
    subjectController.updateSubject
  )
  .delete(
    [
      param('id').isMongoId().withMessage('Invalid subject ID format'),
      validate,
    ],
    subjectController.deleteSubject
  );

module.exports = router;
