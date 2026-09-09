"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  evaluateProgramFinder,
  todayLocal,
  type FinderAcademicYear,
  type FinderElementaryGrade,
  type FinderOffering,
} from "@/lib/finder";

export interface FinderYearOption extends FinderAcademicYear {
  offerings: FinderOffering[];
}

interface ProgramFinderProps {
  years: FinderYearOption[];
  elementaryActive: boolean;
  elementaryGrades: FinderElementaryGrade[];
}

/**
 * Interactive shell around the pure finder evaluator. All placement logic
 * lives in `@/lib/finder`; this component only collects input and renders
 * the result.
 */
export function ProgramFinder({ years, elementaryActive, elementaryGrades }: ProgramFinderProps) {
  const id = useId();
  const [dob, setDob] = useState("");
  const [yearId, setYearId] = useState(years[0]?.id ?? "");

  const result = useMemo(() => {
    const year = years.find((y) => y.id === yearId) ?? years[0];
    if (!year) return null;
    return evaluateProgramFinder({
      dateOfBirth: dob,
      today: todayLocal(),
      academicYear: year,
      offerings: year.offerings,
      elementaryActive,
      elementaryGrades,
    });
  }, [dob, yearId, years, elementaryActive, elementaryGrades]);

  if (!result) return null;

  return (
    <div className="card card-pad grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-3.5">
        <h2 className="section-heading">Find your child&apos;s program</h2>
        <p className="small-text">
          Enter your child&apos;s date of birth and the year you are planning for. Placement follows your
          child&apos;s age on the eligibility date for that academic year — so two birthdays days apart can
          lead to different programs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="field">
            <label htmlFor={`${id}-dob`} className="field-label">
              Child&apos;s date of birth
            </label>
            <input
              id={`${id}-dob`}
              className="input"
              type="date"
              autoComplete="bday"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor={`${id}-year`} className="field-label">
              Academic year
            </label>
            <select
              id={`${id}-year`}
              className="input"
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
            >
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="meta-text">Our admissions team confirms every placement.</p>
      </div>
      <div className="panel-soft flex flex-col gap-2 items-start" aria-live="polite" data-finder-result={result.kind}>
        <p className="meta-text">{result.cutoffLine}</p>
        <p className="sub-heading font-serif font-semibold">{result.age}</p>
        <p className="meta-text">{result.label}</p>
        <p className="font-semibold text-green">{result.program}</p>
        <Link href={result.action.href} className="btn mt-1">
          {result.action.label}
        </Link>
      </div>
    </div>
  );
}
