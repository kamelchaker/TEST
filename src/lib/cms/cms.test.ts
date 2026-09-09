import { describe, expect, it } from "vitest";
import { programs } from "@/content/programs";
import { curriculumDomains } from "@/content/curriculum";
import {
  getCorePrograms,
  getDomainProgression,
  getFinderOfferings,
  getProgramBySlug,
  getProgramFacts,
  getStagesForProgram,
  getTuition,
  getVisiblePrograms,
} from "./index";
import { isProgramVisible } from "./visibility";
import { evaluateProgramFinder } from "@/lib/finder";
import { getAcademicYear } from "./index";

const FORBIDDEN = /\b(TBD|placeholder|pending|mock|configuration|lorem)\b/i;

describe("program visibility", () => {
  it("hides elementary programs while elementaryActive is false", () => {
    expect(getVisiblePrograms().some((p) => p.kind === "elementary")).toBe(false);
    expect(getProgramBySlug("grade-1")).toBeNull();
    const grade = programs.find((p) => p.kind === "elementary")!;
    expect(isProgramVisible(grade, { elementaryActive: false })).toBe(false);
    expect(isProgramVisible(grade, { elementaryActive: true })).toBe(true);
  });

  it("lists the five current programs in order", () => {
    expect(getVisiblePrograms().map((p) => p.slug)).toEqual([
      "early-learners",
      "preschool",
      "pre-kindergarten",
      "kindergarten",
      "extended-learning",
    ]);
    expect(getCorePrograms().map((p) => p.stageIndex)).toEqual([0, 1, 2, 3]);
  });

  it("excludes Extended Learning and elementary from finder offerings", () => {
    const slugs = getFinderOfferings("ay-2026").map((o) => o.slug);
    expect(slugs).toEqual(["early-learners", "preschool", "pre-kindergarten", "kindergarten"]);
  });
});

describe("curriculum", () => {
  it("defines the twelve approved domains", () => {
    expect(curriculumDomains.filter((d) => d.group === "academic").map((d) => d.shortName)).toEqual([
      "English & Literacy",
      "Mathematics",
      "Science & Discovery",
      "STEM & Problem Solving",
      "Social-Emotional",
      "Physical Development",
      "Creative Arts",
    ]);
    expect(curriculumDomains.filter((d) => d.group === "islamic").map((d) => d.name)).toEqual([
      "Qur'an Studies",
      "Arabic Language",
      "Islamic Studies",
      "Du‘a & Daily Islamic Practice",
      "Islamic Character & Akhlaq",
    ]);
  });

  it("resolves a stage for every domain and core program", () => {
    for (const program of getCorePrograms()) {
      expect(getStagesForProgram(program, "academic")).toHaveLength(7);
      expect(getStagesForProgram(program, "islamic")).toHaveLength(5);
    }
    for (const domain of curriculumDomains) {
      expect(getDomainProgression(domain.id)).toHaveLength(4);
    }
  });
});

describe("graceful omission", () => {
  it("omits unapproved program facts rather than showing placeholders", () => {
    const program = getProgramBySlug("preschool")!;
    const facts = getProgramFacts(program, {
      id: "x",
      programId: program.id,
      academicYearId: "ay-2026",
      campusId: "campus-main",
      status: "waitlist",
      dobCutoffOverride: null,
      applicationUrl: null,
      days: null,
      hours: null,
      classSize: null,
    });
    expect(facts.map((f) => f.label)).toEqual(["Ages", "Extended Learning", "Next step", "Enrollment"]);
    expect(facts.find((f) => f.label === "Next step")?.value).toBe("Pre-Kindergarten (4–5)");
  });

  it("withholds tuition until approved", () => {
    expect(getTuition("ay-2026")?.approved).toBe(false);
    expect(getTuition("missing-year")).toBeNull();
  });

  it("contains no internal or placeholder language in content", () => {
    for (const program of getVisiblePrograms()) {
      expect(JSON.stringify(program)).not.toMatch(FORBIDDEN);
    }
  });
});

describe("2026–27 placement table", () => {
  const year = getAcademicYear("ay-2026")!;
  const place = (dateOfBirth: string) =>
    evaluateProgramFinder({
      dateOfBirth,
      today: { year: 2026, month: 3, day: 1 },
      academicYear: year,
      offerings: getFinderOfferings(year.id),
      elementaryActive: false,
      elementaryGrades: [],
    });

  it("uses the approved 1 September 2026 cutoff", () => {
    expect(year.eligibilityCutoffDate).toBe("2026-09-01");
    expect(place("2023-01-15").cutoffLine).toBe("Age on 1 Sep 2026");
  });

  it.each([
    ["2024-09-01", "prog-early-learners"],
    ["2023-09-02", "prog-early-learners"],
    ["2023-09-01", "prog-preschool"],
    ["2022-09-02", "prog-preschool"],
    ["2022-09-01", "prog-pre-kindergarten"],
    ["2021-09-02", "prog-pre-kindergarten"],
    ["2021-09-01", "prog-kindergarten"],
    ["2020-09-02", "prog-kindergarten"],
  ])("places a child born %s in %s", (dob, programId) => {
    const result = place(dob);
    expect(result.kind).toBe("match");
    expect(result.matchedProgramId).toBe(programId);
  });

  it("marks children born after 1 September 2024 as not yet eligible", () => {
    expect(place("2024-09-02").kind).toBe("below-minimum");
  });

  it("directs children born on or before 1 September 2020 to admissions", () => {
    expect(place("2020-09-01").kind).toBe("beyond");
  });

  it("still defers to admissions for 2027–28, which has no approved cutoff", () => {
    const next = getAcademicYear("ay-2027")!;
    expect(next.eligibilityCutoffDate).toBeNull();
    const result = evaluateProgramFinder({
      dateOfBirth: "2023-01-15",
      today: { year: 2026, month: 3, day: 1 },
      academicYear: next,
      offerings: getFinderOfferings(next.id),
      elementaryActive: false,
      elementaryGrades: [],
    });
    expect(result.kind).toBe("no-cutoff");
  });
});
