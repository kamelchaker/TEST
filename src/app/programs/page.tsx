import type { Metadata } from "next";
import { CtaBand } from "@/components/ui/CtaBand";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { Section } from "@/components/ui/Section";
import { Kicker, Lede, PageHeading } from "@/components/ui/Typography";
import { getProgramListings } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Programs",
  description:
    "Programs for ages 2 to 6: one curriculum deepening year over year, from Early Learners through Kindergarten, with Extended Learning at either end of the day.",
  path: "/programs",
});

export default function ProgramsPage() {
  const listings = getProgramListings();
  return (
    <>
      <Section surface="cream" innerClassName="flex flex-col gap-3.5">
        <Kicker>Programs</Kicker>
        <PageHeading>Programs for ages 2 to 6</PageHeading>
        <Lede>
          One curriculum deepening year over year, from Early Learners through Kindergarten, with Extended
          Learning at either end of the day.
        </Lede>
      </Section>
      <Section innerClassName="grid grid-cols-1 md:grid-cols-3 gap-5">
        {listings.map((listing) => (
          <ProgramCard key={listing.program.id} listing={listing} headingLevel="h2" />
        ))}
      </Section>
      <CtaBand
        surface="cream"
        heading="Not sure which program fits?"
        body="Placement follows date of birth against the cutoff set for the academic year. We can help."
        bodyMaxWidth="none"
      />
    </>
  );
}
