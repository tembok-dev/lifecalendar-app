import { useEffect, useMemo, useRef, useState } from "react";
import type { GetProfileCalendarResponse, LifeEvent } from "@lifecalendar/shared";
import { CalendarLegend } from "./CalendarLegend";
import { LifeCalendarGrid } from "./LifeCalendarGrid";
import { WeekPopover } from "./WeekPopover";
import { usePosterLayout } from "./hooks/usePosterLayout";
import { useCalendarZoom } from "./hooks/useCalendarZoom";
import { CalendarViewport } from "./composition/CalendarViewport";
import { CalendarStage } from "./composition/CalendarStage";
import { PosterTopRail } from "./composition/PosterTopRail";
import { ReflectionSpace } from "./composition/ReflectionSpace";
import { EventQuickAddPopover } from "./events/EventQuickAddPopover";
import { SettingsModal } from "../settings/SettingsModal";
import type { CalendarDisplayMode } from "./LifeCalendarGrid";
import type { CalendarScaleMode } from "./hooks/useCalendarZoom";
import { PopoverSurface } from "../ui/primitives/PopoverSurface";
import { resolveCalendarDisplayMode } from "./utils/resolveCalendarDisplayMode";

interface LifeCalendarCanvasProps {
  calendar: GetProfileCalendarResponse;
  onCreateEvent: (input: {
    category: LifeEvent["category"];
    title: string;
    date: string;
    note: string | null;
    isPrivate: boolean;
    showOnExport: boolean;
    isRecurring: boolean;
    recurrenceType: "yearly" | null;
  }) => Promise<void>;
  onUpdateEvent: (
    eventId: string,
    input: {
      category?: LifeEvent["category"];
      title?: string;
      date?: string;
      note?: string | null;
      isPrivate?: boolean;
      showOnExport?: boolean;
      isRecurring?: boolean;
      recurrenceType?: "yearly" | null;
    }
  ) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
  onUpdateProfile: (input: { name?: string; birthDate?: string; expectedLifespanYears?: number | null }) => Promise<void>;
  onUpdateSettings: (input: {
    showYearMarkers?: boolean;
    showEventIcons?: boolean;
  }) => Promise<void>;
  onReload: () => Promise<void>;
}

const DISPLAY_MODE_KEY = "lifecalendar.displayMode";
const SCALE_MODE_KEY = "lifecalendar.scaleMode";

