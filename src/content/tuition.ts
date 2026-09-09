import type { Tuition } from "./types";

/**
 * Tuition figures are published only once the school approves them. Until
 * then the tuition page directs families to the admissions team.
 */
export const tuition: Tuition[] = [
  {
    academicYearId: "ay-2026",
    approved: false,
    rows: [],
    otherFees: ["Application fee", "Enrollment deposit", "Supplies", "Extended learning"],
    assistanceNote: "Plan options, sibling consideration and any assistance available.",
  },
  {
    academicYearId: "ay-2027",
    approved: false,
    rows: [],
    otherFees: ["Application fee", "Enrollment deposit", "Supplies", "Extended learning"],
    assistanceNote: "Plan options, sibling consideration and any assistance available.",
  },
];
