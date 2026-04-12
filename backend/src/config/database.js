const mysql = require('mysql2/promise');
const { env } = require('./env');
const logger = require('../utils/logger');

let pool = null;

const createPool = () => {
  if (pool) return pool;

  pool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: 'utf8mb4',
    timezone: '+00:00',
    typeCast: function (field, next) {
      if (field.type === 'TINY' && field.length === 1) {
        return field.string() === '1';
      }
      if (field.type === 'JSON') {
        const val = field.string();
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return next();
    }
  });

  return pool;
};

const getPool = () => {
  if (!pool) {
    return createPool();
  }
  return pool;
};

const initDatabase = async () => {
  try {
    const db = getPool();
    const connection = await db.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    logger.info(`MySQL connected to ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
    return db;
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Execute a read query using pool.query() (non-prepared statement).
 * Use this for queries with LIMIT/OFFSET or dynamically built SQL.
 * Parameters are still escaped safely by mysql2.
 */
const query = async (sql, params = []) => {
  const db = getPool();
  try {
    const [rows] = await db.query(sql, params);
    return rows;
  } catch (error) {
    logger.error(`Query error: ${sql}`, error.message);
    throw error;
  }
};

/**
 * Execute a single-row read query.
 */
const queryOne = async (sql, params = []) => {
  const rows = await query(sql, params);
  return rows[0] || null;
};

/**
 * Execute a write query (INSERT/UPDATE/DELETE) using prepared statements.
 */
const insert = async (sql, params = []) => {
  const db = getPool();
  try {
    const [result] = await db.execute(sql, params);
    return result;
  } catch (error) {
    logger.error(`Insert error: ${sql}`, error.message);
    throw error;
  }
};

const transaction = async (callback) => {
  const db = getPool();
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Gracefully close the connection pool.
 */
const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database pool closed');
  }
};

module.exports = {
  getPool,
  initDatabase,
  query,
  queryOne,
  insert,
  transaction,
  closePool
};
