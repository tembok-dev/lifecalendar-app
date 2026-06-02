import { buildRecurringPreviewEvents, type CalendarWeek, type LifeEvent } from "@lifecalendar/shared";

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
  currentWeekIndex: number;
  mode: "weeks" | "months";
  now?: Date;
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

export function buildVisualCalendarRows({ weeks, currentWeekIndex, mode, now: providedNow }: BuildVisualCalendarRowsInput): VisualCalendarRow[] {
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

  const rowMap = new Map<number, CalendarWeek[]>();
  for (const week of weeks) {
    const bucket = rowMap.get(week.lifeYear);
    if (bucket) {
      bucket.push(week);
    } else {
      rowMap.set(week.lifeYear, [week]);
    }
  }

  const rows: VisualCalendarRow[] = [];
  const sortedAgeYears = Array.from(rowMap.keys()).sort((a, b) => a - b);
  const recurringPreviewEvents = buildRecurringPreviewEvents(
    weeks.flatMap((week) => week.events),
    now
  );
  const previewEventsByYear = new Map<number, LifeEvent[]>();
  for (const preview of recurringPreviewEvents) {
    const year = new Date(preview.date).getUTCFullYear();
    const bucket = previewEventsByYear.get(year);
    if (bucket) {
      bucket.push(preview);
    } else {
      previewEventsByYear.set(year, [preview]);
    }
  }

  for (const ageYear of sortedAgeYears) {
    const rowWeeks = [...(rowMap.get(ageYear) ?? [])].sort((a, b) => a.weekIndex - b.weekIndex);
    const calendarYear = birthYear + ageYear;
    const slots = mode === "weeks" ? 52 : 12;
    const slotCells: VisualCalendarCell[] = [];

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
      const slotEvents = rowWeeks
        .flatMap((week) => week.events)
        .filter((event) => {
          const eventDate = new Date(event.date);
          const eventTime = Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
          return eventTime >= slotStartTime && eventTime < slotEndTime;
        })
        .sort((a, b) => a.date.localeCompare(b.date));
      const slotRecurringPreviews = (previewEventsByYear.get(calendarYear) ?? [])
        .filter((event) => {
          const eventDate = new Date(event.date);
          const eventTime = Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
          return eventTime >= slotStartTime && eventTime < slotEndTime;
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      const fallbackWeek = rowWeeks[Math.min(slotIndex, Math.max(0, rowWeeks.length - 1))];
      const mappedWeekIndex = fallbackWeek?.weekIndex ?? ageYear * 52 + slotIndex;
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

    const rowEvents = rowWeeks
      .flatMap((week) => week.events)
      .filter((event) => new Date(event.date).getUTCFullYear() === calendarYear)
      .sort((a, b) => a.date.localeCompare(b.date));
    const rowRecurringPreviewEvents = (previewEventsByYear.get(calendarYear) ?? []).sort((a, b) => a.date.localeCompare(b.date));

    const firstActiveCell = slotCells.find((cell) => cell.status !== "preBirth");
    rows.push({
      calendarYear,
      ageYear,
      label: String(ageYear),
      isCurrentAgeYear: ageYear === currentAgeYear,
      isDecade: ageYear % 10 === 0,
      firstActiveDate: firstActiveCell?.startDate ?? birthDate.toISOString(),
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
    return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
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
