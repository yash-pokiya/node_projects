const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    const err = new AppError('Validation failed', 400);
    err.errors = errorMessages;
    return next(err);
  }
  next();
};

const questionValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Question title is required')
    .isLength({ min: 10 })
    .withMessage('Question title must be at least 10 characters long'),
  
  body('options')
    .isArray({ min: 2, max: 5 })
    .withMessage('Questions must have between 2 and 5 options'),
  
  body('options.*.optionNumber')
    .isInt({ min: 1, max: 5 })
    .withMessage('Option number must be an integer between 1 and 5'),

  body('options.*.text')
    .trim()
    .notEmpty()
    .withMessage('Option text is required'),

  body('correctAnswers')
    .isArray({ min: 1 })
    .withMessage('At least one correct answer must be provided'),

  body('correctAnswers.*')
    .isInt({ min: 1, max: 5 })
    .withMessage('Correct answers must correspond to valid option numbers between 1 and 5'),

  body('difficulty')
    .trim()
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
    
  validateResults,
];

module.exports = {
  questionValidator,
};
