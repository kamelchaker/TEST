import type { Metadata } from "next";
import { ProgramFinder, type FinderYearOption } from "@/components/finder/ProgramFinder";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CtaBand, VISIT_BODY } from "@/components/ui/CtaBand";
import { HighlightGrid } from "@/components/ui/HighlightGrid";
import { IconCircle } from "@/components/ui/Icon";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { Section } from "@/components/ui/Section";
import {
  BodyText,
  DisplayHeading,
  Kicker,
  Lede,
  SectionHeading,
  SmallText,
  SubHeading,
} from "@/components/ui/Typography";
import { extendedLearningCards, homeHighlights, pathway } from "@/content/home";
import {
  getAcademicYears,
  getCoreProgramListings,
  getFinderOfferings,
  getSiteSettings,
} from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { cx } from "@/lib/cx";

export const metadata: Metadata = buildMetadata({
  title: "Al-Baseerah Academy | Early Childhood & Elementary Education",
  description:
    "Nurturing, engaging education for children ages 2–6 — strong academics and Islamic learning together, building skills, character, and confidence for a bright future.",
  path: "/",
  bareTitle: true,
});

const strip = [
  { imageKey: "curriculumArabic", caption: "Qur'an & Arabic learning" },
  { imageKey: "curriculumLiteracy", caption: "Reading & early writing" },
  { imageKey: "curriculumStem", caption: "STEM & discovery" },
  { imageKey: "curriculumPhysical", caption: "Teachers, play & outdoor time" },
];

export default function HomePage() {
  const settings = getSiteSettings();
  const years: FinderYearOption[] = getAcademicYears().map((year) => ({
    id: year.id,
    label: year.label,
    eligibilityCutoffDate: year.eligibilityCutoffDate,
    offerings: getFinderOfferings(year.id),
  }));
  const corePrograms = getCoreProgramListings();

  return (
    <>
      <Section surface="cream" innerClassName="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-7 lg:gap-12 items-center">
        <div className="flex flex-col gap-4">
          <Kicker>{settings.name}</Kicker>
          <DisplayHeading>A strong beginning for a lifetime of learning</DisplayHeading>
          <Lede>
            Nurturing, engaging education for children ages 2–6 — strong academics and Islamic learning
            together, building skills, character, and confidence for a bright future.
          </Lede>
          <div className="btn-row">
            <ButtonLink href="/schedule-a-tour">Schedule a Tour</ButtonLink>
            <ButtonLink href="/programs" variant="outline">
              Explore our programs
            </ButtonLink>
          </div>
        </div>
        <PhotoSlot imageKey="homeHero" ratio="4/3" priority />
      </Section>

      <Section surface="cream" padding="bottom">
        <ProgramFinder
          years={years}
          elementaryActive={settings.elementaryActive}
          elementaryGrades={settings.elementaryGrades}
        />
      </Section>

      <Section surface="cream" padding="bottom">
        <HighlightGrid items={homeHighlights} />
      </Section>

      <Section innerClassName="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Kicker>One integrated day</Kicker>
          <SectionHeading>Academics and Islamic learning, side by side</SectionHeading>
          <BodyText className="max-w-[60ch]">
            Qur&apos;an, Arabic, Islamic Studies and akhlaq sit in the same day as literacy, mathematics,
            science and the arts. Learning is designed as one connected experience, so children see the
            relationships between what they read, count, build and believe.
          </BodyText>
          <div>
            <ButtonLink href="/curriculum" variant="outline">
              See the curriculum
            </ButtonLink>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 grid-fill-last">
          {strip.map((item) => (
            <figure key={item.imageKey} className="flex flex-col gap-2 m-0">
              <PhotoSlot imageKey={item.imageKey} ratio="3/2" alt="" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              <figcaption className="meta-text">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section innerClassName="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Kicker>What sets the program apart</Kicker>
          <SectionHeading>Twelve learning domains, carried year over year</SectionHeading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="flex flex-col gap-2">
            <IconCircle name="book" />
            <SubHeading>Seven academic domains</SubHeading>
            <SmallText>
              Literacy, mathematics, science, STEM, social-emotional learning, physical development and
              creative arts — each revisited every year with greater depth.
            </SmallText>
          </Card>
          <Card soft className="flex flex-col gap-2">
            <IconCircle name="recitation" className="bg-white" />
            <SubHeading>Five Islamic &amp; Arabic domains</SubHeading>
            <SmallText>
              Qur&apos;an Studies, Arabic Language, Islamic Studies, Du‘a &amp; Daily Practice, and Islamic
              Character &amp; Akhlaq — taught within the school day, not added to the end of it.
            </SmallText>
          </Card>
          <Card className="flex flex-col gap-2">
            <IconCircle name="school" />
            <SubHeading>Progression, not repetition</SubHeading>
            <SmallText>
              A child who begins at two arrives at Kindergarten having built the same domains four times
              over — each time with more independence.
            </SmallText>
          </Card>
        </div>
      </Section>

      <Section surface="cream" innerClassName="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Kicker>Programs</Kicker>
          <SectionHeading>Four programs, one continuous path</SectionHeading>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 grid-fill-last">
          {corePrograms.map((listing) => (
            <ProgramCard key={listing.program.id} listing={listing} headingLevel="h3" />
          ))}
        </div>
      </Section>

      <Section innerClassName="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Kicker>The path through Al-Baseerah</Kicker>
          <SectionHeading>From first words to a confident reader</SectionHeading>
        </div>
        <ol className="steps steps-stacked">
          {pathway.map((step) => (
            <li key={step.name} className={cx("step", step.current && "step-now")}>
              <span className="kicker">{step.ages}</span>
              <span className="font-semibold text-[16px]">{step.name}</span>
              <span className="meta-text">{step.gain}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section surface="cream" innerClassName="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Kicker>Extended Learning</Kicker>
          <SectionHeading>Before School and After School</SectionHeading>
          <BodyText className="max-w-[62ch]">
            Purposeful enrichment at either end of the day — a calm start, and afternoons of Qur&apos;an
            practice, reading, STEM and creative time. Family support that stays educational.
          </BodyText>
          <div>
            <ButtonLink href="/programs/extended-learning">Explore Extended Learning</ButtonLink>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {extendedLearningCards.map((card) => (
            <Card key={card.title} soft={card.soft} className="flex flex-col gap-2">
              <SubHeading>{card.title}</SubHeading>
              <SmallText>{card.body}</SmallText>
            </Card>
          ))}
        </div>
      </Section>

      <CtaBand heading="See a school day for yourself" body={VISIT_BODY} />
    </>
  );
}
