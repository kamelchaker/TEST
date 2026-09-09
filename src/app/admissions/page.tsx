import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CtaBand } from "@/components/ui/CtaBand";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section } from "@/components/ui/Section";
import { Kicker, Lede, PageHeading, SectionHeading, SmallText, SubHeading } from "@/components/ui/Typography";
import { getAdmissionsContent } from "@/lib/cms";
import { cx } from "@/lib/cx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admissions",
  description:
    "Start with a visit. Explore the learning environment and learn more about the program from our team; everything else follows from there.",
  path: "/admissions",
});

const strip = [
  { imageKey: "curriculumQuran", caption: "Qur'an and Arabic in the school day" },
  { imageKey: "curriculumLiteracy", caption: "Explore the learning environment" },
  { imageKey: "curriculumArts", caption: "See the day as children live it" },
];

export default function AdmissionsPage() {
  const { journey } = getAdmissionsContent();
  return (
    <>
      <Section
        surface="cream"
        innerClassName="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-7 lg:gap-12 items-center"
      >
        <div className="flex flex-col gap-3.5">
          <Kicker>Admissions</Kicker>
          <PageHeading>Admissions</PageHeading>
          <SubHeading as="h2">Start with a visit.</SubHeading>
          <Lede>
            The best way to understand Al-Baseerah is to visit: explore the learning environment and learn
            more about the program from our team. Everything else follows from there.
          </Lede>
          <div className="btn-row">
            <ButtonLink href="/schedule-a-tour">Schedule a Tour</ButtonLink>
            <ButtonLink href="/request-information" variant="outline">
              Request Information
            </ButtonLink>
          </div>
        </div>
        <PhotoSlot imageKey="admissionsHero" ratio="4/3" priority />
      </Section>

      <Section innerClassName="flex flex-col gap-5">
        <SectionHeading>Your path to enrollment</SectionHeading>
        <ol className="steps">
          {journey.map((step, i) => (
            <li key={step.label} className={cx("step", step.current && "step-now")}>
              <span className="kicker">Step {String(i + 1).padStart(2, "0")}</span>
              <span className="font-semibold text-[16px]">{step.label}</span>
              <span className="meta-text">{step.body}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section surface="cream" innerClassName="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card className="flex flex-col gap-2">
          <SubHeading as="h2">Academic year and key dates</SubHeading>
          <SmallText>
            Application opening, priority deadline and the first day of school are confirmed with families
            for each academic year.
          </SmallText>
        </Card>
        <Card soft className="flex flex-col gap-2">
          <SubHeading as="h2">Eligibility</SubHeading>
          <SmallText>
            Placement follows date of birth against the eligibility cutoff for the academic year, not age
            at application.
          </SmallText>
        </Card>
      </Section>

      <Section innerClassName="grid grid-cols-1 md:grid-cols-3 gap-5">
        {strip.map((item) => (
          <figure key={item.caption} className="flex flex-col gap-2 m-0">
            <PhotoSlot imageKey={item.imageKey} ratio="3/2" alt="" sizes="(min-width: 768px) 33vw, 100vw" />
            <figcaption className="meta-text">{item.caption}</figcaption>
          </figure>
        ))}
      </Section>

      <CtaBand
        surface="cream"
        heading="Not sure which program?"
        body="Use the program finder on the homepage, or ask us — placement follows date of birth against the cutoff set for the academic year."
        bodyMaxWidth="none"
      />
    </>
  );
}
