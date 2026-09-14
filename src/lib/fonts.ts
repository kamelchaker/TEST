import localFont from "next/font/local";

/**
 * Self-hosted variable fonts from the approved visual baseline.
 * Figtree carries body and interface text; Source Serif 4 carries headings.
 */
export const figtree = localFont({
  src: [
    { path: "../../public/fonts/figtree-latin.woff2", style: "normal" },
  ],
  weight: "300 900",
  display: "swap",
  variable: "--font-figtree",
  fallback: ["system-ui", "sans-serif"],
});

/** Amiri carries the Arabic name in the stacked lockup. */
export const amiri = localFont({
  src: [{ path: "../../public/fonts/amiri-arabic.woff2", style: "normal" }],
  weight: "400",
  display: "swap",
  variable: "--font-amiri",
  fallback: ["serif"],
  preload: false,
});

export const sourceSerif = localFont({
  src: [
    { path: "../../public/fonts/source-serif-4-latin.woff2", style: "normal" },
  ],
  weight: "200 900",
  display: "swap",
  variable: "--font-source-serif",
  fallback: ["Georgia", "serif"],
});
