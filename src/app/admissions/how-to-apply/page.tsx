import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { BodyText, Kicker, Lede, MetaText, PageHeading, SectionHeading, SmallText, SubHeading } from "@/components/ui/Typography";
import { getAdmissionsContent, getCoreProgramListings } from "@/lib/cms";
import { cx } from "@/lib/cx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "How to Apply",
  description:
    "Four steps, in order. Most families tour first — it is not required, but it makes the rest of the process straightforward.",
  path: "/admissions/how-to-apply",
});

export default function HowToApplyPage() {
  const { applySteps, neededAtApplication, afterOfferNote } = getAdmissionsContent();
  // Application links open the external application system, only where one is approved.
  const applicationLinks = getCoreProgramListings().flatMap(({ program, offering }) =>
    offering?.applicationUrl ? [{ name: program.name, url: offering.applicationUrl }] : [],
  );

  return (
    <>
      <Section surface="cream" innerClassName="flex flex-col gap-3.5">
        <Kicker>Admissions</Kicker>
        <PageHeading>How to Apply</PageHeading>
        <Lede>
          Four steps, in order. Most families tour first — it is not required, but it makes the rest of
          the process straightforward.
        </Lede>
      </Section>

      <Section innerClassName="flex flex-col gap-5">
        <ol className="list-none m-0 p-0 flex flex-col gap-5">
          {applySteps.map((step, i) => (
            <li key={step.title} className="numstep">
              <span className={cx("num", i === applySteps.length - 1 && "num-last")} aria-hidden="true">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1 border-b border-line pb-[18px]">
                <SubHeading as="h2">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </SubHeading>
                <SmallText>{step.body}</SmallText>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section surface="cream">
        <Card className="flex flex-col gap-2.5">
          <SubHeading as="h2">What you will need at application</SubHeading>
          <SmallText>{neededAtApplication.join(" · ")}</SmallText>
          <MetaText>{afterOfferNote}</MetaText>
        </Card>
      </Section>

      <Section innerClassName="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <SectionHeading>Ready to begin?</SectionHeading>
          <BodyText>Schedule a tour, ask us a question, or start your application.</BodyText>
        </div>
        <div className="btn-row">
          <ButtonLink href="/schedule-a-tour">Schedule a Tour</ButtonLink>
          <ButtonLink href="/request-information" variant="outline">
            Request Information
          </ButtonLink>
          {applicationLinks.map((link) => (
            <ButtonLink key={link.name} href={link.url} variant="outline" external>
              Apply to {link.name}
            </ButtonLink>
          ))}
        </div>
      </Section>
    </>
  );
}
