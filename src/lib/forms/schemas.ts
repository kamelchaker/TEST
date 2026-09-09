import { z } from "zod";
import { compareDates, parseIsoDate, type CalendarDate } from "@/lib/finder/date";

/**
 * Authoritative validation for the two public forms. The same schemas run on
 * the server for every submission; client-side checks are a convenience only.
 */

export const MESSAGES = {
  guardianName: "Please enter your full name",
  email: "Please enter a valid email address",
  phone: "Please enter a phone number we can reach you on",
  childDob: "Please enter your child's date of birth",
  childDobCheck: "Please check the date of birth",
  program: "Please choose a program",
  preferred: "Please choose a preferred date and time",
  consent: "Please confirm we may contact you",
  tooLong: "Please shorten this message",
} as const;

const trimmed = z.string().trim();

const guardianName = trimmed.min(2, MESSAGES.guardianName).max(120, MESSAGES.guardianName);
const email = trimmed.max(254, MESSAGES.email).regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, MESSAGES.email);
const phone = trimmed.min(7, MESSAGES.phone).max(40, MESSAGES.phone).regex(/^[+()\d\s.-]+$/, MESSAGES.phone);
const consent = z.literal("on", { error: MESSAGES.consent });

/** Date-only string validated as a real calendar date on or before `today`. */
export function dateOfBirth(today: CalendarDate, required: boolean) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) {
        if (required) ctx.addIssue({ code: "custom", message: MESSAGES.childDob });
        return;
      }
      const date = parseIsoDate(value);
      if (!date || date.year < 1900 || compareDates(date, today) > 0) {
        ctx.addIssue({ code: "custom", message: MESSAGES.childDobCheck });
      }
    });
}

const PREFERRED = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/;

/** `datetime-local` value validated as a real date and time, not in the past. */
export function preferredDateTime(today: CalendarDate) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      const match = PREFERRED.exec(value);
      if (!match) {
        ctx.addIssue({ code: "custom", message: MESSAGES.preferred });
        return;
      }
      const date = parseIsoDate(match[1]);
      const hours = Number(match[2]);
      const minutes = Number(match[3]);
      if (!date || hours > 23 || minutes > 59 || compareDates(date, today) < 0) {
        ctx.addIssue({ code: "custom", message: MESSAGES.preferred });
      }
    });
}

export interface SchemaOptions {
  /** Server's calendar date; passed in so validation is deterministic. */
  today: CalendarDate;
  /** Program slugs a family may select. */
  programSlugs: string[];
}

export function tourRequestSchema({ today, programSlugs }: SchemaOptions) {
  return z.strictObject({
    guardianName,
    email,
    phone,
    childDob: dateOfBirth(today, true),
    program: z.enum([...programSlugs, "not-sure"], { error: MESSAGES.program }),
    preferred: preferredDateTime(today),
    message: trimmed.max(2000, MESSAGES.tooLong).optional().default(""),
    consent,
  });
}

export function informationRequestSchema({ today, programSlugs }: SchemaOptions) {
  return z.strictObject({
    guardianName,
    email,
    childDob: dateOfBirth(today, false).optional().default(""),
    program: z.enum(["", ...programSlugs], { error: MESSAGES.program }).optional().default(""),
    question: trimmed.max(2000, MESSAGES.tooLong).optional().default(""),
    consent,
  });
}

export type TourRequest = z.infer<ReturnType<typeof tourRequestSchema>>;
export type InformationRequest = z.infer<ReturnType<typeof informationRequestSchema>>;

export const TOUR_FIELDS = ["guardianName", "email", "phone", "childDob", "program", "preferred", "message", "consent"] as const;
export const INFORMATION_FIELDS = ["guardianName", "email", "childDob", "program", "question", "consent"] as const;

/** Flattens Zod issues to one message per field, first issue wins. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
