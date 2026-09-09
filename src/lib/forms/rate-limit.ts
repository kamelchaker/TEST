import { createHash } from "node:crypto";

export interface RateLimitDecision {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  consume(key: string): Promise<RateLimitDecision>;
}

interface Options {
  /** Maximum submissions per window. */
  limit: number;
  windowMs: number;
  now?: () => number;
}

/**
 * Sliding-window limiter held in process memory. Suitable for a single
 * instance; swap in a shared store (Redis, Upstash, a database) behind the
 * same interface for multi-instance deployments.
 */
export class MemoryRateLimiter implements RateLimiter {
  private readonly hits = new Map<string, number[]>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;

  constructor({ limit, windowMs, now = Date.now }: Options) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
  }

  async consume(key: string): Promise<RateLimitDecision> {
    const now = this.now();
    const floor = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((t) => t > floor);
    if (recent.length >= this.limit) {
      const oldest = recent[0] ?? now;
      return { allowed: false, retryAfterSeconds: Math.ceil((oldest + this.windowMs - now) / 1000) };
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 10_000) this.prune(floor);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  private prune(floor: number) {
    for (const [key, times] of this.hits) {
      const kept = times.filter((t) => t > floor);
      if (kept.length === 0) this.hits.delete(key);
      else this.hits.set(key, kept);
    }
  }
}

/** Stable, non-reversible key for a client so raw addresses are never stored. */
export function clientKey(form: string, ip: string | null): string {
  const digest = createHash("sha256").update(ip ?? "unknown").digest("hex").slice(0, 32);
  return `${form}:${digest}`;
}

const globalStore = globalThis as unknown as { __abRateLimiter?: RateLimiter };

/** Five submissions per ten minutes per client, per form. */
export function getRateLimiter(): RateLimiter {
  globalStore.__abRateLimiter ??= new MemoryRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
  return globalStore.__abRateLimiter;
}
