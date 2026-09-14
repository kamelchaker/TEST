import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  matchStudents,
  summarizeMatches,
  type ExistingStudent,
  type ImportRow,
} from "@/lib/student-duplicate-match";

/** The disposable DEV fixture used for manual browser validation. */
const FIXTURE = path.resolve(__dirname, "../fixtures/student-import-dev.csv");

function loadFixture(): ImportRow[] {
  const [header, ...lines] = readFileSync(FIXTURE, "utf8").trim().split("\n");
  const columns = header!.split(",");
  return lines.map((line, i) => {
    const cells = line.split(",");
    const raw = Object.fromEntries(columns.map((c, j) => [c, cells[j] ?? ""]));
    return {
      rowNumber: i + 1,
      firstName: raw.first_name ?? "",
      lastName: raw.last_name ?? "",
      dateOfBirth: raw.date_of_birth ?? "",
      grade: raw.grade,
      className: raw.class,
      parentEmail: raw.parent_email,
      raw,
    };
  });
}

describe("DEV import fixture", () => {
  const rows = loadFixture();

  it("first import into an empty school: 6 new, 2 duplicate, 1 possible duplicate", () => {
    const results = matchStudents({ rows, existingStudents: [] });
    expect(results.map((r) => [r.rowNumber, r.status])).toEqual([
      [1, "new"],
      [2, "new"],
      [3, "duplicate"],
      [4, "new"],
      [5, "duplicate"],
      [6, "new"],
      [7, "possible-duplicate"],
      [8, "new"],
      [9, "new"],
    ]);
    expect(summarizeMatches(results)).toEqual({ new: 6, duplicate: 2, possibleDuplicate: 1 });
    // Row 9 carries a malformed DOB; the dialog's validation marks it invalid.
    expect(results[8]?.dob).toEqual({ kind: "malformed", raw: "14/06/2022" });
  });

  it("re-importing the same file after the first import: 7 duplicate, 1 possible duplicate, 1 new (invalid)", () => {
    // Rows imported the first time: the five new valid rows plus row 7,
    // assuming the admin chose "Import" for that possible duplicate.
    const imported = [1, 2, 4, 6, 7, 8];
    const existing: ExistingStudent[] = rows
      .filter((r) => imported.includes(r.rowNumber))
      .map((r) => ({
        id: `stu-${r.rowNumber}`,
        firstName: r.firstName,
        lastName: r.lastName,
        dateOfBirth: r.dateOfBirth || null,
        grade: r.grade,
        className: r.className,
        parentEmail: r.parentEmail,
      }));
    const results = matchStudents({ rows, existingStudents: existing });
    expect(results.map((r) => [r.rowNumber, r.status])).toEqual([
      [1, "duplicate"],
      [2, "duplicate"],
      [3, "duplicate"],
      [4, "duplicate"],
      [5, "duplicate"],
      [6, "possible-duplicate"],
      [7, "duplicate"],
      [8, "duplicate"],
      [9, "new"],
    ]);
    expect(summarizeMatches(results)).toEqual({ new: 1, duplicate: 7, possibleDuplicate: 1 });
  });
});
