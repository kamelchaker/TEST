import type { IconName } from "./types";

export interface HomeHighlight {
  label: string;
  icon: IconName;
}

export const homeHighlights: HomeHighlight[] = [
  { label: "Academic Foundation", icon: "book" },
  { label: "Qur'an Studies", icon: "recitation" },
  { label: "Arabic Language", icon: "chat" },
  { label: "Islamic Studies", icon: "school" },
  { label: "Social-Emotional Growth", icon: "heart" },
  { label: "Creative Exploration", icon: "spark" },
  { label: "Islamic Character & Akhlaq", icon: "person" },
  { label: "Du‘a & Daily Practice", icon: "hands" },
  { label: "A Nurturing Environment", icon: "shield" },
];

export interface PathwayStep {
  name: string;
  ages: string;
  gain: string;
  /** Steps that describe a program offered today are marked as current. */
  current: boolean;
}

export const pathway: PathwayStep[] = [
  {
    name: "Early Learners",
    ages: "Ages 2–3",
    gain: "First routines, first words, first friendships. Listening to Qur’an daily and learning to be part of a group.",
    current: true,
  },
  {
    name: "Preschool",
    ages: "Ages 3–4",
    gain: "Letter sounds and counting take hold. Children recognise familiar passages and join in Arabic vocabulary and daily du‘a.",
    current: true,
  },
  {
    name: "Pre-Kindergarten",
    ages: "Ages 4–5",
    gain: "Writing, blending and number sense to twenty. Structured Qur’an and Arabic in small groups; independence a classroom can rely on.",
    current: true,
  },
  {
    name: "Kindergarten",
    ages: "Ages 5–6",
    gain: "Reading, writing and mathematical reasoning. Purposeful memorization, Arabic reading, and character carried into how the day is lived.",
    current: true,
  },
  {
    name: "Beyond Kindergarten",
    ages: "Looking ahead",
    gain: "Midad is built to grow with its children. Families planning past Kindergarten are welcome to talk with our admissions team.",
    current: false,
  },
];

export const extendedLearningCards = [
  {
    title: "Before School",
    body: "Early drop-off with breakfast, quiet reading and morning du‘a before the school day begins.",
    soft: false,
  },
  {
    title: "After School",
    body: "Snack, outdoor time, then enrichment blocks — Qur'an and literacy practice, STEM and creative arts.",
    soft: true,
  },
  {
    title: "Summer Explorers",
    body: "A lighter summer programme built on the same domains: reading, building, making and outdoor time.",
    soft: false,
  },
];
