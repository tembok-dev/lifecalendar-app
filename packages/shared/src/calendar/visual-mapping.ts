import { parseIsoDate, startOfUtcDay } from "./dates.js";

export type VisualSlotStatus = "pre-birth" | "past" | "current" | "future";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

function getUtcDayOfYear(date: Date): number {
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  const current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - yearStart) / MS_PER_DAY);
}

export function getCalendarYearWeekSlot(dateIso: string): number {
  const date = parseIsoDate(dateIso);
  return Math.min(51, Math.floor(getUtcDayOfYear(date) / 7));
}

export function getCalendarYearMonthSlot(dateIso: string): number {
  const date = parseIsoDate(dateIso);
  return date.getUTCMonth();
}

export function getCalendarYearRowFromBirth(birthDateIso: string, targetDateIso: string): number {
  const birthDate = parseIsoDate(birthDateIso);
  const targetDate = parseIsoDate(targetDateIso);
  return targetDate.getUTCFullYear() - birthDate.getUTCFullYear();
}

export function getWeekSlotRange(calendarYear: number, weekSlot: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(calendarYear, 0, 1 + weekSlot * 7, 0, 0, 0, 0));
  const end = new Date(start.getTime() + MS_PER_WEEK);
  return { start, end };
}

export function resolveVisualSlotStatus(input: {
  slotStart: Date;
  slotEnd: Date;
  birthDateIso: string;
  now?: Date;
}): VisualSlotStatus {
  const birthDate = parseIsoDate(input.birthDateIso);
  const now = startOfUtcDay(input.now ?? new Date());

  if (input.slotEnd.getTime() <= birthDate.getTime()) {
    return "pre-birth";
  }
  if (now.getTime() >= input.slotStart.getTime() && now.getTime() < input.slotEnd.getTime()) {
    return "current";
  }
  if (input.slotEnd.getTime() <= now.getTime()) {
    return "past";
  }
  return "future";
}

