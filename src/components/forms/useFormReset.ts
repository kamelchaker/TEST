"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { refreshFormToken } from "@/lib/forms/actions";
import type { FormState } from "@/lib/forms/state";

/** Moves focus to the error summary when a submission fails. */
export function useFocusOnError(state: FormState) {
  const summaryRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === "error") {
      summaryRef.current?.querySelector<HTMLElement>('[role="alert"]')?.focus();
    }
  }, [state]);
  return summaryRef;
}

/**
 * Success-panel bookkeeping for a form driven by useActionState. The panel
 * shows after a successful submission until the family chooses to submit
 * another request, which remounts a blank form with a fresh anti-spam token.
 */
export function useSubmitAnother(state: FormState, initialToken: string) {
  const [token, setToken] = useState(initialToken);
  const [formKey, setFormKey] = useState(0);
  const [dismissed, setDismissed] = useState<FormState | null>(null);
  const [resetting, startReset] = useTransition();

  const showSuccess = state.status === "success" && state !== dismissed;

  const submitAnother = () =>
    startReset(async () => {
      const fresh = await refreshFormToken();
      setToken(fresh);
      setDismissed(state);
      setFormKey((k) => k + 1);
    });

  return { token, formKey, showSuccess, submitAnother, resetting };
}