export function LifeCalendarCanvas({
  calendar,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onUpdateProfile,
  onUpdateSettings,
  onReload
}: LifeCalendarCanvasProps) {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number | null>(calendar.summary.currentWeekIndex);
  const [selectedAnchor, setSelectedAnchor] = useState<{ x: number; y: number; defaultDate: string; contextLabel: string } | null>(null);
  const [selectedEventsOverride, setSelectedEventsOverride] = useState<LifeEvent[] | null>(null);
  const [legendAnchor, setLegendAnchor] = useState<{ x: number; y: number } | null>(null);
  const [eventModalState, setEventModalState] = useState<{
    mode: "create" | "edit";
    anchor: { x: number; y: number } | null;
    defaultDate: string | null;
    contextLabel: string | null;
    initialEvent: LifeEvent | null;
  } | null>(null);
  const [eventModalSaving, setEventModalSaving] = useState(false);
  const [eventModalDeleting, setEventModalDeleting] = useState(false);
  const [eventModalError, setEventModalError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [displayMode, setDisplayMode] = useState<CalendarDisplayMode>(() => {
    const stored = localStorage.getItem(DISPLAY_MODE_KEY);
    return stored === "weeks" || stored === "months" || stored === "auto" ? stored : "auto";
  });
  const [defaultScaleMode, setDefaultScaleMode] = useState<CalendarScaleMode>(() => {
    const stored = localStorage.getItem(SCALE_MODE_KEY);
    return stored === "contain" || stored === "fit-width" ? stored : "fit-width";
  });

  const centeredOnceRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageContentRef = useRef<HTMLDivElement>(null);

  const layoutMode = usePosterLayout();

  const zoom = useCalendarZoom({
    mode: defaultScaleMode,
    viewportWidth: viewportSize.width,
    viewportHeight: viewportSize.height,
    stageWidth: stageSize.width,
    stageHeight: stageSize.height
  });

  useEffect(() => {
    localStorage.setItem(DISPLAY_MODE_KEY, displayMode);
  }, [displayMode]);

  useEffect(() => {
    localStorage.setItem(SCALE_MODE_KEY, defaultScaleMode);
  }, [defaultScaleMode]);

  const selectedWeek = useMemo(() => {
    if (selectedWeekIndex === null) {
      return null;
    }
    return calendar.weeks.find((week) => week.weekIndex === selectedWeekIndex) ?? null;
  }, [calendar.weeks, selectedWeekIndex]);

  const hasAnyEvents = useMemo(() => calendar.weeks.some((week) => week.events.length > 0), [calendar.weeks]);
  const upcomingCount = useMemo(() => {
    const now = Date.now();
    return calendar.weeks.reduce((total, week) => {
      const upcomingInWeek = week.events.filter((event) => Number.isFinite(Date.parse(event.date)) && Date.parse(event.date) >= now).length;
      return total + upcomingInWeek;
    }, 0);
  }, [calendar.weeks]);

  useEffect(() => {
    const updateViewport = () => {
      const viewport = viewportRef.current;
      if (!viewport) {
        return;
      }
      setViewportSize({ width: viewport.clientWidth, height: viewport.clientHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const stage = stageContentRef.current;
    if (!stage) {
      return;
    }

    const updateStage = () => {
      setStageSize({ width: stage.scrollWidth, height: stage.scrollHeight });
    };

    updateStage();

    const observer = new ResizeObserver(updateStage);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [calendar.weeks.length]);

  useEffect(() => {
    if (centeredOnceRef.current || zoom.mode !== "fit-width") {
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const currentLifeYear = Math.floor(calendar.summary.currentWeekIndex / 52);
    const row = viewport.querySelector<HTMLElement>(`[data-life-year='${currentLifeYear}']`);
    if (!row) {
      return;
    }

    requestAnimationFrame(() => {
      const scaledRowTop = row.offsetTop * zoom.scale;
      const scaledRowHeight = row.clientHeight * zoom.scale;
      const target = scaledRowTop - viewport.clientHeight / 2 + scaledRowHeight / 2;
      viewport.scrollTo({ top: Math.max(0, target), behavior: "auto" });
      centeredOnceRef.current = true;
    });
  }, [calendar.summary.currentWeekIndex, zoom.mode, zoom.scale]);

  useEffect(() => {
    if (zoom.mode !== "contain") {
      return;
    }
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    viewport.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [zoom.mode]);

  const scaledStageWidth = stageSize.width * zoom.scale;
  const centerStage = scaledStageWidth < viewportSize.width && zoom.mode === "contain";
  const effectiveMode = resolveCalendarDisplayMode(displayMode, viewportSize.width);

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-[12] h-[var(--poster-fade-height)] bg-[rgba(18,23,29,0.62)] backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_38%,transparent_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-[12] h-[calc(var(--poster-fade-height)*0.55)] bg-[rgba(18,23,29,0.35)] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto min-h-screen w-full max-w-[var(--poster-max-width)] px-[var(--poster-page-padding-x)] pb-10 pt-2 sm:px-9">
        <PosterTopRail
          profile={calendar.profile}
          completedWeeks={calendar.summary.completedWeeks}
          totalWeeks={calendar.summary.totalWeeks}
          currentAgeYears={calendar.summary.currentAgeYears}
          upcomingCount={upcomingCount}
          mode={zoom.mode}
          onToggleMode={zoom.toggleMode}
          onToggleInfo={(anchor) => setLegendAnchor((current) => (current ? null : anchor))}
          onQuickAdd={(anchor) => {
            requestAnimationFrame(() => {
              setEventModalState({
                mode: "create",
                anchor,
                defaultDate: new Date().toISOString(),
                contextLabel: `Today • ${new Date().toLocaleDateString()}`,
                initialEvent: null
              });
            });
            setEventModalError(null);
          }}
          onOpenSettings={() => setSettingsOpen(true)}
          showAddHint={!hasAnyEvents}
        />

        <main className={layoutMode === "horizontal" ? "grid grid-cols-[60%_40%] items-start" : "block"}>
          <CalendarViewport viewportRef={viewportRef} centerStage={centerStage}>
            <CalendarStage scale={zoom.scale} contentRef={stageContentRef} fitContent={effectiveMode !== "months"}>
              <LifeCalendarGrid
                weeks={calendar.weeks}
                currentWeekIndex={calendar.summary.currentWeekIndex}
                currentAgeYears={calendar.summary.currentAgeYears}
                displayMode={displayMode}
                effectiveMode={effectiveMode}
                initialDisplayMode={displayMode}
                showYearMarkers={calendar.settings.showYearMarkers}
                showEventMarkers={calendar.settings.showEventIcons}
                onDisplayModeChange={setDisplayMode}
                onSelectWeek={(weekIndex, anchor, events) => {
                  if (events?.length === 1) {
                    const event = events[0];
                    if (!event) {
                      return;
                    }
                    setSelectedAnchor(null);
                    setSelectedEventsOverride(null);
                    setEventModalError(null);
                    setEventModalState({
                      mode: "edit",
                      anchor: null,
                      defaultDate: event.date,
                      contextLabel: anchor.contextLabel,
                      initialEvent: event
                    });
                    return;
                  }
                  setSelectedWeekIndex(weekIndex);
                  setSelectedAnchor(anchor);
                  setSelectedEventsOverride(events ?? null);
                }}
                onSelectRowDate={(anchor) => {
                  requestAnimationFrame(() => {
                    setEventModalState({
                      mode: "create",
                      anchor: { x: anchor.x, y: anchor.y },
                      defaultDate: anchor.defaultDate,
                      contextLabel: anchor.contextLabel,
                      initialEvent: null
                    });
                  });
                  setEventModalError(null);
                }}
                onRequestEditEvent={(event, contextLabel) => {
                  setEventModalError(null);
                  setEventModalState({
                    mode: "edit",
                    anchor: null,
                    defaultDate: event.date,
                    contextLabel,
                    initialEvent: event
                  });
                }}
              />
            </CalendarStage>
          </CalendarViewport>

          {layoutMode === "horizontal" ? <ReflectionSpace selectedWeek={selectedWeek} /> : null}
        </main>
      </div>

      <PopoverSurface
        open={Boolean(legendAnchor)}
        anchor={legendAnchor}
        width={276}
        onClose={() => setLegendAnchor(null)}
        ariaLabel="Calendar legend"
        showArrow={false}
      >
        <CalendarLegend />
      </PopoverSurface>

      <WeekPopover
        week={selectedWeek}
        eventsOverride={selectedEventsOverride}
        anchor={selectedAnchor}
        onClose={() => {
          setSelectedAnchor(null);
          setSelectedEventsOverride(null);
        }}
        onRequestCreate={({ defaultDate, contextLabel }) => {
          setSelectedAnchor(null);
          setSelectedEventsOverride(null);
          setEventModalError(null);
          setEventModalState({
            mode: "create",
            anchor: null,
            defaultDate,
            contextLabel,
            initialEvent: null
          });
        }}
        onRequestEdit={(event, contextLabel) => {
          setSelectedAnchor(null);
          setSelectedEventsOverride(null);
          setEventModalError(null);
          setEventModalState({
            mode: "edit",
            anchor: null,
            defaultDate: event.date,
            contextLabel,
            initialEvent: event
          });
        }}
      />

      <EventQuickAddPopover
        open={Boolean(eventModalState)}
        anchor={eventModalState?.anchor ?? undefined}
        mode={eventModalState?.mode ?? "create"}
        defaultDate={eventModalState?.defaultDate ?? undefined}
        contextLabel={eventModalState?.contextLabel ?? undefined}
        initialEvent={eventModalState?.initialEvent ?? undefined}
        saving={eventModalSaving}
        deleting={eventModalDeleting}
        error={eventModalError}
        onClose={() => {
          setEventModalState(null);
          setEventModalError(null);
        }}
        onSubmit={async (input) => {
          setEventModalSaving(true);
          setEventModalError(null);
          try {
            if (eventModalState?.mode === "edit" && eventModalState.initialEvent) {
              await onUpdateEvent(eventModalState.initialEvent.id, input);
            } else {
              await onCreateEvent(input);
            }
          } catch (err) {
            setEventModalError(err instanceof Error ? err.message : "Unable to save event");
            throw err;
          } finally {
            setEventModalSaving(false);
          }
        }}
        onDelete={async (eventId) => {
          setEventModalDeleting(true);
          setEventModalError(null);
          try {
            await onDeleteEvent(eventId);
          } catch (err) {
            setEventModalError(err instanceof Error ? err.message : "Unable to delete event");
            throw err;
          } finally {
            setEventModalDeleting(false);
          }
        }}
      />

      <SettingsModal
        open={settingsOpen}
        profile={calendar.profile}
        settings={calendar.settings}
        displayMode={displayMode}
        scaleMode={defaultScaleMode}
        onClose={() => setSettingsOpen(false)}
        onReload={onReload}
        onSave={async ({ profile, view }) => {
          await onUpdateProfile(profile);
          await onUpdateSettings({
            showYearMarkers: view.showYearMarkers,
            showEventIcons: view.showEventMarkers
          });
          setDisplayMode(view.displayMode);
          setDefaultScaleMode(view.scaleMode);
          zoom.setMode(view.scaleMode);
        }}
      />
    </>
  );
}
