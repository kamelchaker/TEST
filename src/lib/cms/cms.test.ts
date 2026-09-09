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
