import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export const ROUTES = [
  "/",
  "/programs",
  "/programs/early-learners",
  "/programs/preschool",
  "/programs/pre-kindergarten",
  "/programs/kindergarten",
  "/programs/extended-learning",
  "/curriculum",
  "/our-approach",
  "/families",
  "/about",
  "/admissions",
  "/admissions/how-to-apply",
  "/admissions/tuition",
  "/admissions/faq",
  "/schedule-a-tour",
  "/request-information",
  "/contact",
];

export const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 412, height: 915 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1536, height: 960 },
];

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const offenders: string[] = [];
    const limit = doc.clientWidth;
    for (const el of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) continue;
      const style = getComputedStyle(el);
      if (style.position === "fixed" && el.closest(".drawer")) continue;
      if (rect.right > limit + 1 && style.overflowX !== "auto" && style.overflowX !== "scroll" && !el.closest(".tabs, .tblwrap")) {
        offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} right=${Math.round(rect.right)}`);
      }
    }
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, bodyScroll: document.body.scrollWidth, offenders: offenders.slice(0, 5) };
  });
  expect(overflow.scrollWidth, `document overflow ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.clientWidth);
  expect(overflow.bodyScroll, `body overflow ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.clientWidth);
}

export async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`);
  expect(summary, summary.join("\n")).toEqual([]);
}
