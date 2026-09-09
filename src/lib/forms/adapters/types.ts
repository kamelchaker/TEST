export type LeadKind = "tour-request" | "information-request";

export interface LeadConsent {
  accepted: true;
  statement: string;
  acceptedAt: string;
}

export interface Lead {
  kind: LeadKind;
  submittedAt: string;
  guardianName: string;
  email: string;
  phone: string | null;
  /** Child's date of birth as YYYY-MM-DD, handled server-side only. */
  childDateOfBirth: string | null;
  programSlug: string | null;
  preferredDateTime: string | null;
  message: string | null;
  consent: LeadConsent;
  source: {
    page: string;
    userAgent: string | null;
  };
}

export interface CrmAdapter {
  readonly name: string;
  createLead(lead: Lead): Promise<{ reference: string | null }>;
}

export interface EmailAdapter {
  readonly name: string;
  notifyAdmissions(lead: Lead): Promise<void>;
}
