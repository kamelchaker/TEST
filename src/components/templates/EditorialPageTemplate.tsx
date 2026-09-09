import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand, VISIT_BODY } from "@/components/ui/CtaBand";
import { FaqList } from "@/components/ui/FaqList";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section } from "@/components/ui/Section";
import { BodyText, Kicker, Lede, PageHeading, SectionHeading, SubHeading } from "@/components/ui/Typography";
import type { EditorialPage } from "@/content/editorial";
import type { Faq } from "@/content/types";
import { faqJsonLd } from "@/lib/structured-data";

interface EditorialPageTemplateProps {
  page: EditorialPage;
  faqs: Faq[];
}

/** Shared layout for Our Approach, Families and About. */
export function EditorialPageTemplate({ page, faqs }: EditorialPageTemplateProps) {
  return (
    <>
      {faqs.length ? <JsonLd data={faqJsonLd(faqs)} /> : null}
      <Section
        surface="cream"
        innerClassName="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-7 lg:gap-12 items-center"
      >
        <div className="flex flex-col gap-3.5">
          <Kicker>{page.kicker}</Kicker>
          <PageHeading>{page.heading}</PageHeading>
          <Lede>{page.lede}</Lede>
        </div>
        <PhotoSlot imageKey={page.imageKey} ratio="4/3" tone="warm" priority />
      </Section>

      <Section innerClassName="flex flex-col gap-5">
        {page.sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2 border-t border-line pt-5">
            <SubHeading as="h2">{section.title}</SubHeading>
            <BodyText className="max-w-[66ch]">{section.body}</BodyText>
          </div>
        ))}
      </Section>

      {faqs.length ? (
        <Section surface="cream" innerClassName="flex flex-col gap-3">
          <SectionHeading>Common questions</SectionHeading>
          <FaqList items={faqs} />
        </Section>
      ) : null}

      <CtaBand heading="Come and see for yourself" body={VISIT_BODY} />
    </>
  );
}
