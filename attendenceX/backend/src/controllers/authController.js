const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config');
const jwt = require('jsonwebtoken');

// Helper to set Cookie attributes safely
const setRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
  };
  res.cookie('refreshToken', token, cookieOptions);
};

/**
 * Signup Account
 */
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.signup({
    name,
    email,
    password,
  });

  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.toDTO(),
      accessToken,
    },
  });
});

/**
 * Log In User
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.login(
    email,
    password
  );

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: user.toDTO(),
      accessToken,
    },
  });
});

/**
 * Token Refresh Rotation
 */
exports.refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  const { accessToken, refreshToken: newRefreshToken, user } = await authService.refresh(token);

  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({
    success: true,
    message: 'Session token refreshed successfully',
    data: {
      user: user.toDTO(),
      accessToken,
    },
  });
});

/**
 * Log Out Account
 */
exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtRefreshSecret);
      await authService.logout(decoded.userId);
    } catch (e) {
      // Invalidate cookie even if token verification fails
    }
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});
