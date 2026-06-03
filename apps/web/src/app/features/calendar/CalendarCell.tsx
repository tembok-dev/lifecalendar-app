import { memo } from "react";
import type { LifeEvent } from "@lifecalendar/shared";
import { resolveEventContrastIconClass, resolveEventFillClass, resolveEventIcon, resolveEventRingClass } from "./utils/eventIcons";
import { buildCalendarEventDisplayItems } from "./utils/calendarEventDisplay";
import type { VisualCalendarCell } from "./utils/visualCalendarRows";
import { Tooltip } from "../ui/primitives/TooltipSurface";

interface CalendarCellProps {
  cell: VisualCalendarCell;
  mode: "weeks" | "months";
  currentLifeYear: number;
  contextLabel: string;
  onSelect: (weekIndex: number, anchor: { x: number; y: number; defaultDate: string; contextLabel: string }, events?: LifeEvent[]) => void;
}

export const CalendarCell = memo(function CalendarCell({ cell, mode, currentLifeYear, contextLabel, onSelect }: CalendarCellProps) {
  const isPreBirth = cell.status === "preBirth";
  const hasEvents = cell.events.length > 0;
  const hasRecurringPreviews = cell.recurringPreviewEvents.length > 0;
  const displayItems = buildCalendarEventDisplayItems(cell.events, cell.recurringPreviewEvents);
  const totalItems = displayItems.length;
  const firstDisplayItem = displayItems[0];
  const secondDisplayItem = displayItems[1];
  const firstEvent = firstDisplayItem?.event;
  const inCurrentLifeYear = cell.lifeYear === currentLifeYear;
  const isAnticipation = hasEvents && cell.status === "future" && inCurrentLifeYear;

  const statusClass =
    cell.status === "past"
      ? "week-cell--past"
      : cell.status === "current"
        ? "week-cell--current"
        : inCurrentLifeYear
          ? "week-cell--future-current-year"
          : "week-cell--future";

  const EventIcon = firstDisplayItem ? resolveEventIcon(firstDisplayItem.category, firstDisplayItem.resolvedIconKey) : null;
  const SecondIcon = secondDisplayItem ? resolveEventIcon(secondDisplayItem.category, secondDisplayItem.resolvedIconKey) : null;
  const eventFillClass = firstEvent ? resolveEventFillClass(firstEvent.category, firstEvent.colorKey) : "bg-zinc-400/28";
  const eventIconClass = firstEvent ? resolveEventContrastIconClass(firstEvent.category, firstEvent.colorKey) : "text-zinc-950";
  const anticipationRingClass = firstEvent ? resolveEventRingClass(firstEvent.category, firstEvent.colorKey) : "ring-zinc-300/45";
  const tooltipContent =
    totalItems <= 1
      ? firstDisplayItem
        ? (
            <div className="space-y-0.5">
              <p className="text-[11px] text-[var(--text-primary)]">{firstDisplayItem.title}</p>
              <p className="text-[11px] text-[var(--text-muted)]">{firstDisplayItem.dateLabel}</p>
            </div>
          )
        : null
      : (
          <div className="space-y-0.5">
            {displayItems.slice(0, 2).map((item) => (
              <p key={`${item.id}:tooltip`} className="truncate text-[11px] text-[var(--text-primary)]">
                {item.displayTitle}
              </p>
            ))}
            {totalItems > 2 ? <p className="text-[11px] text-[var(--text-muted)]">+{totalItems - 2} more</p> : null}
          </div>
        );

  const baseClassName = [
    mode === "months"
      ? "relative flex h-[var(--calendar-month-cell-height)] w-full max-w-[var(--calendar-month-cell-max-width)] items-center justify-center rounded-[3px] border transition duration-150"
      : "relative flex h-[var(--week-cell-size)] w-[var(--calendar-cell-width,var(--week-cell-size))] items-center justify-center rounded-[3px] border transition duration-150",
    isPreBirth ? "cursor-default opacity-0" : "",
    statusClass,
    hasEvents ? "border-transparent" : "",
    isPreBirth ? "week-cell--prebirth" : "",
    isAnticipation ? `week-cell--anticipation ring-1 ${anticipationRingClass}` : "",
    cell.status === "current" ? "z-20 week-cell--current-strong" : "",
    ""
  ].join(" ");

  if (!hasEvents && !hasRecurringPreviews) {
    return <div className={baseClassName} aria-hidden data-cell-kind={isPreBirth ? "prebirth" : "empty"} />;
  }

  return (
    <Tooltip
      content={tooltipContent}
      disabled={!tooltipContent}
      className="inline-flex"
      tooltipClassName="max-w-[220px]"
      showArrow={false}
    >
      <button
        type="button"
        aria-label={firstDisplayItem?.tooltip ?? cell.slotLabel}
        data-event-cell="true"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(
            cell.weekIndex,
            { x: event.clientX, y: event.clientY, defaultDate: cell.startDate, contextLabel },
            [...cell.events, ...cell.recurringPreviewEvents]
          );
        }}
        className={[baseClassName, "group/cell z-20 cursor-pointer hover:z-20 hover:scale-[2.6] hover:shadow-[0_8px_18px_rgba(0,0,0,0.35)] focus-visible:z-20 focus-visible:scale-[2.6] focus-visible:outline-none"].join(" ")}
      >
        {cell.status === "current" && cell.progressRatio !== undefined ? (
          <span
            className="pointer-events-none absolute bottom-0 left-0 top-0 rounded-[3px] bg-[rgb(var(--calendar-current-color))] opacity-[var(--calendar-current-progress-opacity)]"
            style={{ width: `${Math.round(cell.progressRatio * 100)}%` }}
          />
        ) : null}
        {hasEvents ? (
          <span
            className={[
              "absolute inset-0 rounded-[3px]",
              eventFillClass,
              isAnticipation ? "opacity-26" : cell.status === "current" ? "opacity-44" : "opacity-84"
            ].join(" ")}
          />
        ) : null}
        {!hasEvents && hasRecurringPreviews ? <span className="absolute inset-0 rounded-[3px] week-cell--recurring-preview" /> : null}
        {totalItems === 1 && firstDisplayItem && EventIcon ? (
          <EventIcon
            size={9}
            weight="fill"
            className={["relative z-[1]", firstDisplayItem.isUpcomingPreview ? "text-zinc-200/72" : eventIconClass].join(" ")}
          />
        ) : null}
        {totalItems >= 2 ? (
          <span className="absolute inset-[2px] z-[1] flex items-center justify-center rounded-[1px] bg-zinc-900/85 text-[8px] font-semibold text-zinc-100">
            {totalItems}
          </span>
        ) : null}
        {totalItems >= 2 ? (
          <span className="pointer-events-none absolute inset-[1px] z-[2] flex items-center justify-center gap-[2px] opacity-0 transition-opacity duration-120 group-hover/cell:opacity-100 group-focus-visible/cell:opacity-100">
            {EventIcon ? <EventIcon size={8} weight="duotone" className={firstDisplayItem?.isUpcomingPreview ? "text-zinc-200/70" : "text-zinc-100"} /> : null}
            {SecondIcon ? <SecondIcon size={8} weight="duotone" className={secondDisplayItem?.isUpcomingPreview ? "text-zinc-200/68" : "text-zinc-100/90"} /> : null}
            {totalItems > 2 ? <span className="text-[7px] font-semibold text-zinc-100/90">+{totalItems - 2}</span> : null}
          </span>
        ) : null}
      </button>
    </Tooltip>
  );
});
