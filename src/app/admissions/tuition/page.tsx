import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section } from "@/components/ui/Section";
import { Kicker, Lede, PageHeading, SmallText, SubHeading } from "@/components/ui/Typography";
import { getTuition } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Tuition & Fees",
  description:
    "Tuition is set for each academic year and each program. Our admissions team will walk you through the current figures, payment plans and any support available.",
  path: "/admissions/tuition",
});

export default function TuitionPage() {
  const tuition = getTuition();
  const otherFees = tuition?.otherFees ?? [];
  const assistanceNote = tuition?.assistanceNote ?? "";

  return (
    <>
      <Section surface="cream" innerClassName="flex flex-col gap-3.5">
        <Kicker>Admissions</Kicker>
        <PageHeading>Tuition &amp; Fees</PageHeading>
        <Lede>
          Tuition is set for each academic year and each program. Our admissions team will walk you
          through the current figures, payment plans and any support available.
        </Lede>
      </Section>

      <Section innerClassName="flex flex-col gap-5">
        {tuition?.approved ? (
          <div className="tblwrap" role="region" aria-label="Tuition table" tabIndex={0}>
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Program</th>
                  <th scope="col">Ages</th>
                  <th scope="col">Annual</th>
                  <th scope="col">Monthly</th>
                </tr>
              </thead>
              <tbody>
                {tuition.rows.map((row) => (
                  <tr key={row.program.id}>
                    <th scope="row" className="font-semibold text-ink normal-case tracking-normal text-[15px] font-sans border-b border-line">
                      {row.program.name}
                    </th>
                    <td>{row.program.ageRange}</td>
                    <td>{row.annual}</td>
                    <td>{row.monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="note">
            <strong>Tuition for the coming academic year is shared directly with families.</strong> Request
            information or schedule a tour, and our admissions team will walk you through tuition, fees and
            any available support.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {otherFees.length ? (
            <Card className="flex flex-col gap-2">
              <SubHeading as="h2">Other fees</SubHeading>
              <SmallText>{otherFees.join(" · ")}</SmallText>
            </Card>
          ) : null}
          {assistanceNote ? (
            <Card soft className="flex flex-col gap-2">
              <SubHeading as="h2">Payment plans &amp; assistance</SubHeading>
              <SmallText>{assistanceNote}</SmallText>
            </Card>
          ) : null}
        </div>
      </Section>

      <CtaBand
        surface="cream"
        heading="Questions about cost?"
        body="Our admissions team can walk you through tuition, fees and any available support."
        bodyMaxWidth="none"
      />
    </>
  );
}
