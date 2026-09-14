import { expect, test } from "@playwright/test";
import { expectAccessible } from "./helpers";

test.describe("Schedule a Tour", () => {
  test("shows accessible errors, then succeeds", async ({ page }) => {
    await page.goto("/schedule-a-tour");
    await page.getByRole("button", { name: "Schedule a Tour" }).click();

    const alert = page.locator(".form-summary[role=\"alert\"]");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("Please check these fields");
    await expect(alert).toBeFocused();
    await expect(alert.getByRole("link", { name: "Please enter your full name" })).toHaveAttribute("href", "#t-name");

    const name = page.getByLabel(/Parent or guardian name/);
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription("Please enter your full name");
    await expectAccessible(page);

    await name.fill("Amina Rahman");
    await page.getByLabel(/^Email/).fill("amina@example.com");
    await page.getByLabel(/^Phone/).fill("+1 555 010 2030");
    await page.getByLabel(/Child's date of birth/).fill("2023-06-10");
    await page.getByLabel(/Program of interest/).selectOption("preschool");
    await page.getByLabel(/Preferred date and time/).fill("2030-04-02T10:00");
    await page.getByLabel(/I agree that Midad Academy may contact me/).check();

    // The anti-spam token requires a few seconds between render and submit.
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Schedule a Tour" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("Thank you");
    await expect(status).toContainText("Your tour request has been received");
    await expectAccessible(page);

    await status.getByRole("button", { name: "Submit another" }).click();
    await expect(page.getByLabel(/Parent or guardian name/)).toHaveValue("");
  });

  test("rejects a submission that arrives too quickly", async ({ page }) => {
    await page.goto("/schedule-a-tour");
    await page.getByLabel(/Parent or guardian name/).fill("Amina Rahman");
    await page.getByLabel(/^Email/).fill("amina@example.com");
    await page.getByLabel(/^Phone/).fill("+1 555 010 2030");
    await page.getByLabel(/Child's date of birth/).fill("2023-06-10");
    await page.getByLabel(/Program of interest/).selectOption("not-sure");
    await page.getByLabel(/Preferred date and time/).fill("2030-04-02T10:00");
    await page.getByLabel(/I agree that Midad Academy may contact me/).check();
    await page.getByRole("button", { name: "Schedule a Tour" }).click();
    await expect(page.locator(".form-summary[role=\"alert\"]")).toContainText("We could not send your request just now");
  });
});

test.describe("Request Information", () => {
  test("requires name, email and consent, then succeeds", async ({ page }) => {
    await page.goto("/request-information");
    await page.getByRole("button", { name: "Request Information" }).click();
    const alert = page.locator(".form-summary[role=\"alert\"]");
    await expect(alert).toContainText("Please enter your full name");
    await expect(alert).toContainText("Please enter a valid email address");
    await expect(alert).toContainText("Please confirm we may contact you");

    await page.getByLabel(/Parent or guardian name/).fill("Amina Rahman");
    await page.getByLabel(/^Email/).fill("amina@example.com");
    await page.getByLabel(/I agree that Midad Academy may contact me/).check();
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Request Information" }).click();
    await expect(page.getByRole("status")).toContainText("Your request has been received");
  });

  test("keeps the honeypot hidden from people", async ({ page }) => {
    await page.goto("/request-information");
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).not.toBeInViewport();
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
  });
});
