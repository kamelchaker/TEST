import { academicYears } from "@/content/academic-years";
import { admissionsContent } from "@/content/admissions";
import { campuses } from "@/content/campuses";
import { curriculumDomains, curriculumStages } from "@/content/curriculum";
import { editorialPages, type EditorialPage } from "@/content/editorial";
import { faculty } from "@/content/faculty";
import { faqs } from "@/content/faqs";
import { programOfferings } from "@/content/offerings";
import { getPhoto } from "@/content/photography";
import { programs } from "@/content/programs";
import { siteSettings } from "@/content/site";
import { tuition } from "@/content/tuition";
import type {
  AcademicYear,
  AdmissionsContent,
  Campus,
  CurriculumDomain,
  CurriculumStage,
  DomainGroup,
  Faculty,
  Faq,
  Program,
  ProgramOffering,
  SiteSettings,
  Tuition,
} from "@/content/types";
import type { FinderOffering } from "@/lib/finder";
import { isProgramVisible, statusLabel } from "./visibility";

export { getPhoto, isProgramVisible, statusLabel };

/* ---------------------------------------------------------------- Settings */

export function getSiteSettings(): SiteSettings {
  return siteSettings;
}

/* ---------------------------------------------------------- Academic years */

export function getAcademicYears(): AcademicYear[] {
  return academicYears;
}

export function getAcademicYear(id: string): AcademicYear | null {
  return academicYears.find((y) => y.id === id) ?? null;
}

export function getCurrentAcademicYear(): AcademicYear {
  const current = getAcademicYear(siteSettings.currentAcademicYearId) ?? academicYears[0];
  if (!current) throw new Error("At least one academic year must be defined.");
  return current;
}

/* ----------------------------------------------------------------- Campus */

export function getCampus(id = siteSettings.defaultCampusId): Campus | null {
  return campuses.find((c) => c.id === id) ?? null;
}

/* --------------------------------------------------------------- Programs */

/** Programs the site may show, in display order. */
export function getVisiblePrograms(): Program[] {
  return programs.filter((p) => isProgramVisible(p, siteSettings));
}

/** The age-banded core programs in stage order (Early Learners → Kindergarten). */
export function getCorePrograms(): Program[] {
  return getVisiblePrograms()
    .filter((p) => p.kind === "core")
    .sort((a, b) => a.stageIndex - b.stageIndex);
}

export function getProgramBySlug(slug: string): Program | null {
  return getVisiblePrograms().find((p) => p.slug === slug) ?? null;
}

export function getProgramById(id: string): Program | null {
  return getVisiblePrograms().find((p) => p.id === id) ?? null;
}

/* -------------------------------------------------------------- Offerings */

export function getOffering(
  programId: string,
  academicYearId = siteSettings.currentAcademicYearId,
): ProgramOffering | null {
  return (
    programOfferings.find(
      (o) => o.programId === programId && o.academicYearId === academicYearId,
    ) ?? null
  );
}

export interface ProgramListing {
  program: Program;
  offering: ProgramOffering | null;
  /** Human status, e.g. "Open", or null when no offering exists for the year. */
  status: string | null;
}

export function getProgramListings(academicYearId?: string): ProgramListing[] {
  return getVisiblePrograms().map((program) => {
    const offering = getOffering(program.id, academicYearId);
    return { program, offering, status: offering ? statusLabel(offering.status) : null };
  });
}

export function getCoreProgramListings(academicYearId?: string): ProgramListing[] {
  return getProgramListings(academicYearId).filter((l) => l.program.kind === "core");
}

/** Core offerings for the Program Finder, shaped for the pure evaluator. */
export function getFinderOfferings(academicYearId: string): FinderOffering[] {
  return getCorePrograms().flatMap((program) => {
    const offering = getOffering(program.id, academicYearId);
    if (!offering) return [];
    return [
      {
        programId: program.id,
        slug: program.slug,
        name: program.name,
        ageRange: program.ageRange,
        ageMinMonths: program.ageMinMonths,
        ageMaxMonths: program.ageMaxMonths,
        dobCutoffOverride: offering.dobCutoffOverride,
      },
    ];
  });
}

