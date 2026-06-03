import type { LifeEvent, Profile } from "../domain/models.js";
import { attachEventsToWeeks } from "./events.js";
import { buildRecurringPreviewEvents, getYearlyOccurrenceDate, isOccurrenceAfterToday } from "./recurrence.js";
import { groupWeeksByLifeYear } from "./grouping.js";
import {
  getCalendarYearMonthSlot,
  getCalendarYearRowFromBirth,
  getCalendarYearWeekSlot,
  getWeekSlotRange,
  resolveVisualSlotStatus
} from "./visual-mapping.js";
import { buildCalendarSummary, buildCalendarWeeks, getCurrentLifeWeekIndex, getLifeWeekRange, getWeekIndexFromDate } from "./weeks.js";
import type { BuildCalendarInput, BuiltCalendar, CalendarDerivedData, CalendarSummary, CalendarWeek, LifeWeekRange } from "./types.js";

function sortEventsAsc(events: LifeEvent[]): LifeEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
}

function uniqueEventsById(events: LifeEvent[]): LifeEvent[] {
  return Array.from(new Map(events.map((event) => [event.id, event])).values());
}

function getInRangeEvents(weeks: CalendarWeek[]): LifeEvent[] {
  const attached = weeks.flatMap((week) => week.events);
  return sortEventsAsc(uniqueEventsById(attached));
}

function buildCalendarDerivedData(events: LifeEvent[], weeks: CalendarWeek[], now: Date): CalendarDerivedData {
  const currentCalendarYear = now.getUTCFullYear();
  const sortedEvents = sortEventsAsc(events);
  const inRangeEvents = getInRangeEvents(weeks);
  const currentYearEvents = sortedEvents.filter((event) => new Date(event.date).getUTCFullYear() === currentCalendarYear);
  const currentYearUpcomingRecurringEvents = buildRecurringPreviewEvents(sortedEvents, now);

  return {
    currentCalendarYear,
    inRangeEvents,
    currentYearEvents,
    currentYearUpcomingRecurringEvents
  };
}

export function buildLifeCalendar(input: BuildCalendarInput): BuiltCalendar {
  const now = input.now ?? new Date();
  const summary = buildCalendarSummary({
    birthDate: input.profile.birthDate,
    expectedLifespanYears: input.profile.expectedLifespanYears,
    fallbackLifespanYears: input.fallbackLifespanYears,
    now
  });

  const weeks = buildCalendarWeeks({
    birthDate: summary.birthDate,
    totalWeeks: summary.totalWeeks,
    currentWeekIndex: summary.currentWeekIndex
  });
  const sortedEvents = sortEventsAsc(input.events);
  const attachedWeeks = attachEventsToWeeks(weeks, sortedEvents);

  return {
    summary,
    weeks: attachedWeeks,
    events: sortedEvents,
    derived: buildCalendarDerivedData(sortedEvents, attachedWeeks, now)
  };
}

export {
  attachEventsToWeeks,
  buildCalendarSummary,
  buildCalendarWeeks,
  getCurrentLifeWeekIndex,
  getCalendarYearMonthSlot,
  getCalendarYearRowFromBirth,
  getCalendarYearWeekSlot,
  getLifeWeekRange,
  getWeekSlotRange,
  getWeekIndexFromDate,
  groupWeeksByLifeYear,
  resolveVisualSlotStatus,
  buildRecurringPreviewEvents,
  getYearlyOccurrenceDate,
  isOccurrenceAfterToday
};

export type { BuildCalendarInput, BuiltCalendar, CalendarDerivedData, CalendarSummary, CalendarWeek, LifeWeekRange, LifeEvent, Profile };
