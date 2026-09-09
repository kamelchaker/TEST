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

export const sourceSerif = localFont({
  src: [
    { path: "../../public/fonts/source-serif-4-latin.woff2", style: "normal" },
  ],
  weight: "200 900",
  display: "swap",
  variable: "--font-source-serif",
  fallback: ["Georgia", "serif"],
});
