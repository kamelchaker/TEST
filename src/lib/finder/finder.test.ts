import { describe, expect, it } from "vitest";
import { completedMonths, formatAge, parseIsoDate } from "./date";
import {
  CONFIRMATION_LINE,
  CONFIRMATION_MESSAGE,
  evaluateProgramFinder,
  resolveEffectiveCutoff,
  type FinderInput,
  type FinderOffering,
} from "./finder";

const TODAY = { year: 2026, month: 3, day: 15 };

const offering = (
  slug: string,
  name: string,
  ageMinMonths: number,
  ageMaxMonths: number,
  dobCutoffOverride: string | null = null,
): FinderOffering => ({
  programId: `prog-${slug}`,
  slug,
  name,
  ageRange: `${ageMinMonths / 12}–${(ageMaxMonths + 1) / 12}`,
  ageMinMonths,
  ageMaxMonths,
  dobCutoffOverride,
});

const CORE: FinderOffering[] = [
  offering("early-learners", "Early Learners", 24, 35),
  offering("preschool", "Preschool", 36, 47),
  offering("pre-kindergarten", "Pre-Kindergarten", 48, 59),
  offering("kindergarten", "Kindergarten", 60, 71),
];

function input(overrides: Partial<FinderInput> = {}): FinderInput {
  return {
    dateOfBirth: "",
    today: TODAY,
    academicYear: { id: "ay-2026", label: "2026–27", eligibilityCutoffDate: "2026-09-01" },
    offerings: CORE,
    elementaryActive: false,
    elementaryGrades: [],
    ...overrides,
  };
}

describe("resolveEffectiveCutoff", () => {
  it("prefers the offering override, then the academic year, then null", () => {
    const year = { eligibilityCutoffDate: "2026-09-01" };
    expect(resolveEffectiveCutoff({ dobCutoffOverride: "2026-12-31" }, year)).toBe("2026-12-31");
    expect(resolveEffectiveCutoff({ dobCutoffOverride: null }, year)).toBe("2026-09-01");
    expect(resolveEffectiveCutoff({ dobCutoffOverride: null }, { eligibilityCutoffDate: null })).toBeNull();
  });
});

