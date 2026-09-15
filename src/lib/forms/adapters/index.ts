import { ConsoleCrmAdapter, ConsoleEmailAdapter } from "./console";
import { NoopCrmAdapter, NoopEmailAdapter } from "./noop";
import { ResendEmailAdapter } from "./resend";
import { siteSettings } from "@/content/site";
import type { CrmAdapter, EmailAdapter } from "./types";

export type { CrmAdapter, EmailAdapter, Lead, LeadConsent, LeadKind } from "./types";

export interface FormAdapters {
  crm: CrmAdapter;
  email: EmailAdapter;
}

/**
 * Adapter selection. The app runs end to end with the console adapters and
 * no credentials. EMAIL_ADAPTER=resend sends notifications through Resend.
 * Another CRM or mail provider is added by implementing the interfaces in
 * ./types and registering it here under a new env value.
 */
export type AdapterEnv = Record<string, string | undefined>;

export function createAdapters(env: AdapterEnv = process.env): FormAdapters {
  const crmChoice = env.CRM_ADAPTER ?? "console";
  const emailChoice = env.EMAIL_ADAPTER ?? "console";
  // Notifications go to the admissions inbox; ADMISSIONS_INBOX overrides it per environment.
  const inbox = env.ADMISSIONS_INBOX || siteSettings.admissionsEmail;

  const crm: CrmAdapter = crmChoice === "noop" ? new NoopCrmAdapter() : new ConsoleCrmAdapter();

  let email: EmailAdapter;
  switch (emailChoice) {
    case "resend":
      email = new ResendEmailAdapter({
        apiKey: env.RESEND_API_KEY ?? "",
        from: env.EMAIL_FROM ?? "",
        inbox,
      });
      break;
    case "noop":
      email = new NoopEmailAdapter(inbox);
      break;
    default:
      email = new ConsoleEmailAdapter(inbox);
  }
  return { crm, email };
}

const globalStore = globalThis as unknown as { __abFormAdapters?: FormAdapters };

export function getAdapters(): FormAdapters {
  globalStore.__abFormAdapters ??= createAdapters();
  return globalStore.__abFormAdapters;
}
