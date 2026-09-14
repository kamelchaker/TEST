import type { SiteSettings } from "./types";

export const siteSettings: SiteSettings = {
  name: "Midad Academy",
  shortName: "Midad",
  parentOrganization: { name: "Al-Baseerah Academy", url: null },
  tagline: "Nurturing hearts, building bright futures",
  descriptor: "Early Childhood & Elementary Education",
  strapline: "Early Childhood & Elementary · Nurturing hearts",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
  currentAcademicYearId: "ay-2026",
  defaultCampusId: "campus-main",
  // Elementary Grades 1–5 are not offered yet. Flip this only once the school
  // opens elementary enrollment; nothing else in the site needs to change.
  elementaryActive: false,
  elementaryGrades: [],
  navigation: [
    { label: "Programs", href: "/programs", match: "/programs" },
    { label: "Curriculum", href: "/curriculum", match: "/curriculum" },
    { label: "Our Approach", href: "/our-approach", match: "/our-approach" },
    { label: "Admissions", href: "/admissions", match: "/admissions" },
    { label: "Families", href: "/families", match: "/families" },
    { label: "About", href: "/about", match: "/about" },
  ],
  footer: [
    {
      title: "Programs",
      items: [
        { label: "Early Learners", href: "/programs/early-learners" },
        { label: "Preschool", href: "/programs/preschool" },
        { label: "Pre-Kindergarten", href: "/programs/pre-kindergarten" },
        { label: "Kindergarten", href: "/programs/kindergarten" },
        { label: "Extended Learning", href: "/programs/extended-learning" },
      ],
    },
    {
      title: "Admissions",
      items: [
        { label: "Admissions", href: "/admissions" },
        { label: "How to Apply", href: "/admissions/how-to-apply" },
        { label: "Tuition & Fees", href: "/admissions/tuition" },
        { label: "Admissions FAQ", href: "/admissions/faq" },
      ],
    },
    {
      title: "Learning",
      items: [
        { label: "Curriculum", href: "/curriculum" },
        { label: "Our Approach", href: "/our-approach" },
        { label: "Families", href: "/families" },
      ],
    },
    {
      title: "Visit",
      items: [
        { label: "Schedule a Tour", href: "/schedule-a-tour" },
        { label: "Request Information", href: "/request-information" },
        { label: "Contact", href: "/contact" },
        { label: "About", href: "/about" },
      ],
    },
  ],
  consentStatement:
    "I agree that Midad Academy may contact me about my enquiry.",
};
