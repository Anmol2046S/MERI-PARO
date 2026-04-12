const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { queryOne } = require('../config/database');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Invalid token format');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr instanceof jwt.TokenExpiredError) {
        return next(ApiError.unauthorized('Token expired'));
      }
      return next(ApiError.unauthorized('Invalid token'));
    }

    const user = await queryOne(
      'SELECT id, email, first_name, last_name, role, career_score, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.is_active) {
      throw ApiError.forbidden('Account is deactivated');
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      careerScore: user.career_score
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(ApiError.unauthorized('Authentication failed'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
