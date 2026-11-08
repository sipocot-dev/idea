import { Redis } from "@upstash/redis";

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  throw new Error("KV_REST_API_URL and KV_REST_API_TOKEN must be configured.");
}

export const redis = new Redis({ url, token });

export async function rateLimit(key: string, limit = 10, windowSeconds = 60) {
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    // Fail closed for abuse-sensitive operations when Upstash is unavailable.
    return { allowed: false, remaining: 0, unavailable: true };
  }
}
