import { expect, test } from "@playwright/test";

test("program finder asks admissions to confirm when no cutoff is approved", async ({ page }) => {
  await page.goto("/");
  const result = page.locator("[data-finder-result]");
  await expect(result).toHaveAttribute("data-finder-result", "empty");
  await expect(result).toContainText("Enter a date of birth");

  await page.getByLabel("Child's date of birth").fill("2023-06-10");
  await expect(result).toHaveAttribute("data-finder-result", "no-cutoff");
  await expect(result).toContainText("Our admissions team will confirm the right program for your child");
  await expect(result).toContainText("Eligibility is confirmed by our admissions team");
  await expect(result.getByRole("link", { name: "Contact Admissions" })).toHaveAttribute("href", "/admissions");
  await expect(result).not.toContainText(/Sep(tember)? 1/);

  await page.getByLabel("Academic year").selectOption("ay-2027");
  await expect(result).toHaveAttribute("data-finder-result", "no-cutoff");
});
