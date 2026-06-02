import type { LifeEvent } from "@lifecalendar/shared";
import { useMemo, useRef, useState } from "react";
import { EVENT_COLOR_TEXT_CLASS, resolveEventIcon } from "./utils/eventIcons";
import { buildCalendarEventDisplayItems } from "./utils/calendarEventDisplay";
import type { VisualCalendarRow } from "./utils/visualCalendarRows";
import { PopoverSurface } from "../ui/primitives/PopoverSurface";

interface CalendarEventRailProps {
  row: VisualCalendarRow;
  showEventMarkers: boolean;
  onSelectEvent: (event: LifeEvent, anchor: { x: number; y: number }) => void;
}

export function CalendarEventRail({ row, showEventMarkers, onSelectEvent }: CalendarEventRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const displayItems = buildCalendarEventDisplayItems(row.events, row.recurringPreviewEvents, {
    isCurrentAgeYear: row.isCurrentAgeYear
  });
  const visible = displayItems.slice(0, 3);
  const compactHiddenCount = displayItems.length - visible.length;
  const upcomingItems = displayItems.filter((item) => item.isUpcomingPreview);
  const memoryItems = displayItems.filter((item) => !item.isUpcomingPreview);
  const maxItems = 6;
  const visibleUpcoming = upcomingItems.slice(0, maxItems);
  const remainingSlots = Math.max(0, maxItems - visibleUpcoming.length);
  const visibleMemories = memoryItems.slice(0, remainingSlots);
  const shownCount = visibleUpcoming.length + visibleMemories.length;
  const popoverHiddenCount = displayItems.length - shownCount;

  const railAnchor = useMemo(() => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: rect.left, y: rect.top + rect.height / 2 };
  }, [open]);

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 140);
  };

  if (!showEventMarkers || displayItems.length === 0) {
    return <div className="min-h-[var(--week-cell-size)] w-[var(--calendar-event-rail-width)] " />;
  }

  return (
    <div
      ref={railRef}
      className="calendar-event-rail min-h-[var(--week-cell-size)] w-[var(--calendar-event-rail-width)] border-l border-zinc-200/5 py-[1px] pl-2"
      onMouseEnter={() => {
        clearCloseTimer();
        setAnchorRect(anchorRef.current?.getBoundingClientRect() ?? null);
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => {
        clearCloseTimer();
        setAnchorRect(anchorRef.current?.getBoundingClientRect() ?? null);
        setOpen(true);
      }}
      onBlur={scheduleClose}
    >
      <div className="relative">
        <div
          ref={anchorRef}
          className={["calendar-event-rail-anchor inline-flex items-center gap-1.5 opacity-100 transition-opacity duration-150", open ? "opacity-55" : "opacity-100"].join(" ")}
        >
          {visible.map((item) => {
            const Icon = resolveEventIcon(item.category, item.iconKey);
            return (
              <span key={item.id} className={["inline-flex transition-opacity", item.isUpcomingPreview ? "opacity-55" : "opacity-65"].join(" ")}>
                <Icon size={11} weight="duotone" className={item.isUpcomingPreview ? "text-zinc-300/70" : (EVENT_COLOR_TEXT_CLASS[item.colorKey] ?? "text-zinc-300/75")} />
              </span>
            );
          })}
          {compactHiddenCount > 0 ? <span className="text-xs text-muted">+{compactHiddenCount}</span> : null}
        </div>
      </div>

      <PopoverSurface
        open={open}
        anchor={railAnchor}
        anchorRect={anchorRect}
        width={286}
        onClose={() => setOpen(false)}
        ariaLabel={`Year ${row.calendarYear} events`}
        className="max-w-[min(320px,calc(100vw-32px))] p-3"
        showArrow
        placement="left"
      >
        <div
          onMouseEnter={() => {
            clearCloseTimer();
            setOpen(true);
          }}
          onMouseLeave={scheduleClose}
          className="space-y-0.5"
        >
          <p className="mb-1 text-[11px] text-zinc-300/72">{`Age ${row.ageYear} · ${row.calendarYear}`}</p>

          {visibleUpcoming.length > 0 ? <p className="mb-1 text-[10px] uppercase tracking-[0.08em] text-zinc-400/66">Upcoming</p> : null}
          {visibleUpcoming.map((item, index) => {
            const Icon = resolveEventIcon(item.category, item.iconKey);
            return (
              <button
                key={`${item.id}:popover-upcoming`}
                type="button"
                data-event-rail-item="true"
                aria-label={item.tooltip}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent({ ...item.event, date: item.date }, { x: e.clientX, y: e.clientY });
                  setOpen(false);
                }}
                className="flex h-[20px] w-full items-center gap-1.5 text-left text-[11px] leading-none text-zinc-300/72 transition-all duration-150"
                style={{ transitionDelay: `${index * 20}ms`, transform: open ? "translateX(0px)" : "translateX(4px)", opacity: open ? 1 : 0 }}
              >
                <Icon size={11} weight="duotone" className="text-zinc-300/68" />
                <span className="w-10 shrink-0 text-zinc-400/72">{item.dateLabel}</span>
                <span className="truncate" title={item.tooltip}>{item.title}</span>
              </button>
            );
          })}

          {visibleMemories.length > 0 ? <p className="mb-1 mt-1 text-[10px] uppercase tracking-[0.08em] text-zinc-400/66">Memories</p> : null}
          {visibleMemories.map((item, index) => {
            const Icon = resolveEventIcon(item.category, item.iconKey);
            return (
              <button
                key={`${item.id}:popover-memory`}
                type="button"
                data-event-rail-item="true"
                aria-label={item.tooltip}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent({ ...item.event, date: item.date }, { x: e.clientX, y: e.clientY });
                  setOpen(false);
                }}
                className="flex h-[20px] w-full items-center gap-1.5 text-left text-[11px] leading-none text-zinc-200/85 transition-all duration-150"
                style={{
                  transitionDelay: `${(visibleUpcoming.length + index) * 20}ms`,
                  transform: open ? "translateX(0px)" : "translateX(4px)",
                  opacity: open ? 1 : 0
                }}
              >
                <Icon size={11} weight="duotone" className={EVENT_COLOR_TEXT_CLASS[item.colorKey] ?? "text-zinc-300/75"} />
                <span className="w-10 shrink-0 text-zinc-400/72">{item.dateLabel}</span>
                <span className="truncate" title={item.tooltip}>{item.title}</span>
              </button>
            );
          })}

          {popoverHiddenCount > 0 ? <span className="block text-[11px] text-zinc-400/70">+{popoverHiddenCount} more</span> : null}
        </div>
      </PopoverSurface>
    </div>
  );
}
