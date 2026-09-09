import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Card, Chip } from "@/components/ui/Card";
import { FaqList } from "@/components/ui/FaqList";
import { HighlightGrid } from "@/components/ui/HighlightGrid";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section } from "@/components/ui/Section";
import { BodyText, Kicker, Lede, MetaText, PageHeading, SectionHeading, SubHeading } from "@/components/ui/Typography";
import { CtaBand, VISIT_BODY } from "@/components/ui/CtaBand";
import type { Faq, Program, ProgramOffering } from "@/content/types";
import { getPhoto, statusLabel, type ProgramFact, type ProgramStage } from "@/lib/cms";
import { breadcrumbJsonLd, faqJsonLd, programJsonLd } from "@/lib/structured-data";

export interface ProgramPageTemplateProps {
  program: Program;
  offering: ProgramOffering | null;
  academic: ProgramStage[];
  islamic: ProgramStage[];
  facts: ProgramFact[];
  faqs: Faq[];
}

function StageList({ stages }: { stages: ProgramStage[] }) {
  return (
    <ul className="list-none m-0 p-0 flex flex-col gap-3">
      {stages.map(({ domain, stage }) => (
        <li key={domain.id} className="flex flex-col gap-0.5 border-b border-line pb-2.5">
          <span className="font-serif font-semibold text-[17px] leading-[normal]">{domain.name}</span>
          <span className="meta-text font-semibold text-green">{stage.stageName}</span>
          <span className="meta-text">{stage.outcomes.join(", ")}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The single layout shared by every program page. Program-specific content is
 * supplied through props; nothing here is tied to one program.
 */
export function ProgramPageTemplate({ program, offering, academic, islamic, facts, faqs }: ProgramPageTemplateProps) {
  const status = offering ? statusLabel(offering.status) : null;
  const gallery = program.gallery.filter((g) => getPhoto(g.imageKey));
  const heroPhoto = getPhoto(`${program.imageKey}Hero`);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Programs", path: "/programs" },
          { name: program.name, path: `/programs/${program.slug}` },
        ])}
      />
      <JsonLd data={programJsonLd(program)} />
      {faqs.length ? <JsonLd data={faqJsonLd(faqs)} /> : null}

      <nav aria-label="Breadcrumb" className="bg-cream">
        <ol className="wrap crumb list-none m-0 flex flex-wrap gap-x-1.5">
          <li>
            <Link href="/">Home</Link> <span aria-hidden="true">›</span>
          </li>
          <li>
            <Link href="/programs">Programs</Link> <span aria-hidden="true">›</span>
          </li>
          <li aria-current="page">{program.name}</li>
        </ol>
      </nav>

      <Section
        surface="cream"
        padding="bottom"
        innerClassName="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-7 lg:gap-12 items-center"
      >
        <div className="flex flex-col gap-3.5">
          <PageHeading>{program.name}</PageHeading>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-semibold text-green">{program.ageLabel}</span>
            {status ? <Chip sage>{status}</Chip> : null}
          </div>
          <SubHeading as="h2">{program.headline}</SubHeading>
          <Lede>{program.value}</Lede>
          <div className="btn-row">
            <ButtonLink href="/schedule-a-tour">Schedule a Tour</ButtonLink>
            <ButtonLink href="/request-information" variant="outline">
              Request Information
            </ButtonLink>
            {offering?.applicationUrl ? (
              <ButtonLink href={offering.applicationUrl} variant="outline" external>
                Apply to {program.name}
              </ButtonLink>
            ) : null}
          </div>
        </div>
        <PhotoSlot imageKey={`${program.imageKey}Hero`} ratio="4/3" priority alt={heroPhoto?.alt} />
      </Section>

      {program.highlights.length ? (
        <Section>
          <HighlightGrid items={program.highlights} />
        </Section>
      ) : null}

      {academic.length || islamic.length ? (
        <Section innerClassName="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <SectionHeading>What your child will learn</SectionHeading>
            <BodyText className="max-w-[66ch]">
              Academic and Islamic learning are taught together across one integrated day, not as two
              separate curricula.
            </BodyText>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {academic.length ? (
              <Card className="flex flex-col gap-3">
                <Kicker>Academic &amp; Developmental Learning</Kicker>
                <StageList stages={academic} />
              </Card>
            ) : null}
            {islamic.length ? (
              <Card soft className="flex flex-col gap-3">
                <Kicker className="text-green">Islamic, Arabic &amp; Character Learning</Kicker>
                <StageList stages={islamic} />
              </Card>
            ) : null}
          </div>
        </Section>
      ) : null}

      {program.schedule.length ? (
        <Section
          surface="cream"
          innerClassName="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-7 lg:gap-12 items-center"
        >
          <div className="flex flex-col gap-2.5">
            <SectionHeading>{program.dayTitle}</SectionHeading>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {program.schedule.map((block, i) => (
                <li key={`${block.time}-${i}`} className="tl">
                  <span className="tl-time">{block.time}</span>
                  <span>{block.label}</span>
                  <span className="meta-text">{block.domains}</span>
                </li>
              ))}
            </ul>
            <MetaText className="mt-1.5">A typical day. Daily routines vary with the season and the group.</MetaText>
          </div>
          <PhotoSlot imageKey={`${program.imageKey}Day`} ratio="3/2" tone="deep" />
        </Section>
      ) : null}

      {gallery.length ? (
        <Section innerClassName="grid grid-cols-1 md:grid-cols-3 gap-5">
          {gallery.map((item) => (
            <figure key={item.imageKey} className="flex flex-col gap-2 m-0">
              <PhotoSlot
                imageKey={item.imageKey}
                ratio="3/2"
                tone="warm"
                alt=""
                sizes="(min-width: 768px) 33vw, 100vw"
              />
              <figcaption className="meta-text">{item.caption}</figcaption>
            </figure>
          ))}
        </Section>
      ) : null}

      <Section padding="bottom">
        <div className="panel-cream">
          <SectionHeading className="mb-4">Program details</SectionHeading>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 m-0">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1">
                <dt className="meta-text">{fact.label}</dt>
                <dd className="m-0 font-semibold text-[15px]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {faqs.length ? (
        <Section innerClassName="flex flex-col gap-3">
          <SectionHeading>Family FAQ</SectionHeading>
          <FaqList items={faqs} />
        </Section>
      ) : null}

      <CtaBand heading={`Visit ${program.name}`} body={VISIT_BODY} />
    </>
  );
}
