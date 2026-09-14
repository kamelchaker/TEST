import { ButtonLink } from "./Button";
import { Section } from "./Section";
import { BodyText, SectionHeading } from "./Typography";

interface CtaBandProps {
  heading: string;
  body?: string;
  /** Green band (default) or cream band with green/outline buttons. */
  surface?: "green" | "cream";
  bodyMaxWidth?: string;
}

export const VISIT_BODY =
  "Visit Midad, explore the learning environment, and learn more about the program from our team.";

/** The shared "Schedule a Tour / Request Information" call to action. */
export function CtaBand({ heading, body, surface = "green", bodyMaxWidth = "56ch" }: CtaBandProps) {
  const green = surface === "green";
  return (
    <Section surface={surface} innerClassName="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <SectionHeading>{heading}</SectionHeading>
        {body ? <BodyText style={{ maxWidth: bodyMaxWidth }}>{body}</BodyText> : null}
      </div>
      <div className="btn-row">
        <ButtonLink href="/schedule-a-tour" variant={green ? "white" : "primary"}>
          Schedule a Tour
        </ButtonLink>
        <ButtonLink href="/request-information" variant={green ? "white-outline" : "outline"}>
          Request Information
        </ButtonLink>
      </div>
    </Section>
  );
}
