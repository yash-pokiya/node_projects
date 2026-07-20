const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down server...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Database connection
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log('MongoDB connection successful.');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Start server
const server = app.listen(config.port, () => {
  console.log(`AttendX server running on port ${config.port} in ${config.nodeEnv} mode.`);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down server gracefully...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
