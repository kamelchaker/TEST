import { expect, test } from "@playwright/test";
import { expectAccessible } from "./helpers";

test.describe("mobile drawer", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("traps focus, makes the page inert, closes on Escape and restores focus", async ({ page }) => {
    await page.goto("/");
    const burger = page.getByRole("button", { name: "Open menu" });
    await burger.click();

    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(page.locator("#site-shell")).toHaveAttribute("inert", "");
    await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
    await expectAccessible(page);

    // Tab wraps within the dialog.
    const focusable = dialog.locator("a[href], button");
    const count = await focusable.count();
    for (let i = 0; i < count; i += 1) await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("link", { name: "Schedule a Tour" })).toBeFocused();

    await expect(dialog.getByRole("link", { name: "Programs" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(page.locator("#site-shell")).not.toHaveAttribute("inert", "");
    await expect(burger).toBeFocused();
    await expect(burger).toHaveAttribute("aria-expanded", "false");
  });

  test("marks the current section and navigates", async ({ page }) => {
    await page.goto("/admissions/faq");
    await page.getByRole("button", { name: "Open menu" }).click();
    const current = page.getByRole("dialog").getByRole("link", { name: "Admissions" });
    await expect(current).toHaveAttribute("aria-current", "page");
    await page.getByRole("dialog").getByRole("link", { name: "Curriculum" }).click();
    await expect(page).toHaveURL(/\/curriculum$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("sticky call to action hides on the form pages", async ({ page }) => {
    await page.goto("/programs");
    await expect(page.locator(".sticky-cta")).toBeVisible();
    await page.goto("/schedule-a-tour");
    await expect(page.locator(".sticky-cta")).toHaveCount(0);
  });
});

test("desktop navigation marks the current section", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/programs/preschool");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link", { name: "Programs" })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current", "page");
});

test("curriculum tabs are keyboard operable", async ({ page }) => {
  await page.goto("/curriculum");
  const first = page.getByRole("tab", { name: "English & Literacy" });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Mathematics" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab", { name: "Mathematics" })).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Akhlaq" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Islamic Character & Akhlaq across the years");
  await expectAccessible(page);
});

test("program FAQ disclosures toggle with the keyboard", async ({ page }) => {
  await page.goto("/programs/early-learners");
  const button = page.getByRole("button", { name: /Is toilet training required/ });
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.focus();
  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Toilet training is not required in Early Learners.")).toBeVisible();
});
