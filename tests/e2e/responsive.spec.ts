import { test } from "@playwright/test";
import { VIEWPORTS, expectNoHorizontalOverflow } from "./helpers";

const PAGES = ["/", "/programs", "/programs/kindergarten", "/curriculum", "/admissions", "/schedule-a-tour", "/request-information", "/contact"];

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });
    for (const route of PAGES) {
      test(`${route} has no horizontal overflow`, async ({ page }) => {
        await page.goto(route);
        await expectNoHorizontalOverflow(page);
        if (viewport.width < 1024) {
          await page.getByRole("button", { name: "Open menu" }).click();
          await expectNoHorizontalOverflow(page);
        }
      });
    }
  });
}
