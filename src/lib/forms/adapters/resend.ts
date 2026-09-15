import type { EmailAdapter, Lead } from "./types";

/**
 * Email adapter for Resend (https://resend.com), using its HTTP API directly.
 *
 * Required environment:
 *   EMAIL_ADAPTER=resend
 *   RESEND_API_KEY=re_...
 *   EMAIL_FROM="Midad Academy <admissions@midadacademy.org>"  (a verified sender)
 */

export interface ResendOptions {
  apiKey: string;
  from: string;
  inbox: string;
  fetchImpl?: typeof fetch;
  endpoint?: string;
}

const LABELS: Record<Lead["kind"], string> = {
  "tour-request": "Tour request",
  "information-request": "Information request",
};

function line(label: string, value: string | null | undefined): string | null {
  return value ? `${label}: ${value}` : null;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/** Plain-text and HTML bodies for the admissions notification. */
export function renderLeadEmail(lead: Lead): { subject: string; text: string; html: string } {
  const label = LABELS[lead.kind];
  const rows = [
    line("Parent or guardian", lead.guardianName),
    line("Email", lead.email),
    line("Phone", lead.phone),
    line("Child's date of birth", lead.childDateOfBirth),
    line("Program of interest", lead.programSlug),
    line("Preferred date and time", lead.preferredDateTime),
    line("Message", lead.message),
    line("Submitted", lead.submittedAt),
    line("Consent", `${lead.consent.statement} (accepted ${lead.consent.acceptedAt})`),
    line("Page", lead.source.page),
  ].filter((r): r is string => r !== null);

  const text = `${label} from ${lead.guardianName}\n\n${rows.join("\n")}\n`;
  const html = `<p><strong>${escapeHtml(label)}</strong> from ${escapeHtml(lead.guardianName)}</p><table>${rows
    .map((r) => {
      const i = r.indexOf(": ");
      return `<tr><td style="padding:4px 12px 4px 0"><strong>${escapeHtml(r.slice(0, i))}</strong></td><td style="padding:4px 0">${escapeHtml(r.slice(i + 2))}</td></tr>`;
    })
    .join("")}</table>`;
  return { subject: `${label} — ${lead.guardianName}`, text, html };
}

export class ResendEmailAdapter implements EmailAdapter {
  readonly name = "resend";
  readonly inbox: string;
  private readonly apiKey: string;
  private readonly from: string;
  private readonly fetchImpl: typeof fetch;
  private readonly endpoint: string;

  constructor({ apiKey, from, inbox, fetchImpl = fetch, endpoint = "https://api.resend.com/emails" }: ResendOptions) {
    if (!apiKey) throw new Error("ResendEmailAdapter requires RESEND_API_KEY.");
    if (!from) throw new Error("ResendEmailAdapter requires EMAIL_FROM, a sender on a domain verified in Resend.");
    this.apiKey = apiKey;
    this.from = from;
    this.inbox = inbox;
    this.fetchImpl = fetchImpl;
    this.endpoint = endpoint;
  }

  async notifyAdmissions(lead: Lead): Promise<void> {
    const { subject, text, html } = renderLeadEmail(lead);
    const response = await this.fetchImpl(this.endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: this.from,
        to: [this.inbox],
        reply_to: lead.email,
        subject,
        text,
        html,
        tags: [{ name: "kind", value: lead.kind }],
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Resend rejected the notification (${response.status}): ${detail.slice(0, 200)}`);
    }
  }
}
