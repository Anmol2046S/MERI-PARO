-- MERI PARO Database Schema
-- MySQL 8.0 Compatible

CREATE DATABASE IF NOT EXISTS meri_paro
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE meri_paro;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar_url VARCHAR(500) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  location VARCHAR(200) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  career_score DECIMAL(5,2) DEFAULT 0.00,
  is_active TINYINT(1) DEFAULT 1,
  last_login DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_active (is_active),
  INDEX idx_users_created (created_at)
) ENGINE=InnoDB;

-- =============================================
-- RESUMES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS resumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT DEFAULT 0,
  mime_type VARCHAR(100) DEFAULT 'application/pdf',
  raw_text LONGTEXT DEFAULT NULL,
  parsed_data JSON DEFAULT NULL,
  extracted_skills JSON DEFAULT NULL,
  extracted_education JSON DEFAULT NULL,
  extracted_experience JSON DEFAULT NULL,
  extracted_contact JSON DEFAULT NULL,
  ats_score DECIMAL(5,2) DEFAULT NULL,
  parsing_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  parsing_error TEXT DEFAULT NULL,
  is_primary TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_resumes_user (user_id),
  INDEX idx_resumes_status (parsing_status),
  INDEX idx_resumes_primary (is_primary),
  INDEX idx_resumes_created (created_at)
) ENGINE=InnoDB;

-- =============================================
-- SKILLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category ENUM('programming', 'framework', 'database', 'cloud', 'devops', 'design', 'soft_skill', 'tool', 'language', 'other') DEFAULT 'other',
  demand_score DECIMAL(5,2) DEFAULT 50.00,
  description TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_skills_name (name),
  INDEX idx_skills_category (category),
  INDEX idx_skills_demand (demand_score)
) ENGINE=InnoDB;

-- =============================================
-- USER_SKILLS TABLE (Many-to-Many)
-- =============================================
CREATE TABLE IF NOT EXISTS user_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  skill_id INT NOT NULL,
  proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
  years_experience DECIMAL(3,1) DEFAULT 0.0,
  verified TINYINT(1) DEFAULT 0,
  source ENUM('resume', 'manual', 'assessment') DEFAULT 'resume',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_skill (user_id, skill_id),
  INDEX idx_user_skills_user (user_id),
  INDEX idx_user_skills_skill (skill_id)
) ENGINE=InnoDB;

-- =============================================
-- JOB_ROLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS job_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  required_skills JSON NOT NULL,
  optional_skills JSON DEFAULT NULL,
  avg_salary_min DECIMAL(12,2) DEFAULT NULL,
  avg_salary_max DECIMAL(12,2) DEFAULT NULL,
  demand_level ENUM('low', 'medium', 'high', 'very_high') DEFAULT 'medium',
  experience_level ENUM('entry', 'mid', 'senior', 'lead', 'executive') DEFAULT 'mid',
  industry VARCHAR(100) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_job_roles_slug (slug),
  INDEX idx_job_roles_demand (demand_level),
  INDEX idx_job_roles_experience (experience_level)
) ENGINE=InnoDB;

-- =============================================
-- PREDICTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS predictions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  resume_id INT DEFAULT NULL,
  prediction_type ENUM('job_role', 'skill_gap', 'career_path', 'ats_score') NOT NULL,
  model_version VARCHAR(50) DEFAULT 'v1.0',
  model_type ENUM('baseline', 'ml', 'deep_learning') DEFAULT 'ml',
  input_data JSON DEFAULT NULL,
  results JSON NOT NULL,
  confidence_score DECIMAL(5,4) DEFAULT NULL,
  top_prediction VARCHAR(200) DEFAULT NULL,
  processing_time_ms INT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL,
  INDEX idx_predictions_user (user_id),
  INDEX idx_predictions_type (prediction_type),
  INDEX idx_predictions_created (created_at),
  INDEX idx_predictions_model (model_type)
) ENGINE=InnoDB;

-- =============================================
-- SKILL_GAPS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS skill_gaps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  prediction_id INT DEFAULT NULL,
  target_role VARCHAR(200) NOT NULL,
  missing_skills JSON NOT NULL,
  matching_skills JSON DEFAULT NULL,
  match_percentage DECIMAL(5,2) DEFAULT 0.00,
  priority_ranking JSON DEFAULT NULL,
  learning_path JSON DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE SET NULL,
  INDEX idx_skill_gaps_user (user_id),
  INDEX idx_skill_gaps_role (target_role)
) ENGINE=InnoDB;

-- =============================================
-- RECOMMENDATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('course', 'certification', 'project', 'career_move', 'skill') NOT NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT DEFAULT NULL,
  provider VARCHAR(200) DEFAULT NULL,
  url VARCHAR(500) DEFAULT NULL,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  estimated_duration VARCHAR(100) DEFAULT NULL,
  relevance_score DECIMAL(5,2) DEFAULT 0.00,
  is_completed TINYINT(1) DEFAULT 0,
  source ENUM('ai', 'rule_based', 'hybrid') DEFAULT 'hybrid',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_recommendations_user (user_id),
  INDEX idx_recommendations_type (type),
  INDEX idx_recommendations_priority (priority)
) ENGINE=InnoDB;

-- =============================================
-- HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action_type ENUM('resume_upload', 'prediction', 'skill_gap_analysis', 'recommendation', 'profile_update', 'job_match') NOT NULL,
  entity_type VARCHAR(50) DEFAULT NULL,
  entity_id INT DEFAULT NULL,
  summary TEXT DEFAULT NULL,
  metadata JSON DEFAULT NULL,
  career_score_at_time DECIMAL(5,2) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_history_user (user_id),
  INDEX idx_history_action (action_type),
  INDEX idx_history_created (created_at),
  INDEX idx_history_entity (entity_type, entity_id)
) ENGINE=InnoDB;

-- =============================================
-- JOB_DESCRIPTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS job_descriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(300) NOT NULL,
  company VARCHAR(200) DEFAULT NULL,
  raw_text LONGTEXT NOT NULL,
  extracted_skills JSON DEFAULT NULL,
  match_results JSON DEFAULT NULL,
  match_score DECIMAL(5,2) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_jd_user (user_id),
  INDEX idx_jd_created (created_at)
) ENGINE=InnoDB;

-- =============================================
-- CAREER_SIMULATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS career_simulations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  `current_role` VARCHAR(200) DEFAULT NULL,
  added_skills JSON NOT NULL,
  simulation_results JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_simulations_user (user_id)
) ENGINE=InnoDB;
