import type { z } from "zod";
import { todayLocal } from "@/lib/finder/date";
import { getAdapters, type Lead, type LeadKind } from "./adapters";
import { clientKey, getRateLimiter } from "./rate-limit";
import { fieldErrors } from "./schemas";
import { HONEYPOT_FIELD, TOKEN_FIELD, honeypotTripped, verifyFormToken } from "./spam";
import type { FormState } from "./state";

export const GENERIC_ERROR =
  "We could not send your request just now. Please try again in a moment, or contact our admissions team.";
export const RATE_LIMIT_ERROR = "Too many requests were sent from this connection. Please try again shortly.";

export interface ProcessOptions<S extends z.ZodTypeAny> {
  kind: LeadKind;
  page: string;
  /** Field names the form legitimately submits. Anything else is rejected. */
  allowedFields: readonly string[];
  schema: (today: ReturnType<typeof todayLocal>) => S;
  toLead: (data: z.infer<S>, meta: { submittedAt: string; consentStatement: string; userAgent: string | null }) => Lead;
  consentStatement: string;
  request: { ip: string | null; userAgent: string | null };
  formData: FormData;
  now?: () => number;
}

function echo(formData: FormData, allowed: readonly string[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const key of allowed) {
    const value = formData.get(key);
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

/**
 * Shared server-side pipeline for both forms:
 * unexpected fields → honeypot → schema → timing token → rate limit → adapters.
 */
export async function processSubmission<S extends z.ZodTypeAny>(options: ProcessOptions<S>): Promise<FormState> {
  const { formData, allowedFields, request } = options;
  const now = options.now ?? Date.now;
  const values = echo(formData, allowedFields);
  const fail = (formError: string, errors: Record<string, string> = {}): FormState => ({
    status: "error",
    errors,
    formError,
    values,
  });

  const permitted = new Set<string>([...allowedFields, HONEYPOT_FIELD, TOKEN_FIELD]);
  for (const key of formData.keys()) {
    // Next.js adds its own action bookkeeping fields with a `$ACTION` prefix.
    if (key.startsWith("$ACTION")) continue;
    if (!permitted.has(key)) return fail(GENERIC_ERROR);
  }

  if (honeypotTripped(formData.get(HONEYPOT_FIELD))) {
    // Silently accept so automated senders learn nothing.
    return { status: "success", errors: {}, formError: null, values: {} };
  }

  const parsed = options.schema(todayLocal(new Date(now()))).safeParse(Object.fromEntries(
    [...formData.entries()].filter(([key]) => allowedFields.includes(key)),
  ));
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error), formError: null, values };
  }

  const token = verifyFormToken(formData.get(TOKEN_FIELD), now());
  if (!token.ok) return fail(GENERIC_ERROR);

  const limiter = getRateLimiter();
  const decision = await limiter.consume(clientKey(options.kind, request.ip));
  if (!decision.allowed) return fail(RATE_LIMIT_ERROR);

  const submittedAt = new Date(now()).toISOString();
  const lead = options.toLead(parsed.data, {
    submittedAt,
    consentStatement: options.consentStatement,
    userAgent: request.userAgent,
  });

  const { crm, email } = getAdapters();
  try {
    await crm.createLead(lead);
  } catch (error) {
    console.error("[forms] CRM delivery failed", error instanceof Error ? error.message : error);
    return fail(GENERIC_ERROR);
  }
  try {
    await email.notifyAdmissions(lead);
  } catch (error) {
    // The lead is recorded; a notification failure must not fail the family.
    console.error("[forms] email notification failed", error instanceof Error ? error.message : error);
  }

  return { status: "success", errors: {}, formError: null, values: {} };
}
