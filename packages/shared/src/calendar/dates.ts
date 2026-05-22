export const WEEKS_PER_YEAR = 52;
export const DEFAULT_LIFESPAN_YEARS = 90;
export const MIN_LIFESPAN_YEARS = 1;
export const MAX_LIFESPAN_YEARS = 140;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function parseIsoDate(iso: string): Date {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid ISO date");
  }

  return startOfUtcDay(date);
}

export function clampLifespanYears(value: number | null | undefined, fallback = DEFAULT_LIFESPAN_YEARS): number {
  const candidate = Number.isFinite(value as number) ? Number(value) : fallback;
  const rounded = Math.round(candidate);
  return Math.min(MAX_LIFESPAN_YEARS, Math.max(MIN_LIFESPAN_YEARS, rounded));
}

export function addWeeks(date: Date, weeks: number): Date {
  return new Date(date.getTime() + weeks * MS_PER_WEEK);
}

export function diffFullWeeks(start: Date, end: Date): number {
  const distance = startOfUtcDay(end).getTime() - startOfUtcDay(start).getTime();
  return Math.floor(distance / MS_PER_WEEK);
}

export function diffFullYears(start: Date, end: Date): number {
  const startYear = start.getUTCFullYear();
  const endYear = end.getUTCFullYear();
  let years = endYear - startYear;

  const hasNotReachedBirthday =
    end.getUTCMonth() < start.getUTCMonth() ||
    (end.getUTCMonth() === start.getUTCMonth() && end.getUTCDate() < start.getUTCDate());

  if (hasNotReachedBirthday) {
    years -= 1;
  }

  return years;
}

export function toIsoDate(date: Date): string {
  return startOfUtcDay(date).toISOString();
}