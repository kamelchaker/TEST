"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { HONEYPOT_FIELD, TOKEN_FIELD } from "@/lib/forms/spam";

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: (a11y: { "aria-invalid": boolean | undefined; "aria-describedby": string | undefined; "aria-required": boolean | undefined }) => ReactNode;
}

function FieldShell({ id, label, required, error, children }: FieldShellProps) {
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label} <span className="field-opt">({required ? "required" : "optional"})</span>
      </label>
      {children({
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
        "aria-required": required ? true : undefined,
      })}
      {error ? (
        <p id={errorId} className="err-msg">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type Common = { id: string; label: string; required?: boolean; error?: string };

export function TextField({ id, label, required, error, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      {(a11y) => <input id={id} className="input" {...a11y} {...rest} />}
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  required,
  error,
  children,
  ...rest
}: Common & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      {(a11y) => (
        <select id={id} className="input" {...a11y} {...rest}>
          {children}
        </select>
      )}
    </FieldShell>
  );
}

export function TextareaField({ id, label, required, error, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      {(a11y) => <textarea id={id} className="input" rows={4} {...a11y} {...rest} />}
    </FieldShell>
  );
}

interface CheckboxFieldProps {
  id: string;
  name: string;
  label: string;
  error?: string;
  defaultChecked?: boolean;
}

export function CheckboxField({ id, name, label, error, defaultChecked }: CheckboxFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label className="flex gap-3 items-start min-h-11 font-normal">
        <input
          id={id}
          name={name}
          type="checkbox"
          className="checkbox"
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <span>{label}</span>
      </label>
      {error ? (
        <p id={errorId} className="err-msg">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface ErrorSummaryProps {
  errors: Record<string, string>;
  formError: string | null;
  /** Field name → input id, so each message links to its field. */
  fieldIds: Record<string, string>;
}

export function ErrorSummary({ errors, formError, fieldIds }: ErrorSummaryProps) {
  const entries = Object.entries(errors);
  if (entries.length === 0 && !formError) return null;
  return (
    <div className="form-summary" role="alert" tabIndex={-1}>
      <h2 className="sub-heading text-terra-deep">{entries.length ? "Please check these fields" : "Something went wrong"}</h2>
      {formError ? <p className="mt-2 text-[15px]">{formError}</p> : null}
      {entries.length ? (
        <ul className="mt-2 mb-0 pl-5 text-[15px]">
          {entries.map(([field, message]) => {
            const target = fieldIds[field];
            return <li key={field}>{target ? <a href={`#${target}`}>{message}</a> : message}</li>;
          })}
        </ul>
      ) : null}
    </div>
  );
}

/** Hidden anti-spam inputs: the signed timing token and the honeypot. */
export function SpamGuards({ token }: { token: string }) {
  return (
    <>
      <input type="hidden" name={TOKEN_FIELD} value={token} />
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`hp-${HONEYPOT_FIELD}`}>Leave this field empty</label>
        <input id={`hp-${HONEYPOT_FIELD}`} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
    </>
  );
}
