import type { MetadataRoute } from "next";
import { getVisiblePrograms } from "@/lib/cms";
import { absoluteUrl } from "@/lib/seo";

const STATIC_ROUTES = [
  "/",
  "/programs",
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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const programRoutes = getVisiblePrograms().map((p) => `/programs/${p.slug}`);
  return [...STATIC_ROUTES, ...programRoutes].map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/programs") ? 0.8 : 0.6,
  }));
}
