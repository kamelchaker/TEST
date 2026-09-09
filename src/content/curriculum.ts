import type { CurriculumDomain, CurriculumStage } from "./types";

export const curriculumDomains: CurriculumDomain[] = [
  {
    id: "d-lit",
    name: "English Language & Literacy",
    shortName: "English & Literacy",
    group: "academic",
    imageKey: "curriculumLiteracy",
    blurb:
      "We build strong communication skills through meaningful experiences with language, stories, and early reading and writing.",
  },
  {
    id: "d-math",
    name: "Mathematics",
    shortName: "Mathematics",
    group: "academic",
    imageKey: "curriculumMath",
    blurb:
      "Number sense grows out of handling real materials, then becomes counting, patterns, and reasoning children can explain.",
  },
  {
    id: "d-sci",
    name: "Science & Discovery",
    shortName: "Science & Discovery",
    group: "academic",
    imageKey: "curriculumScience",
    blurb:
      "Children notice, wonder, and test — from sensory play to recording what an experiment actually showed.",
  },
  {
    id: "d-stem",
    name: "STEM & Problem Solving",
    shortName: "STEM & Problem Solving",
    group: "academic",
    imageKey: "curriculumStem",
    blurb:
      "Building and engineering challenges give children a reason to plan, try, fail, and try a better way.",
  },
  {
    id: "d-se",
    name: "Social-Emotional Learning",
    shortName: "Social-Emotional",
    group: "academic",
    imageKey: "curriculumSocial",
    blurb:
      "Trust first, then turn-taking, then the self-regulation and independence a classroom asks for.",
  },
  {
    id: "d-phys",
    name: "Physical Development",
    shortName: "Physical Development",
    group: "academic",
    imageKey: "curriculumPhysical",
    blurb:
      "Fine and gross motor development through daily movement, outdoor time, and healthy routines.",
  },
  {
    id: "d-arts",
    name: "Creative Arts",
    shortName: "Creative Arts",
    group: "academic",
    imageKey: "curriculumArts",
    blurb:
      "Art, music, movement, and dramatic play — open-ended at first, purposeful by Kindergarten.",
  },
  {
    id: "d-quran",
    name: "Qur'an Studies",
    shortName: "Qur'an",
    group: "islamic",
    imageKey: "curriculumQuran",
    blurb:
      "Age-appropriate Qur'an exposure that grows from listening and repetition into guided memorization and recitation, at the pace each child is ready for.",
  },
  {
    id: "d-arabic",
    name: "Arabic Language",
    shortName: "Arabic",
    group: "islamic",
    imageKey: "curriculumArabic",
    blurb:
      "Arabic as a living language — listening and speaking first, then letters, phonics, reading and writing.",
  },
  {
    id: "d-islamic",
    name: "Islamic Studies",
    shortName: "Islamic Studies",
    group: "islamic",
    imageKey: "curriculumIslamic",
    blurb:
      "Foundational Islamic knowledge, values, stories and manners, taught at the level each age can hold.",
  },
  {
    id: "d-dua",
    name: "Du‘a & Daily Islamic Practice",
    shortName: "Du‘a & Daily Practice",
    group: "islamic",
    imageKey: "curriculumDua",
    blurb:
      "Everyday du‘as, Islamic greetings and practical habits woven into the ordinary school day.",
  },
  {
    id: "d-akhlaq",
    name: "Islamic Character & Akhlaq",
    shortName: "Akhlaq",
    group: "islamic",
    imageKey: "curriculumAkhlaq",
    blurb:
      "Kindness, honesty, respect, responsibility, gratitude and care for others, practiced daily.",
  },
];

const stage = (
  domainId: string,
  rows: [string, string][],
): CurriculumStage[] =>
  rows.map(([stageName, outcomes], stageIndex) => ({
    domainId,
    stageIndex,
    stageName,
    outcomes: outcomes.split(", "),
  }));

