import { describe, expect, it } from "vitest";
import { MESSAGES, fieldErrors, informationRequestSchema, tourRequestSchema } from "./schemas";

const today = { year: 2026, month: 3, day: 15 };
const programSlugs = ["early-learners", "preschool", "pre-kindergarten", "kindergarten", "extended-learning"];
const options = { today, programSlugs };

const validTour = {
  guardianName: "Amina Rahman",
  email: "amina@example.com",
  phone: "+1 555 010 2030",
  childDob: "2023-06-10",
  program: "preschool",
  preferred: "2026-04-02T10:00",
  message: "",
  consent: "on",
};

describe("tourRequestSchema", () => {
  it("accepts a complete submission", () => {
    expect(tourRequestSchema(options).safeParse(validTour).success).toBe(true);
  });

  it("reports the approved messages per field", () => {
    const result = tourRequestSchema(options).safeParse({
      guardianName: "A",
      email: "not-an-email",
      phone: "12",
      childDob: "",
      program: "",
      preferred: "",
      consent: "",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(fieldErrors(result.error)).toEqual({
      guardianName: MESSAGES.guardianName,
      email: MESSAGES.email,
      phone: MESSAGES.phone,
      childDob: MESSAGES.childDob,
      program: MESSAGES.program,
      preferred: MESSAGES.preferred,
      consent: MESSAGES.consent,
    });
  });

  it("rejects a date of birth in the future or that is not a real date", () => {
    for (const childDob of ["2026-03-16", "2023-02-30", "1899-12-31"]) {
      const result = tourRequestSchema(options).safeParse({ ...validTour, childDob });
      expect(result.success).toBe(false);
      if (!result.success) expect(fieldErrors(result.error).childDob).toBe(MESSAGES.childDobCheck);
    }
    expect(tourRequestSchema(options).safeParse({ ...validTour, childDob: "2026-03-15" }).success).toBe(true);
  });

  it("rejects a preferred time in the past or malformed", () => {
    for (const preferred of ["2026-03-14T10:00", "2026-03-15T25:00", "tomorrow"]) {
      const result = tourRequestSchema(options).safeParse({ ...validTour, preferred });
      expect(result.success).toBe(false);
    }
  });

  it("rejects unexpected fields", () => {
    const result = tourRequestSchema(options).safeParse({ ...validTour, admin: "true" });
    expect(result.success).toBe(false);
  });

  it("only accepts visible programs or 'not sure'", () => {
    expect(tourRequestSchema(options).safeParse({ ...validTour, program: "grade-1" }).success).toBe(false);
    expect(tourRequestSchema(options).safeParse({ ...validTour, program: "not-sure" }).success).toBe(true);
  });
});

describe("informationRequestSchema", () => {
  it("accepts the minimal submission", () => {
    const result = informationRequestSchema(options).safeParse({
      guardianName: "Amina Rahman",
      email: "amina@example.com",
      consent: "on",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.childDob).toBe("");
      expect(result.data.program).toBe("");
    }
  });

  it("validates an optional date of birth when supplied", () => {
    const bad = informationRequestSchema(options).safeParse({
      guardianName: "Amina Rahman",
      email: "amina@example.com",
      childDob: "2030-01-01",
      consent: "on",
    });
    expect(bad.success).toBe(false);
  });

  it("requires consent", () => {
    const result = informationRequestSchema(options).safeParse({
      guardianName: "Amina Rahman",
      email: "amina@example.com",
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).consent).toBe(MESSAGES.consent);
  });
});
