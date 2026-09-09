"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/content/types";

export function isCurrent(pathname: string, item: NavItem): boolean {
  return pathname === item.match || pathname.startsWith(`${item.match}/`);
}

interface NavLinksProps {
  items: NavItem[];
  variant: "header" | "drawer";
  onNavigate?: () => void;
}

/** Navigation list with aria-current on the active section. */
export function NavLinks({ items, variant, onNavigate }: NavLinksProps) {
  const pathname = usePathname();
  const linkClass = variant === "header" ? "nav-link" : "drawer-link";
  const links = items.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={linkClass}
      aria-current={isCurrent(pathname, item) ? "page" : undefined}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  ));

  if (variant === "drawer") return <>{links}</>;

  return (
    <ul className="hidden lg:flex items-center gap-[22px] list-none m-0 p-0">
      {items.map((item, i) => (
        <li key={item.href}>{links[i]}</li>
      ))}
    </ul>
  );
}
