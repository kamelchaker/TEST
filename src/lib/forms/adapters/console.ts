import type { CrmAdapter, EmailAdapter, Lead } from "./types";

/**
 * Credential-free adapters for local development. They log a redacted
 * summary so no family data lands in logs.
 */
function redact(lead: Lead) {
  const at = lead.email.indexOf("@");
  return {
    kind: lead.kind,
    submittedAt: lead.submittedAt,
    guardian: `${lead.guardianName.slice(0, 1)}…`,
    emailDomain: at > 0 ? lead.email.slice(at) : "…",
    program: lead.programSlug,
    hasPhone: lead.phone !== null,
    hasDateOfBirth: lead.childDateOfBirth !== null,
    hasMessage: Boolean(lead.message),
  };
}

export class ConsoleCrmAdapter implements CrmAdapter {
  readonly name = "console";
  async createLead(lead: Lead) {
    console.info("[crm:console] lead received", redact(lead));
    return { reference: null };
  }
}

export class ConsoleEmailAdapter implements EmailAdapter {
  readonly name = "console";
  async notifyAdmissions(lead: Lead) {
    console.info("[email:console] admissions notification", redact(lead));
  }
}
