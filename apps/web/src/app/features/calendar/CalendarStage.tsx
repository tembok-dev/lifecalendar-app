import type { LifeEvent } from "@lifecalendar/shared";
import { CalendarAxisLabels } from "./CalendarAxisLabels";
import { CalendarYearRow } from "./CalendarYearRow";
import type { VisualCalendarRow } from "./utils/visualCalendarRows";

interface CalendarStageProps {
  mode: "weeks" | "months";
  rows: VisualCalendarRow[];
  colCount: number;
  currentLifeYear: number;
  birthDate: string;
  showYearMarkers: boolean;
  showEventMarkers: boolean;
  eventsCount: number;
  onOpenEvents: () => void;
  onSelectCell: (weekIndex: number, anchor: { x: number; y: number; defaultDate: string; contextLabel: string }, events?: LifeEvent[]) => void;
  onSelectEventFromRail: (row: VisualCalendarRow, event: LifeEvent, anchor: { x: number; y: number }) => void;
  onSelectRowAddDate: (anchor: { x: number; y: number; defaultDate: string; contextLabel: string }) => void;
  buildContextLabel: (startDate: string) => string;
}

export function CalendarStage({
  mode,
  rows,
  colCount,
  currentLifeYear,
  birthDate,
  showYearMarkers,
  showEventMarkers,
  eventsCount,
  onOpenEvents,
  onSelectCell,
  onSelectEventFromRail,
  onSelectRowAddDate,
  buildContextLabel
}: CalendarStageProps) {
  const groupCount = mode === "weeks" ? 13 : 4;
  const groupSize = mode === "weeks" ? 4 : 3;
  const gridWidth =
    mode === "months"
      ? "100%"
      : `calc((${colCount} * var(--calendar-cell-width,var(--week-cell-size))) + (${colCount - 1} * var(--calendar-cell-gap)) + (${groupCount - 1} * var(--calendar-week-group-gap)))`;
  const stageTemplateColumns =
    mode === "weeks"
      ? `var(--year-label-width) ${gridWidth} var(--calendar-row-add-gap-width) var(--calendar-event-rail-width)`
      : `var(--calendar-year-label-width) minmax(0,1fr) var(--calendar-add-gap-width) var(--calendar-event-rail-width)`;

  return (
    <div className={mode === "months" ? "w-full" : ""}>
      <CalendarAxisLabels
        mode={mode}
        colCount={colCount}
        gridWidth={gridWidth}
        groupSize={groupSize}
        stageTemplateColumns={stageTemplateColumns}
        eventsCount={eventsCount}
        onOpenEvents={onOpenEvents}
        showEventHeader={showEventMarkers}
      />
      {rows.map((row) => (
        <CalendarYearRow
          key={row.ageYear}
          row={row}
          mode={mode}
          showYearMarkers={showYearMarkers}
          showEventMarkers={showEventMarkers}
          groupSize={groupSize}
          currentLifeYear={currentLifeYear}
          gridWidth={gridWidth}
          stageTemplateColumns={stageTemplateColumns}
          birthDate={birthDate}
          onSelectCell={onSelectCell}
          onSelectEventFromRail={onSelectEventFromRail}
          onSelectRowAddDate={onSelectRowAddDate}
          buildContextLabel={buildContextLabel}
        />
      ))}
    </div>
  );
}
