const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

/**
 * Helper to sign Access Token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    config.jwtAccessSecret,
    { expiresIn: config.accessTokenExpiry }
  );
};

/**
 * Helper to sign Refresh Token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    config.jwtRefreshSecret,
    { expiresIn: config.refreshTokenExpiry }
  );
};

/**
 * Register a new user
 */
const signup = async (userData) => {
  const { name, email, password } = userData;

  // Check unique email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 400;
    throw error;
  }

  // Create new user (pre-save hook hashes passwordHash via Argon2)
  const user = new User({
    name,
    email,
    passwordHash: password,
  });

  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

/**
 * Log in user
 */
const login = async (email, password) => {
  if (!email || !password) {
    const error = new Error('Please provide email and password.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Verify password using Argon2 verify (encapsulated on User method comparePassword)
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save new refresh token (Rotated!)
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

/**
 * Rotate tokens using the refresh token cookie
 */
const refresh = async (token) => {
  if (!token) {
    const error = new Error('Session has expired or is invalid. Please log in again.');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, config.jwtRefreshSecret);
    const user = await User.findById(decoded.userId);

    // Verify token validity and rotation integrity
    if (!user || user.refreshToken !== token) {
      const error = new Error('Session has expired or is invalid. Please log in again.');
      error.statusCode = 401;
      throw error;
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Rotate refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
  } catch (err) {
    const error = new Error('Session validation failed. Please log in again.');
    error.statusCode = 401;
    throw error;
  }
};

/**
 * Log out user (Invalidate token)
 */
const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
};
