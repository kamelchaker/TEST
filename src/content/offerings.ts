import type { ProgramOffering } from "./types";

/**
 * One offering per program per academic year. Application URLs, days, hours
 * and class sizes stay `null` until approved for publication; the site omits
 * anything that is `null`.
 */
const offering = (
  programId: string,
  academicYearId: string,
  status: ProgramOffering["status"],
): ProgramOffering => ({
  id: `${programId}:${academicYearId}`,
  programId,
  academicYearId,
  campusId: "campus-main",
  status,
  dobCutoffOverride: null,
  applicationUrl: null,
  days: null,
  hours: null,
  classSize: null,
});

export const programOfferings: ProgramOffering[] = [
  offering("prog-early-learners", "ay-2026", "open"),
  offering("prog-preschool", "ay-2026", "waitlist"),
  offering("prog-pre-kindergarten", "ay-2026", "open"),
  offering("prog-kindergarten", "ay-2026", "open"),
  offering("prog-extended-learning", "ay-2026", "open"),
  offering("prog-early-learners", "ay-2027", "open"),
  offering("prog-preschool", "ay-2027", "waitlist"),
  offering("prog-pre-kindergarten", "ay-2027", "open"),
  offering("prog-kindergarten", "ay-2027", "open"),
  offering("prog-extended-learning", "ay-2027", "open"),
];
