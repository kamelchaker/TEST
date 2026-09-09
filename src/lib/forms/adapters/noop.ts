import type { CrmAdapter, EmailAdapter, Lead } from "./types";

/** Adapters that accept every lead silently; used in tests. */
export class NoopCrmAdapter implements CrmAdapter {
  readonly name = "noop";
  async createLead(_lead: Lead) {
    return { reference: null };
  }
}

export class NoopEmailAdapter implements EmailAdapter {
  readonly name = "noop";
  async notifyAdmissions(_lead: Lead) {}
}
