import type { Metadata } from "next";
import { CurriculumTabs, type DomainView } from "@/components/curriculum/CurriculumTabs";
import { Card } from "@/components/ui/Card";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section } from "@/components/ui/Section";
import { Kicker, Lede, PageHeading, SmallText, SubHeading } from "@/components/ui/Typography";
import { getDomainProgression, getDomains } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Curriculum",
  description:
    "Strong academics and Islamic education, integrated across every stage from Early Learners through Kindergarten. Each stage builds on the one before it.",
  path: "/curriculum",
});

function views(group: "academic" | "islamic"): DomainView[] {
  return getDomains(group).map((domain) => ({
    domain,
    columns: getDomainProgression(domain.id).map(({ program, stage }) => ({
      programName: program.name,
      ageLabel: program.ageLabel,
      imageKey: `${program.imageKey}Hero`,
      stageName: stage.stageName,
      outcomes: stage.outcomes,
    })),
  }));
}

export default function CurriculumPage() {
  return (
    <>
      <Section
        surface="cream"
        innerClassName="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-7 lg:gap-12 items-center"
      >
        <div className="flex flex-col gap-3.5">
          <Kicker>Our curriculum</Kicker>
          <PageHeading>A progressive path for every stage</PageHeading>
          <Lede>
            Strong academics and Islamic education, integrated across every stage from Early Learners
            through Kindergarten. Each stage builds on the one before it — greater depth, never a fresh
            start.
          </Lede>
        </div>
        <PhotoSlot imageKey="curriculumHero" ratio="4/3" tone="deep" priority />
      </Section>

      <Section innerClassName="flex flex-col gap-6">
        <CurriculumTabs academic={views("academic")} islamic={views("islamic")} />
      </Section>

      <Section surface="cream" innerClassName="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card className="flex flex-col gap-2">
          <SubHeading as="h2">Academics and Islamic learning, taught together</SubHeading>
          <SmallText>
            Qur&apos;an, Arabic, Islamic Studies and akhlaq run alongside literacy, math, science and the
            arts — one integrated day, not an add-on.
          </SmallText>
        </Card>
        <Card soft className="flex flex-col gap-2">
          <SubHeading as="h2">Increasing depth, not new subjects</SubHeading>
          <SmallText>
            Every domain is revisited each year with greater depth, so children arrive at Kindergarten
            with a foundation they have been building since age two.
          </SmallText>
        </Card>
      </Section>
    </>
  );
}
