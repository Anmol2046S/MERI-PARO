const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'meri_paro',

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',

  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760,
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads'
};

// Validate required environment variables
const requiredVars = ['JWT_SECRET'];
for (const varName of requiredVars) {
  if (!env[varName]) {
    if (env.NODE_ENV === 'development') {
      env[varName] = 'dev_fallback_secret_key_change_in_production';
    } else {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
}

module.exports = { env };
