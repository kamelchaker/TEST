"use client";

import { useActionState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { submitInformationRequest } from "@/lib/forms/actions";
import { initialFormState } from "@/lib/forms/state";
import { CheckboxField, ErrorSummary, SelectField, SpamGuards, TextField, TextareaField } from "./fields";
import { SuccessPanel } from "./SuccessPanel";
import type { ProgramOption } from "./TourRequestForm";
import { useFocusOnError, useSubmitAnother } from "./useFormReset";

interface InformationRequestFormProps {
  token: string;
  programOptions: ProgramOption[];
  consentStatement: string;
}

const IDS = {
  guardianName: "i-name",
  email: "i-email",
  childDob: "i-dob",
  program: "i-prog",
  question: "i-q",
  consent: "i-consent",
};

export function InformationRequestForm({ token: initialToken, programOptions, consentStatement }: InformationRequestFormProps) {
  const [state, formAction, pending] = useActionState(submitInformationRequest, initialFormState);
  const { token, formKey, showSuccess, submitAnother, resetting } = useSubmitAnother(state, initialToken);
  const summaryRef = useFocusOnError(state);
  const v = state.values;

  if (showSuccess) {
    return (
      <SuccessPanel body="Your request has been received and our admissions team will be in touch.">
        <ButtonLink href="/schedule-a-tour">Schedule a Tour</ButtonLink>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField
          id={IDS.childDob}
          name="childDob"
          label="Child's date of birth"
          type="date"
          autoComplete="bday"
          defaultValue={v.childDob}
          error={state.errors.childDob}
        />
        <SelectField id={IDS.program} name="program" label="Program of interest" defaultValue={v.program ?? ""} error={state.errors.program}>
          <option value="">No preference yet</option>
          {programOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectField>
      </div>
      <TextareaField id={IDS.question} name="question" label="Your question" defaultValue={v.question} error={state.errors.question} />
      <CheckboxField
        id={IDS.consent}
        name="consent"
        label={consentStatement}
        defaultChecked={v.consent === "on"}
        error={state.errors.consent}
      />
      <Button type="submit" variant="outline" className="self-start" disabled={pending}>
        {pending ? "Sending…" : "Request Information"}
      </Button>
      <div className="panel-soft p-4 flex flex-wrap gap-3 items-center justify-between">
        <p className="small-text">Ready to see the school?</p>
        <ButtonLink href="/schedule-a-tour">Schedule a Tour</ButtonLink>
      </div>
    </form>
  );
}
