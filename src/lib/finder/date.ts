/**
 * Calendar arithmetic on plain year/month/day values.
 *
 * No `Date` objects are used, so results are identical in every timezone and
 * unaffected by daylight-saving transitions.
 */

export interface CalendarDate {
  year: number;
  month: number; // 1–12
  day: number; // 1–31
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  const lengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return lengths[month - 1] ?? 0;
}

/** Parses a YYYY-MM-DD string into a real calendar date, or null. */
export function parseIsoDate(value: unknown): CalendarDate | null {
  if (typeof value !== "string") return null;
  const match = ISO_DATE.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1000 || month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function toIsoDate(date: CalendarDate): string {
  const mm = String(date.month).padStart(2, "0");
  const dd = String(date.day).padStart(2, "0");
  return `${date.year}-${mm}-${dd}`;
}

/** Negative when a is earlier than b, zero when equal, positive when later. */
export function compareDates(a: CalendarDate, b: CalendarDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day;
}

/**
 * Whole months completed between `from` and `to`. A month only counts once
 * the day-of-month has been reached, so a child born on the 15th has not
 * completed the month on the 14th. Never negative.
 */
export function completedMonths(from: CalendarDate, to: CalendarDate): number {
  let months = (to.year - from.year) * 12 + (to.month - from.month);
  if (to.day < from.day) months -= 1;
  return Math.max(0, months);
}

/** "18 months" below two years, otherwise whole years: "3 years". */
export function formatAge(months: number): string {
  if (months < 24) return `${months} ${months === 1 ? "month" : "months"}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "1 Sep 2026" — deterministic, locale-independent. */
export function formatDate(date: CalendarDate): string {
  return `${date.day} ${MONTHS[date.month - 1]} ${date.year}`;
}

/** Today's calendar date in the caller's local timezone. */
export function todayLocal(now: Date = new Date()): CalendarDate {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}
