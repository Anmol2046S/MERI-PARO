const { query, queryOne, insert } = require('../config/database');
const ApiError = require('../utils/ApiError');

class AdminService {
  async getAllUsers(page = 1, limit = 20, search = '') {
    const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    let whereClause = '';
    const params = [];

    if (search) {
      whereClause = 'WHERE email LIKE ? OR first_name LIKE ? OR last_name LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const users = await query(
      `SELECT id, email, first_name, last_name, role, career_score,
              is_active, last_login, created_at
       FROM users ${whereClause}
       ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${offset}`,
      params
    );

    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    return {
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.first_name,
        lastName: u.last_name,
        role: u.role,
        careerScore: parseFloat(u.career_score),
        isActive: u.is_active,
        lastLogin: u.last_login,
        createdAt: u.created_at
      })),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / safeLimit)
      }
    };
  }

  async getSystemAnalytics() {
    const [userStats, topSkills, popularRoles, recentPredictions, usageByDay, modelDistribution] = await Promise.all([
      query(`SELECT COUNT(*) as total_users,
              SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
              SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
              AVG(career_score) as avg_career_score,
              SUM(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as weekly_active
            FROM users`),
      query(`SELECT s.name, s.category, COUNT(us.id) as user_count, s.demand_score
            FROM skills s LEFT JOIN user_skills us ON s.id = us.skill_id
            GROUP BY s.id ORDER BY user_count DESC LIMIT 15`),
      query(`SELECT top_prediction as role, COUNT(*) as count, AVG(confidence_score) as avg_confidence
            FROM predictions WHERE prediction_type = 'job_role' AND top_prediction IS NOT NULL
            GROUP BY top_prediction ORDER BY count DESC LIMIT 10`),
      query(`SELECT prediction_type, model_type, top_prediction, confidence_score, created_at
            FROM predictions ORDER BY created_at DESC LIMIT 10`),
      query(`SELECT DATE(created_at) as date, COUNT(*) as actions
            FROM history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at) ORDER BY date ASC`),
      query(`SELECT model_type, COUNT(*) as count FROM predictions GROUP BY model_type`)
    ]);

    const resumeStats = await queryOne(`SELECT COUNT(*) as total_resumes,
      SUM(CASE WHEN parsing_status = 'completed' THEN 1 ELSE 0 END) as parsed,
      SUM(CASE WHEN parsing_status = 'failed' THEN 1 ELSE 0 END) as failed,
      AVG(ats_score) as avg_ats_score FROM resumes`);

    return {
      users: userStats[0] || {},
      resumes: resumeStats || {},
      topSkills,
      popularRoles,
      recentPredictions,
      usageByDay,
      modelDistribution
    };
  }

  async toggleUserStatus(userId, requestingUserId) {
    const user = await queryOne('SELECT id, is_active, role FROM users WHERE id = ?', [userId]);
    if (!user) throw ApiError.notFound('User not found');

    // Prevent admin from deactivating themselves
    if (String(userId) === String(requestingUserId)) {
      throw ApiError.badRequest('You cannot deactivate your own account');
    }

    const newStatus = !user.is_active;
    await insert('UPDATE users SET is_active = ? WHERE id = ?', [newStatus ? 1 : 0, userId]);

    return { userId: parseInt(userId), isActive: newStatus };
  }
}

module.exports = new AdminService();
