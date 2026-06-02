import type { CalendarDisplayMode } from "../LifeCalendarGrid";

export type CalendarEffectiveMode = "weeks" | "months";

export function resolveCalendarDisplayMode(displayMode: CalendarDisplayMode, availableWidth: number): CalendarEffectiveMode {
  if (displayMode === "weeks" || displayMode === "months") {
    return displayMode;
  }
  return availableWidth > 0 && availableWidth < 940 ? "months" : "weeks";
}

