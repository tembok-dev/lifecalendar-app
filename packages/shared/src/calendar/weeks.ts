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
  const rawCurrentWeekIndex = diffFullWeeks(birthDate, now);
  const currentWeekIndex = Math.min(totalWeeks - 1, Math.max(0, rawCurrentWeekIndex));
  const completedWeeks = rawCurrentWeekIndex < 0 ? 0 : Math.min(totalWeeks, rawCurrentWeekIndex);
  const remainingWeeks = Math.max(0, totalWeeks - completedWeeks);
  const currentAgeYears = Math.max(0, diffFullYears(birthDate, now));

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