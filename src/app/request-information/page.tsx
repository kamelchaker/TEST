import type { Metadata } from "next";
import { InformationRequestForm } from "@/components/forms/InformationRequestForm";
import { Section } from "@/components/ui/Section";
import { Kicker, Lede, PageHeading } from "@/components/ui/Typography";
import { getSiteSettings, getVisiblePrograms } from "@/lib/cms";
import { issueFormToken } from "@/lib/forms/spam";
import { buildMetadata } from "@/lib/seo";

// Rendered per request so each visit receives a fresh anti-spam token.
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Request Information",
  description: "We will send the program details and answer your questions by email.",
  path: "/request-information",
});

export default function RequestInformationPage() {
  const settings = getSiteSettings();
  const programOptions = getVisiblePrograms().map((p) => ({ value: p.slug, label: p.name }));

  return (
    <>
      <Section surface="cream" innerClassName="flex flex-col gap-3">
        <Kicker>Admissions</Kicker>
        <PageHeading>Request Information</PageHeading>
        <Lede>We will send the program details and answer your questions by email.</Lede>
      </Section>
      <Section innerClassName="max-w-[640px]">
        <InformationRequestForm
          token={issueFormToken()}
          programOptions={programOptions}
          consentStatement={settings.consentStatement}
          admissionsEmail={settings.admissionsEmail}
        />
      </Section>
    </>
  );
}
