import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms";

interface PageMeta {
  title: string;
  description: string;
  /** Route path beginning with "/", used for the canonical URL. */
  path: string;
  /** Use the site name alone as the title (home page). */
  bareTitle?: boolean;
}

export function siteUrl(): URL {
  return new URL(getSiteSettings().siteUrl);
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl()).toString();
}

/** Route-specific metadata with canonical, Open Graph and Twitter basics. */
export function buildMetadata({ title, description, path, bareTitle }: PageMeta): Metadata {
  const settings = getSiteSettings();
  const fullTitle = bareTitle ? title : `${title} | ${settings.name}`;
  const url = absoluteUrl(path);
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: settings.name,
      title: fullTitle,
      description,
      url,
      locale: "en_US",
      images: [{ url: absoluteUrl("/images/logofull.png"), width: 600, height: 691, alt: settings.name }],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
