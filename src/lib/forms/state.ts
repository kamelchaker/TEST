export type FormStatus = "idle" | "success" | "error";

export interface FormState {
  status: FormStatus;
  /** Field name → message. */
  errors: Record<string, string>;
  /** Form-level message shown in the summary when no field is at fault. */
  formError: string | null;
  /** Submitted values echoed back so the form can be re-populated. */
  values: Record<string, string>;
}

export const initialFormState: FormState = {
  status: "idle",
  errors: {},
  formError: null,
  values: {},
};
