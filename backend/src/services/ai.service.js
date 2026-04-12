const axios = require('axios');
const { query, queryOne, insert } = require('../config/database');
const { env } = require('../config/env');
const { cacheGet, cacheSet } = require('../config/redis');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class AIService {
  async getRecommendations(userId) {
    const cacheKey = `recommendations_${userId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const user = await queryOne('SELECT * FROM users WHERE id = ?', [userId]);

    const skills = await query(
      `SELECT s.name, s.category, s.demand_score, us.proficiency_level
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?`,
      [userId]
    );

    const latestPrediction = await queryOne(
      `SELECT results, top_prediction FROM predictions
       WHERE user_id = ? AND prediction_type = 'job_role'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    const latestGap = await queryOne(
      `SELECT * FROM skill_gaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    let aiRecommendations;
    try {
      const missingSkills = latestGap
        ? (typeof latestGap.missing_skills === 'string' ? JSON.parse(latestGap.missing_skills) : (latestGap.missing_skills || []))
        : [];

      const response = await axios.post(
        `${env.AI_SERVICE_URL}/api/recommendations/generate`,
        {
          skills: skills.map(s => ({ name: s.name, category: s.category, proficiency: s.proficiency_level })),
          target_role: latestPrediction?.top_prediction || null,
          missing_skills: missingSkills,
          career_score: user.career_score
        },
        { timeout: 20000 }
      );
      aiRecommendations = response.data.recommendations || [];
    } catch (aiError) {
      logger.warn('AI recommendation service unavailable, using rule-based fallback');
      aiRecommendations = this.generateRuleBasedRecommendations(skills, latestGap, latestPrediction);
    }

    // Delete existing recommendations before inserting new ones to prevent duplicates
    try {
      await query('DELETE FROM recommendations WHERE user_id = ? AND is_completed = 0', [userId]);
    } catch (err) {
      logger.warn('Failed to clean old recommendations:', err.message);
    }

    // Store recommendations
    for (const rec of aiRecommendations) {
      try {
        await insert(
          `INSERT INTO recommendations (user_id, type, title, description, provider, url, priority, estimated_duration, relevance_score, source)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            rec.type || 'course',
            rec.title,
            rec.description || '',
            rec.provider || null,
            rec.url || null,
            rec.priority || 'medium',
            rec.estimated_duration || null,
            rec.relevance_score || 50,
            rec.source || 'hybrid'
          ]
        );
      } catch (err) {
        logger.warn('Failed to store recommendation:', err.message);
      }
    }

    await insert(
      `INSERT INTO history (user_id, action_type, summary)
       VALUES (?, 'recommendation', ?)`,
      [userId, `Generated ${aiRecommendations.length} recommendations`]
    );

    await cacheSet(cacheKey, aiRecommendations, 1800);

    return aiRecommendations;
  }

  generateRuleBasedRecommendations(skills, latestGap, latestPrediction) {
    const recommendations = [];
    const skillNames = skills.map(s => s.name.toLowerCase());
    const missingSkills = latestGap
      ? (typeof latestGap.missing_skills === 'string' ? JSON.parse(latestGap.missing_skills) : (latestGap.missing_skills || []))
      : [];

    const skillCourseMap = {
      'react': { title: 'Complete React Developer Course', provider: 'Udemy', duration: '40 hours', url: 'https://udemy.com' },
      'python': { title: 'Python for Data Science & ML', provider: 'Coursera', duration: '60 hours', url: 'https://coursera.org' },
      'node.js': { title: 'Node.js Backend Masterclass', provider: 'Udemy', duration: '35 hours', url: 'https://udemy.com' },
      'docker': { title: 'Docker & Kubernetes Complete Guide', provider: 'Udemy', duration: '30 hours', url: 'https://udemy.com' },
      'aws': { title: 'AWS Solutions Architect Associate', provider: 'AWS', duration: '80 hours', url: 'https://aws.amazon.com/training' },
      'machine learning': { title: 'Machine Learning Specialization', provider: 'Coursera', duration: '120 hours', url: 'https://coursera.org' },
      'tensorflow': { title: 'TensorFlow Developer Certificate', provider: 'Google', duration: '100 hours', url: 'https://tensorflow.org/certificate' },
      'sql': { title: 'SQL & Database Design A-Z', provider: 'Udemy', duration: '20 hours', url: 'https://udemy.com' },
      'kubernetes': { title: 'Certified Kubernetes Administrator', provider: 'Linux Foundation', duration: '60 hours', url: 'https://kubernetes.io' },
      'typescript': { title: 'TypeScript Deep Dive', provider: 'Frontend Masters', duration: '25 hours', url: 'https://frontendmasters.com' },
      'git': { title: 'Git Complete Guide', provider: 'Udemy', duration: '15 hours', url: 'https://udemy.com' },
      'figma': { title: 'UI/UX Design with Figma', provider: 'Coursera', duration: '30 hours', url: 'https://coursera.org' }
    };

    for (const missingSkill of missingSkills.slice(0, 5)) {
      const courseInfo = skillCourseMap[missingSkill.toLowerCase()];
      if (courseInfo) {
        recommendations.push({
          type: 'course',
          title: courseInfo.title,
          description: `Learn ${missingSkill} to fill your skill gap and improve your career prospects.`,
          provider: courseInfo.provider,
          url: courseInfo.url,
          priority: 'high',
          estimated_duration: courseInfo.duration,
          relevance_score: 85,
          source: 'rule_based'
        });
      } else {
        recommendations.push({
          type: 'course',
          title: `Learn ${missingSkill}`,
          description: `${missingSkill} is a required skill for your target role.`,
          provider: 'Various',
          url: `https://www.google.com/search?q=learn+${encodeURIComponent(missingSkill)}+course`,
          priority: 'high',
          estimated_duration: '20-40 hours',
          relevance_score: 70,
          source: 'rule_based'
        });
      }
    }

    const targetRole = latestPrediction?.top_prediction || '';
    const certMap = {
      'DevOps Engineer': { title: 'AWS Certified DevOps Engineer', provider: 'AWS' },
      'Cloud Architect': { title: 'AWS Solutions Architect Professional', provider: 'AWS' },
      'Data Scientist': { title: 'Google Data Analytics Certificate', provider: 'Google' },
      'ML Engineer': { title: 'TensorFlow Developer Certificate', provider: 'Google' },
      'AI Engineer': { title: 'Deep Learning Specialization', provider: 'deeplearning.ai' },
      'Full Stack Developer': { title: 'Meta Full Stack Developer Certificate', provider: 'Meta' },
      'Frontend Developer': { title: 'Meta Front-End Developer Certificate', provider: 'Meta' }
    };

    if (certMap[targetRole]) {
      recommendations.push({
        type: 'certification',
        title: certMap[targetRole].title,
        description: `Industry-recognized certification for ${targetRole} roles.`,
        provider: certMap[targetRole].provider,
        priority: 'high',
        estimated_duration: '3-6 months',
        relevance_score: 90,
        source: 'rule_based'
      });
    }

    recommendations.push({
      type: 'career_move',
      title: `Career Roadmap: Path to ${targetRole || 'Senior Developer'}`,
      description: `Based on your current skills (${skills.length} total), focus on building depth in your strongest areas while filling critical gaps.`,
      priority: 'medium',
      relevance_score: 75,
      source: 'rule_based'
    });

    // Only add portfolio project recommendation if user has skills
    if (skills.length > 0) {
      const topSkillNames = skills.slice(0, 3).map(s => s.name).join(', ');
      recommendations.push({
        type: 'project',
        title: 'Build a Portfolio Project',
        description: `Create a project that showcases your skills in ${topSkillNames}.`,
        priority: 'medium',
        estimated_duration: '2-4 weeks',
        relevance_score: 80,
        source: 'rule_based'
      });
    }

    return recommendations;
  }

  async getUserRecommendations(userId) {
    return query(
      `SELECT * FROM recommendations WHERE user_id = ? ORDER BY relevance_score DESC, created_at DESC LIMIT 20`,
      [userId]
    );
  }

  async markRecommendationComplete(userId, recommendationId) {
    const rec = await queryOne(
      'SELECT id FROM recommendations WHERE id = ? AND user_id = ?',
      [recommendationId, userId]
    );
    if (!rec) throw ApiError.notFound('Recommendation not found');
    await insert('UPDATE recommendations SET is_completed = 1 WHERE id = ?', [recommendationId]);
    return { message: 'Recommendation marked as completed' };
  }

  async getDashboardData(userId) {
    const cacheKey = `user_dashboard_${userId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const user = await queryOne('SELECT career_score FROM users WHERE id = ?', [userId]);

    const latestPrediction = await queryOne(
      `SELECT results, model_type, created_at FROM predictions
       WHERE user_id = ? AND prediction_type = 'job_role'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    const skills = await query(
      `SELECT s.name, s.category, s.demand_score, us.proficiency_level
       FROM user_skills us JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ? ORDER BY s.demand_score DESC`,
      [userId]
    );

    const latestGap = await queryOne(
      `SELECT target_role, match_percentage, missing_skills, matching_skills
       FROM skill_gaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    const progressHistory = await query(
      `SELECT career_score_at_time, created_at FROM history
       WHERE user_id = ? AND career_score_at_time IS NOT NULL
       ORDER BY created_at ASC LIMIT 30`,
      [userId]
    );

    const resumeCount = await queryOne('SELECT COUNT(*) as cnt FROM resumes WHERE user_id = ?', [userId]);
    const predictionCount = await queryOne('SELECT COUNT(*) as cnt FROM predictions WHERE user_id = ?', [userId]);

    let predictions = [];
    if (latestPrediction?.results) {
      const results = typeof latestPrediction.results === 'string'
        ? JSON.parse(latestPrediction.results) : latestPrediction.results;
      predictions = results.predictions || [];
    }

    let missingSkills = [];
    let matchPercentage = 0;
    if (latestGap) {
      missingSkills = typeof latestGap.missing_skills === 'string'
        ? JSON.parse(latestGap.missing_skills) : (latestGap.missing_skills || []);
      matchPercentage = latestGap.match_percentage || 0;
    }

    const dashboard = {
      careerScore: parseFloat(user?.career_score) || 0,
      predictedRoles: predictions.slice(0, 3),
      skillMatchPercentage: matchPercentage,
      skills,
      missingSkills: missingSkills.slice(0, 10),
      progressHistory: progressHistory.map(h => ({
        score: parseFloat(h.career_score_at_time),
        date: h.created_at
      })),
      stats: {
        totalSkills: skills.length,
        resumeCount: resumeCount?.cnt || 0,
        predictionCount: predictionCount?.cnt || 0,
        targetRole: latestGap?.target_role || predictions[0]?.role || 'Not set'
      }
    };

    await cacheSet(cacheKey, dashboard, 300);
    return dashboard;
  }
}

module.exports = new AIService();
