import { ArabicText } from "@/components/ArabicText";
import { cx } from "@/lib/cx";
import { MidadMark } from "./MidadMark";

/**
 * Midad Academy lockups from the logo handoff.
 *
 * - horizontal: mark, then a left-aligned text column — wordmark, rule,
 *   descriptor. The site header's variant (terracotta accent, no endorsement).
 * - stacked: mark over wordmark, with the Arabic name as a peer line, then the
 *   rule and descriptor centred on the lockup's axis. For square placements.
 *
 * Sizes are set through CSS custom properties so the same construction scales
 * from the header to a footer block without changing the markup.
 */

export const DESCRIPTOR_FULL = ["Early Childhood & Elementary", "Nurturing hearts"] as const;
export const DESCRIPTOR_SHORT = "Early Childhood & Elementary";
export const DESCRIPTOR_FULL_LINE = `${DESCRIPTOR_FULL[0]} · ${DESCRIPTOR_FULL[1]}`;
export const ARABIC_NAME = "مداد";

interface LockupProps {
  /** Mark height in CSS pixels. */
  markSize: number;
  /** Surface colour behind the lockup; fills the mark's keyhole. */
  surface: string;
  /**
   * Descriptor line. "responsive" renders both sanctioned forms and lets CSS
   * pick one per breakpoint (the site header's case).
   */
  descriptor?: "full" | "short" | "none" | "responsive";
  className?: string;
  style?: React.CSSProperties;
}

export function HorizontalLockup({ markSize, surface, descriptor = "full", className, style }: LockupProps) {
  return (
    <span className={cx("lockup lockup-horizontal", className)} style={style}>
      <MidadMark size={markSize} surface={surface} className="lockup-mark" />
      <span className="lockup-text">
        <span className="lockup-wordmark">Midad Academy</span>
        {descriptor === "none" ? null : (
          <>
            <span className="lockup-rule" aria-hidden="true" />
            {descriptor === "responsive" ? (
              <>
                <span className="lockup-descriptor lockup-descriptor-full">{DESCRIPTOR_FULL_LINE}</span>
                <span className="lockup-descriptor lockup-descriptor-short">{DESCRIPTOR_SHORT}</span>
              </>
            ) : (
              <span className="lockup-descriptor">
                {descriptor === "short" ? DESCRIPTOR_SHORT : DESCRIPTOR_FULL_LINE}
              </span>
            )}
          </>
        )}
      </span>
    </span>
  );
}

interface StackedLockupProps extends Omit<LockupProps, "descriptor"> {
  descriptor?: "full" | "short";
  /** Accessible name for the whole lockup when it stands alone. */
  label?: string;
}

export function StackedLockup({ markSize, surface, descriptor = "full", label, className, style }: StackedLockupProps) {
  return (
    <span className={cx("lockup lockup-stacked", className)} style={style} role={label ? "img" : undefined} aria-label={label}>
      <MidadMark size={markSize} surface={surface} className="lockup-mark" />
      <span className="lockup-wordmark">Midad Academy</span>
      <ArabicText className="lockup-arabic">{ARABIC_NAME}</ArabicText>
      <span className="lockup-rule" aria-hidden="true" />
      {descriptor === "full" ? (
        // A 1fr auto 1fr grid pins the middle dot to the lockup's vertical axis.
        <span className="lockup-descriptor lockup-descriptor-grid">
          <span className="text-right">{DESCRIPTOR_FULL[0]}</span>
          <span aria-hidden="true">·</span>
          <span className="text-left">{DESCRIPTOR_FULL[1]}</span>
        </span>
      ) : (
        <span className="lockup-descriptor">{DESCRIPTOR_SHORT}</span>
      )}
    </span>
  );
}
