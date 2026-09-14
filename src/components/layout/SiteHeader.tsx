import Link from "next/link";
import { HorizontalLockup } from "@/components/brand/MidadLockup";
import { getSiteSettings } from "@/lib/cms";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export const SHELL_ID = "site-shell";

export function SiteHeader() {
  const settings = getSiteSettings();
  return (
    <header className="site-header">
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center min-h-11 no-underline" aria-label={`${settings.name} home`}>
          <HorizontalLockup markSize={40} surface="#fff" descriptor="responsive" endorsement className="header-lockup" />
        </Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <NavLinks items={settings.navigation} variant="header" />
        </nav>
        <div className="flex items-center gap-2 flex-nowrap">
          <Link href="/schedule-a-tour" className="btn btn-compact hidden xs:inline-flex">
            Schedule a Tour
          </Link>
          <MobileNav items={settings.navigation} shellId={SHELL_ID} />
        </div>
      </div>
    </header>
  );
}
