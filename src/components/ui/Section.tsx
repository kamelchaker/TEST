import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";

type Surface = "cream" | "white" | "green";

const surfaceClass: Record<Surface, string> = {
  cream: "bg-cream",
  white: "bg-white",
  green: "surface-green",
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  surface?: Surface;
  /** Vertical padding: full (both sides), bottom only, or none. */
  padding?: "both" | "bottom" | "none";
  /** Extra classes applied to the inner container. */
  innerClassName?: string;
  children: ReactNode;
}

/** Full-bleed band with a centred, gutter-padded container. */
export function Section({
  surface = "white",
  padding = "both",
  innerClassName,
  className,
  children,
  ...rest
}: SectionProps) {
  const pad = padding === "both" ? "sec" : padding === "bottom" ? "sec-b" : "";
  return (
    <section className={cx(surfaceClass[surface], className)} {...rest}>
      <div className={cx("wrap", pad, innerClassName)}>{children}</div>
    </section>
  );
}
