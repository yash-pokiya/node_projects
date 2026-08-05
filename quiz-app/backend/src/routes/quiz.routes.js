const express = require('express');
const { startQuiz, submitQuiz } = require('../controllers/quiz.controller');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth protection to all quiz routes
router.use(protect);

router.get('/start', startQuiz);
router.post('/submit', submitQuiz);

module.exports = router;
