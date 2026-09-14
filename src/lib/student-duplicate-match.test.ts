import { describe, expect, it } from "vitest";
import {
  matchStudents,
  normalizeDob,
  normalizeName,
  summarizeMatches,
  type ExistingStudent,
  type ImportRow,
} from "./student-duplicate-match";

const row = (rowNumber: number, overrides: Partial<ImportRow> = {}): ImportRow => ({
  rowNumber,
  firstName: "Amina",
  lastName: "Rahman",
  dateOfBirth: "2021-03-10",
  grade: "Kindergarten",
  className: "K-A",
  parentEmail: "parent@example.com",
  ...overrides,
});

const student = (overrides: Partial<ExistingStudent> = {}): ExistingStudent => ({
  id: "stu-1",
  firstName: "Amina",
  lastName: "Rahman",
  dateOfBirth: "2021-03-10",
  grade: "Kindergarten",
  className: "K-A",
  parentEmail: "parent@example.com",
  ...overrides,
});

describe("normalizeName", () => {
  it("trims, lowercases and collapses whitespace", () => {
    expect(normalizeName("  Amina   RAHMAN ")).toBe("amina rahman");
  });

  it("strips diacritics", () => {
    expect(normalizeName("Zoë")).toBe("zoe");
    expect(normalizeName("Ålvaro Núñez")).toBe("alvaro nunez");
    expect(normalizeName("Zoë")).toBe(normalizeName("Zoe"));
  });

  it("treats apostrophes and hyphens as spaces", () => {
    expect(normalizeName("O'Neil")).toBe("o neil");
    expect(normalizeName("O’Neil")).toBe("o neil");
    expect(normalizeName("Abdul-Rahman")).toBe("abdul rahman");
    expect(normalizeName("Abdul - Rahman")).toBe("abdul rahman");
  });
});

describe("normalizeDob", () => {
  it("accepts exact YYYY-MM-DD only", () => {
    expect(normalizeDob(" 2021-03-10 ")).toEqual({ kind: "present", value: "2021-03-10" });
    expect(normalizeDob("")).toEqual({ kind: "missing" });
    expect(normalizeDob(null)).toEqual({ kind: "missing" });
    expect(normalizeDob("10/03/2021")).toEqual({ kind: "malformed", raw: "10/03/2021" });
    expect(normalizeDob("2021-02-30")).toEqual({ kind: "malformed", raw: "2021-02-30" });
  });
});

describe("matching against existing students", () => {
  it("marks same name and same DOB as duplicate", () => {
    const [result] = matchStudents({ rows: [row(1)], existingStudents: [student()] });
    expect(result?.status).toBe("duplicate");
    expect(result?.reason).toContain("Matches existing student Amina Rahman (born 2021-03-10)");
    expect(result?.matches[0]).toMatchObject({
      kind: "existing-student",
      sharedFields: ["grade", "className", "parentEmail"],
    });
  });

  it("marks same name and different DOB as new", () => {
    const [result] = matchStudents({ rows: [row(1, { dateOfBirth: "2020-09-02" })], existingStudents: [student()] });
    expect(result?.status).toBe("new");
    expect(result?.matches).toHaveLength(1);
  });

  it("marks same name with a missing DOB on either side as possible duplicate", () => {
    const rowMissing = matchStudents({ rows: [row(1, { dateOfBirth: "" })], existingStudents: [student()] });
    expect(rowMissing[0]?.status).toBe("possible-duplicate");
    const studentMissing = matchStudents({ rows: [row(1)], existingStudents: [student({ dateOfBirth: null })] });
    expect(studentMissing[0]?.status).toBe("possible-duplicate");
  });

  it("never silently deduplicates on a malformed DOB", () => {
    const [result] = matchStudents({ rows: [row(1, { dateOfBirth: "10/03/2021" })], existingStudents: [student()] });
    expect(result?.status).toBe("possible-duplicate");
    expect(result?.dob).toEqual({ kind: "malformed", raw: "10/03/2021" });
  });

  it("matches names after normalization", () => {
    const rows = [
      row(1, { firstName: "  amina ", lastName: "RAHMAN" }),
      row(2, { firstName: "Zoë", lastName: "O’Neil-Smith" }),
    ];
    const existing = [student(), student({ id: "stu-2", firstName: "Zoe", lastName: "O'Neil Smith" })];
    const results = matchStudents({ rows, existingStudents: existing });
    expect(results.map((r) => r.status)).toEqual(["duplicate", "duplicate"]);
  });

  it("does not match on grade, class or parent email alone", () => {
    const [result] = matchStudents({ rows: [row(1, { firstName: "Yusuf" })], existingStudents: [student()] });
    expect(result?.status).toBe("new");
    expect(result?.matches).toHaveLength(0);
  });

  it("keeps supporting fields as context, not as a promotion", () => {
    const [result] = matchStudents({
      rows: [row(1, { dateOfBirth: "2020-09-02", grade: "Grade 1", className: "1-B", parentEmail: "other@example.com" })],
      existingStudents: [student()],
    });
    expect(result?.status).toBe("new");
    expect(result?.matches[0]).toMatchObject({ kind: "existing-student", sharedFields: [] });
  });
});

