import type { ReactNode } from "react";

interface SuccessPanelProps {
  body: string;
  children: ReactNode;
}

export function SuccessPanel({ body, children }: SuccessPanelProps) {
  return (
    <div className="form-success" role="status">
      <h2 className="section-heading">Thank you</h2>
      <p className="body-text mt-2">{body}</p>
      <div className="btn-row mt-4">{children}</div>
    </div>
  );
}
