"use server";

import { headers } from "next/headers";
import { getSiteSettings, getVisiblePrograms } from "@/lib/cms";
import { processSubmission } from "./process";
import {
  INFORMATION_FIELDS,
  TOUR_FIELDS,
  informationRequestSchema,
  tourRequestSchema,
} from "./schemas";
import { issueFormToken } from "./spam";
import type { FormState } from "./state";

async function requestMeta() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded ? (forwarded.split(",")[0]?.trim() ?? null) : h.get("x-real-ip");
  return { ip, userAgent: h.get("user-agent") };
}

function programSlugs(): string[] {
  return getVisiblePrograms().map((p) => p.slug);
}

export async function submitTourRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const slugs = programSlugs();
  return processSubmission({
    kind: "tour-request",
    page: "/schedule-a-tour",
    allowedFields: TOUR_FIELDS,
    schema: (today) => tourRequestSchema({ today, programSlugs: slugs }),
    consentStatement: getSiteSettings().consentStatement,
    request: await requestMeta(),
    formData,
    toLead: (data, meta) => ({
      kind: "tour-request",
      submittedAt: meta.submittedAt,
      guardianName: data.guardianName,
      email: data.email,
      phone: data.phone,
      childDateOfBirth: data.childDob,
      programSlug: data.program === "not-sure" ? null : data.program,
      preferredDateTime: data.preferred,
      message: data.message || null,
      consent: { accepted: true, statement: meta.consentStatement, acceptedAt: meta.submittedAt },
      source: { page: "/schedule-a-tour", userAgent: meta.userAgent },
    }),
  });
}

export async function submitInformationRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const slugs = programSlugs();
  return processSubmission({
    kind: "information-request",
    page: "/request-information",
    allowedFields: INFORMATION_FIELDS,
    schema: (today) => informationRequestSchema({ today, programSlugs: slugs }),
    consentStatement: getSiteSettings().consentStatement,
    request: await requestMeta(),
    formData,
    toLead: (data, meta) => ({
      kind: "information-request",
      submittedAt: meta.submittedAt,
      guardianName: data.guardianName,
      email: data.email,
      phone: null,
      childDateOfBirth: data.childDob || null,
      programSlug: data.program || null,
      preferredDateTime: null,
      message: data.question || null,
      consent: { accepted: true, statement: meta.consentStatement, acceptedAt: meta.submittedAt },
      source: { page: "/request-information", userAgent: meta.userAgent },
    }),
  });
}

/** Fresh anti-spam token, used when a family chooses to submit another request. */
export async function refreshFormToken(): Promise<string> {
  return issueFormToken();
}
