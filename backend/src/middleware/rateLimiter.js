const rateLimit = require('express-rate-limit');

// Proxy-aware key generator
const keyGenerator = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    statusCode: 429,
    message: 'AI processing rate limit reached. Please wait.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator
});

module.exports = { rateLimiter, authLimiter, aiLimiter };
