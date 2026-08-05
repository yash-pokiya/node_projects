const Question = require('../models/Question.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all questions (with pagination, filtering & search)
// @route   GET /api/questions
// @access  Private/Admin
const getAllQuestions = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const { category, difficulty, search } = req.query;

  // Build query
  const queryObj = {};

  if (category) {
    queryObj.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  if (difficulty) {
    queryObj.difficulty = difficulty;
  }

  if (search) {
    queryObj.title = { $regex: search, $options: 'i' };
  }

  const total = await Question.countDocuments(queryObj);
  const questions = await Question.find(queryObj)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    questions,
    total,
    page,
    totalPages,
  });
});

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private/Admin
const getQuestionById = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new AppError('Question not found', 404));
  }

  res.status(200).json({
    success: true,
    question,
  });
});

// @desc    Create new question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = asyncHandler(async (req, res, next) => {
  const { title, options, correctAnswers, difficulty, category } = req.body;

  const question = await Question.create({
    title,
    options,
    correctAnswers,
    difficulty,
    category,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    msg: 'Question created successfully',
    question,
  });
});

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = asyncHandler(async (req, res, next) => {
  const { title, options, correctAnswers, difficulty, category } = req.body;

  const question = await Question.findByIdAndUpdate(
    req.params.id,
    {
      title,
      options,
      correctAnswers,
      difficulty,
      category,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!question) {
    return next(new AppError('Question not found', 404));
  }

  res.status(200).json({
    success: true,
    msg: 'Question updated successfully',
    question,
  });
});

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    return next(new AppError('Question not found', 404));
  }

  res.status(200).json({
    success: true,
    msg: 'Question deleted successfully',
  });
});

// @desc    Get questions stats overview
// @route   GET /api/questions/stats/overview
// @access  Private/Admin
const getStatsOverview = asyncHandler(async (req, res, next) => {
  const total = await Question.countDocuments();
  const active = await Question.countDocuments({ isActive: true });

  const difficultyStats = await Question.aggregate([
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 },
      },
    },
  ]);

  const categoryStats = await Question.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        count: 1,
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  // Format difficulty stats object
  const byDifficulty = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  difficultyStats.forEach((stat) => {
    if (byDifficulty[stat._id] !== undefined) {
      byDifficulty[stat._id] = stat.count;
    }
  });

  res.status(200).json({
    success: true,
    stats: {
      total,
      active,
      byDifficulty,
      byCategory: categoryStats,
    },
  });
});

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getStatsOverview,
};
