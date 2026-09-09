import {
  compareDates,
  completedMonths,
  formatAge,
  formatDate,
  parseIsoDate,
  type CalendarDate,
} from "./date";

/**
 * Program Finder — framework-independent placement logic.
 *
 * Each offering is evaluated against its own effective cutoff:
 *
 *   effectiveCutoff = offering.dobCutoffOverride ?? academicYear.eligibilityCutoffDate ?? null
 *
 * Completed months are calculated at that cutoff date and compared with the
 * offering's inclusive age band. When no approved cutoff exists nothing is
 * calculated; the family is directed to the admissions team instead.
 */

export interface FinderAcademicYear {
  id: string;
  label: string;
  eligibilityCutoffDate: string | null;
}

export interface FinderOffering {
  programId: string;
  slug: string;
  name: string;
  /** Age range without prefix, e.g. "2–3". */
  ageRange: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  dobCutoffOverride: string | null;
}

export interface FinderElementaryGrade {
  id: string;
  label: string;
  ageMinMonths: number;
  ageMaxMonths: number;
}

export interface FinderInput {
  /** Raw date-of-birth input, expected as YYYY-MM-DD. */
  dateOfBirth: string;
  /** The calendar date to treat as "today" (for future-date checks). */
  today: CalendarDate;
  academicYear: FinderAcademicYear;
  /** Core program offerings for the academic year, in any order. */
  offerings: FinderOffering[];
  elementaryActive: boolean;
  elementaryGrades: FinderElementaryGrade[];
}

export type FinderResultKind =
  | "empty"
  | "no-cutoff"
  | "invalid-dob"
  | "match"
  | "unresolved"
  | "below-minimum"
  | "elementary"
  | "beyond";

export interface FinderAction {
  label: string;
  href: string;
}

export interface FinderResult {
  kind: FinderResultKind;
  /** e.g. "Age on 1 Sep 2026" or the admissions-confirmation line. */
  cutoffLine: string;
  /** Formatted age at the cutoff, or "—" when nothing was calculated. */
  age: string;
  label: string;
  program: string;
  action: FinderAction;
  /** Present only for a matched offering. */
  matchedProgramId: string | null;
  /** Completed months at the cutoff used, when calculated. */
  months: number | null;
}

export const CONFIRMATION_LINE = "Eligibility is confirmed by our admissions team";
export const CONFIRMATION_MESSAGE =
  "Our admissions team will confirm the right program for your child";

const CONTACT_ADMISSIONS: FinderAction = { label: "Contact Admissions", href: "/admissions" };
const EXPLORE_PROGRAMS: FinderAction = { label: "Explore all programs", href: "/programs" };

export function resolveEffectiveCutoff(
  offering: Pick<FinderOffering, "dobCutoffOverride">,
  academicYear: Pick<FinderAcademicYear, "eligibilityCutoffDate">,
): string | null {
  return offering.dobCutoffOverride ?? academicYear.eligibilityCutoffDate ?? null;
}

function cutoffLine(iso: string | null): string {
  const date = iso ? parseIsoDate(iso) : null;
  return date ? `Age on ${formatDate(date)}` : CONFIRMATION_LINE;
}

export function evaluateProgramFinder(input: FinderInput): FinderResult {
  const { academicYear, offerings } = input;
  const yearCutoff = academicYear.eligibilityCutoffDate ?? null;

  const blank: FinderResult = {
    kind: "empty",
    cutoffLine: cutoffLine(yearCutoff),
    age: "—",
    label: "Recommended program",
    program: "Enter a date of birth",
    action: EXPLORE_PROGRAMS,
    matchedProgramId: null,
    months: null,
  };

  if (!input.dateOfBirth.trim()) return blank;

  // Without any approved eligibility date, placement is confirmed by
  // admissions rather than computed here.
  const anyCutoff = offerings.some((o) => resolveEffectiveCutoff(o, academicYear) !== null);
  if (!anyCutoff) {
    return {
      kind: "no-cutoff",
      cutoffLine: CONFIRMATION_LINE,
      age: "—",
      label: "Placement",
      program: CONFIRMATION_MESSAGE,
      action: CONTACT_ADMISSIONS,
      matchedProgramId: null,
      months: null,
    };
  }

  const dob = parseIsoDate(input.dateOfBirth);
  if (!dob || compareDates(dob, input.today) > 0) {
    return {
      ...blank,
      kind: "invalid-dob",
      label: "Check the date",
      program: "Please check the date of birth",
    };
  }

  // Each offering is evaluated against its OWN effective cutoff, in age order.
  const ordered = [...offerings].sort((a, b) => a.ageMinMonths - b.ageMinMonths);
  for (const offering of ordered) {
    const cutoffIso = resolveEffectiveCutoff(offering, academicYear);
    const cutoff = cutoffIso ? parseIsoDate(cutoffIso) : null;
    if (!cutoff) continue;
    const months = completedMonths(dob, cutoff);
    if (months >= offering.ageMinMonths && months <= offering.ageMaxMonths) {
      return {
        kind: "match",
        cutoffLine: cutoffLine(cutoffIso),
        age: formatAge(months),
        label: "Recommended program",
        program: `${offering.name} (${offering.ageRange})`,
        action: { label: `Learn about ${offering.name}`, href: `/programs/${offering.slug}` },
        matchedProgramId: offering.programId,
        months,
      };
    }
  }

  // No band matched: the remaining states use the academic-year cutoff.
  const yearCutoffDate = yearCutoff ? parseIsoDate(yearCutoff) : null;
  if (!yearCutoffDate) {
    return {
      ...blank,
      kind: "unresolved",
      label: "Placement",
      program: "Our admissions team will confirm placement",
      action: CONTACT_ADMISSIONS,
    };
  }

  const months = completedMonths(dob, yearCutoffDate);
  const base = {
    cutoffLine: cutoffLine(yearCutoff),
    age: formatAge(months),
    matchedProgramId: null,
    months,
  };

  const youngest = ordered[0];
  if (youngest && months < youngest.ageMinMonths) {
    return {
      ...base,
      kind: "below-minimum",
      label: "Not yet eligible",
      program: `${youngest.name} opens at age ${Math.floor(youngest.ageMinMonths / 12)}`,
      action: { label: "Request Information", href: "/request-information" },
    };
  }

  const grade = input.elementaryActive
    ? input.elementaryGrades.find((g) => months >= g.ageMinMonths && months <= g.ageMaxMonths)
    : undefined;
  if (grade) {
    return {
      ...base,
      kind: "elementary",
      label: "Recommended program",
      program: `${grade.label} — Elementary Program`,
      action: { label: "Talk to Admissions", href: "/admissions" },
    };
  }

  return {
    ...base,
    kind: "beyond",
    label: "Beyond Kindergarten eligibility",
    program: "Elementary Program — contact Admissions",
    action: CONTACT_ADMISSIONS,
  };
}
