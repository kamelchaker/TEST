"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_ON = ["/schedule-a-tour", "/request-information", "/contact"];

/** Bottom-anchored tour button on small screens, hidden on the form pages. */
export function StickyCta() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return (
    <div className="sticky-cta">
      <Link href="/schedule-a-tour" className="btn btn-block">
        Schedule a Tour
      </Link>
    </div>
  );
}
