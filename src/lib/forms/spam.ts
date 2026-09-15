import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Two lightweight spam controls that need no third-party service:
 *
 * 1. A honeypot field that real visitors never see or fill.
 * 2. A signed timing token issued when the form renders. Submissions that
 *    arrive implausibly fast, or with a stale or forged token, are rejected.
 */

export const HONEYPOT_FIELD = "website";
export const TOKEN_FIELD = "_token";

const MIN_ELAPSED_MS = 3_000;
const MAX_AGE_MS = 24 * 60 * 60 * 1_000;

let ephemeralSecret: Buffer | null = null;
let warned = false;

function secret(): Buffer {
  const configured = process.env.FORM_TOKEN_SECRET;
  if (configured && configured.length >= 16) return Buffer.from(configured, "utf8");
  // Local development only: a per-process secret means tokens do not survive a
  // restart and are not shared across instances or Worker isolates. Set
  // FORM_TOKEN_SECRET in production or submissions will be rejected.
  if (process.env.NODE_ENV === "production" && !warned) {
    warned = true;
    console.error("[forms] FORM_TOKEN_SECRET is not set; form submissions will fail across instances.");
  }
  ephemeralSecret ??= randomBytes(32);
  return ephemeralSecret;
}

function sign(issuedAt: number, nonce: string): string {
  return createHmac("sha256", secret()).update(`${issuedAt}.${nonce}`).digest("base64url");
}

export function issueFormToken(now = Date.now()): string {
  const nonce = randomBytes(8).toString("base64url");
  return `${now}.${nonce}.${sign(now, nonce)}`;
}

export type TokenVerdict =
  | { ok: true }
  | { ok: false; reason: "missing" | "malformed" | "forged" | "too-fast" | "expired" };

export function verifyFormToken(token: unknown, now = Date.now()): TokenVerdict {
  if (typeof token !== "string" || token.length === 0) return { ok: false, reason: "missing" };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "malformed" };
  const [issuedRaw, nonce, signature] = parts as [string, string, string];
  const issuedAt = Number(issuedRaw);
  if (!Number.isFinite(issuedAt) || !nonce) return { ok: false, reason: "malformed" };
  const expected = Buffer.from(sign(issuedAt, nonce));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return { ok: false, reason: "forged" };
  }
  const age = now - issuedAt;
  if (age < MIN_ELAPSED_MS) return { ok: false, reason: "too-fast" };
  if (age > MAX_AGE_MS) return { ok: false, reason: "expired" };
  return { ok: true };
}

/** True when the honeypot was filled in, which only automated senders do. */
export function honeypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
