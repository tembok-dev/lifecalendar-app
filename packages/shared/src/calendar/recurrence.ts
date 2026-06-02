import type { LifeEvent } from "../domain/models.js";

function daysInUtcMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

export function getYearlyOccurrenceDate(eventDate: string, targetYear: number): string {
  const source = new Date(eventDate);
  const month = source.getUTCMonth();
  const day = Math.min(source.getUTCDate(), daysInUtcMonth(targetYear, month));
  return new Date(Date.UTC(targetYear, month, day, 0, 0, 0, 0)).toISOString();
}

export function isOccurrenceAfterToday(occurrenceIso: string, today: Date): boolean {
  const occurrence = new Date(occurrenceIso);
  const occTime = Date.UTC(occurrence.getUTCFullYear(), occurrence.getUTCMonth(), occurrence.getUTCDate());
  const todayTime = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return occTime > todayTime;
}

export function buildRecurringPreviewEvents(events: LifeEvent[], now: Date): LifeEvent[] {
  const currentYear = now.getUTCFullYear();
  const previews: LifeEvent[] = [];

  for (const event of events) {
    if (!event.isRecurring || event.recurrenceType !== "yearly") continue;
    if (new Date(event.date).getUTCFullYear() === currentYear) continue;

    const occurrenceDate = getYearlyOccurrenceDate(event.date, currentYear);
    if (!isOccurrenceAfterToday(occurrenceDate, now)) continue;

    previews.push({
      ...event,
      id: `recurring-preview:${event.id}:${currentYear}`,
      date: occurrenceDate
    });
  }

  return previews.sort((a, b) => a.date.localeCompare(b.date));
}
