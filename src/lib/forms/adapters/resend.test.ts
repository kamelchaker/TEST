import { describe, expect, it, vi } from "vitest";
import { createAdapters } from "./index";
import { ResendEmailAdapter, renderLeadEmail } from "./resend";
import type { Lead } from "./types";

const lead: Lead = {
  kind: "tour-request",
  submittedAt: "2026-09-14T10:00:00.000Z",
  guardianName: "Amina Rahman",
  email: "amina@example.com",
  phone: "+1 555 010 2030",
  childDateOfBirth: "2023-06-10",
  programSlug: "preschool",
  preferredDateTime: "2026-10-02T10:00",
  message: "Looking forward to visiting <3",
  consent: { accepted: true, statement: "I agree.", acceptedAt: "2026-09-14T10:00:00.000Z" },
  source: { page: "/schedule-a-tour", userAgent: "test" },
};

describe("ResendEmailAdapter", () => {
  it("posts the notification to the admissions inbox with reply-to set to the family", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));
    const adapter = new ResendEmailAdapter({
      apiKey: "re_test",
      from: "Midad Academy <admissions@midadacademy.org>",
      inbox: "info@midadacademy.org",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await adapter.notifyAdmissions(lead);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer re_test");
    const body = JSON.parse(String(init.body));
    expect(body.to).toEqual(["info@midadacademy.org"]);
    expect(body.reply_to).toBe("amina@example.com");
    expect(body.from).toBe("Midad Academy <admissions@midadacademy.org>");
    expect(body.subject).toBe("Tour request — Amina Rahman");
    expect(body.text).toContain("Child's date of birth: 2023-06-10");
    expect(body.html).toContain("&lt;3");
  });

  it("throws when Resend rejects the message so the failure is logged", async () => {
    const fetchImpl = vi.fn(async () => new Response("invalid key", { status: 401 }));
    const adapter = new ResendEmailAdapter({
      apiKey: "bad",
      from: "Midad Academy <admissions@midadacademy.org>",
      inbox: "info@midadacademy.org",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(adapter.notifyAdmissions(lead)).rejects.toThrow(/401/);
  });

  it("omits empty fields from the body", () => {
    const { text } = renderLeadEmail({ ...lead, kind: "information-request", phone: null, preferredDateTime: null, message: null });
    expect(text).toContain("Information request from Amina Rahman");
    expect(text).not.toContain("Phone:");
    expect(text).not.toContain("Preferred date and time:");
  });

  it("is selected by EMAIL_ADAPTER=resend and requires its credentials", () => {
    const { email } = createAdapters({
      EMAIL_ADAPTER: "resend",
      RESEND_API_KEY: "re_test",
      EMAIL_FROM: "Midad Academy <admissions@midadacademy.org>",
    });
    expect(email.name).toBe("resend");
    expect(email.inbox).toBe("info@midadacademy.org");
    expect(() => createAdapters({ EMAIL_ADAPTER: "resend" })).toThrow(/RESEND_API_KEY/);
  });
});
