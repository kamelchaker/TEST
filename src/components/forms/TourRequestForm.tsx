"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { submitTourRequest } from "@/lib/forms/actions";
import { initialFormState } from "@/lib/forms/state";
import { CheckboxField, ErrorSummary, SelectField, SpamGuards, TextField, TextareaField } from "./fields";
import { SuccessPanel } from "./SuccessPanel";
import { useFocusOnError, useSubmitAnother } from "./useFormReset";

export interface ProgramOption {
  value: string;
  label: string;
}

interface TourRequestFormProps {
  token: string;
  programOptions: ProgramOption[];
  consentStatement: string;
  /** Public admissions address, offered as an alternative to the form. */
  admissionsEmail: string;
}

const IDS = {
  guardianName: "t-name",
  email: "t-email",
  phone: "t-phone",
  childDob: "t-dob",
  program: "t-prog",
  preferred: "t-when",
  message: "t-msg",
  consent: "t-consent",
};

export function TourRequestForm({ token: initialToken, programOptions, consentStatement, admissionsEmail }: TourRequestFormProps) {
  const [state, formAction, pending] = useActionState(submitTourRequest, initialFormState);
  const { token, formKey, showSuccess, submitAnother, resetting } = useSubmitAnother(state, initialToken);
  const summaryRef = useFocusOnError(state);
  const v = state.values;

  if (showSuccess) {
    return (
      <SuccessPanel body="Your tour request has been received and our admissions team will be in touch.">
        <ButtonLink href="/programs" variant="outline">
          Explore programs
        </ButtonLink>
        <Button variant="outline" onClick={submitAnother} disabled={resetting}>
          Submit another
        </Button>
      </SuccessPanel>
    );
  }

  return (
    <form key={formKey} action={formAction} noValidate className="flex flex-col gap-5 relative">
      <div ref={summaryRef} className="contents">
        <ErrorSummary errors={state.errors} formError={state.formError} fieldIds={IDS} />
      </div>
      <SpamGuards token={token} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField
          id={IDS.guardianName}
          name="guardianName"
          label="Parent or guardian name"
          required
          autoComplete="name"
          defaultValue={v.guardianName}
          error={state.errors.guardianName}
        />
        <TextField
          id={IDS.email}
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          defaultValue={v.email}
          error={state.errors.email}
        />
        <TextField
          id={IDS.phone}
          name="phone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          defaultValue={v.phone}
          error={state.errors.phone}
        />
        <TextField
          id={IDS.childDob}
          name="childDob"
          label="Child's date of birth"
          type="date"
          required
          autoComplete="bday"
          defaultValue={v.childDob}
          error={state.errors.childDob}
        />
        <SelectField
          id={IDS.program}
          name="program"
          label="Program of interest"
          required
          defaultValue={v.program ?? ""}
          error={state.errors.program}
        >
          <option value="">Choose a program</option>
          {programOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          <option value="not-sure">Not sure yet</option>
        </SelectField>
        <TextField
          id={IDS.preferred}
          name="preferred"
          label="Preferred date and time"
          type="datetime-local"
          required
          defaultValue={v.preferred}
          error={state.errors.preferred}
        />
      </div>
      <TextareaField
        id={IDS.message}
        name="message"
        label="Anything you would like us to know"
        defaultValue={v.message}
        error={state.errors.message}
      />
      <CheckboxField
        id={IDS.consent}
        name="consent"
        label={consentStatement}
        defaultChecked={v.consent === "on"}
        error={state.errors.consent}
      />
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Schedule a Tour"}
        </Button>
        <p className="meta-text">
          Prefer to write first? <Link href="/request-information">Request Information</Link> or email{" "}
          <a href={`mailto:${admissionsEmail}`}>{admissionsEmail}</a>
        </p>
      </div>
      <p className="meta-text border-t border-line pt-4">
        Seven fields, nothing more. No medical records, identity documents or payment details are collected
        here — those come later, privately, after an offer.
      </p>
    </form>
  );
}
