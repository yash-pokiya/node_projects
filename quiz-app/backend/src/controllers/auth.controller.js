const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

// Helper to sign JWT tokens
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered', 400));
  }

  // Create new user
  const newUser = await User.create({
    name,
    email,
    password,
    role: role || 'user',
  });

  // Generate JWT token
  const token = signToken(newUser._id);

  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({
    success: true,
    msg: 'Registration successful',
    token,
    user: newUser,
  });
});

// @desc    Log in a user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user and select password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Generate token
  const token = signToken(user._id);

  // Remove password from response
  user.password = undefined;

  res.status(200).json({
    success: true,
    msg: 'Login successful',
    token,
    user,
  });
});

// @desc    Get currently logged in user info
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  // req.user is already fetched in protect middleware
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = {
  register,
  login,
  getMe,
};
