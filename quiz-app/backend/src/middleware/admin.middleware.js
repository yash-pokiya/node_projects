const AppError = require('../utils/AppError');

const restrictToAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};

module.exports = restrictToAdmin;
