import type { CalendarWeek } from "@lifecalendar/shared";
import { EVENT_COLOR_FILL_CLASS, resolveEventContrastIconClass, resolveEventFillClass, resolveEventIcon, resolveEventRingClass } from "./utils/eventIcons";

interface WeekCellProps {
  week: CalendarWeek;
  currentWeekIndex: number;
  currentLifeYear: number;
  selected: boolean;
  disabled?: boolean;
  preBirth?: boolean;
  onSelect: (weekIndex: number, anchor: { x: number; y: number; defaultDate: string; contextLabel: string }) => void;
  defaultDate: string;
  contextLabel: string;
}

export function WeekCell({
  week,
  currentWeekIndex,
  currentLifeYear,
  selected,
  disabled = false,
  preBirth = false,
  onSelect,
  defaultDate,
  contextLabel
}: WeekCellProps) {
  const events = week.events;
  const firstEvent = events[0];
  const secondEvent = events[1];
  const hasEvents = events.length > 0;

  const weekLifeYear = Math.floor(week.weekIndex / 52);
  const inCurrentLifeYear = weekLifeYear === currentLifeYear;
  const isAnticipation = hasEvents && week.status === "future" && inCurrentLifeYear;

  const statusClass =
    week.status === "past"
      ? "week-cell--past"
      : week.status === "current"
        ? "week-cell--current"
        : inCurrentLifeYear
          ? "week-cell--future-current-year"
          : "week-cell--future";

  const EventIcon = firstEvent ? resolveEventIcon(firstEvent.category, firstEvent.iconKey) : null;
  const eventFillClass = firstEvent ? resolveEventFillClass(firstEvent.category, firstEvent.colorKey) : "bg-zinc-400/28";
  const eventIconClass = firstEvent ? resolveEventContrastIconClass(firstEvent.category, firstEvent.colorKey) : "text-zinc-950";
  const anticipationRingClass = firstEvent ? resolveEventRingClass(firstEvent.category, firstEvent.colorKey) : "ring-zinc-300/45";

  // TODO(stage-5 recurrence): once recurrence fields exist, only show anticipation on upcoming recurring events
  // in current calendar year; render first occurrence only for past recurring entries.
  return (
    <button
      type="button"
      aria-label={`Week ${week.weekIndex + 1}`}
      disabled={disabled}
      onClick={(event) =>
        !disabled
          ? onSelect(week.weekIndex, {
              x: event.clientX,
              y: event.clientY,
              defaultDate,
              contextLabel
            })
          : undefined
      }
      className={[
        "relative flex h-[var(--week-cell-size)] w-[var(--week-cell-size)] items-center justify-center rounded-[3px] border transition duration-200",
        disabled
          ? "cursor-default opacity-0"
          : "hover:-translate-y-[1px] hover:brightness-[1.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-200/70",
        statusClass,
        hasEvents ? "border-transparent" : "",
        preBirth ? "week-cell--prebirth" : "",
        isAnticipation ? `week-cell--anticipation ring-1 ${anticipationRingClass}` : "",
        selected ? "ring-1 ring-zinc-200/80" : ""
      ].join(" ")}
    >
      {hasEvents ? <span className={["absolute inset-0 rounded-[3px]", eventFillClass, isAnticipation ? "opacity-38" : "opacity-92"].join(" ")} /> : null}

      {events.length === 1 && firstEvent && EventIcon ? (
        <EventIcon size={9} weight="fill" className={["relative z-[1]", eventIconClass].join(" ")} />
      ) : null}

      {events.length === 2 && firstEvent && secondEvent ? (
        <span className="absolute inset-[2px] z-[1] grid grid-cols-2 gap-[1px]">
          <span className={["rounded-[1px]", resolveEventFillClass(firstEvent.category, firstEvent.colorKey)].join(" ")} />
          <span className={["rounded-[1px]", resolveEventFillClass(secondEvent.category, secondEvent.colorKey)].join(" ")} />
        </span>
      ) : null}

      {events.length >= 3 ? (
        <span className="absolute inset-[2px] z-[1] flex items-center justify-center rounded-[1px] bg-zinc-900/85 text-[8px] font-semibold text-zinc-100">
          {events.length}
        </span>
      ) : null}
    </button>
  );
}
