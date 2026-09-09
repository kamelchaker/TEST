import type { OfferingStatus, Program, SiteSettings } from "@/content/types";

/**
 * Central visibility rules. Every place that lists or links to programs goes
 * through here, so elementary grades cannot leak while they are inactive.
 */
export function isProgramVisible(
  program: Program,
  settings: Pick<SiteSettings, "elementaryActive">,
): boolean {
  if (program.kind === "elementary") return settings.elementaryActive;
  return true;
}

export const statusLabels: Record<OfferingStatus, string> = {
  open: "Open",
  waitlist: "Waitlist",
  closed: "Closed",
  "coming-soon": "Coming soon",
};

export function statusLabel(status: OfferingStatus): string {
  return statusLabels[status];
}
