import { ConsoleCrmAdapter, ConsoleEmailAdapter } from "./console";
import { NoopCrmAdapter, NoopEmailAdapter } from "./noop";
import type { CrmAdapter, EmailAdapter } from "./types";

export type { CrmAdapter, EmailAdapter, Lead, LeadConsent, LeadKind } from "./types";

export interface FormAdapters {
  crm: CrmAdapter;
  email: EmailAdapter;
}

/**
 * Adapter selection. The app runs end to end with the console adapters and
 * no credentials. A live CRM or mail provider is added by implementing the
 * interfaces in ./types and registering it here under a new env value.
 */
export function createAdapters(env: NodeJS.ProcessEnv = process.env): FormAdapters {
  const crmChoice = env.CRM_ADAPTER ?? "console";
  const emailChoice = env.EMAIL_ADAPTER ?? "console";

  const crm: CrmAdapter = crmChoice === "noop" ? new NoopCrmAdapter() : new ConsoleCrmAdapter();
  const email: EmailAdapter = emailChoice === "noop" ? new NoopEmailAdapter() : new ConsoleEmailAdapter();
  return { crm, email };
}

const globalStore = globalThis as unknown as { __abFormAdapters?: FormAdapters };

export function getAdapters(): FormAdapters {
  globalStore.__abFormAdapters ??= createAdapters();
  return globalStore.__abFormAdapters;
}
