import { Redis } from "@upstash/redis";

let redisInstance = null;

function getRedisClient() {
  if (redisInstance) return redisInstance;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  redisInstance = new Redis({ url, token });
  return redisInstance;
}

export const redis = getRedisClient();

export async function cacheGet(key) {
  try {
    if (!redis) return null;
    return await redis.get(key);
  } catch { return null; }
}

export async function cacheSet(key, value, expireInSeconds = 3600) {
  try {
    if (!redis) return false;
    if (expireInSeconds) {
      await redis.set(key, value, { ex: expireInSeconds });
    } else {
      await redis.set(key, value);
    }
    return true;
  } catch { return false; }
}

export async function cacheDelete(key) {
  try {
    if (!redis) return false;
    await redis.del(key);
    return true;
  } catch { return false; }
}

export async function rateLimit(identifier, limit = 10, windowInSeconds = 60) {
  try {
    if (!redis) return { success: true, remaining: limit };
    const key = `ratelimit:${identifier}`;
    const current = await redis.incr(key);
    if (current === 1) await redis.expire(key, windowInSeconds);
    return { success: current <= limit, remaining: Math.max(0, limit - current) };
  } catch {
    return { success: true, remaining: limit };
  }
}

export default redis;