import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Kicker, Lede, PageHeading } from "@/components/ui/Typography";

export default function NotFound() {
  return (
    <Section surface="cream" innerClassName="flex flex-col gap-4">
      <Kicker>Page not found</Kicker>
      <PageHeading>We could not find that page</PageHeading>
      <Lede>The page may have moved. Explore our programs, or reach our admissions team directly.</Lede>
      <div className="btn-row">
        <ButtonLink href="/programs">Explore programs</ButtonLink>
        <ButtonLink href="/request-information" variant="outline">
          Request Information
        </ButtonLink>
      </div>
    </Section>
  );
}
