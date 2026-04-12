const app = require('./src/app');
const { env } = require('./src/config/env');
const { initDatabase, closePool } = require('./src/config/database');
const { getRedisClient } = require('./src/config/redis');
const logger = require('./src/utils/logger');

let server;

const startServer = async () => {
  try {
    await initDatabase();
    logger.info('Database connection established');

    const PORT = env.PORT || 5000;
    server = app.listen(PORT, () => {
      logger.info(`MERI PARO Backend running on port ${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`AI Service: ${env.AI_SERVICE_URL}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      try {
        await closePool();
        const redis = getRedisClient();
        if (redis) await redis.quit().catch(() => {});
        logger.info('All connections closed. Exiting.');
      } catch (err) {
        logger.error('Error during cleanup:', err);
      }
      process.exit(0);
    });

    // Force exit after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

startServer();
