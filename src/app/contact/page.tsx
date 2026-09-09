import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section } from "@/components/ui/Section";
import { BodyText, Kicker, Lede, MetaText, PageHeading, SectionHeading } from "@/components/ui/Typography";
import { getCampus, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "The quickest way to reach us is to book a tour or send a question — both go straight to our admissions team.",
  path: "/contact",
});

export default function ContactPage() {
  const settings = getSiteSettings();
  const campus = getCampus();
  return (
    <>
      <Section surface="cream" innerClassName="flex flex-col gap-3">
        <Kicker>Contact</Kicker>
        <PageHeading>Visit or contact us</PageHeading>
        <Lede>
          The quickest way to reach us is to book a tour or send a question — both go straight to our
          admissions team.
        </Lede>
      </Section>
      <Section innerClassName="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-7 lg:gap-12 items-center">
        <div className="flex flex-col gap-4">
          <SectionHeading>{settings.name}</SectionHeading>
          <BodyText>
            Our admissions team is the fastest way to reach the school. Book a tour to visit in person, or
            send a question and we will reply by email.
          </BodyText>
          {campus?.addressLines.length ? (
            <address className="not-italic body-text">
              {campus.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          ) : null}
          {campus?.phone ? (
            <p className="body-text">
              <a href={`tel:${campus.phone.replace(/\s+/g, "")}`}>{campus.phone}</a>
            </p>
          ) : null}
          {campus?.email ? (
            <p className="body-text">
              <a href={`mailto:${campus.email}`}>{campus.email}</a>
            </p>
          ) : null}
          <div className="btn-row">
            <ButtonLink href="/schedule-a-tour">Schedule a Tour</ButtonLink>
            <ButtonLink href="/request-information" variant="outline">
              Request Information
            </ButtonLink>
          </div>
          <MetaText>Both routes above reach the same admissions team.</MetaText>
        </div>
        <PhotoSlot imageKey="contactCampus" ratio="none" className="min-h-[280px]" />
      </Section>
    </>
  );
}
