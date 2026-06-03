import { buildRecurringPreviewEvents, getWeekIndexFromDate, type CalendarWeek, type LifeEvent } from "@lifecalendar/shared";

export type VisualCellStatus = "preBirth" | "past" | "current" | "future";

export interface VisualCalendarCell {
  cellKey: string;
  calendarYear: number;
  slotIndex: number;
  slotLabel: string;
  startDate: string;
  endDate: string;
  status: VisualCellStatus;
  events: LifeEvent[];
  recurringPreviewEvents: LifeEvent[];
  progressRatio?: number;
  weekIndex: number;
  lifeYear: number;
}

export interface VisualCalendarRow {
  calendarYear: number;
  ageYear: number;
  label: string;
  isCurrentAgeYear: boolean;
  isDecade: boolean;
  firstActiveDate: string;
  cells: VisualCalendarCell[];
  events: LifeEvent[];
  recurringPreviewEvents: LifeEvent[];
}

interface BuildVisualCalendarRowsInput {
  weeks: CalendarWeek[];
  events?: LifeEvent[];
  recurringPreviewEvents?: LifeEvent[];
  currentWeekIndex: number;
  mode: "weeks" | "months";
  now?: Date;
}

function getUtcStartOfDay(input: Date): Date {
  return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate(), 0, 0, 0, 0));
}

function getCalendarYearRange(weeks: CalendarWeek[]): { startYear: number; endYear: number } {
  const firstWeek = weeks[0];
  const lastWeek = weeks[weeks.length - 1];
  const startYear = new Date(firstWeek?.startDate ?? new Date().toISOString()).getUTCFullYear();
  const lastCoveredDay = new Date((lastWeek?.endDate ?? new Date().toISOString()));
  lastCoveredDay.setUTCDate(lastCoveredDay.getUTCDate() - 1);
  const endYear = lastCoveredDay.getUTCFullYear();
  return { startYear, endYear };
}

