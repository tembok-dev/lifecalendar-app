import type { LifeEvent, Profile } from "../domain/models.js";

export type CalendarWeekStatus = "past" | "current" | "future";

export interface CalendarWeek {
  id: string;
  weekIndex: number;
  lifeYear: number;
  weekOfLifeYear: number;
  startDate: string;
  endDate: string;
  status: CalendarWeekStatus;
  events: LifeEvent[];
}

export interface CalendarSummary {
  birthDate: string;
  expectedLifespanYears: number;
  totalWeeks: number;
  currentWeekIndex: number;
  currentAgeYears: number;
  completedWeeks: number;
  remainingWeeks: number;
}

export interface LifeWeekRange {
  startDate: string;
  endDate: string;
}

export interface BuildCalendarInput {
  profile: Profile;
  events: LifeEvent[];
  now?: Date;
  fallbackLifespanYears?: number;
}

export interface BuiltCalendar {
  summary: CalendarSummary;
  weeks: CalendarWeek[];
}