export interface ProgramFact {
  label: string;
  value: string;
}

/** Only values approved for publication appear; unapproved ones are omitted. */
export function getProgramFacts(program: Program, offering: ProgramOffering | null): ProgramFact[] {
  const facts: ProgramFact[] = [{ label: "Ages", value: program.ageRange }];
  if (offering?.days) facts.push({ label: "Days", value: offering.days });
  if (offering?.hours) facts.push({ label: "Hours", value: offering.hours });
  if (offering?.classSize) facts.push({ label: "Class size", value: offering.classSize });
  facts.push({ label: "Extended Learning", value: "Before & After School" });
  const next = program.nextProgramId ? getProgramById(program.nextProgramId) : null;
  if (next) facts.push({ label: "Next step", value: `${next.name} (${next.ageRange})` });
  if (offering) facts.push({ label: "Enrollment", value: statusLabel(offering.status) });
  return facts;
}

/* ------------------------------------------------------------- Curriculum */

export function getDomains(group?: DomainGroup): CurriculumDomain[] {
  return group ? curriculumDomains.filter((d) => d.group === group) : curriculumDomains;
}

export function getDomain(id: string): CurriculumDomain | null {
  return curriculumDomains.find((d) => d.id === id) ?? null;
}

export function getStage(domainId: string, stageIndex: number): CurriculumStage | null {
  return (
    curriculumStages.find((s) => s.domainId === domainId && s.stageIndex === stageIndex) ?? null
  );
}

export interface ProgramStage {
  domain: CurriculumDomain;
  stage: CurriculumStage;
}

/** The stage of every domain in a group for a program, omitting gaps. */
export function getStagesForProgram(program: Program, group: DomainGroup): ProgramStage[] {
  return getDomains(group).flatMap((domain) => {
    const stage = getStage(domain.id, program.stageIndex);
    return stage ? [{ domain, stage }] : [];
  });
}

export interface DomainStageColumn {
  program: Program;
  stage: CurriculumStage;
}

/** One column per core program for a single domain (ages 2 to 6, left to right). */
export function getDomainProgression(domainId: string): DomainStageColumn[] {
  return getCorePrograms().flatMap((program) => {
    const stage = getStage(domainId, program.stageIndex);
    return stage ? [{ program, stage }] : [];
  });
}

/* ------------------------------------------------------------------- FAQs */

export function getFaqs(ids: string[]): Faq[] {
  return ids.flatMap((id) => {
    const faq = faqs.find((f) => f.id === id);
    return faq ? [faq] : [];
  });
}

/* ---------------------------------------------------------------- Tuition */

export interface TuitionView {
  approved: boolean;
  rows: { program: Program; annual: string; monthly: string }[];
  otherFees: string[];
  assistanceNote: string;
}

export function getTuition(academicYearId = siteSettings.currentAcademicYearId): TuitionView | null {
  const record: Tuition | undefined = tuition.find((t) => t.academicYearId === academicYearId);
  if (!record) return null;
  const rows = record.approved
    ? record.rows.flatMap((row) => {
        const program = getProgramById(row.programId);
        return program ? [{ program, annual: row.annual, monthly: row.monthly }] : [];
      })
    : [];
  return {
    approved: record.approved && rows.length > 0,
    rows,
    otherFees: record.otherFees,
    assistanceNote: record.assistanceNote,
  };
}

/* ------------------------------------------------------------- Admissions */

export function getAdmissionsContent(): AdmissionsContent {
  return admissionsContent;
}

/* -------------------------------------------------------------- Editorial */

export function getEditorialPage(slug: EditorialPage["slug"]): EditorialPage | null {
  return editorialPages.find((p) => p.slug === slug) ?? null;
}

/* ---------------------------------------------------------------- Faculty */

/** Faculty approved for publication. Empty until profiles are supplied. */
export function getFaculty(): Faculty[] {
  return faculty.filter((f) => f.name.trim().length > 0);
}
