import { Redis } from "@upstash/redis";

let client: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  if (!client) client = new Redis({ url, token });
  return client;
}

export async function rateLimit(key: string, limit = 10, windowSeconds = 60) {
  const redis = getRedis();
  if (!redis) {
    // Fail closed for abuse-sensitive operations when rate limiting is not configured.
    return { allowed: false, remaining: 0, unavailable: true };
  }
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    // Fail closed if Upstash is unavailable.
    return { allowed: false, remaining: 0, unavailable: true };
  }
}
