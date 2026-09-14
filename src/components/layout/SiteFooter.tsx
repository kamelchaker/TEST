import Link from "next/link";
import { StackedLockup } from "@/components/brand/MidadLockup";
import { getSiteSettings } from "@/lib/cms";

export function SiteFooter() {
  const settings = getSiteSettings();
  return (
    <footer className="site-footer">
      <div className="wrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 sec">
        {settings.footer.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="kicker mb-2">{column.title}</p>
            <ul className="list-none m-0 p-0">
              {column.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="wrap border-t border-line pt-5 pb-5" aria-hidden="true" />
      <div className="wrap border-t border-line pt-5 pb-6 flex flex-wrap gap-4 items-center justify-between">
        <StackedLockup
          markSize={64}
          surface="#faf7f1"
          descriptor="short"
          label={settings.name}
          style={{ "--lockup-wordmark": "22px", "--lockup-descriptor": "10px" } as React.CSSProperties}
        />
        <div className="flex flex-col gap-1">
          <p className="meta-text">
            {settings.name} · {settings.tagline}
          </p>
          {settings.endorsementLine ? <p className="meta-text">{settings.endorsementLine}</p> : null}
        </div>
        <p className="meta-text">{settings.descriptor}</p>
      </div>
    </footer>
  );
}
