const config = require('../config');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let errors = err.errors || undefined;

  // Log full error in development mode
  if (!config.isProduction) {
    console.error('Error Handler Triggered:', err);
  } else {
    console.error(`Error: ${err.message}`);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errorCode = 'VALIDATION_ERROR';
    errors = Object.values(err.errors).map((el) => el.message);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `An account with this ${field} already exists.`;
    errorCode = 'DUPLICATE_KEY_ERROR';
  }

  // Handle Mongoose Cast Error (Invalid Object IDs)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for path: ${err.path}`;
    errorCode = 'CAST_ERROR';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
    errorCode = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired. Please refresh your session.';
    errorCode = 'TOKEN_EXPIRED';
  }

  // Format response in strict consistent failure format
  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    details: errors || undefined,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
