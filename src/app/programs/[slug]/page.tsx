import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramPageTemplate } from "@/components/templates/ProgramPageTemplate";
import {
  getFaqs,
  getOffering,
  getProgramBySlug,
  getProgramFacts,
  getStagesForProgram,
  getVisiblePrograms,
} from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

interface Params {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getVisiblePrograms().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) return {};
  return buildMetadata({
    title: `${program.name} (${program.ageLabel})`,
    description: `${program.headline} ${program.value}`,
    path: `/programs/${program.slug}`,
  });
}

export default async function ProgramPage({ params }: Params) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  const offering = getOffering(program.id);
  return (
    <ProgramPageTemplate
      program={program}
      offering={offering}
      academic={getStagesForProgram(program, "academic")}
      islamic={getStagesForProgram(program, "islamic")}
      facts={getProgramFacts(program, offering)}
      faqs={getFaqs(program.faqIds)}
    />
  );
}
