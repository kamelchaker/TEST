import Image from "next/image";
import Link from "next/link";
import { logos } from "@/content/photography";
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
        <Image
          src={logos.full.src}
          alt={logos.full.alt}
          width={132}
          height={152}
          className="w-[132px] h-[152px] object-contain"
        />
        <p className="meta-text">
          {settings.name} · {settings.tagline}
        </p>
        <p className="meta-text">{settings.descriptor}</p>
      </div>
    </footer>
  );
}
