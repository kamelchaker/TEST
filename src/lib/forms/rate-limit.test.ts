import { describe, expect, it } from "vitest";
import { MemoryRateLimiter, clientKey } from "./rate-limit";

describe("MemoryRateLimiter", () => {
  it("allows up to the limit within a window, then blocks", async () => {
    let now = 1_000_000;
    const limiter = new MemoryRateLimiter({ limit: 2, windowMs: 60_000, now: () => now });
    expect((await limiter.consume("a")).allowed).toBe(true);
    expect((await limiter.consume("a")).allowed).toBe(true);
    const blocked = await limiter.consume("a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    // A different client is unaffected.
    expect((await limiter.consume("b")).allowed).toBe(true);
    // After the window passes the client is allowed again.
    now += 61_000;
    expect((await limiter.consume("a")).allowed).toBe(true);
  });
});

describe("clientKey", () => {
  it("never embeds the raw address", () => {
    const key = clientKey("tour-request", "203.0.113.9");
    expect(key).not.toContain("203.0.113.9");
    expect(key.startsWith("tour-request:")).toBe(true);
    expect(clientKey("tour-request", "203.0.113.9")).toBe(key);
  });
});
