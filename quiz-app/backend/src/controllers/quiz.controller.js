const mongoose = require('mongoose');
const Question = require('../models/Question.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

// Helper to check array equality (order-independent)
const arraysEqual = (a, b) => {
  if (!a || !b || a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((val, index) => val === sortedB[index]);
};

// Helper to determine grade based on percentage
const getGrade = (percentage) => {
  if (percentage >= 90) return 'A';
  if (percentage >= 75) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

// @desc    Start quiz (Get random 10 active questions without correctAnswers)
// @route   GET /api/quiz/start
// @access  Private
const startQuiz = asyncHandler(async (req, res, next) => {
  // Use MongoDB aggregation to randomly sample 10 active questions
  const questions = await Question.aggregate([
    { $match: { isActive: true } },
    { $sample: { size: 10 } },
  ]);

  if (!questions || questions.length === 0) {
    return next(new AppError('No active questions found in the database. Please contact an admin.', 404));
  }

  // Format questions: Exclude correctAnswers for security
  const formattedQuestions = questions.map((q) => ({
    _id: q._id,
    title: q.title,
    options: q.options.map((opt) => ({
      optionNumber: opt.optionNumber,
      text: opt.text,
    })),
    questionType: q.questionType,
    difficulty: q.difficulty,
    category: q.category,
  }));

  // Generate a mock quizId
  const quizId = new mongoose.Types.ObjectId();

  res.status(200).json({
    success: true,
    questions: formattedQuestions,
    quizId,
    totalQuestions: formattedQuestions.length,
  });
});

// @desc    Submit quiz answers and calculate results
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = asyncHandler(async (req, res, next) => {
  const { quizId, answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return next(new AppError('Invalid request format. Answers must be an array.', 400));
  }

  const questionIds = answers.map((ans) => ans.questionId);

  // Fetch only the submitted questions
  const dbQuestions = await Question.find({ _id: { $in: questionIds } });

  // Map database questions for constant time lookup
  const questionMap = {};
  dbQuestions.forEach((q) => {
    questionMap[q._id.toString()] = q;
  });

  let correctAnswersCount = 0;
  const details = [];

  answers.forEach((ans) => {
    const q = questionMap[ans.questionId];
    if (q) {
      const isCorrect = arraysEqual(ans.selectedOptions, q.correctAnswers);
      if (isCorrect) {
        correctAnswersCount += 1;
      }

      details.push({
        questionId: q._id,
        title: q.title,
        yourAnswer: ans.selectedOptions || [],
        correctAnswer: q.correctAnswers,
        isCorrect,
      });
    }
  });

  const totalQuestions = answers.length;
  const wrongAnswers = totalQuestions - correctAnswersCount;
  const percentageValue = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;
  const grade = getGrade(percentageValue);

  res.status(200).json({
    success: true,
    result: {
      totalQuestions,
      correctAnswers: correctAnswersCount,
      wrongAnswers,
      score: `${correctAnswersCount} out of ${totalQuestions}`,
      percentage: `${percentageValue}%`,
      grade,
      details,
    },
  });
});

module.exports = {
  startQuiz,
  submitQuiz,
};
