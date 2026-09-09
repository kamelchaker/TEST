import type { AcademicYear } from "./types";

/**
 * Eligibility cutoff dates stay `null` until Al-Baseerah supplies an approved
 * date for the year. With none set, the Program Finder does not calculate and
 * instead directs families to the admissions team.
 */
export const academicYears: AcademicYear[] = [
  {
    id: "ay-2026",
    label: "2026–27",
    startYear: 2026,
    eligibilityCutoffDate: null,
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
