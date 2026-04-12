const axios = require('axios');
const { query, queryOne, insert } = require('../config/database');
const { env } = require('../config/env');
const { cacheGet, cacheSet } = require('../config/redis');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class PredictionService {
  async predictJobRoles(userId, resumeId, modelType = 'ml') {
    const resume = await queryOne(
      'SELECT * FROM resumes WHERE id = ? AND user_id = ? AND parsing_status = ?',
      [resumeId, userId, 'completed']
    );

    if (!resume) {
      throw ApiError.notFound('Completed resume not found. Please upload and wait for parsing.');
    }

    const skills = this._parseJsonField(resume.extracted_skills, []);
    const experience = this._parseJsonField(resume.extracted_experience, []);
    const education = this._parseJsonField(resume.extracted_education, []);

    // Check cache
    const cacheKey = `prediction_${userId}_${resumeId}_${modelType}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      logger.info(`Prediction cache hit: ${cacheKey}`);
      return cached;
    }

    const startTime = Date.now();
    let results;

    try {
      const response = await axios.post(
        `${env.AI_SERVICE_URL}/api/predict/job-roles`,
        {
          skills,
          experience,
          education,
          raw_text: resume.raw_text || '',
          model_type: modelType
        },
        { timeout: 30000 }
      );
      results = response.data;
    } catch (aiError) {
      logger.warn('AI service unavailable, using fallback prediction:', aiError.message);
      results = this.fallbackPrediction(skills);
    }

    const processingTime = Date.now() - startTime;

    // Store prediction
    const predResult = await insert(
      `INSERT INTO predictions
       (user_id, resume_id, prediction_type, model_type, model_version, input_data, results, confidence_score, top_prediction, processing_time_ms)
       VALUES (?, ?, 'job_role', ?, 'v1.0', ?, ?, ?, ?, ?)`,
      [
        userId,
        resumeId,
        modelType,
        JSON.stringify({ skills, experience_count: experience.length }),
        JSON.stringify(results),
        results.predictions?.[0]?.confidence || 0,
        results.predictions?.[0]?.role || 'Unknown',
        processingTime
      ]
    );

    // Store history
    await insert(
      `INSERT INTO history (user_id, action_type, entity_type, entity_id, summary, career_score_at_time)
       VALUES (?, 'prediction', 'prediction', ?, ?, (SELECT career_score FROM users WHERE id = ?))`,
      [
        userId,
        predResult.insertId,
        `Job role prediction: ${results.predictions?.[0]?.role || 'N/A'} (${modelType})`,
        userId
      ]
    );

    // Cache for 1 hour
    await cacheSet(cacheKey, results, 3600);

    return {
      ...results,
      predictionId: predResult.insertId,
      processingTimeMs: processingTime,
      modelType
    };
  }

  fallbackPrediction(skills) {
    const roleMapping = {
      'Git': ["Full Stack Developer", "Frontend Developer", "Backend Developer", "React Developer", "Angular Developer"],
      'CSS': ["Full Stack Developer", "Frontend Developer", "Backend Developer", "React Developer", "Angular Developer"],
      'HTML': ["Full Stack Developer", "Frontend Developer", "Backend Developer", "React Developer", "Angular Developer"],
      'Problem Solving': ["Full Stack Developer", "Frontend Developer", "Backend Developer", "React Developer", "Angular Developer"],
      'Node.js': ["Backend Developer", "Node.js Developer"],
      'REST API': ["Backend Developer", "Node.js Developer", "Mobile Developer", "iOS Developer", "Android Developer"],
      'SQL': ["Backend Developer", "Node.js Developer", "Python Web Developer", "Django Developer", "Data Scientist"],
      'React': ["React Developer", "React Native Developer"],
      'JavaScript': ["React Developer", "Angular Developer", "Vue.js Developer", "Mobile Developer", "Flutter Developer"],
      'TypeScript': ["Angular Developer"],
      'Angular': ["Angular Developer"],
      'Vue.js': ["Vue.js Developer"],
      'PHP': ["PHP Developer"],
      'MySQL': ["PHP Developer"],
      'Python': ["Python Web Developer", "Django Developer", "Data Scientist", "Data Analyst", "Data Engineer"],
      'Django': ["Python Web Developer", "Django Developer"],
      'Kotlin': ["Mobile Developer", "Android Developer", "Kotlin Developer", "Mobile Architect"],
      'Swift': ["Mobile Developer", "iOS Developer", "Swift Developer", "Mobile Architect"],
      'Machine Learning': ["Data Scientist", "Machine Learning Engineer", "AI Engineer"],
      'Data Analysis': ["Data Scientist", "Data Analyst", "Data Engineer", "Business Intelligence Analyst", "Machine Learning Engineer"],
      'Scikit-learn': ["Data Scientist", "Machine Learning Engineer", "AI Engineer"],
      'AWS': ["DevOps Engineer", "Cloud Architect", "Cloud Engineer", "Site Reliability Engineer", "AWS Solutions Architect"],
      'Jenkins': ["DevOps Engineer"],
      'Docker': ["DevOps Engineer", "Cloud Architect", "Cloud Engineer", "Site Reliability Engineer", "AWS Solutions Architect"],
      'Linux': ["DevOps Engineer", "Cloud Architect", "Cloud Engineer", "Site Reliability Engineer", "AWS Solutions Architect"],
      'CI/CD': ["DevOps Engineer", "Automation Tester", "SDET", "Mobile QA Automation Engineer"],
      'Kubernetes': ["Cloud Architect", "AWS Solutions Architect", "Kubernetes Administrator"],
      'Terraform': ["Cloud Architect", "AWS Solutions Architect", "Kubernetes Administrator"],
      'Communication': ["Cybersecurity Analyst", "Security Engineer", "Penetration Tester", "Information Security Manager", "Security Architect"],
      'Figma': ["UI/UX Designer", "Product Designer", "Graphic Designer", "Interaction Designer", "Visual Designer"],
      'UI/UX Design': ["UI/UX Designer", "Product Designer", "Graphic Designer", "Interaction Designer", "Visual Designer"],
      'JIRA': ["QA Engineer", "Automation Tester", "Manual Tester", "SDET", "Performance Test Engineer"],
      'Agile': ["QA Engineer", "Automation Tester", "Manual Tester", "SDET", "Performance Test Engineer"],
      'Leadership': ["Product Manager", "Scrum Master", "Agile Coach", "Technical Product Manager", "Product Owner"],
      'Scrum': ["Product Manager", "Scrum Master", "Agile Coach", "Technical Product Manager", "Product Owner"],
      'Unity': ["Game Developer", "Unity Developer", "Game Designer"],
      'C#': ["Game Developer", "Unity Developer", "Game Designer"],
      'C++': ["Game Developer", "Unity Developer", "Game Designer"],
      'Solidity': ["Blockchain Developer", "Web3 Engineer"],
      'Web3.js': ["Blockchain Developer", "Web3 Engineer"],
    };

    const roleScores = {};
    const normalizedSkills = skills.map(s => s.toLowerCase());

    for (const [skill, roles] of Object.entries(roleMapping)) {
      if (normalizedSkills.includes(skill.toLowerCase())) {
        for (let i = 0; i < roles.length; i++) {
          const weight = 1 - (i * 0.2);
          roleScores[roles[i]] = (roleScores[roles[i]] || 0) + weight;
        }
      }
    }

    const sorted = Object.entries(roleScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const maxScore = sorted[0]?.[1] || 1;

    const predictions = sorted.map(([role, score]) => ({
      role,
      confidence: Math.round((score / maxScore) * 100) / 100,
      matchedSkills: skills.filter(s => {
        const mapping = roleMapping[s];
        return mapping && mapping.includes(role);
      })
    }));

    if (predictions.length === 0) {
      predictions.push({
        role: 'Full Stack Developer',
        confidence: 0.3,
        matchedSkills: []
      });
    }

    return {
      predictions,
      model_used: 'baseline',
      total_skills_analyzed: skills.length
    };
  }

  async getSkillGap(userId, targetRole, resumeId) {
    const resume = resumeId
      ? await queryOne('SELECT * FROM resumes WHERE id = ? AND user_id = ?', [resumeId, userId])
      : await queryOne('SELECT * FROM resumes WHERE user_id = ? AND is_primary = 1', [userId]);

    if (!resume) {
      throw ApiError.notFound('No resume found');
    }

    const userSkills = this._parseJsonField(resume.extracted_skills, []);

    const jobRole = await queryOne(
      'SELECT * FROM job_roles WHERE slug = ? OR title = ?',
      [targetRole, targetRole]
    );

    if (!jobRole) {
      throw ApiError.notFound(`Job role "${targetRole}" not found`);
    }

    const requiredSkills = this._parseJsonField(jobRole.required_skills, []);
    const optionalSkills = this._parseJsonField(jobRole.optional_skills, []);

    const normalizedUser = userSkills.map(s => s.toLowerCase());

    const matchingRequired = requiredSkills.filter(s =>
      normalizedUser.includes(s.toLowerCase())
    );
    const missingRequired = requiredSkills.filter(s =>
      !normalizedUser.includes(s.toLowerCase())
    );
    const matchingOptional = optionalSkills.filter(s =>
      normalizedUser.includes(s.toLowerCase())
    );
    const missingOptional = optionalSkills.filter(s =>
      !normalizedUser.includes(s.toLowerCase())
    );

    const matchPercentage = requiredSkills.length > 0
      ? Math.round((matchingRequired.length / requiredSkills.length) * 100)
      : 0;

    const priorityRanking = [
      ...missingRequired.map((s, i) => ({ skill: s, priority: 'high', order: i + 1 })),
      ...missingOptional.map((s, i) => ({ skill: s, priority: 'medium', order: missingRequired.length + i + 1 }))
    ];

    const learningPath = this.generateLearningPath(missingRequired, missingOptional);

    // Store skill gap analysis
    const gapResult = await insert(
      `INSERT INTO skill_gaps (user_id, target_role, missing_skills, matching_skills, match_percentage, priority_ranking, learning_path)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        jobRole.title,
        JSON.stringify([...missingRequired, ...missingOptional]),
        JSON.stringify([...matchingRequired, ...matchingOptional]),
        matchPercentage,
        JSON.stringify(priorityRanking),
        JSON.stringify(learningPath)
      ]
    );

    // Store history
    await insert(
      `INSERT INTO history (user_id, action_type, entity_type, entity_id, summary, career_score_at_time)
       VALUES (?, 'skill_gap_analysis', 'skill_gap', ?, ?, (SELECT career_score FROM users WHERE id = ?))`,
      [userId, gapResult.insertId, `Skill gap analysis for: ${jobRole.title} (${matchPercentage}% match)`, userId]
    );

    return {
      targetRole: jobRole.title,
      matchPercentage,
      matchingSkills: {
        required: matchingRequired,
        optional: matchingOptional,
        total: matchingRequired.length + matchingOptional.length
      },
      missingSkills: {
        required: missingRequired,
        optional: missingOptional,
        total: missingRequired.length + missingOptional.length
      },
      priorityRanking,
      learningPath,
      salaryRange: {
        min: jobRole.avg_salary_min,
        max: jobRole.avg_salary_max
      },
      demandLevel: jobRole.demand_level
    };
  }

  generateLearningPath(missingRequired, missingOptional) {
    const phases = [];

    if (missingRequired.length > 0) {
      const phase1Skills = missingRequired.slice(0, 3);
      phases.push({
        phase: 1,
        title: 'Core Skills Foundation',
        duration: '4-6 weeks',
        skills: phase1Skills,
        description: `Master the essential skills: ${phase1Skills.join(', ')}`
      });

      if (missingRequired.length > 3) {
        phases.push({
          phase: 2,
          title: 'Advanced Required Skills',
          duration: '4-8 weeks',
          skills: missingRequired.slice(3),
          description: 'Build upon your foundation with remaining required skills'
        });
      }
    }

    if (missingOptional.length > 0) {
      phases.push({
        phase: phases.length + 1,
        title: 'Competitive Edge Skills',
        duration: '6-12 weeks',
        skills: missingOptional.slice(0, 5),
        description: 'Stand out from other candidates with these bonus skills'
      });
    }

    return phases;
  }

  async analyzeJobDescription(userId, title, description, company) {
    const primaryResume = await queryOne(
      'SELECT * FROM resumes WHERE user_id = ? AND is_primary = 1 AND parsing_status = ?',
      [userId, 'completed']
    );

    let userSkills = [];
    if (primaryResume) {
      userSkills = this._parseJsonField(primaryResume.extracted_skills, []);
    }

    let extractedSkills;
    try {
      const response = await axios.post(
        `${env.AI_SERVICE_URL}/api/resume/extract-skills`,
        { text: description },
        { timeout: 15000 }
      );
      extractedSkills = response.data.skills || [];
    } catch {
      extractedSkills = this.extractSkillsFallback(description);
    }

    const normalizedUser = userSkills.map(s => s.toLowerCase());
    const matching = extractedSkills.filter(s => normalizedUser.includes(s.toLowerCase()));
    const missing = extractedSkills.filter(s => !normalizedUser.includes(s.toLowerCase()));
    const matchScore = extractedSkills.length > 0
      ? Math.round((matching.length / extractedSkills.length) * 100)
      : 0;

    const jdResult = await insert(
      `INSERT INTO job_descriptions (user_id, title, company, raw_text, extracted_skills, match_results, match_score)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        company || null,
        description,
        JSON.stringify(extractedSkills),
        JSON.stringify({ matching, missing }),
        matchScore
      ]
    );

    await insert(
      `INSERT INTO history (user_id, action_type, entity_type, entity_id, summary)
       VALUES (?, 'job_match', 'job_description', ?, ?)`,
      [userId, jdResult.insertId, `Job match analysis: ${title} (${matchScore}% match)`]
    );

    return {
      id: jdResult.insertId,
      title,
      company,
      extractedSkills,
      matchScore,
      matchingSkills: matching,
      missingSkills: missing,
      recommendation: matchScore >= 75
        ? 'Strong match! You should apply.'
        : matchScore >= 50
        ? 'Good match. Consider learning the missing skills.'
        : 'Weak match. Significant skill gaps exist.'
    };
  }

  extractSkillsFallback(text) {
    const knownSkills = [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'TypeScript', 'PHP', 'Ruby',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring',
      'Next.js', '.NET', 'Laravel', 'Rails', 'TensorFlow', 'PyTorch', 'Scikit-learn',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Firebase',
      'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform',
      'Git', 'Linux', 'CI/CD', 'REST', 'GraphQL', 'Microservices',
      'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Analysis',
      'SQL', 'HTML', 'CSS', 'Figma', 'Agile', 'Scrum', 'JIRA'
    ];

    const lowerText = text.toLowerCase();
    return knownSkills.filter(skill => lowerText.includes(skill.toLowerCase()));
  }

  async simulateCareer(userId, addedSkills) {
    const currentSkills = await query(
      `SELECT s.name FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?`,
      [userId]
    );

    const currentSkillNames = currentSkills.map(s => s.name);
    const combinedSkills = [...new Set([...currentSkillNames, ...addedSkills])];

    const currentPrediction = this.fallbackPrediction(currentSkillNames);
    const futurePrediction = this.fallbackPrediction(combinedSkills);

    const result = {
      currentSkills: currentSkillNames,
      addedSkills,
      combinedSkills,
      currentPredictions: currentPrediction.predictions,
      futurePredictions: futurePrediction.predictions,
      improvement: {
        newRoles: futurePrediction.predictions.filter(
          fp => !currentPrediction.predictions.find(cp => cp.role === fp.role)
        ),
        improvedConfidence: futurePrediction.predictions
          .filter(fp => {
            const current = currentPrediction.predictions.find(cp => cp.role === fp.role);
            return current && fp.confidence > current.confidence;
          })
          .map(fp => ({
            role: fp.role,
            before: currentPrediction.predictions.find(cp => cp.role === fp.role)?.confidence || 0,
            after: fp.confidence
          }))
      }
    };

    await insert(
      `INSERT INTO career_simulations (user_id, current_role, added_skills, simulation_results)
       VALUES (?, ?, ?, ?)`,
      [
        userId,
        currentPrediction.predictions[0]?.role || 'Unknown',
        JSON.stringify(addedSkills),
        JSON.stringify(result)
      ]
    );

    return result;
  }

  async getUserPredictions(userId, page = 1, limit = 20) {
    const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const [items, countResult] = await Promise.all([
      query(
        `SELECT id, prediction_type, model_type, results, confidence_score,
                top_prediction, processing_time_ms, created_at
         FROM predictions
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ${safeLimit} OFFSET ${offset}`,
        [userId]
      ),
      queryOne('SELECT COUNT(*) as total FROM predictions WHERE user_id = ?', [userId])
    ]);

    return {
      items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / safeLimit)
      }
    };
  }

  async getJobRoles() {
    return query('SELECT id, title, slug, demand_level, experience_level, industry FROM job_roles ORDER BY title');
  }

  /** Safely parse a JSON field that may already be an object or a string */
  _parseJsonField(field, fallback) {
    if (field == null) return fallback;
    if (typeof field === 'string') {
      try { return JSON.parse(field); } catch { return fallback; }
    }
    return field;
  }
}

module.exports = new PredictionService();
