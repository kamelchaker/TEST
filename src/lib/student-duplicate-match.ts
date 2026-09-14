/**
 * Duplicate detection for student CSV imports.
 *
 * Pure, framework-independent logic. It compares incoming rows against the
 * existing students of one school and against each other, and classifies
 * every row so an admin can decide what to import.
 *
 * Only normalized first + last name and an exact date of birth decide a
 * status. Grade, class and parent email never promote a row to a duplicate;
 * they are reported as supporting context only.
 */

export type MatchStatus = "new" | "duplicate" | "possible-duplicate";

export interface ExistingStudent {
  id: string;
  firstName: string;
  lastName: string;
  /** YYYY-MM-DD, or null when unknown. */
  dateOfBirth: string | null;
  grade?: string | null;
  className?: string | null;
  parentEmail?: string | null;
}

export interface ImportRow {
  /** 1-based row number in the uploaded file, for display. */
  rowNumber: number;
  firstName: string;
  lastName: string;
  /** Raw date-of-birth cell; may be empty or malformed. */
  dateOfBirth: string | null | undefined;
  grade?: string | null;
  className?: string | null;
  parentEmail?: string | null;
  /** All raw cells of the row, used to detect exactly repeated rows. */
  raw?: Record<string, string>;
}

export type DobStatus =
  | { kind: "present"; value: string }
  | { kind: "missing" }
  | { kind: "malformed"; raw: string };

export type SupportingField = "grade" | "className" | "parentEmail";

export type MatchContext =
  | {
      kind: "existing-student";
      student: ExistingStudent;
      /** Supporting fields that also agree, shown to the admin only. */
      sharedFields: SupportingField[];
    }
  | { kind: "repeated-row"; rowNumber: number }
  | { kind: "csv-row"; rowNumber: number; sharedFields: SupportingField[] };

export interface RowMatch {
  rowNumber: number;
  status: MatchStatus;
  /** Short, admin-facing explanation of the status. */
  reason: string;
  dob: DobStatus;
  matches: MatchContext[];
}

export interface MatchInput {
  rows: ImportRow[];
  existingStudents: ExistingStudent[];
}

/* ------------------------------------------------------------ normalizing */

