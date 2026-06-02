import type { LifeEvent } from "@lifecalendar/shared";
import { memo } from "react";
import { CalendarCell } from "./CalendarCell";
import { CalendarEventRail } from "./CalendarEventRail";
import type { VisualCalendarRow } from "./utils/visualCalendarRows";
import { estimateDateFromRowClick } from "./utils/calendarInteraction";

interface CalendarYearRowProps {
  row: VisualCalendarRow;
  mode: "weeks" | "months";
  showYearMarkers: boolean;
  showEventMarkers: boolean;
  groupSize: number;
  currentLifeYear: number;
  gridWidth: string;
  stageTemplateColumns: string;
  birthDate: string;
  onSelectCell: (weekIndex: number, anchor: { x: number; y: number; defaultDate: string; contextLabel: string }, events?: LifeEvent[]) => void;
  onSelectEventFromRail: (row: VisualCalendarRow, event: LifeEvent, anchor: { x: number; y: number }) => void;
  onSelectRowAddDate: (anchor: { x: number; y: number; defaultDate: string; contextLabel: string }) => void;
  buildContextLabel: (startDate: string) => string;
}

function chunk<T>(items: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let i = 0; i < items.length; i += size) output.push(items.slice(i, i + size));
  return output;
}

export const CalendarYearRow = memo(function CalendarYearRow({
  row,
  mode,
  showYearMarkers,
  showEventMarkers,
  groupSize,
  currentLifeYear,
  gridWidth,
  stageTemplateColumns,
  birthDate,
  onSelectCell,
  onSelectEventFromRail,
  onSelectRowAddDate,
  buildContextLabel
}: CalendarYearRowProps) {
  const leftLabel = row.isCurrentAgeYear ? `${row.ageYear}y` : row.isDecade ? row.label : "";
  const rowSpacingClass = row.ageYear > 0 && row.isDecade ? "mt-[var(--calendar-decade-gap)]" : "mt-[var(--calendar-cell-gap)]";
  const currentRowClass = row.isCurrentAgeYear ? "calendar-year-row--current" : "";
  const groupedCells = chunk(row.cells, groupSize);

  return (
    <div
      data-life-year={row.ageYear}
      className={["calendar-year-row group/year-row grid items-center gap-2 transition-[padding] duration-200", rowSpacingClass, currentRowClass].join(" ")}
      style={{ gridTemplateColumns: stageTemplateColumns }}
    >
      <div className={["text-right text-xs transition-opacity duration-150", row.isCurrentAgeYear ? "calendar-current-age-label" : "text-muted"].join(" ")}>
        {showYearMarkers ? (
          row.isCurrentAgeYear ? (
            <span className="inline-flex items-center justify-end gap-1">
              <span>{leftLabel}</span>
              <span className="calendar-current-age-dot" aria-hidden />
            </span>
          ) : (
            leftLabel || <span className="opacity-0 group-hover/year-row:opacity-100">{row.label}</span>
          )
        ) : (
          ""
        )}
      </div>

      <div
        className=" group/rowgrid flex w-full hover:cursor-pointer"
        data-row-grid="true"
        style={{ gap: "var(--calendar-week-group-gap)", maxWidth: mode === "weeks" ? gridWidth : "none" }}
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("[data-event-cell='true']") || target.closest("[data-event-rail-item='true']") || target.closest("[data-row-add='true']")) {
            return;
          }
          const gridRect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
          const defaultDate = estimateDateFromRowClick({
            calendarYear: row.calendarYear,
            mode,
            x: event.clientX,
            rowRect: gridRect,
            totalSlots: row.cells.length,
            birthDate
          });
          onSelectRowAddDate({
            x: event.clientX,
            y: event.clientY,
            defaultDate,
            contextLabel: buildContextLabel(defaultDate)
          });
        }}
      >
        {mode === "months" ? (
          <div className="grid w-full min-w-0" style={{ gap: "var(--calendar-month-group-gap)", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {chunk(row.cells, 3).map((quarter, quarterIndex) => (
              <div
                key={`${row.ageYear}-q${quarterIndex}`}
                className="grid min-w-0"
                style={{ gap: "var(--calendar-month-cell-gap)", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
              >
                {quarter.map((cell) => (
                  <CalendarCell
                    key={cell.cellKey}
                    cell={cell}
                    currentLifeYear={currentLifeYear}
                    contextLabel={buildContextLabel(cell.startDate)}
                    onSelect={onSelectCell}
                    mode={mode}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          groupedCells.map((cellGroup, groupIndex) => (
            <div
              key={`${row.ageYear}-g${groupIndex}`}
              className="grid"
              style={{
                gap: "var(--calendar-cell-gap)",
                gridTemplateColumns: `repeat(${groupSize}, var(--calendar-cell-width,var(--week-cell-size)))`
              }}
            >
              {cellGroup.map((cell) => (
                <CalendarCell
                  key={cell.cellKey}
                  cell={cell}
                  currentLifeYear={currentLifeYear}
                  contextLabel={buildContextLabel(cell.startDate)}
                  onSelect={onSelectCell}
                  mode={mode}
                />
              ))}
            </div>
          ))
        )}

      </div>

      <div className="flex items-center justify-center">
        <button
          type="button"
          data-row-add="true"
          aria-label={`Add event in year ${row.calendarYear}`}
          className="flex h-5 w-5 items-center justify-center rounded-full text-[14px] leading-none text-zinc-300/35 opacity-0 transition-all duration-150 group-hover/year-row:opacity-100 hover:bg-zinc-100/10 hover:text-zinc-100"
          onClick={(event) => {
            event.stopPropagation();
            onSelectRowAddDate({
              x: event.clientX,
              y: event.clientY,
              defaultDate: row.firstActiveDate,
              contextLabel: buildContextLabel(row.firstActiveDate)
            });
          }}
        >
          +
        </button>
      </div>

      <CalendarEventRail row={row} showEventMarkers={showEventMarkers} onSelectEvent={(event, anchor) => onSelectEventFromRail(row, event, anchor)} />
    </div>
  );
});
