import { ArrowRight, LucideArrowLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CalendarWeek, LifeEvent } from "@lifecalendar/shared";
import type { CSSProperties } from "react";
import { CalendarStage } from "./CalendarStage";
import { buildContextLabel, buildVisualCalendarRows, type VisualCalendarRow } from "./utils/visualCalendarRows";
import { resolveCalendarDisplayMode, type CalendarEffectiveMode } from "./utils/resolveCalendarDisplayMode";
import { ModalSurface } from "../ui/primitives/ModalSurface";

export type CalendarDisplayMode = "auto" | "weeks" | "months";

interface LifeCalendarGridProps {
  weeks: CalendarWeek[];
  currentWeekIndex: number;
  currentAgeYears: number;
  displayMode?: CalendarDisplayMode;
  effectiveMode?: CalendarEffectiveMode;
  initialDisplayMode?: CalendarDisplayMode;
  showYearMarkers?: boolean;
  showEventMarkers?: boolean;
  onDisplayModeChange?: (mode: CalendarDisplayMode) => void;
  onSelectWeek: (weekIndex: number, anchor: { x: number; y: number; defaultDate: string; contextLabel: string }, events?: LifeEvent[]) => void;
  onSelectRowDate: (anchor: { x: number; y: number; defaultDate: string; contextLabel: string }) => void;
}

export function LifeCalendarGrid({
  weeks,
  currentWeekIndex,
  displayMode: forcedDisplayMode,
  effectiveMode: parentEffectiveMode,
  initialDisplayMode = "auto",
  showYearMarkers = true,
  showEventMarkers = true,
  onDisplayModeChange,
  onSelectWeek,
  onSelectRowDate
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
        currentWeekIndex,
        mode: effectiveMode
      }),
    [weeks, currentWeekIndex, effectiveMode]
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
    for (const week of weeks) {
      for (const event of week.events) {
        unique.set(event.id, event);
      }
    }
    return Array.from(unique.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [weeks]);

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
        <label className="flex items-center gap-2 text-muted" style={{ top: 0, left: 52 }}>
          <span className="text-xs">View</span>
          <select
            value={displayMode}
            onChange={(event) => {
              const nextMode = event.target.value as CalendarDisplayMode;
              setDisplayMode(nextMode);
              onDisplayModeChange?.(nextMode);
            }}
            className="rounded-md border border-zinc-300/20 bg-[rgba(16,22,27,0.85)] px-2 py-1 text-xs text-zinc-200 outline-none"
          >
            <option value="auto">Auto</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
          <ArrowRight size={14}/>
        </label>
        <span className="flex items-center justify-center gap-3 text-muted" style={{ top: 104, left: -16, transform: "rotate(-90deg)" }}>
          <LucideArrowLeft size={14} />
          Years
        </span>
      </div>

      <CalendarStage
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

      <ModalSurface open={eventsModalOpen} onClose={() => setEventsModalOpen(false)} ariaLabel="All events">
        <div className="flex items-center justify-between">
          <p className="font-medium text-zinc-100">Events</p>
          <span className="rounded-full bg-zinc-200/12 px-2 py-[2px] text-xs text-zinc-200">{allEvents.length}</span>
        </div>
        <div className="mt-3 max-h-[56vh] space-y-1.5 overflow-y-auto pr-1">
          {allEvents.length === 0 ? (
            <p className="text-xs text-muted">No events yet.</p>
          ) : (
            allEvents.map((event) => (
              <div key={event.id} className="rounded-md border border-line/55 bg-zinc-900/22 px-2 py-1.5">
                <p className="text-[11px] font-medium text-zinc-100">{event.title}</p>
                <p className="mt-0.5 text-xs text-muted">{new Date(event.date).toISOString().slice(0, 10)}</p>
              </div>
            ))
          )}
        </div>
      </ModalSurface>
    </div>
  );
}
