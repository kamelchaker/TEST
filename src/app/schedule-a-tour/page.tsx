import type { Metadata } from "next";
import { TourRequestForm } from "@/components/forms/TourRequestForm";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section } from "@/components/ui/Section";
import { Kicker, Lede, PageHeading } from "@/components/ui/Typography";
import { getSiteSettings, getVisiblePrograms } from "@/lib/cms";
import { issueFormToken } from "@/lib/forms/spam";
import { buildMetadata } from "@/lib/seo";

// Rendered per request so each visit receives a fresh anti-spam token.
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Schedule a Tour",
  description:
    "Visit Al-Baseerah, explore the learning environment, and learn more about the program from our team. Time for your questions is included.",
  path: "/schedule-a-tour",
});

export default function ScheduleTourPage() {
  const settings = getSiteSettings();
  const programOptions = getVisiblePrograms().map((p) => ({
    value: p.slug,
    label: p.kind === "core" ? `${p.name} (${p.ageRange})` : p.name,
  }));

  return (
    <>
      <Section
        surface="cream"
        innerClassName="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-7 lg:gap-12 items-center"
      >
        <div className="flex flex-col gap-3">
          <Kicker>Visit us</Kicker>
          <PageHeading>Schedule a Tour</PageHeading>
          <Lede>
            Visit Al-Baseerah, explore the learning environment, and learn more about the program from our
            team. Time for your questions is included.
          </Lede>
        </div>
        <PhotoSlot imageKey="tourHero" ratio="3/2" priority />
      </Section>
      <Section innerClassName="max-w-[760px]">
        <TourRequestForm
          token={issueFormToken()}
          programOptions={programOptions}
          consentStatement={settings.consentStatement}
        />
      </Section>
    </>
  );
}