export const curriculumStages: CurriculumStage[] = [
  ...stage("d-lit", [
    ["Exposure", "Songs and naming, board books, listening to stories"],
    ["Foundations", "Letter sounds, story recall, shared reading"],
    ["Readiness", "Name writing, blending, early sentences"],
    ["Structured Learning", "Decoding, sentence writing, comprehension"],
  ]),
  ...stage("d-math", [
    ["Exploration", "Sorting, filling and emptying, matching"],
    ["Foundations", "Counting to ten, patterns, classification"],
    ["Readiness", "Number sense to twenty, measurement, shape"],
    ["Structured Learning", "Operations, geometry, mathematical reasoning"],
  ]),
  ...stage("d-sci", [
    ["Discovery", "Sensory materials, nature walks, noticing change"],
    ["Exploration", "Asking why, simple predictions, observation"],
    ["Investigation", "Testing ideas, recording results, comparing"],
    ["Applied Learning", "Experiments, drawing conclusions, explaining findings"],
  ]),
  ...stage("d-stem", [
    ["Exploration", "Stacking, cause and effect, simple tools"],
    ["Introduction", "Simple builds, using tools safely, working in pairs"],
    ["Guided Projects", "Multi-step challenges, planning a build, revising a design"],
    ["Projects", "Team projects, iteration, presenting a solution"],
  ]),
  ...stage("d-se", [
    ["Foundational", "Separation and comfort, trust in adults, parallel play"],
    ["Developing", "Turn-taking, naming feelings, joining a group"],
    ["School Readiness", "Conflict resolution, group work, following routines"],
    ["Independence", "Self-direction, responsibility, helping others"],
  ]),
  ...stage("d-phys", [
    ["Foundational", "Walking and climbing, grasping, balance"],
    ["Developing", "Running and jumping, scissors, drawing"],
    ["Developing", "Pencil grip, coordination, ball skills"],
    ["Continuing", "Sport games, endurance, fine-motor precision"],
  ]),
  ...stage("d-arts", [
    ["Exploration", "Texture, sound, movement"],
    ["Exploration", "Open-ended art, music, dramatic play"],
    ["Expression", "Storytelling, role play, purposeful making"],
    ["Application", "Planned art, performance, reflecting on work"],
  ]),
  ...stage("d-quran", [
    ["Listening & Exposure", "Hearing recitation daily, joyful repetition, calm listening routines"],
    ["Recognition & Participation", "Recognising familiar passages, joining group repetition, listening with attention"],
    ["Structured Learning & Readiness", "Guided memorization in small groups, clearer pronunciation, recitation with the teacher"],
    ["Understanding & Application", "Purposeful memorization and recitation, growing independence, gradual understanding of meaning"],
  ]),
  ...stage("d-arabic", [
    ["Listening & Vocabulary", "Listening to Arabic, familiar everyday words, songs and rhymes"],
    ["Speaking & Letter Sounds", "Simple spoken phrases, letter sounds, growing vocabulary"],
    ["Phonics, Reading & Writing", "Letter recognition, phonics and blending, early reading and writing"],
    ["Reading & Written Expression", "Reading simple text, writing words, conversation with growing independence"],
  ]),
  ...stage("d-islamic", [
    ["Stories & Routines", "Simple stories, familiar routines, gentle first concepts"],
    ["Recognition & Participation", "Recognising and retelling stories, joining discussion, manners in the classroom"],
    ["Structured Learning & Readiness", "Structured lessons, questions and discussion, understanding why we do what we do"],
    ["Understanding & Application", "Applying knowledge in daily school life, explaining it in their own words"],
  ]),
  ...stage("d-dua", [
    ["Daily Routines", "Du‘a together at snack and departure, Islamic greetings"],
    ["Guided Participation", "Joining in everyday du‘as, greeting and thanking others"],
    ["Independent Practice", "Saying daily du‘as independently, practical habits through the day"],
    ["Independent Daily Habit", "A settled daily habit, leading du‘a for the class"],
  ]),
  ...stage("d-akhlaq", [
    ["Foundational", "Gentle hands, kind words, greeting friends and teachers"],
    ["Developing", "Sharing, honesty, gratitude"],
    ["Practicing", "Respect, responsibility, resolving conflict kindly"],
    ["Applied", "Integrity, service to others, leadership among peers"],
  ]),
];
