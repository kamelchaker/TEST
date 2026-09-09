import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "outline" | "white" | "white-outline";

const variantClass: Record<ButtonVariant, string> = {
  primary: "",
  outline: "btn-outline",
  white: "btn-white",
  "white-outline": "btn-white-outline",
};

interface BaseProps {
  variant?: ButtonVariant;
  block?: boolean;
  compact?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonLinkProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    /** Opens an external system (application portal) in a new tab. */
    external?: boolean;
  };

function classes({ variant = "primary", block, compact, className }: BaseProps) {
  return cx("btn", variantClass[variant], block && "btn-block", compact && "btn-compact", className);
}

export function ButtonLink({ href, external, children, variant, block, compact, className, ...rest }: ButtonLinkProps) {
  const cls = classes({ variant, block, compact, className, children });
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({ children, variant, block, compact, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={classes({ variant, block, compact, className, children })} {...rest}>
      {children}
    </button>
  );
}
