import type { LifeEvent } from "../domain/models.js";
import type { CalendarWeek, CalendarSummary, LifeWeekRange } from "./types.js";
import {
  addWeeks,
  clampLifespanYears,
  DEFAULT_LIFESPAN_YEARS,
  diffFullWeeks,
  diffFullYears,
  parseIsoDate,
  toIsoDate,
  WEEKS_PER_YEAR
} from "./dates.js";

export function getWeekIndexFromDate(birthDateIso: string, targetDateIso: string): number {
  const birthDate = parseIsoDate(birthDateIso);
  const targetDate = parseIsoDate(targetDateIso);
  return diffFullWeeks(birthDate, targetDate);
}

export function getCurrentLifeWeekIndex(birthDateIso: string, now = new Date()): number {
  const birthDate = parseIsoDate(birthDateIso);
  return diffFullWeeks(birthDate, now);
}

export function getLifeWeekRange(birthDateIso: string, weekIndex: number): LifeWeekRange {
  const birthDate = parseIsoDate(birthDateIso);
  const start = addWeeks(birthDate, weekIndex);
  const end = addWeeks(start, 1);

  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end)
  };
}

export function buildCalendarSummary(input: {
  birthDate: string;
  expectedLifespanYears?: number | null;
  fallbackLifespanYears?: number;
  now?: Date;
}): CalendarSummary {
  const birthDate = parseIsoDate(input.birthDate);
  const now = input.now ?? new Date();
  const expectedLifespanYears = clampLifespanYears(
    input.expectedLifespanYears,
    input.fallbackLifespanYears ?? DEFAULT_LIFESPAN_YEARS
  );

  const totalWeeks = expectedLifespanYears * WEEKS_PER_YEAR;
  const currentAgeYears = Math.max(0, diffFullYears(birthDate, now));
  const currentBirthday = new Date(
    Date.UTC(
      birthDate.getUTCFullYear() + currentAgeYears,
      birthDate.getUTCMonth(),
      birthDate.getUTCDate()
    )
  );
  const weeksSinceBirthday = Math.max(0, diffFullWeeks(currentBirthday, now));
  const currentWeekOfLifeYear = Math.min(WEEKS_PER_YEAR - 1, weeksSinceBirthday);
  const normalizedCurrentWeekIndex = currentAgeYears * WEEKS_PER_YEAR + currentWeekOfLifeYear;
  const currentWeekIndex = Math.min(totalWeeks - 1, Math.max(0, normalizedCurrentWeekIndex));
  const completedWeeks = Math.min(totalWeeks, currentWeekIndex);
  const remainingWeeks = Math.max(0, totalWeeks - completedWeeks);

  return {
    birthDate: toIsoDate(birthDate),
    expectedLifespanYears,
    totalWeeks,
    currentWeekIndex,
    currentAgeYears,
    completedWeeks,
    remainingWeeks
  };
}

export function buildCalendarWeeks(input: {
  birthDate: string;
  totalWeeks: number;
  currentWeekIndex: number;
}): CalendarWeek[] {
  const birthDate = parseIsoDate(input.birthDate);

  return Array.from({ length: input.totalWeeks }, (_, weekIndex) => {
    const start = addWeeks(birthDate, weekIndex);
    const end = addWeeks(start, 1);

    const status: CalendarWeek["status"] =
      weekIndex < input.currentWeekIndex ? "past" : weekIndex === input.currentWeekIndex ? "current" : "future";

    return {
      id: `week-${weekIndex}`,
      weekIndex,
      lifeYear: Math.floor(weekIndex / WEEKS_PER_YEAR),
      weekOfLifeYear: (weekIndex % WEEKS_PER_YEAR) + 1,
      startDate: toIsoDate(start),
      endDate: toIsoDate(end),
      status,
      events: [] as LifeEvent[]
    };
  });
}
