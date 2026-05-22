import type { LifeEvent, Profile } from "../domain/models.js";
import { attachEventsToWeeks } from "./events.js";
import { groupWeeksByLifeYear } from "./grouping.js";
import { buildCalendarSummary, buildCalendarWeeks, getCurrentLifeWeekIndex, getLifeWeekRange, getWeekIndexFromDate } from "./weeks.js";
import type { BuildCalendarInput, BuiltCalendar, CalendarSummary, CalendarWeek, LifeWeekRange } from "./types.js";

export function buildLifeCalendar(input: BuildCalendarInput): BuiltCalendar {
  const summary = buildCalendarSummary({
    birthDate: input.profile.birthDate,
    expectedLifespanYears: input.profile.expectedLifespanYears,
    fallbackLifespanYears: input.fallbackLifespanYears,
    now: input.now
  });

  const weeks = buildCalendarWeeks({
    birthDate: summary.birthDate,
    totalWeeks: summary.totalWeeks,
    currentWeekIndex: summary.currentWeekIndex
  });

  return {
    summary,
    weeks: attachEventsToWeeks(weeks, input.events)
  };
}

export {
  attachEventsToWeeks,
  buildCalendarSummary,
  buildCalendarWeeks,
  getCurrentLifeWeekIndex,
  getLifeWeekRange,
  getWeekIndexFromDate,
  groupWeeksByLifeYear
};

export type { BuildCalendarInput, BuiltCalendar, CalendarSummary, CalendarWeek, LifeWeekRange, LifeEvent, Profile };