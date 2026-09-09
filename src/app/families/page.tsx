import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialPageTemplate } from "@/components/templates/EditorialPageTemplate";
import { getEditorialPage, getFaqs } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

const SLUG = "families";

export function generateMetadata(): Metadata {
  const page = getEditorialPage(SLUG);
  if (!page) return {};
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: `/${SLUG}` });
}

export default function Page() {
  const page = getEditorialPage(SLUG);
  if (!page) notFound();
  return <EditorialPageTemplate page={page} faqs={getFaqs(page.faqIds)} />;
}
