const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const FormData = require('form-data');
const { query, queryOne, insert } = require('../config/database');
const { env } = require('../config/env');
const { cacheGet, cacheSet, cacheDelete } = require('../config/redis');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class ResumeService {
  /**
   * Resolves and validates that the given file path is within the uploads directory.
   * Prevents path traversal attacks.
   */
  _safePath(filePath) {
    const uploadsDir = path.resolve(__dirname, '..', '..', env.UPLOAD_DIR);
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(uploadsDir)) {
      throw ApiError.badRequest('Invalid file path');
    }
    return resolved;
  }

  async uploadResume(userId, file) {
    if (!file) {
      throw ApiError.badRequest('Resume file is required');
    }

    const result = await insert(
      `INSERT INTO resumes (user_id, file_name, file_path, file_size, mime_type, parsing_status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, file.originalname, file.path, file.size, file.mimetype]
    );

    const resumeId = result.insertId;

    // Set as primary if it's the only resume
    const count = await queryOne(
      'SELECT COUNT(*) as cnt FROM resumes WHERE user_id = ?',
      [userId]
    );
    if (count.cnt === 1) {
      await insert('UPDATE resumes SET is_primary = 1 WHERE id = ?', [resumeId]);
    }

    // Trigger async parsing
    this.parseResumeAsync(resumeId, file.path, userId, file.mimetype).catch(err => {
      logger.error(`Async resume parsing failed for resume ${resumeId}:`, err.message);
    });

    await insert(
      `INSERT INTO history (user_id, action_type, entity_type, entity_id, summary)
       VALUES (?, 'resume_upload', 'resume', ?, ?)`,
      [userId, resumeId, `Uploaded resume: ${file.originalname}`]
    );

    const resume = await queryOne('SELECT * FROM resumes WHERE id = ?', [resumeId]);
    return this.formatResume(resume);
  }

  async parseResumeAsync(resumeId, filePath, userId, mimeType = 'application/pdf') {
    try {
      await insert(
        'UPDATE resumes SET parsing_status = ? WHERE id = ?',
        ['processing', resumeId]
      );

      const safePath = this._safePath(filePath);
      const fileBuffer = await fs.readFile(safePath);

      let response;
      try {
        const formData = new FormData();
        formData.append('file', fileBuffer, {
          filename: path.basename(safePath),
          contentType: mimeType || 'application/pdf'
        });

        response = await axios.post(
          `${env.AI_SERVICE_URL}/api/resume/parse`,
          formData,
          {
            headers: formData.getHeaders(),
            timeout: 60000,
            maxContentLength: Infinity
          }
        );
      } catch (aiError) {
        logger.warn('AI service unavailable, using fallback parsing:', aiError.message);
        response = { data: this.fallbackParse() };
      }

      const parsedData = response.data;

      await insert(
        `UPDATE resumes SET
          raw_text = ?,
          parsed_data = ?,
          extracted_skills = ?,
          extracted_education = ?,
          extracted_experience = ?,
          extracted_contact = ?,
          ats_score = ?,
          parsing_status = 'completed'
        WHERE id = ?`,
        [
          parsedData.raw_text || '',
          JSON.stringify(parsedData.parsed_data || {}),
          JSON.stringify(parsedData.skills || []),
          JSON.stringify(parsedData.education || []),
          JSON.stringify(parsedData.experience || []),
          JSON.stringify(parsedData.contact || {}),
          parsedData.ats_score || 0,
          resumeId
        ]
      );

      // Sync extracted skills to user_skills
      if (parsedData.skills && parsedData.skills.length > 0) {
        await this.syncUserSkills(userId, parsedData.skills);
      }

      // Update career score
      await this.updateCareerScore(userId);

      // Invalidate cache
      await cacheDelete(`user_dashboard_${userId}`);

      logger.info(`Resume ${resumeId} parsed successfully`);
    } catch (error) {
      await insert(
        'UPDATE resumes SET parsing_status = ?, parsing_error = ? WHERE id = ?',
        ['failed', error.message, resumeId]
      );
      logger.error(`Resume parsing failed for ${resumeId}:`, error.message);
      throw error;
    }
  }

  fallbackParse() {
    return {
      raw_text: '',
      parsed_data: {},
      skills: [],
      education: [],
      experience: [],
      contact: {},
      ats_score: 0
    };
  }

  async syncUserSkills(userId, skillNames) {
    for (const skillName of skillNames) {
      try {
        let skill = await queryOne(
          'SELECT id FROM skills WHERE LOWER(name) = LOWER(?)',
          [skillName.trim()]
        );

        if (!skill) {
          const result = await insert(
            "INSERT INTO skills (name, category, demand_score) VALUES (?, 'other', 50.00)",
            [skillName.trim()]
          );
          skill = { id: result.insertId };
        }

        await insert(
          `INSERT INTO user_skills (user_id, skill_id, source)
           VALUES (?, ?, 'resume')
           ON DUPLICATE KEY UPDATE source = 'resume'`,
          [userId, skill.id]
        );
      } catch (err) {
        logger.warn(`Failed to sync skill "${skillName}":`, err.message);
      }
    }
  }

  async updateCareerScore(userId) {
    const skills = await query(
      `SELECT COUNT(*) as skill_count,
              AVG(s.demand_score) as avg_demand
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?`,
      [userId]
    );

    const resumes = await queryOne(
      'SELECT AVG(ats_score) as avg_ats FROM resumes WHERE user_id = ? AND parsing_status = ?',
      [userId, 'completed']
    );

    const predictions = await queryOne(
      'SELECT COUNT(*) as pred_count FROM predictions WHERE user_id = ?',
      [userId]
    );

    const skillScore = Math.min((skills[0]?.skill_count || 0) * 3, 30);
    const demandScore = (skills[0]?.avg_demand || 0) * 0.3;
    const atsScore = (resumes?.avg_ats || 0) * 0.2;
    const activityScore = Math.min((predictions?.pred_count || 0) * 2, 10);

    const careerScore = Math.min(Math.round(skillScore + demandScore + atsScore + activityScore), 100);

    await insert('UPDATE users SET career_score = ? WHERE id = ?', [careerScore, userId]);
  }

  async getResumes(userId) {
    const resumes = await query(
      'SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return resumes.map(r => this.formatResume(r));
  }

  async getResumeById(userId, resumeId) {
    const resume = await queryOne(
      'SELECT * FROM resumes WHERE id = ? AND user_id = ?',
      [resumeId, userId]
    );
    if (!resume) {
      throw ApiError.notFound('Resume not found');
    }
    return this.formatResume(resume);
  }

  async deleteResume(userId, resumeId) {
    const resume = await queryOne(
      'SELECT * FROM resumes WHERE id = ? AND user_id = ?',
      [resumeId, userId]
    );
    if (!resume) {
      throw ApiError.notFound('Resume not found');
    }

    // Path traversal protection for file deletion
    try {
      const safePath = this._safePath(resume.file_path);
      await fs.unlink(safePath);
    } catch (err) {
      logger.warn(`Could not delete file: ${resume.file_path}`, err.message);
    }

    await insert('DELETE FROM resumes WHERE id = ?', [resumeId]);
    await cacheDelete(`user_dashboard_${userId}`);
    return { message: 'Resume deleted successfully' };
  }

  async setPrimary(userId, resumeId) {
    const resume = await queryOne(
      'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
      [resumeId, userId]
    );
    if (!resume) {
      throw ApiError.notFound('Resume not found');
    }

    await insert('UPDATE resumes SET is_primary = 0 WHERE user_id = ?', [userId]);
    await insert('UPDATE resumes SET is_primary = 1 WHERE id = ?', [resumeId]);
    return { message: 'Primary resume updated' };
  }

  formatResume(resume) {
    const parseJsonField = (field, fallback) => {
      if (field == null) return fallback;
      if (typeof field === 'string') {
        try { return JSON.parse(field); } catch { return fallback; }
      }
      return field;
    };

    return {
      id: resume.id,
      userId: resume.user_id,
      fileName: resume.file_name,
      fileSize: resume.file_size,
      mimeType: resume.mime_type,
      skills: parseJsonField(resume.extracted_skills, []),
      education: parseJsonField(resume.extracted_education, []),
      experience: parseJsonField(resume.extracted_experience, []),
      contact: parseJsonField(resume.extracted_contact, {}),
      atsScore: parseFloat(resume.ats_score) || 0,
      parsingStatus: resume.parsing_status,
      parsingError: resume.parsing_error,
      isPrimary: resume.is_primary,
      createdAt: resume.created_at,
      updatedAt: resume.updated_at
    };
  }
}

module.exports = new ResumeService();
