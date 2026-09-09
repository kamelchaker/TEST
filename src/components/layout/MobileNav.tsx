"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { NavItem } from "@/content/types";
import { NavLinks } from "./NavLinks";

interface MobileNavProps {
  items: NavItem[];
  /** id of the element that wraps the rest of the page; made inert while open. */
  shellId: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Burger button plus a modal navigation drawer.
 *
 * While open: focus moves into the drawer, Tab is trapped inside it, the rest
 * of the page is inert and scroll-locked, Escape closes it, and focus returns
 * to the burger on close.
 */
export function MobileNav({ items, shellId }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const shell = document.getElementById(shellId);
    const burger = burgerRef.current;
    const previousOverflow = document.body.style.overflow;
    shell?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      shell?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      burger?.focus();
    };
  }, [open, shellId]);

  const drawer = open ? (
    <div className="drawer lg:hidden">
      <div className="drawer-scrim" onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between gap-3">
          <span id={titleId} className="sub-heading font-serif font-semibold text-green">
            Menu
          </span>
          <button ref={closeRef} type="button" className="burger" onClick={close}>
            <span aria-hidden="true" className="text-[22px] leading-none">
              ×
            </span>
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Site" className="mt-3 overflow-y-auto">
          <NavLinks items={items} variant="drawer" onNavigate={close} />
        </nav>
        <div className="pt-4">
          <Link href="/schedule-a-tour" className="btn btn-block" onClick={close}>
            Schedule a Tour
          </Link>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className="burger lg:hidden"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <span className="sr-only">Open menu</span>
      </button>
      {drawer ? createPortal(drawer, document.body) : null}
    </>
  );
}
