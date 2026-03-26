import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

/**
 * Shared Redis connection for BullMQ.
 * BullMQ requires ioredis, not generic Redis clients.
 */
export function createRedisConnection(): IORedis {
  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
  });
}
