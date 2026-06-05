import { ArrowRight, CalendarDays, LucideArrowLeft, Scan } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CalendarWeek, LifeEvent } from "@lifecalendar/shared";
import type { CSSProperties } from "react";
import { CalendarStage } from "./CalendarStage";
import { EventListItem } from "./events/EventListItem";
import { formatEventDate } from "./events/eventListFormatting";
import { buildContextLabel, buildVisualCalendarRows, type VisualCalendarRow } from "./utils/visualCalendarRows";
import { resolveCalendarDisplayMode, type CalendarEffectiveMode } from "./utils/resolveCalendarDisplayMode";
import { ModalBody } from "../ui/primitives/ModalBody";
import { ModalFooter } from "../ui/primitives/ModalFooter";
import { ModalHeader } from "../ui/primitives/ModalHeader";
import { ModalSurface } from "../ui/primitives/ModalSurface";
import type { CalendarScaleMode } from "./hooks/useCalendarZoom";

export type CalendarDisplayMode = "auto" | "weeks" | "months";
export type CalendarStageAppearance = "normal" | "print";

interface LifeCalendarGridProps {
  weeks: CalendarWeek[];
  events: LifeEvent[];
  recurringPreviewEvents: LifeEvent[];
  currentWeekIndex: number;
  currentAgeYears: number;
  displayMode?: CalendarDisplayMode;
  stageAppearance?: CalendarStageAppearance;
  scaleMode?: CalendarScaleMode;
  effectiveMode?: CalendarEffectiveMode;
  initialDisplayMode?: CalendarDisplayMode;
  showYearMarkers?: boolean;
  showEventMarkers?: boolean;
  onDisplayModeChange?: (mode: CalendarDisplayMode) => void;
  onToggleScaleMode?: () => void;
  onSelectWeek: (weekIndex: number, anchor: { x: number; y: number; defaultDate: string; contextLabel: string }, events?: LifeEvent[]) => void;
  onSelectRowDate: (anchor: { x: number; y: number; defaultDate: string; contextLabel: string }) => void;
  onRequestEditEvent: (event: LifeEvent, contextLabel: string) => void;
}

