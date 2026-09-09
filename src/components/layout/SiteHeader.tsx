import Image from "next/image";
import Link from "next/link";
import { logos } from "@/content/photography";
import { getSiteSettings } from "@/lib/cms";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export const SHELL_ID = "site-shell";

export function SiteHeader() {
  const settings = getSiteSettings();
  return (
    <header className="site-header">
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 min-h-11 no-underline">
          <Image
            src={logos.crest.src}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 flex-none object-contain"
            priority
          />
          <span>
            <span className="brand-name">{settings.name}</span>
            <span className="brand-tagline">{settings.strapline}</span>
          </span>
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
