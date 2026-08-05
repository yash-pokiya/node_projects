const express = require('express');
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getStatsOverview,
} = require('../controllers/question.controller');
const { questionValidator } = require('../validators/question.validator');
const protect = require('../middleware/auth.middleware');
const restrictToAdmin = require('../middleware/admin.middleware');

const router = express.Router();

// Apply auth + admin restriction to all question routes
router.use(protect);
router.use(restrictToAdmin);

router.get('/stats/overview', getStatsOverview);

router.route('/')
  .get(getAllQuestions)
  .post(questionValidator, createQuestion);

router.route('/:id')
  .get(getQuestionById)
  .put(questionValidator, updateQuestion)
  .delete(deleteQuestion);

module.exports = router;
