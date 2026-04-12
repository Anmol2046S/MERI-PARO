const Redis = require('ioredis');
const { env } = require('./env');
const logger = require('../utils/logger');

let redisClient = null;
let redisAvailable = false;

const getRedisClient = () => {
  if (redisClient) return redisClient;

  try {
    redisClient = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
      showFriendlyErrorStack: env.NODE_ENV === 'development'
    });

    redisClient.on('connect', () => {
      redisAvailable = true;
      logger.info('Redis connected successfully');
    });

    let hasLoggedError = false;
    redisClient.on('error', (err) => {
      redisAvailable = false;
      if (!hasLoggedError) {
        logger.warn('Redis connection error (non-fatal) - Caching will be disabled');
        hasLoggedError = true;
      }
    });

    redisClient.on('close', () => {
      redisAvailable = false;
    });

    // Attempt connection but don't block
    redisClient.connect().catch(() => {
      logger.warn('Redis not available, caching disabled');
    });

    return redisClient;
  } catch (error) {
    logger.warn('Redis not available, caching disabled:', error.message);
    return null;
  }
};

const cacheGet = async (key) => {
  try {
    const client = getRedisClient();
    if (!client || !redisAvailable) return null;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const cacheSet = async (key, value, ttlSeconds = 3600) => {
  try {
    const client = getRedisClient();
    if (!client || !redisAvailable) return false;
    await client.setex(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const cacheDelete = async (key) => {
  try {
    const client = getRedisClient();
    if (!client || !redisAvailable) return false;
    await client.del(key);
    return true;
  } catch {
    return false;
  }
};

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDelete };
