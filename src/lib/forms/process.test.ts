import { beforeEach, describe, expect, it, vi } from "vitest";
import { NoopCrmAdapter, NoopEmailAdapter } from "./adapters/noop";
import type { Lead } from "./adapters/types";
import { GENERIC_ERROR, RATE_LIMIT_ERROR, processSubmission } from "./process";
import { INFORMATION_FIELDS, informationRequestSchema } from "./schemas";
import { issueFormToken } from "./spam";

const globalStore = globalThis as unknown as { __abFormAdapters?: unknown; __abRateLimiter?: unknown };

function formData(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.append(k, v);
  return fd;
}

const ISSUED = 1_700_000_000_000;
const NOW = ISSUED + 10_000;

function run(fd: FormData, ip = "198.51.100.7") {
  return processSubmission({
    kind: "information-request",
    page: "/request-information",
    allowedFields: INFORMATION_FIELDS,
    schema: (today) => informationRequestSchema({ today, programSlugs: ["preschool"] }),
    consentStatement: "I agree.",
    request: { ip, userAgent: "test" },
    formData: fd,
    now: () => NOW,
    toLead: (data, meta): Lead => ({
      kind: "information-request",
      submittedAt: meta.submittedAt,
      guardianName: data.guardianName,
      email: data.email,
      phone: null,
      childDateOfBirth: data.childDob || null,
      programSlug: data.program || null,
      preferredDateTime: null,
      message: data.question || null,
      consent: { accepted: true, statement: meta.consentStatement, acceptedAt: meta.submittedAt },
      source: { page: "/request-information", userAgent: meta.userAgent },
    }),
  });
}

const valid = () => ({
  guardianName: "Amina Rahman",
  email: "amina@example.com",
  consent: "on",
  _token: issueFormToken(ISSUED),
});

describe("processSubmission", () => {
  let crm: NoopCrmAdapter;

  beforeEach(() => {
    crm = new NoopCrmAdapter();
    vi.spyOn(crm, "createLead");
    globalStore.__abFormAdapters = { crm, email: new NoopEmailAdapter() };
    globalStore.__abRateLimiter = undefined;
  });

  it("delivers a valid submission with consent captured", async () => {
    const state = await run(formData(valid()));
    expect(state.status).toBe("success");
    expect(crm.createLead).toHaveBeenCalledTimes(1);
    const lead = vi.mocked(crm.createLead).mock.calls[0]?.[0];
    expect(lead?.consent).toEqual({ accepted: true, statement: "I agree.", acceptedAt: new Date(NOW).toISOString() });
    expect(lead?.childDateOfBirth).toBeNull();
  });

  it("returns field errors without contacting the CRM", async () => {
    const state = await run(formData({ ...valid(), email: "nope" }));
    expect(state.status).toBe("error");
    expect(state.errors.email).toBeDefined();
    expect(state.values.guardianName).toBe("Amina Rahman");
    expect(crm.createLead).not.toHaveBeenCalled();
  });

  it("rejects unexpected fields", async () => {
    const state = await run(formData({ ...valid(), role: "admin" }));
    expect(state.status).toBe("error");
    expect(state.formError).toBe(GENERIC_ERROR);
    expect(crm.createLead).not.toHaveBeenCalled();
  });

  it("silently drops submissions that fill the honeypot", async () => {
    const state = await run(formData({ ...valid(), website: "http://spam.example" }));
    expect(state.status).toBe("success");
    expect(crm.createLead).not.toHaveBeenCalled();
  });

  it("reports field errors before checking the anti-spam token", async () => {
    const state = await run(formData({ ...valid(), email: "nope", _token: "" }));
    expect(state.status).toBe("error");
    expect(state.errors.email).toBeDefined();
    expect(state.formError).toBeNull();
  });

  it("rejects a missing or too-fast token", async () => {
    const missing = await run(formData({ ...valid(), _token: "" }));
    expect(missing.formError).toBe(GENERIC_ERROR);
    const fast = await run(formData({ ...valid(), _token: issueFormToken(NOW - 100) }));
    expect(fast.formError).toBe(GENERIC_ERROR);
    expect(crm.createLead).not.toHaveBeenCalled();
  });

  it("rate limits repeated submissions from one client", async () => {
    for (let i = 0; i < 5; i += 1) {
      expect((await run(formData(valid()))).status).toBe("success");
    }
    const sixth = await run(formData(valid()));
    expect(sixth.status).toBe("error");
    expect(sixth.formError).toBe(RATE_LIMIT_ERROR);
    expect((await run(formData(valid()), "203.0.113.5")).status).toBe("success");
  });

  it("keeps the date of birth server-side only as a date string", async () => {
    const state = await run(formData({ ...valid(), childDob: "2023-06-10" }));
    expect(state.status).toBe("success");
    const lead = vi.mocked(crm.createLead).mock.calls[0]?.[0];
    expect(lead?.childDateOfBirth).toBe("2023-06-10");
    expect(state.values).toEqual({});
  });
});
