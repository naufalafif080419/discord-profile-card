import { createClient } from 'redis';

let redis: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (redis && redis.isOpen) return redis;

  try {
    const redisUrl = process.env.KV_URL || process.env.REDIS_URL;
    if (!redisUrl) throw new Error('Redis URL not configured');

    const needsTls = redisUrl.startsWith('rediss://') || redisUrl.includes(':6380');
    // Simple reconnect strategy: wait 100ms * retries, up to 3s
    const reconnectStrategy = (retries: number) => Math.min(retries * 100, 3000);

    if (needsTls) {
      redis = createClient({
        url: redisUrl,
        socket: {
          tls: true,
          reconnectStrategy,
        },
      });
    } else {
      redis = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy,
        },
      });
    }

    redis.on('error', (err) => console.error('Redis Client Error:', err));
    await redis.connect();
    return redis;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}
