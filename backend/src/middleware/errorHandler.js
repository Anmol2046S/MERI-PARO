const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');
const logger = require('../utils/logger');

// Fields that should never appear in error logs
const SENSITIVE_FIELDS = ['password', 'confirmPassword', 'token', 'authorization', 'secret', 'passwordHash'];

const sanitizeBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  const sanitized = { ...body };
  for (const key of Object.keys(sanitized)) {
    if (SENSITIVE_FIELDS.some(f => key.toLowerCase().includes(f.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  return sanitized;
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors.length > 0 && { errors: error.errors }),
    ...(env.NODE_ENV === 'development' && { stack: error.stack })
  };

  if (error.statusCode >= 500) {
    logger.error(`${error.statusCode} - ${error.message}`, {
      url: req.originalUrl,
      method: req.method,
      body: sanitizeBody(req.body),
      stack: error.stack
    });
  } else {
    logger.warn(`${error.statusCode} - ${error.message}`, {
      url: req.originalUrl,
      method: req.method
    });
  }

  res.status(error.statusCode).json(response);
};

module.exports = { errorHandler };
