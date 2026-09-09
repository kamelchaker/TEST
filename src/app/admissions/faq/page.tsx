import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqList } from "@/components/ui/FaqList";
import { Section } from "@/components/ui/Section";
import { Kicker, Lede, PageHeading } from "@/components/ui/Typography";
import { getAdmissionsContent, getFaqs } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Admissions FAQ",
  description: "Find answers to common questions about programs, eligibility, applications and enrollment.",
  path: "/admissions/faq",
});

export default function AdmissionsFaqPage() {
  const faqs = getFaqs(getAdmissionsContent().faqIds);
  return (
    <>
      {faqs.length ? <JsonLd data={faqJsonLd(faqs)} /> : null}
      <Section surface="cream" innerClassName="flex flex-col gap-3.5">
        <Kicker>Admissions</Kicker>
        <PageHeading>Admissions FAQ</PageHeading>
        <Lede>Find answers to common questions about programs, eligibility, applications and enrollment.</Lede>
      </Section>
      <Section>
        <FaqList items={faqs} />
      </Section>
      <CtaBand
        surface="cream"
        heading="Still have a question?"
        body="Ask us directly, or come and see the school."
        bodyMaxWidth="none"
      />
    </>
  );
}
