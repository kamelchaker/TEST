import { describe, expect, it } from "vitest";
import { honeypotTripped, issueFormToken, verifyFormToken } from "./spam";

describe("form tokens", () => {
  it("accepts a token submitted after a plausible delay", () => {
    const issued = 1_700_000_000_000;
    const token = issueFormToken(issued);
    expect(verifyFormToken(token, issued + 5_000)).toEqual({ ok: true });
  });

  it("rejects submissions that arrive too quickly", () => {
    const issued = 1_700_000_000_000;
    const token = issueFormToken(issued);
    expect(verifyFormToken(token, issued + 500)).toEqual({ ok: false, reason: "too-fast" });
  });

  it("rejects stale tokens", () => {
    const issued = 1_700_000_000_000;
    const token = issueFormToken(issued);
    expect(verifyFormToken(token, issued + 25 * 60 * 60 * 1000)).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects forged, malformed and missing tokens", () => {
    const issued = 1_700_000_000_000;
    const token = issueFormToken(issued);
    const [ts, nonce] = token.split(".");
    expect(verifyFormToken(`${ts}.${nonce}.tampered`, issued + 5_000)).toEqual({ ok: false, reason: "forged" });
    expect(verifyFormToken("nonsense", issued + 5_000)).toEqual({ ok: false, reason: "malformed" });
    expect(verifyFormToken(undefined, issued + 5_000)).toEqual({ ok: false, reason: "missing" });
  });
});

describe("honeypot", () => {
  it("trips only when the hidden field carries text", () => {
    expect(honeypotTripped("")).toBe(false);
    expect(honeypotTripped(null)).toBe(false);
    expect(honeypotTripped("http://spam.example")).toBe(true);
  });
});
