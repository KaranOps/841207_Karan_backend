const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  let message = err.message || 'Server Error';
  let statusCode = err.statusCode || 500;

  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected field: ${err.field}`;
    } else {
      message = err.message;
    }
  }

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;