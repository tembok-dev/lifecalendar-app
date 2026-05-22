import type { LifeEvent } from "../domain/models.js";
import type { CalendarWeek } from "./types.js";

export function attachEventsToWeeks(weeks: CalendarWeek[], events: LifeEvent[]): CalendarWeek[] {
  const eventsByIndex = events.reduce<Record<number, LifeEvent[]>>((acc, event) => {
    if (!Number.isInteger(event.weekIndex) || event.weekIndex < 0) {
      return acc;
    }

    const existing = acc[event.weekIndex];
    if (!existing) {
      acc[event.weekIndex] = [event];
      return acc;
    }
    existing.push(event);
    return acc;
  }, {});

  return weeks.map((week) => ({
    ...week,
    events: eventsByIndex[week.weekIndex] ?? []
  }));
}
