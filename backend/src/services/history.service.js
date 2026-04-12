const { query, queryOne } = require('../config/database');
const ApiError = require('../utils/ApiError');

class HistoryService {
  async getUserHistory(userId, page = 1, limit = 20) {
    const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const [items, countResult] = await Promise.all([
      query(
        `SELECT id, action_type, entity_type, entity_id, summary,
                metadata, career_score_at_time, created_at
         FROM history WHERE user_id = ?
         ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${offset}`,
        [userId]
      ),
      queryOne('SELECT COUNT(*) as total FROM history WHERE user_id = ?', [userId])
    ]);

    return {
      items: items.map(item => ({
        id: item.id,
        actionType: item.action_type,
        entityType: item.entity_type,
        entityId: item.entity_id,
        summary: item.summary,
        metadata: item.metadata,
        careerScoreAtTime: parseFloat(item.career_score_at_time) || null,
        createdAt: item.created_at
      })),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / safeLimit)
      }
    };
  }

  async getTimeline(userId) {
    const items = await query(
      `SELECT action_type, summary, career_score_at_time, created_at
       FROM history WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );

    return items.map(item => ({
      type: item.action_type,
      summary: item.summary,
      score: parseFloat(item.career_score_at_time) || null,
      date: item.created_at
    }));
  }
}

module.exports = new HistoryService();
