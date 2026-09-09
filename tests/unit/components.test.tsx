import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProgramFinder } from "@/components/finder/ProgramFinder";
import { FaqList } from "@/components/ui/FaqList";
import { CurriculumTabs } from "@/components/curriculum/CurriculumTabs";
import { CONFIRMATION_MESSAGE } from "@/lib/finder";

const offerings = [
  { programId: "p1", slug: "early-learners", name: "Early Learners", ageRange: "2–3", ageMinMonths: 24, ageMaxMonths: 35, dobCutoffOverride: null },
  { programId: "p2", slug: "preschool", name: "Preschool", ageRange: "3–4", ageMinMonths: 36, ageMaxMonths: 47, dobCutoffOverride: null },
];

describe("ProgramFinder", () => {
  it("directs families to admissions when no cutoff is approved", async () => {
    const user = userEvent.setup();
    render(
      <ProgramFinder
        years={[{ id: "ay", label: "2026–27", eligibilityCutoffDate: null, offerings }]}
        elementaryActive={false}
        elementaryGrades={[]}
      />,
    );
    await user.type(screen.getByLabelText("Child's date of birth"), "2023-06-10");
    expect(screen.getByText(CONFIRMATION_MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact Admissions" })).toHaveAttribute("href", "/admissions");
  });

  it("recommends a program when a cutoff exists", async () => {
    const user = userEvent.setup();
    render(
      <ProgramFinder
        years={[{ id: "ay", label: "2026–27", eligibilityCutoffDate: "2026-09-01", offerings }]}
        elementaryActive={false}
        elementaryGrades={[]}
      />,
    );
    await user.type(screen.getByLabelText("Child's date of birth"), "2023-06-10");
    expect(screen.getByText("Preschool (3–4)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Learn about Preschool" })).toHaveAttribute("href", "/programs/preschool");
  });
});

describe("FaqList", () => {
  it("toggles answers with keyboard-operable buttons", async () => {
    const user = userEvent.setup();
    render(
      <FaqList
        items={[
          { id: "a", scope: "admissions", question: "Is there a waitlist?", answer: "Waitlist availability is published per program." },
        ]}
      />,
    );
    const button = screen.getByRole("button", { name: /Is there a waitlist/ });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    button.focus();
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region")).toHaveTextContent("Waitlist availability");
  });
});

describe("CurriculumTabs", () => {
  const domain = (id: string, group: "academic" | "islamic", shortName: string) => ({
    domain: { id, name: shortName, shortName, group, blurb: "", imageKey: "curriculumStem" },
    columns: [{ programName: "Preschool", ageLabel: "Ages 3–4", imageKey: "preschoolHero", stageName: "Foundations", outcomes: ["A", "B"] }],
  });

  it("moves selection with arrow keys across both groups", async () => {
    const user = userEvent.setup();
    render(
      <CurriculumTabs
        academic={[domain("d-lit", "academic", "English & Literacy"), domain("d-math", "academic", "Mathematics")]}
        islamic={[domain("d-quran", "islamic", "Qur'an")]}
      />,
    );
    const first = screen.getByRole("tab", { name: "English & Literacy" });
    expect(first).toHaveAttribute("aria-selected", "true");
    first.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Mathematics" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Qur'an" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Qur'an" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(first).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Qur'an" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Qur'an");
  });
});
