import { expect, test } from "@playwright/test";
import { ROUTES, expectAccessible } from "./helpers";

for (const route of ROUTES) {
  test(`${route} renders with correct landmarks and passes axe`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    await expect(page).not.toHaveTitle(/Bundled Page/);
    await expect(page).toHaveTitle(/Al-Baseerah Academy/);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);

    const skip = page.locator("a.skip-link");
    await expect(skip).toHaveAttribute("href", "#main");
    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", new RegExp(`${route === "/" ? "/?$" : route.replace(/\//g, "\\/")}`));
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);

    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/\b(TBD|placeholder|pending|mock|configuration)\b/i);

    await expectAccessible(page);
  });
}

test("elementary grades are not exposed while inactive", async ({ page }) => {
  const response = await page.goto("/programs/grade-1");
  expect(response?.status()).toBe(404);
  await page.goto("/programs");
  await expect(page.locator("body")).not.toContainText(/Grade 1/);
  const sitemap = await page.request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("grade-1");
});

test("sitemap and robots are served", async ({ page }) => {
  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const route of ROUTES) expect(xml).toContain(route === "/" ? "<loc>http" : route);
  const robots = await page.request.get("/robots.txt");
  expect(await robots.text()).toContain("sitemap.xml");
});

test("structured data is present for the school and program pages", async ({ page }) => {
  await page.goto("/programs/kindergarten");
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = scripts.map((s) => JSON.parse(s)["@type"]);
  expect(types.flat()).toEqual(expect.arrayContaining(["Preschool", "BreadcrumbList", "EducationalOccupationalProgram", "FAQPage"]));
});

test("interactive targets meet 44x44 on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/programs/preschool");
  const small = await page.evaluate(() => {
    const out: string[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("a, button, input, select, textarea"))) {
      if (el.closest(".skip-link, [aria-hidden='true']") || el.offsetParent === null) continue;
      const r = el.getBoundingClientRect();
      if (r.height < 44 || r.width < 44) {
        // Inline text links inside paragraphs are exempt from the target-size rule.
        if (el.tagName === "A" && el.closest("p, li, dd, figcaption, td")) continue;
        out.push(`${el.tagName}.${el.className} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
    }
    return out;
  });
  expect(small, small.join("\n")).toEqual([]);
});
