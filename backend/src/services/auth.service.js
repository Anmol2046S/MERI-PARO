const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, queryOne, insert } = require('../config/database');
const { env } = require('../config/env');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// Strip HTML tags to prevent stored XSS
const stripHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
};

class AuthService {
  async register({ email, password, firstName, lastName }) {
    const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      throw ApiError.conflict('Email already registered');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await insert(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, career_score)
       VALUES (?, ?, ?, ?, 'user', 0.00)`,
      [email, passwordHash, stripHtml(firstName), stripHtml(lastName)]
    );

    const user = await queryOne(
      'SELECT id, email, first_name, last_name, role, career_score FROM users WHERE id = ?',
      [result.insertId]
    );

    const token = this.generateToken(user.id, user.role);

    logger.info(`New user registered: ${email}`);

    return {
      user: this.formatUser(user),
      token
    };
  }

  async login({ email, password }) {
    const user = await queryOne(
      'SELECT id, email, password_hash, first_name, last_name, role, career_score, is_active FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.is_active) {
      throw ApiError.forbidden('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    await insert('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    const token = this.generateToken(user.id, user.role);

    logger.info(`User logged in: ${email}`);

    return {
      user: this.formatUser(user),
      token
    };
  }

  async getProfile(userId) {
    const user = await queryOne(
      `SELECT id, email, first_name, last_name, role, avatar_url, phone,
              location, bio, career_score, created_at, last_login
       FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const skills = await query(
      `SELECT s.name, s.category, s.demand_score, us.proficiency_level, us.years_experience
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?
       ORDER BY us.proficiency_level DESC`,
      [userId]
    );

    return {
      ...this.formatUser(user),
      skills
    };
  }

  async updateProfile(userId, updates) {
    const fieldMap = {
      firstName: 'first_name',
      lastName: 'last_name',
      phone: 'phone',
      location: 'location',
      bio: 'bio'
    };

    const setClauses = [];
    const values = [];

    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) {
        // Sanitize all string inputs to prevent stored XSS
        const sanitizedValue = typeof updates[key] === 'string' ? stripHtml(updates[key]) : updates[key];
        setClauses.push(`${dbField} = ?`);
        values.push(sanitizedValue);
      }
    }

    if (setClauses.length === 0) {
      throw ApiError.badRequest('No valid fields to update');
    }

    values.push(userId);
    await insert(
      `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`,
      values
    );

    return this.getProfile(userId);
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await queryOne('SELECT id, password_hash FROM users WHERE id = ?', [userId]);
    if (!user) throw ApiError.notFound('User not found');

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) throw ApiError.unauthorized('Current password is incorrect');

    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);
    await insert('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);

    logger.info(`Password changed for user ${userId}`);
    return { message: 'Password changed successfully' };
  }

  generateToken(userId, role) {
    return jwt.sign(
      { userId, role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }

  formatUser(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      avatarUrl: user.avatar_url || null,
      phone: user.phone || null,
      location: user.location || null,
      bio: user.bio || null,
      careerScore: parseFloat(user.career_score) || 0,
      createdAt: user.created_at,
      lastLogin: user.last_login
    };
  }
}

module.exports = new AuthService();
