import { getCampus, getSiteSettings } from "@/lib/cms";
import { absoluteUrl } from "@/lib/seo";
import type { Faq, Program } from "@/content/types";

/**
 * schema.org records for a school. Only approved facts are included; address
 * and contact details appear once the campus record carries them.
 */
export function organizationJsonLd(): Record<string, unknown> {
  const settings = getSiteSettings();
  const campus = getCampus();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Preschool", "School"],
    "@id": absoluteUrl("/#organization"),
    name: settings.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/logofull.png"),
    slogan: settings.tagline,
  };
  if (campus?.addressLines.length) {
    data.address = { "@type": "PostalAddress", streetAddress: campus.addressLines.join(", ") };
  }
  if (campus?.phone) data.telephone = campus.phone;
  if (campus?.email) data.email = campus.email;
  return data;
}

export function websiteJsonLd(): Record<string, unknown> {
  const settings = getSiteSettings();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.name,
    url: absoluteUrl("/"),
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function programJsonLd(program: Program): Record<string, unknown> {
  const settings = getSiteSettings();
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: program.name,
    description: program.value,
    url: absoluteUrl(`/programs/${program.slug}`),
    provider: { "@id": absoluteUrl("/#organization"), "@type": "School", name: settings.name },
    educationalProgramMode: "onsite",
  };
}
