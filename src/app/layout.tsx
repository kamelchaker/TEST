import type { Metadata, Viewport } from "next";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SHELL_ID, SiteHeader } from "@/components/layout/SiteHeader";
import { StickyCta } from "@/components/layout/StickyCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/cms";
import { amiri, figtree, sourceSerif } from "@/lib/fonts";
import { siteUrl } from "@/lib/seo";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import "./globals.css";

const settings = getSiteSettings();

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: settings.name,
    template: `%s | ${settings.name}`,
  },
  description:
    "Nurturing, engaging education for children ages 2–6 — strong academics and Islamic learning together.",
  applicationName: settings.name,
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10513c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={settings.locale} className={`${figtree.variable} ${sourceSerif.variable} ${amiri.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <div id={SHELL_ID}>
          <SkipLink />
          <SiteHeader />
          <main id="main" className="main-with-sticky" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
          <StickyCta />
        </div>
      </body>
    </html>
  );
}
