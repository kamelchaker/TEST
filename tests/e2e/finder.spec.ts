import { expect, test } from "@playwright/test";

test("program finder places a child for 2026–27 and defers to admissions for 2027–28", async ({ page }) => {
  await page.goto("/");
  const result = page.locator("[data-finder-result]");
  await expect(result).toHaveAttribute("data-finder-result", "empty");
  await expect(result).toContainText("Age on 1 Sep 2026");
  await expect(result).toContainText("Enter a date of birth");

  // Born 2 September 2022: three years old on 1 September 2026 → Preschool.
  await page.getByLabel("Child's date of birth").fill("2022-09-02");
  await expect(result).toHaveAttribute("data-finder-result", "match");
  await expect(result).toContainText("3 years");
  await expect(result).toContainText("Preschool (3–4)");
  await expect(result.getByRole("link", { name: "Learn about Preschool" })).toHaveAttribute("href", "/programs/preschool");

  // One day earlier the child is four → Pre-Kindergarten.
  await page.getByLabel("Child's date of birth").fill("2022-09-01");
  await expect(result).toContainText("Pre-Kindergarten (4–5)");

  // Kindergarten band: born 2 Sept 2020 – 1 Sept 2021.
  await page.getByLabel("Child's date of birth").fill("2020-09-02");
  await expect(result).toContainText("Kindergarten (5–6)");

  // 2027–28 has no approved cutoff yet, so nothing is calculated.
  await page.getByLabel("Academic year").selectOption("ay-2027");
  await expect(result).toHaveAttribute("data-finder-result", "no-cutoff");
  await expect(result).toContainText("Our admissions team will confirm the right program for your child");
  await expect(result.getByRole("link", { name: "Contact Admissions" })).toHaveAttribute("href", "/admissions");
});
