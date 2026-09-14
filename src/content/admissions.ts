import type { AdmissionsContent } from "./types";

export const admissionsContent: AdmissionsContent = {
  journey: [
    { label: "Discover", body: "Read the curriculum and program pages", current: false },
    { label: "Explore programs", body: "Find the right fit by date of birth", current: false },
    { label: "Schedule a tour", body: "Visit Midad and learn more about the program from our team", current: true },
    { label: "Apply", body: "Submit the application for your program", current: false },
    { label: "Enroll", body: "Confirm placement and complete enrollment", current: false },
  ],
  applySteps: [
    { title: "Schedule a tour", body: "Visit Midad, explore the learning environment, and learn more about the program from our team." },
    { title: "Submit the application", body: "Child's details, program of interest and preferred start. Application fee, where applicable." },
    { title: "Placement & offer", body: "We confirm eligibility against the cutoff for the academic year and offer a place, or a position on the waitlist." },
    { title: "Enroll", body: "Enrollment agreement, health and emergency forms, and any extended learning add-ons. Handled privately after the offer, never on this site." },
  ],
  neededAtApplication: [
    "Child's full name and date of birth",
    "parent or guardian contact details",
    "program of interest",
    "preferred start date",
  ],
  afterOfferNote:
    "Medical, immunisation and identity records are collected after an offer, through the secure family system — never on this site.",
  faqIds: [
    "adm-placement",
    "adm-tour",
    "adm-open",
    "adm-waitlist",
    "adm-tuition",
    "adm-arabic",
    "adm-toilet",
    "adm-extended",
  ],
};
