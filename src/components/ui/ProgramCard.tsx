import Link from "next/link";
import type { ProgramListing } from "@/lib/cms";
import { Chip } from "./Card";
import { PhotoSlot } from "./PhotoSlot";

interface ProgramCardProps {
  listing: ProgramListing;
  /** Heading level: h3 on the home page (under a section h2), h2 on /programs. */
  headingLevel?: "h2" | "h3";
}

export function ProgramCard({ listing, headingLevel = "h3" }: ProgramCardProps) {
  const { program, status } = listing;
  const Heading = headingLevel;
  const href = `/programs/${program.slug}`;
  return (
    <article className="card flex flex-col">
      <PhotoSlot
        imageKey={`${program.imageKey}Card`}
        ratio="16/10"
        tone="dark"
        square
        alt=""
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="card-pad flex flex-col gap-2.5 flex-1">
        <div className="flex flex-wrap gap-2">
          <Chip sage>{program.ageLabel}</Chip>
          {status ? <Chip>{status}</Chip> : null}
        </div>
        <Heading className="sub-heading text-green">{program.name}</Heading>
        <p className="small-text flex-1">{program.summary}</p>
        <Link href={href} className="link-arrow">
          Learn about {program.name} →
        </Link>
      </div>
    </article>
  );
}
