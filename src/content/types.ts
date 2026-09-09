/**
 * Content model for the Al-Baseerah Academy website.
 *
 * These types describe the records a CMS (or the local content files) supply.
 * Values that the school has not yet approved are represented as `null` or an
 * empty array, never as placeholder text, so the presentation layer can omit
 * them gracefully.
 */

/** Calendar date without a time component, formatted YYYY-MM-DD. */
export type IsoDate = string;

export type ImageKey = string;

export type IconName =
  | "book"
  | "recitation"
  | "chat"
  | "school"
  | "heart"
  | "spark"
  | "person"
  | "hands"
  | "shield"
  | "blocks"
  | "grid"
  | "motion"
  | "idea"
  | "clock";

export interface AcademicYear {
  id: string;
  /** Display label, e.g. "2026–27". */
  label: string;
  startYear: number;
  /**
   * Approved date on which a child's age determines placement for this year.
   * `null` until the school supplies one; no fallback date is ever assumed.
   */
  eligibilityCutoffDate: IsoDate | null;
  applicationOpensOn: IsoDate | null;
  priorityDeadline: IsoDate | null;
  firstDayOfSchool: IsoDate | null;
}

export interface Campus {
  id: string;
  name: string;
  addressLines: string[];
  phone: string | null;
  email: string | null;
  mapUrl: string | null;
}

export type ProgramKind = "core" | "extended" | "elementary";

export interface ScheduleBlock {
  time: string;
  label: string;
  /** Curriculum domains touched in this block, as displayed. */
  domains: string;
}

export interface Highlight {
  label: string;
  icon: IconName;
}

export interface Program {
  id: string;
  slug: string;
  name: string;
  kind: ProgramKind;
  /** Display label, e.g. "Ages 2–3". */
  ageLabel: string;
  /** Short age range without prefix, e.g. "2–3". */
  ageRange: string;
  /** Inclusive age band in completed months at the effective cutoff. */
  ageMinMonths: number;
  ageMaxMonths: number;
  /** Position of this program in the four-stage curriculum progression (0–3). */
  stageIndex: number;
  summary: string;
  headline: string;
  value: string;
  imageKey: ImageKey;
  highlights: Highlight[];
  gallery: { imageKey: ImageKey; caption: string }[];
  dayTitle: string;
  schedule: ScheduleBlock[];
  faqIds: string[];
  nextProgramId: string | null;
  /** Grade label for elementary programs, e.g. "Grade 1". */
  gradeLabel: string | null;
}

export type OfferingStatus = "open" | "waitlist" | "closed" | "coming-soon";

export interface ProgramOffering {
  id: string;
  programId: string;
  academicYearId: string;
  campusId: string;
  status: OfferingStatus;
  /** Overrides the academic year's eligibility cutoff for this offering only. */
  dobCutoffOverride: IsoDate | null;
  /** External application system URL. `null` until supplied by the school. */
  applicationUrl: string | null;
  days: string | null;
  hours: string | null;
  classSize: string | null;
}

export type DomainGroup = "academic" | "islamic";

export interface CurriculumDomain {
  id: string;
  name: string;
  shortName: string;
  group: DomainGroup;
  blurb: string;
  imageKey: ImageKey;
}

export interface CurriculumStage {
  domainId: string;
  /** Stage position 0–3, matching Program.stageIndex. */
  stageIndex: number;
  stageName: string;
  outcomes: string[];
}

export type FaqScope = "admissions" | "families" | "program";

export interface Faq {
  id: string;
  scope: FaqScope;
  question: string;
  answer: string;
}

export interface TuitionRow {
  programId: string;
  annual: string;
  monthly: string;
}

export interface Tuition {
  academicYearId: string;
  /** Figures are shown only once the school approves publication. */
  approved: boolean;
  rows: TuitionRow[];
  otherFees: string[];
  assistanceNote: string;
}

export interface JourneyStep {
  label: string;
  body: string;
  current: boolean;
}

export interface ApplyStep {
  title: string;
  body: string;
}

export interface AdmissionsContent {
  journey: JourneyStep[];
  applySteps: ApplyStep[];
  neededAtApplication: string[];
  afterOfferNote: string;
  faqIds: string[];
}

export interface Faculty {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageKey: ImageKey | null;
}

export interface ElementaryGrade {
  id: string;
  label: string;
  ageMinMonths: number;
  ageMaxMonths: number;
}

export interface NavItem {
  label: string;
  href: string;
  /** Route prefix used to mark the item current. */
  match: string;
}

export interface FooterColumn {
  title: string;
  items: { label: string; href: string }[];
}

export interface SiteSettings {
  name: string;
  shortName: string;
  tagline: string;
  descriptor: string;
  strapline: string;
  siteUrl: string;
  locale: string;
  currentAcademicYearId: string;
  defaultCampusId: string;
  /** Whether Grades 1–5 are offered. Controlled centrally; never inferred. */
  elementaryActive: boolean;
  elementaryGrades: ElementaryGrade[];
  navigation: NavItem[];
  footer: FooterColumn[];
  consentStatement: string;
}

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** CSS object-position, e.g. "62% 45%". */
  position?: string;
  /**
   * Temporary visual assets stand in for Al-Baseerah photography until real
   * images are supplied. They are never described as documentary photographs.
   */
  temporary: boolean;
}
