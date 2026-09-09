import type { HTMLAttributes, ReactNode } from "react";

interface ArabicTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

/**
 * Wraps Arabic-script text so assistive technology pronounces it correctly
 * and the browser applies right-to-left shaping. Use only for genuine Arabic
 * script, not for transliterations such as "Qur'an" or "du‘a".
 */
export function ArabicText({ children, ...rest }: ArabicTextProps) {
  return (
    <span lang="ar" dir="rtl" {...rest}>
      {children}
    </span>
  );
}
