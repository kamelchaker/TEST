import type { AcademicYear } from "./types";

/**
 * Eligibility cutoff dates are set only once Al-Baseerah approves them. For a
 * year with none set, the Program Finder does not calculate and instead
 * directs families to the admissions team.
 *
 * 2026–27: placement follows the child's age on 1 September 2026.
 */
export const academicYears: AcademicYear[] = [
  {
    id: "ay-2026",
    label: "2026–27",
    startYear: 2026,
    eligibilityCutoffDate: "2026-09-01",
    applicationOpensOn: null,
    priorityDeadline: null,
    firstDayOfSchool: null,
  },
  {
    id: "ay-2027",
    label: "2027–28",
    startYear: 2027,
    eligibilityCutoffDate: null,
    applicationOpensOn: null,
    priorityDeadline: null,
    firstDayOfSchool: null,
  },
];