// Hyphen-like and apostrophe-like characters that separate name parts.
const SEPARATORS = /[-‐-―'‘’ʼ]/g;
const KEY_SEPARATOR = "|";
const CELL_SEPARATOR = "\t";

/**
 * trim, then Unicode NFD, strip combining marks, lowercase, hyphens and
 * apostrophes to spaces, collapse whitespace.
 */
export function normalizeName(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(SEPARATORS, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Exact YYYY-MM-DD after trim. Anything else is malformed, never coerced. */
export function normalizeDob(value: string | null | undefined): DobStatus {
  const raw = (value ?? "").trim();
  if (!raw) return { kind: "missing" };
  const match = ISO_DATE.exec(raw);
  if (!match) return { kind: "malformed", raw };
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return { kind: "malformed", raw };
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > daysInMonth) return { kind: "malformed", raw };
  return { kind: "present", value: raw };
}

export function nameKey(firstName: string | null | undefined, lastName: string | null | undefined): string {
  return `${normalizeName(firstName)}${KEY_SEPARATOR}${normalizeName(lastName)}`;
}

/* -------------------------------------------------------------- comparing */

type DobComparison = "equal" | "different" | "undecidable";

/** A malformed DOB is treated like a missing one: it can never confirm a match. */
function compareDob(a: DobStatus, b: DobStatus): DobComparison {
  if (a.kind !== "present" || b.kind !== "present") return "undecidable";
  return a.value === b.value ? "equal" : "different";
}

function statusFromDob(comparison: DobComparison): MatchStatus {
  if (comparison === "equal") return "duplicate";
  if (comparison === "different") return "new";
  return "possible-duplicate";
}

const RANK: Record<MatchStatus, number> = { new: 0, "possible-duplicate": 1, duplicate: 2 };

function stronger(a: MatchStatus, b: MatchStatus): MatchStatus {
  return RANK[b] > RANK[a] ? b : a;
}

function normalizeSupporting(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function sharedSupportingFields(
  row: Pick<ImportRow, "grade" | "className" | "parentEmail">,
  other: Pick<ExistingStudent, "grade" | "className" | "parentEmail">,
): SupportingField[] {
  const shared: SupportingField[] = [];
  for (const field of ["grade", "className", "parentEmail"] as const) {
    const a = normalizeSupporting(row[field]);
    const b = normalizeSupporting(other[field]);
    if (a && a === b) shared.push(field);
  }
  return shared;
}

function rowSignature(row: ImportRow): string {
  const cells = row.raw
    ? Object.keys(row.raw)
        .sort()
        .map((key) => `${key}=${(row.raw?.[key] ?? "").trim()}`)
    : [
        `firstName=${(row.firstName ?? "").trim()}`,
        `lastName=${(row.lastName ?? "").trim()}`,
        `dateOfBirth=${(row.dateOfBirth ?? "").trim()}`,
        `grade=${(row.grade ?? "").trim()}`,
        `className=${(row.className ?? "").trim()}`,
        `parentEmail=${(row.parentEmail ?? "").trim()}`,
      ];
  return cells.join(CELL_SEPARATOR);
}

function describeStudent(student: ExistingStudent): string {
  const name = `${student.firstName} ${student.lastName}`.trim();
  return student.dateOfBirth ? `${name} (born ${student.dateOfBirth})` : name;
}

/* --------------------------------------------------------------- matching */

/**
 * Classifies every row. Within the file, a row is only compared with rows
 * that precede it, so the first occurrence stays "new" and later ones carry
 * the duplicate or possible-duplicate status.
 */
export function matchStudents({ rows, existingStudents }: MatchInput): RowMatch[] {
  const existingByName = new Map<string, ExistingStudent[]>();
  for (const student of existingStudents) {
    const key = nameKey(student.firstName, student.lastName);
    const list = existingByName.get(key) ?? [];
    list.push(student);
    existingByName.set(key, list);
  }

  const seenSignatures = new Map<string, number>();
  const seenByName = new Map<string, { row: ImportRow; dob: DobStatus }[]>();
  const results: RowMatch[] = [];

  for (const row of rows) {
    const dob = normalizeDob(row.dateOfBirth);
    const key = nameKey(row.firstName, row.lastName);
    const matches: MatchContext[] = [];
    const reasons: string[] = [];
    let status: MatchStatus = "new";

    // 1. Exactly repeated row earlier in the same file.
    const signature = rowSignature(row);
    const firstRow = seenSignatures.get(signature);
    if (firstRow !== undefined) {
      status = "duplicate";
      matches.push({ kind: "repeated-row", rowNumber: firstRow });
      reasons.push(`Exact repeat of row ${firstRow}`);
    } else {
      seenSignatures.set(signature, row.rowNumber);
    }

    // 2. Same normalized name earlier in the same file.
    for (const earlier of seenByName.get(key) ?? []) {
      if (matches.some((m) => m.kind === "repeated-row" && m.rowNumber === earlier.row.rowNumber)) continue;
      const comparison = compareDob(dob, earlier.dob);
      const rowStatus = statusFromDob(comparison);
      matches.push({
        kind: "csv-row",
        rowNumber: earlier.row.rowNumber,
        sharedFields: sharedSupportingFields(row, earlier.row),
      });
      if (rowStatus !== "new") {
        status = stronger(status, rowStatus);
        reasons.push(
          comparison === "equal"
            ? `Same name and date of birth as row ${earlier.row.rowNumber}`
            : `Same name as row ${earlier.row.rowNumber}; date of birth missing on one of them`,
        );
      }
    }

    // 3. Existing students of the same school.
    for (const student of existingByName.get(key) ?? []) {
      const comparison = compareDob(dob, normalizeDob(student.dateOfBirth));
      const rowStatus = statusFromDob(comparison);
      matches.push({ kind: "existing-student", student, sharedFields: sharedSupportingFields(row, student) });
      if (rowStatus !== "new") {
        status = stronger(status, rowStatus);
        reasons.push(
          comparison === "equal"
            ? `Matches existing student ${describeStudent(student)}`
            : `Same name as existing student ${describeStudent(student)}; date of birth missing or unreadable`,
        );
      }
    }

    const list = seenByName.get(key) ?? [];
    list.push({ row, dob });
    seenByName.set(key, list);

    results.push({
      rowNumber: row.rowNumber,
      status,
      reason: reasons.length ? reasons.join(". ") : "No matching student found",
      dob,
      matches,
    });
  }

  return results;
}

export interface MatchSummary {
  new: number;
  duplicate: number;
  possibleDuplicate: number;
}

export function summarizeMatches(results: RowMatch[]): MatchSummary {
  const summary: MatchSummary = { new: 0, duplicate: 0, possibleDuplicate: 0 };
  for (const r of results) {
    if (r.status === "new") summary.new += 1;
    else if (r.status === "duplicate") summary.duplicate += 1;
    else summary.possibleDuplicate += 1;
  }
  return summary;
}
