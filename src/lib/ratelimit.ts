import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const RATE_LIMIT = { requests: 5, windowMs: 10 * 60 * 1000, window: "10 m" } as const;

export interface Limiter {
  limit(id: string): Promise<{ success: boolean }>;
}

type Env = Record<string, string | undefined>;

/** In-memory sliding window. Local development only: it resets on restart and isn't shared across instances. */
export function createMemoryLimiter(requests: number = RATE_LIMIT.requests, windowMs: number = RATE_LIMIT.windowMs): Limiter {
  const hits = new Map<string, number[]>();
  return {
    async limit(id) {
      const now = Date.now();
      const recent = (hits.get(id) ?? []).filter((t) => now - t < windowMs);
      const success = recent.length < requests;
      if (success) recent.push(now);
      hits.set(id, recent);
      return { success };
    },
  };
}

let warned = false;
let memory: Limiter | null = null;

/**
 * Upstash when configured. Without Upstash: deployed (VERCEL_ENV is set) → null, so the
 * route fails closed with a 503. Local → in-memory, with a one-time warning.
 */
export function getLimiter(env: Env = process.env): Limiter | null {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    return new Ratelimit({
      redis: new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN }),
      limiter: Ratelimit.slidingWindow(RATE_LIMIT.requests, RATE_LIMIT.window),
      prefix: "renzik-contact",
    });
  }
  if (env.VERCEL_ENV) {
    console.error(JSON.stringify({ ts: new Date().toISOString(), outcome: "config-error", detail: "rate limiter not configured: UPSTASH_REDIS_REST_URL/TOKEN missing" }));
    return null;
  }
  if (!warned) {
    console.warn("[contact] Upstash env vars missing: using an in-memory rate limiter (local development only).");
    warned = true;
  }
  memory ??= createMemoryLimiter();
  return memory;
}

/** Client IP. On Vercel these headers are set by the platform and can't be spoofed by the caller. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-vercel-forwarded-for") ?? headers.get("x-real-ip") ?? headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