describe("evaluateProgramFinder", () => {
  it("shows the empty state before a date of birth is entered", () => {
    const result = evaluateProgramFinder(input());
    expect(result.kind).toBe("empty");
    expect(result.cutoffLine).toBe("Age on 1 Sep 2026");
    expect(result.age).toBe("—");
    expect(result.action.href).toBe("/programs");
  });

  it("places a child using the academic-year cutoff", () => {
    // Born 2023-06-10 → 38 completed months on 2026-09-01 → Preschool (36–47).
    const result = evaluateProgramFinder(input({ dateOfBirth: "2023-06-10" }));
    expect(result.kind).toBe("match");
    expect(result.matchedProgramId).toBe("prog-preschool");
    expect(result.months).toBe(38);
    expect(result.age).toBe("3 years");
    expect(result.cutoffLine).toBe("Age on 1 Sep 2026");
    expect(result.action).toEqual({ label: "Learn about Preschool", href: "/programs/preschool" });
  });

  it("uses an offering's own override instead of the academic-year cutoff", () => {
    // Born 2022-10-15: 46 months on 2026-09-01 (Preschool) but 48 months on
    // 2026-11-01. With Pre-K overridden to 2026-11-01, Preschool still matches
    // first at the year cutoff because it is evaluated in age order.
    const preschoolOverride = [
      offering("early-learners", "Early Learners", 24, 35),
      offering("preschool", "Preschool", 36, 47, "2026-06-01"),
      offering("pre-kindergarten", "Pre-Kindergarten", 48, 59, "2026-11-01"),
      offering("kindergarten", "Kindergarten", 60, 71),
    ];
    // At the Preschool override (2026-06-01) the child is 43 months → Preschool.
    const result = evaluateProgramFinder(input({ dateOfBirth: "2022-10-15", offerings: preschoolOverride }));
    expect(result.kind).toBe("match");
    expect(result.matchedProgramId).toBe("prog-preschool");
    expect(result.months).toBe(43);
    expect(result.cutoffLine).toBe("Age on 1 Jun 2026");
  });

  it("evaluates different offerings against different overrides", () => {
    // Born 2022-09-15. Preschool override 2026-06-01 → 44 months (no match for
    // Pre-K, and Preschool band is 36–47 → matches at its own cutoff).
    // Use a DOB that misses Preschool at its cutoff but hits Pre-K at Pre-K's.
    const offerings = [
      offering("early-learners", "Early Learners", 24, 35),
      offering("preschool", "Preschool", 36, 47, "2026-03-01"),
      offering("pre-kindergarten", "Pre-Kindergarten", 48, 59, "2026-12-01"),
      offering("kindergarten", "Kindergarten", 60, 71),
    ];
    // Born 2022-02-15: at 2026-03-01 → 48 months (outside 36–47 for Preschool);
    // at 2026-12-01 → 57 months → Pre-K.
    const result = evaluateProgramFinder(input({ dateOfBirth: "2022-02-15", offerings }));
    expect(result.kind).toBe("match");
    expect(result.matchedProgramId).toBe("prog-pre-kindergarten");
    expect(result.months).toBe(57);
    expect(result.cutoffLine).toBe("Age on 1 Dec 2026");
  });

  it("treats age-band boundaries as inclusive", () => {
    // Exactly 24 months on the cutoff → Early Learners lower bound.
    const lower = evaluateProgramFinder(input({ dateOfBirth: "2024-09-01" }));
    expect(lower.kind).toBe("match");
    expect(lower.months).toBe(24);
    expect(lower.matchedProgramId).toBe("prog-early-learners");

    // 35 months → still Early Learners upper bound.
    const upper = evaluateProgramFinder(input({ dateOfBirth: "2023-09-02" }));
    expect(upper.months).toBe(35);
    expect(upper.matchedProgramId).toBe("prog-early-learners");

    // 36 months → first day of Preschool.
    const next = evaluateProgramFinder(input({ dateOfBirth: "2023-09-01" }));
    expect(next.months).toBe(36);
    expect(next.matchedProgramId).toBe("prog-preschool");

    // 71 months → Kindergarten upper bound; 72 → beyond.
    const kUpper = evaluateProgramFinder(input({ dateOfBirth: "2020-09-02" }));
    expect(kUpper.months).toBe(71);
    expect(kUpper.matchedProgramId).toBe("prog-kindergarten");
    const beyond = evaluateProgramFinder(input({ dateOfBirth: "2020-09-01" }));
    expect(beyond.months).toBe(72);
    expect(beyond.kind).toBe("beyond");
  });

  it("reports a child below the minimum age", () => {
    const result = evaluateProgramFinder(input({ dateOfBirth: "2025-01-20" }));
    expect(result.kind).toBe("below-minimum");
    expect(result.months).toBe(19);
    expect(result.age).toBe("19 months");
    expect(result.label).toBe("Not yet eligible");
    expect(result.program).toBe("Early Learners opens at age 2");
    expect(result.action.href).toBe("/request-information");
  });

  it("calculates nothing when no approved cutoff exists", () => {
    const result = evaluateProgramFinder(
      input({
        dateOfBirth: "2023-06-10",
        academicYear: { id: "ay-2026", label: "2026–27", eligibilityCutoffDate: null },
      }),
    );
    expect(result.kind).toBe("no-cutoff");
    expect(result.months).toBeNull();
    expect(result.age).toBe("—");
    expect(result.cutoffLine).toBe(CONFIRMATION_LINE);
    expect(result.program).toBe(CONFIRMATION_MESSAGE);
    expect(result.action).toEqual({ label: "Contact Admissions", href: "/admissions" });
  });

  it("never falls back to an assumed date when only some offerings have cutoffs", () => {
    const offerings = [
      offering("early-learners", "Early Learners", 24, 35, "2026-09-01"),
      offering("preschool", "Preschool", 36, 47),
      offering("pre-kindergarten", "Pre-Kindergarten", 48, 59),
      offering("kindergarten", "Kindergarten", 60, 71),
    ];
    const year = { id: "ay-2026", label: "2026–27", eligibilityCutoffDate: null };
    // Child of preschool age: Preschool has no cutoff, so no band matches and
    // the year has no cutoff either → admissions confirms.
    const result = evaluateProgramFinder(input({ dateOfBirth: "2023-06-10", offerings, academicYear: year }));
    expect(result.kind).toBe("unresolved");
    expect(result.months).toBeNull();
    expect(result.action.href).toBe("/admissions");
  });

  it("does not expose elementary grades while elementary is inactive", () => {
    const result = evaluateProgramFinder(
      input({
        dateOfBirth: "2019-05-01",
        elementaryActive: false,
        elementaryGrades: [{ id: "g1", label: "Grade 1", ageMinMonths: 72, ageMaxMonths: 83 }],
      }),
    );
    expect(result.kind).toBe("beyond");
    expect(result.months).toBe(88);
    expect(result.label).toBe("Beyond Kindergarten eligibility");
    expect(result.program).not.toContain("Grade");
    expect(result.action.href).toBe("/admissions");
  });

  it("recommends an elementary grade once elementary is active", () => {
    const result = evaluateProgramFinder(
      input({
        dateOfBirth: "2020-01-15",
        elementaryActive: true,
        elementaryGrades: [
          { id: "g1", label: "Grade 1", ageMinMonths: 72, ageMaxMonths: 83 },
          { id: "g2", label: "Grade 2", ageMinMonths: 84, ageMaxMonths: 95 },
        ],
      }),
    );
    expect(result.kind).toBe("elementary");
    expect(result.months).toBe(79);
    expect(result.program).toBe("Grade 1 — Elementary Program");
    expect(result.action).toEqual({ label: "Talk to Admissions", href: "/admissions" });
  });

  it("handles a leap-day date of birth deterministically", () => {
    // Born 2024-02-29. On 2026-02-28 the 29th has not been reached → 23 months.
    const before = evaluateProgramFinder(
      input({
        dateOfBirth: "2024-02-29",
        academicYear: { id: "y", label: "y", eligibilityCutoffDate: "2026-02-28" },
      }),
    );
    expect(before.months).toBe(23);
    expect(before.kind).toBe("below-minimum");

    // On 2026-03-01 two full years have passed → 24 months → Early Learners.
    const after = evaluateProgramFinder(
      input({
        dateOfBirth: "2024-02-29",
        academicYear: { id: "y", label: "y", eligibilityCutoffDate: "2026-03-01" },
      }),
    );
    expect(after.months).toBe(24);
    expect(after.matchedProgramId).toBe("prog-early-learners");

    // Four years later on the next leap day → exactly 48 months → Pre-K.
    const leap = evaluateProgramFinder(
      input({
        dateOfBirth: "2024-02-29",
        today: { year: 2028, month: 3, day: 1 },
        academicYear: { id: "y", label: "y", eligibilityCutoffDate: "2028-02-29" },
      }),
    );
    expect(leap.months).toBe(48);
    expect(leap.matchedProgramId).toBe("prog-pre-kindergarten");
  });

  it("is independent of the process timezone", () => {
    const original = process.env.TZ;
    const cases: [string, number][] = [];
    for (const tz of ["UTC", "Pacific/Kiritimati", "Pacific/Pago_Pago", "America/Los_Angeles", "Asia/Kolkata"]) {
      process.env.TZ = tz;
      const result = evaluateProgramFinder(input({ dateOfBirth: "2023-09-01" }));
      cases.push([tz, result.months ?? -1]);
    }
    process.env.TZ = original;
    expect(cases.every(([, months]) => months === 36)).toBe(true);
  });

  it("rejects a malformed or future date of birth", () => {
    expect(evaluateProgramFinder(input({ dateOfBirth: "2023-02-30" })).kind).toBe("invalid-dob");
    expect(evaluateProgramFinder(input({ dateOfBirth: "not-a-date" })).kind).toBe("invalid-dob");
    const future = evaluateProgramFinder(input({ dateOfBirth: "2026-03-16" }));
    expect(future.kind).toBe("invalid-dob");
    expect(future.program).toBe("Please check the date of birth");
  });
});

describe("date helpers", () => {
  it("counts completed months only once the day of month is reached", () => {
    const from = parseIsoDate("2024-01-31")!;
    expect(completedMonths(from, parseIsoDate("2024-02-29")!)).toBe(0);
    expect(completedMonths(from, parseIsoDate("2024-03-31")!)).toBe(2);
    expect(completedMonths(from, parseIsoDate("2023-12-01")!)).toBe(0);
  });

  it("formats ages in months under two years and whole years above", () => {
    expect(formatAge(1)).toBe("1 month");
    expect(formatAge(23)).toBe("23 months");
    expect(formatAge(24)).toBe("2 years");
    expect(formatAge(71)).toBe("5 years");
  });

  it("validates real calendar dates", () => {
    expect(parseIsoDate("2024-02-29")).toEqual({ year: 2024, month: 2, day: 29 });
    expect(parseIsoDate("2023-02-29")).toBeNull();
    expect(parseIsoDate("2024-13-01")).toBeNull();
    expect(parseIsoDate("2024-1-1")).toBeNull();
    expect(parseIsoDate(20240101)).toBeNull();
  });
});
