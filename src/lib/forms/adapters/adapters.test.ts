import { describe, expect, it } from "vitest";
import { createAdapters } from "./index";

describe("createAdapters", () => {
  it("addresses notifications to the admissions inbox", () => {
    const { email } = createAdapters({});
    expect(email.inbox).toBe("info@midadacademy.org");
  });

  it("lets an environment override the inbox", () => {
    const { email } = createAdapters({ ADMISSIONS_INBOX: "admissions-test@example.com", EMAIL_ADAPTER: "noop" });
    expect(email.inbox).toBe("admissions-test@example.com");
    expect(email.name).toBe("noop");
  });
});