describe("matching within the same CSV", () => {
  it("marks an exactly repeated row as duplicate of the first occurrence", () => {
    const results = matchStudents({ rows: [row(1), row(2)], existingStudents: [] });
    expect(results[0]?.status).toBe("new");
    expect(results[1]?.status).toBe("duplicate");
    expect(results[1]?.reason).toBe("Exact repeat of row 1");
    expect(results[1]?.matches).toEqual([{ kind: "repeated-row", rowNumber: 1 }]);
  });

  it("detects exact repeats using raw cells when provided", () => {
    const raw = { "First Name": "Amina", "Last Name": "Rahman", DOB: "2021-03-10", Extra: "x" };
    const results = matchStudents({
      rows: [row(1, { raw }), row(2, { raw: { ...raw, Extra: "y" } }), row(3, { raw: { ...raw } })],
      existingStudents: [],
    });
    // Row 2 differs in a raw cell, so it is not an exact repeat, but shares name and DOB.
    expect(results[1]?.status).toBe("duplicate");
    expect(results[1]?.reason).toBe("Same name and date of birth as row 1");
    expect(results[2]?.matches[0]).toEqual({ kind: "repeated-row", rowNumber: 1 });
  });

  it("marks same name and same DOB as duplicate even when other cells differ", () => {
    const results = matchStudents({ rows: [row(1), row(2, { className: "K-B" })], existingStudents: [] });
    expect(results[1]?.status).toBe("duplicate");
    expect(results[1]?.matches[0]).toMatchObject({
      kind: "csv-row",
      rowNumber: 1,
      sharedFields: ["grade", "parentEmail"],
    });
  });

  it("marks same name and different DOB as new", () => {
    const results = matchStudents({ rows: [row(1), row(2, { dateOfBirth: "2020-09-02" })], existingStudents: [] });
    expect(results[1]?.status).toBe("new");
  });

  it("marks same name with a missing DOB on either row as possible duplicate", () => {
    const missingSecond = matchStudents({ rows: [row(1), row(2, { dateOfBirth: "" })], existingStudents: [] });
    expect(missingSecond[1]?.status).toBe("possible-duplicate");
    const missingFirst = matchStudents({ rows: [row(1, { dateOfBirth: "" }), row(2)], existingStudents: [] });
    expect(missingFirst[0]?.status).toBe("new");
    expect(missingFirst[1]?.status).toBe("possible-duplicate");
  });

  it("normalizes whitespace, case, diacritics, hyphens and apostrophes across rows", () => {
    const results = matchStudents({
      rows: [
        row(1, { firstName: "Zoë", lastName: "O'Neil-Smith" }),
        row(2, { firstName: " ZOE ", lastName: "o’neil smith" }),
      ],
      existingStudents: [],
    });
    expect(results[1]?.status).toBe("duplicate");
  });

  it("takes the strongest status when several matches apply", () => {
    // Row 2 is "new" against the existing student (different DOB) but a
    // possible duplicate of row 1 (missing DOB there).
    const results = matchStudents({
      rows: [row(1, { dateOfBirth: "" }), row(2, { dateOfBirth: "2020-09-02" })],
      existingStudents: [student()],
    });
    expect(results[1]?.status).toBe("possible-duplicate");
  });
});

describe("re-importing the same file", () => {
  it("flags every DOB-bearing row as duplicate and every DOB-less same-name row for a decision", () => {
    const first = [
      row(1),
      row(2, { firstName: "Yusuf", dateOfBirth: "2022-01-05" }),
      row(3, { firstName: "Layla", dateOfBirth: "" }),
    ];
    const existing: ExistingStudent[] = first.map((r) => ({
      id: `stu-${r.rowNumber}`,
      firstName: r.firstName,
      lastName: r.lastName,
      dateOfBirth: r.dateOfBirth || null,
    }));
    const results = matchStudents({ rows: first, existingStudents: existing });
    expect(results.map((r) => r.status)).toEqual(["duplicate", "duplicate", "possible-duplicate"]);
    expect(summarizeMatches(results)).toEqual({ new: 0, duplicate: 2, possibleDuplicate: 1 });
  });
});
