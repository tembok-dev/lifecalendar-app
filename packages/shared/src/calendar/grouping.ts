import type { CalendarWeek } from "./types.js";

export function groupWeeksByLifeYear(weeks: CalendarWeek[]): Record<number, CalendarWeek[]> {
  return weeks.reduce<Record<number, CalendarWeek[]>>((acc, week) => {
    const existing = acc[week.lifeYear];
    if (!existing) {
      acc[week.lifeYear] = [week];
      return acc;
    }
    existing.push(week);
    return acc;
  }, {});
}
