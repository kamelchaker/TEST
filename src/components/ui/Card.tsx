import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "li";
  /** Sage background variant used for the Islamic & Arabic panels. */
  soft?: boolean;
  padded?: boolean;
  children: ReactNode;
}

export function Card({ as = "div", soft, padded = true, className, children, ...rest }: CardProps) {
  const Tag = as;
  return (
    <Tag className={cx("card", padded && "card-pad", soft && "bg-sage-soft", className)} {...rest}>
      {children}
    </Tag>
  );
}

export function Chip({ children, sage, className }: { children: ReactNode; sage?: boolean; className?: string }) {
  return <span className={cx("chip", sage && "chip-sage", className)}>{children}</span>;
}