function uniqueEvents(weeks: CalendarWeek[]): LifeEvent[] {
  const byId = new Map<string, LifeEvent>();
  for (const week of weeks) {
    for (const event of week.events) {
      byId.set(event.id, event);
    }
  }
  return Array.from(byId.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function statusForRange(startTime: number, endTime: number, nowTime: number, birthTime: number): VisualCellStatus {
  if (endTime <= birthTime) {
    return "preBirth";
  }
  if (nowTime >= startTime && nowTime < endTime) {
    return "current";
  }
  if (endTime <= nowTime) {
    return "past";
  }
  return "future";
}

export function buildVisualCalendarRows({ weeks, events, recurringPreviewEvents, currentWeekIndex, mode, now: providedNow }: BuildVisualCalendarRowsInput): VisualCalendarRow[] {
  if (weeks.length === 0) {
    return [];
  }
  const firstWeek = weeks[0];
  if (!firstWeek) {
    return [];
  }

  const now = providedNow ?? new Date();
  const nowTime = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const birthDate = new Date(firstWeek.startDate);
  const birthYear = birthDate.getUTCFullYear();
  const birthTime = Date.UTC(birthDate.getUTCFullYear(), birthDate.getUTCMonth(), birthDate.getUTCDate());
  const currentAgeYear = Math.floor(currentWeekIndex / 52);

  const rows: VisualCalendarRow[] = [];
  const allEvents = (events && events.length > 0 ? [...events] : uniqueEvents(weeks)).sort((a, b) => a.date.localeCompare(b.date));
  const effectiveRecurringPreviewEvents =
    recurringPreviewEvents && recurringPreviewEvents.length > 0
      ? [...recurringPreviewEvents].sort((a, b) => a.date.localeCompare(b.date))
      : buildRecurringPreviewEvents(allEvents, now);
  const { startYear, endYear } = getCalendarYearRange(weeks);

  for (let calendarYear = startYear; calendarYear <= endYear; calendarYear += 1) {
    const ageYear = calendarYear - birthYear;
    const rowStart = new Date(Date.UTC(calendarYear, 0, 1, 0, 0, 0, 0));
    const rowEnd = new Date(Date.UTC(calendarYear + 1, 0, 1, 0, 0, 0, 0));
    const slots = mode === "weeks" ? 52 : 12;
    const slotCells: VisualCalendarCell[] = [];
    const rowEvents = allEvents
      .filter((event) => {
        const eventDate = new Date(event.date);
        const eventTime = Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
        return eventTime >= rowStart.getTime() && eventTime < rowEnd.getTime();
      })
      .sort((a, b) => a.date.localeCompare(b.date));
    const rowRecurringPreviewEvents = effectiveRecurringPreviewEvents
      .filter((event) => {
        const eventDate = new Date(event.date);
        const eventTime = Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
        return eventTime >= rowStart.getTime() && eventTime < rowEnd.getTime();
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    for (let slotIndex = 0; slotIndex < slots; slotIndex += 1) {
      const slotStart =
        mode === "weeks"
          ? new Date(Date.UTC(calendarYear, 0, 1 + slotIndex * 7, 0, 0, 0, 0))
          : new Date(Date.UTC(calendarYear, slotIndex, 1, 0, 0, 0, 0));
      const slotEnd =
        mode === "weeks"
          ? new Date(slotStart.getTime() + 7 * 24 * 60 * 60 * 1000)
          : new Date(Date.UTC(calendarYear, slotIndex + 1, 1, 0, 0, 0, 0));

      const slotStartTime = slotStart.getTime();
      const slotEndTime = slotEnd.getTime();
      const status = statusForRange(slotStartTime, slotEndTime, nowTime, birthTime);
      const progressRatio = status === "current" ? Math.max(0, Math.min(1, (nowTime - slotStartTime) / Math.max(1, slotEndTime - slotStartTime))) : undefined;
      const slotEvents = rowEvents
        .filter((event) => {
          const eventDate = new Date(event.date);
          const eventTime = Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
          return eventTime >= slotStartTime && eventTime < slotEndTime;
        })
        .sort((a, b) => a.date.localeCompare(b.date));
      const slotRecurringPreviews = rowRecurringPreviewEvents
        .filter((event) => {
          const eventDate = new Date(event.date);
          const eventTime = Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
          return eventTime >= slotStartTime && eventTime < slotEndTime;
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      const mappedWeekIndex = getWeekIndexFromDate(firstWeek.startDate, slotStart.toISOString());
      slotCells.push({
        cellKey: `${mode}-${calendarYear}-${slotIndex}`,
        calendarYear,
        slotIndex,
        slotLabel: mode === "weeks" ? `W${slotIndex + 1}` : slotStart.toLocaleString(undefined, { month: "short", timeZone: "UTC" }),
        startDate: slotStart.toISOString(),
        endDate: slotEnd.toISOString(),
        status,
        events: slotEvents,
        recurringPreviewEvents: slotRecurringPreviews,
        progressRatio,
        weekIndex: mappedWeekIndex,
        lifeYear: ageYear
      });
    }

    const firstActiveCell = slotCells.find((cell) => cell.status !== "preBirth");
    rows.push({
      calendarYear,
      ageYear,
      label: String(ageYear),
      isCurrentAgeYear: ageYear === currentAgeYear,
      isDecade: ageYear % 10 === 0,
      firstActiveDate: firstActiveCell?.startDate ?? rowStart.toISOString(),
      cells: slotCells,
      events: rowEvents,
      recurringPreviewEvents: rowRecurringPreviewEvents
    });
  }
  return rows;
}

export function buildContextLabel(startDate: string, mode: "weeks" | "months"): string {
  const date = new Date(startDate);
  if (mode === "months") {
    return date.toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone: "UTC" });
  }
  return `ISO Week ${getIsoWeekNumber(date)} of ${date.getUTCFullYear()}`;
}

export function getIsoWeekNumber(inputDate: Date): number {
  const date = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function verifyCalendarDateMapping(): { juneMonthIndex: number; isoWeek: number; julyStatusOnJune1: VisualCellStatus | undefined } {
  const now = new Date(Date.UTC(2026, 5, 1, 12, 0, 0));
  const juneMonthIndex = now.getUTCMonth();
  const isoWeek = getIsoWeekNumber(now);
  // July slot (index 6) on June 1, 2026 must be future.
  const julyStart = Date.UTC(2026, 6, 1, 0, 0, 0, 0);
  const augustStart = Date.UTC(2026, 7, 1, 0, 0, 0, 0);
  const julyStatusOnJune1 = statusForRange(julyStart, augustStart, now.getTime(), Date.UTC(1900, 0, 1));
  return { juneMonthIndex, isoWeek, julyStatusOnJune1 };
}
