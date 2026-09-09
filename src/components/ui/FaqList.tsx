"use client";

import { useId, useState } from "react";
import type { Faq } from "@/content/types";

interface FaqListProps {
  items: Faq[];
}

/**
 * Keyboard-operable disclosure list. Each question is a real button with
 * aria-expanded and aria-controls; answers stay in the DOM so they are
 * discoverable and printable.
 */
export function FaqList({ items }: FaqListProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  if (items.length === 0) return null;

  return (
    <div>
      {items.map((item) => {
        const isOpen = Boolean(open[item.id]);
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;
        return (
          <div className="faq" key={item.id}>
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                className="faq-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen((s) => ({ ...s, [item.id]: !s[item.id] }))}
              >
                <span>{item.question}</span>
                <span aria-hidden="true" className="text-green">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="faq-answer">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
