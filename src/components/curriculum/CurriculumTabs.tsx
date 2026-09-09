"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import type { CurriculumDomain } from "@/content/types";

export interface DomainColumn {
  programName: string;
  ageLabel: string;
  imageKey: string;
  stageName: string;
  outcomes: string[];
}

export interface DomainView {
  domain: CurriculumDomain;
  columns: DomainColumn[];
}

interface CurriculumTabsProps {
  academic: DomainView[];
  islamic: DomainView[];
}

/**
 * Two tab lists (academic and Islamic domains) sharing one tab panel. Arrow
 * keys, Home and End move across the full set per the ARIA tabs pattern.
 */
export function CurriculumTabs({ academic, islamic }: CurriculumTabsProps) {
  const all = [...academic, ...islamic];
  const [activeId, setActiveId] = useState(all[0]?.domain.id ?? "");
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const active = all.find((d) => d.domain.id === activeId) ?? all[0];

  if (!active) return null;

  const tabId = (id: string) => `curriculum-tab-${id}`;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const ids = all.map((d) => d.domain.id);
    const index = ids.indexOf(activeId);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % ids.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + ids.length) % ids.length;
    else if (event.key === "Home") next = 0;
    else next = ids.length - 1;
    const id = ids[next];
    if (!id) return;
    setActiveId(id);
    tabRefs.current.get(id)?.focus();
  };

  const renderTabs = (group: DomainView[], labelId: string, label: string, green?: boolean) => (
    <div className="tabrow">
      <p id={labelId} className={green ? "kicker text-green" : "kicker"}>
        {label}
      </p>
      <div className="tabs" role="tablist" aria-labelledby={labelId} aria-orientation="horizontal" onKeyDown={onKeyDown}>
        {group.map(({ domain }, index) => {
          const selected = domain.id === activeId;
          // Each tab list keeps one tab stop: the selected tab when it lives
          // here, otherwise the first tab, so both lists stay reachable by Tab.
          const groupHasSelection = group.some((d) => d.domain.id === activeId);
          const tabbable = selected || (!groupHasSelection && index === 0);
          return (
            <button
              key={domain.id}
              ref={(el) => {
                if (el) tabRefs.current.set(domain.id, el);
                else tabRefs.current.delete(domain.id);
              }}
              id={tabId(domain.id)}
              type="button"
              role="tab"
              className="tab"
              aria-selected={selected}
              aria-controls="curriculum-panel"
              tabIndex={tabbable ? 0 : -1}
              onClick={() => setActiveId(domain.id)}
            >
              {domain.shortName}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col gap-3">
        {renderTabs(academic, "curriculum-academic-label", "Academic & Developmental")}
        {renderTabs(islamic, "curriculum-islamic-label", "Islamic, Arabic & Character", true)}
      </div>
      <div
        role="tabpanel"
        id="curriculum-panel"
        aria-labelledby={tabId(active.domain.id)}
        tabIndex={0}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <h2 className="section-heading">{active.domain.name} across the years</h2>
          <p className="body-text max-w-[62ch]">{active.domain.blurb}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 grid-fill-last">
          {active.columns.map((column) => (
            <article key={column.programName} className="card flex flex-col">
              <PhotoSlot
                imageKey={column.imageKey}
                ratio="16/10"
                tone="dark"
                square
                alt=""
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="card-pad flex flex-col gap-1.5">
                <h3 className="sub-heading text-green">{column.programName}</h3>
                <p className="meta-text">{column.ageLabel}</p>
                <p className="font-semibold text-[15px]">{column.stageName}</p>
                <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
                  {column.outcomes.map((outcome) => (
                    <li key={outcome} className="meta-text">
                      · {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <p className="meta-text">
          Ages 2 to 6, left to right. Kindergarten is a full academic program, not an extension of
          Pre-Kindergarten.
        </p>
      </div>
    </>
  );
}