export function LifeCalendarGrid({
  weeks,
  events,
  recurringPreviewEvents,
  currentWeekIndex,
  displayMode: forcedDisplayMode,
  stageAppearance = "normal",
  scaleMode = "fit-width",
  effectiveMode: parentEffectiveMode,
  initialDisplayMode = "auto",
  showYearMarkers = true,
  showEventMarkers = true,
  onDisplayModeChange,
  onToggleScaleMode,
  onSelectWeek,
  onSelectRowDate,
  onRequestEditEvent
}: LifeCalendarGridProps) {
  const WEEK_VIEW_RAIL_WIDTH = 136;
  const MONTH_VIEW_RAIL_WIDTH = 112;
  const rootRef = useRef<HTMLDivElement>(null);
  const [displayMode, setDisplayMode] = useState<CalendarDisplayMode>(forcedDisplayMode ?? initialDisplayMode);
  const [containerWidth, setContainerWidth] = useState(0);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);

  useEffect(() => {
    setDisplayMode(forcedDisplayMode ?? initialDisplayMode);
  }, [forcedDisplayMode, initialDisplayMode]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // displayMode is user preference (auto/weeks/months); effectiveMode controls rendered layout sizing.
  const effectiveMode = useMemo(
    () => parentEffectiveMode ?? resolveCalendarDisplayMode(displayMode, containerWidth),
    [parentEffectiveMode, displayMode, containerWidth]
  );

  const visualRows = useMemo(
    () =>
      buildVisualCalendarRows({
        weeks,
        events,
        recurringPreviewEvents,
        currentWeekIndex,
        mode: effectiveMode
      }),
    [weeks, events, recurringPreviewEvents, currentWeekIndex, effectiveMode]
  );

  const currentLifeYear = Math.floor(currentWeekIndex / 52);
  const colCount = effectiveMode === "weeks" ? 52 : 12;
  const birthDate = weeks[0]?.startDate ?? new Date().toISOString();
  const hideEventRail = containerWidth > 0 && effectiveMode === "weeks" && containerWidth < 820;
  const effectiveShowEventRail = showEventMarkers && !hideEventRail;
  const eventRailWidth = useMemo(() => {
    if (!effectiveShowEventRail) return 0;
    return effectiveMode === "months" ? MONTH_VIEW_RAIL_WIDTH : WEEK_VIEW_RAIL_WIDTH;
  }, [effectiveMode, effectiveShowEventRail]);

  const resolveWeekIndexFromEventDate = (row: VisualCalendarRow, eventDate: string): number | null => {
    const targetTime = new Date(eventDate).getTime();
    const matchedCell = row.cells.find((cell) => {
      const start = new Date(cell.startDate).getTime();
      const end = new Date(cell.endDate).getTime();
      return targetTime >= start && targetTime < end;
    });
    return matchedCell?.weekIndex ?? null;
  };

  const allEvents = useMemo(() => {
    const unique = new Map<string, LifeEvent>();
    for (const event of events) {
      unique.set(event.id, event);
    }
    return Array.from(unique.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [events]);

  const gridStyle = {
    "--calendar-cell-width": "13px",
    "--calendar-cell-gap": "2px",
    "--calendar-week-group-gap": "12px",
    "--calendar-row-add-gap-width": "20px",
    "--calendar-add-gap-width": "28px",
    "--calendar-month-cell-height": "18px",
    "--calendar-month-cell-max-width": "48px",
    "--calendar-month-cell-aspect": "2.2 / 1",
    "--calendar-month-cell-gap": "6px",
    "--calendar-month-group-gap": "18px",
    "--calendar-event-rail-width": `${eventRailWidth}px`
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-full py-[var(--poster-top-space)]"
      style={gridStyle}
    >
      <div className="*:absolute text-xs">
        <button
          type="button"
          aria-label={scaleMode === "fit-width" ? "Fit width" : "Contain"}
          onClick={() => onToggleScaleMode?.()}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-300/20 bg-[rgba(16,22,27,0.85)] text-[var(--text-muted)] transition hover:border-zinc-200/30 hover:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-200/70"
          style={{ top: 0, left: 12 }}
        >
          {scaleMode === "fit-width" ? <CalendarDays size={14} /> : <Scan size={14} />}
        </button>
        <label className="flex items-center gap-2 text-[var(--text-muted)]" style={{ top: 0, left: 52 }}>
          <span className="text-xs text-[var(--text-muted)]">View</span>
          <select
            value={displayMode}
            onChange={(event) => {
              const nextMode = event.target.value as CalendarDisplayMode;
              setDisplayMode(nextMode);
              onDisplayModeChange?.(nextMode);
            }}
            className="rounded-md border border-zinc-300/20 bg-[rgba(16,22,27,0.85)] px-2 py-1 text-xs text-[var(--text-secondary)] outline-none"
          >
            <option value="auto">Auto</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </label>
        <span className="flex items-center justify-center gap-3 text-[var(--text-muted)]" style={{ top: 104, left: -16, transform: "rotate(-90deg)" }}>
          <LucideArrowLeft size={14} className="text-[var(--text-muted)]" />
          Years
        </span>
      </div>

      <CalendarStage
        appearance={stageAppearance}
        mode={effectiveMode}
        rows={visualRows}
        colCount={colCount}
        currentLifeYear={currentLifeYear}
        birthDate={birthDate}
        showYearMarkers={showYearMarkers}
        showEventMarkers={effectiveShowEventRail}
        eventsCount={allEvents.length}
        onOpenEvents={() => setEventsModalOpen(true)}
        onSelectCell={onSelectWeek}
        onSelectRowAddDate={onSelectRowDate}
        onSelectEventFromRail={(row, event, anchor) => {
          const weekIndex = resolveWeekIndexFromEventDate(row, event.date);
          if (weekIndex === null) {
            return;
          }
          onSelectWeek(weekIndex, {
            x: anchor.x,
            y: anchor.y,
            defaultDate: event.date,
            contextLabel: buildContextLabel(event.date, effectiveMode)
          }, [event]);
        }}
        buildContextLabel={(startDate) => buildContextLabel(startDate, effectiveMode)}
      />

      <ModalSurface open={eventsModalOpen} onClose={() => setEventsModalOpen(false)} ariaLabel="All events" size="default">
        <ModalHeader
          title="Events"
          subtitle={`${allEvents.length} ${allEvents.length === 1 ? "memory" : "memories"}`}
          onClose={() => setEventsModalOpen(false)}
        />
        <ModalBody>
          {allEvents.length === 0 ? (
            <p className="text-xs text-muted">No moments yet.</p>
          ) : (
            <div className="space-y-2">
              {allEvents.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  onClick={(selected) => {
                    onRequestEditEvent(selected, formatEventDate(selected.date));
                  }}
                />
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            onClick={() => setEventsModalOpen(false)}
            className="ui-radius-pill border border-[var(--border-soft)] px-4 py-2 text-[12px] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            Close
          </button>
          <span className="ui-radius-pill bg-white/[0.05] px-3 py-1 text-[11px] text-[var(--text-muted)]">{allEvents.length} total</span>
        </ModalFooter>
      </ModalSurface>
    </div>
  );
}
