import { useEffect, useMemo, useRef, useState } from "react";
import type { GetProfileCalendarResponse } from "@lifecalendar/shared";
import { CalendarLegend } from "./CalendarLegend";
import { LifeCalendarGrid } from "./LifeCalendarGrid";
import { WeekPopover } from "./WeekPopover";
import { usePosterLayout } from "./hooks/usePosterLayout";
import { useCalendarZoom } from "./hooks/useCalendarZoom";
import { CalendarViewport } from "./composition/CalendarViewport";
import { CalendarStage } from "./composition/CalendarStage";
import { PosterTopRail } from "./composition/PosterTopRail";
import { ReflectionSpace } from "./composition/ReflectionSpace";

interface LifeCalendarCanvasProps {
  calendar: GetProfileCalendarResponse;
}

export function LifeCalendarCanvas({ calendar }: LifeCalendarCanvasProps) {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number | null>(calendar.summary.currentWeekIndex);
  const [selectedAnchor, setSelectedAnchor] = useState<{ x: number; y: number } | null>(null);
  const [legendAnchor, setLegendAnchor] = useState<{ x: number; y: number } | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const centeredOnceRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageContentRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  const layoutMode = usePosterLayout();

  const zoom = useCalendarZoom({
    mode: "fit-width",
    viewportWidth: viewportSize.width,
    viewportHeight: viewportSize.height,
    stageWidth: stageSize.width,
    stageHeight: stageSize.height
  });

  const selectedWeek = useMemo(() => {
    if (selectedWeekIndex === null) {
      return null;
    }
    return calendar.weeks.find((week) => week.weekIndex === selectedWeekIndex) ?? null;
  }, [calendar.weeks, selectedWeekIndex]);

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

  useEffect(() => {
    if (!legendAnchor) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!legendRef.current?.contains(target)) {
        setLegendAnchor(null);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [legendAnchor]);

  const scaledStageWidth = stageSize.width * zoom.scale;
  const centerStage = scaledStageWidth < viewportSize.width && zoom.mode === "contain";

  return (
    <>
      <div className="mx-auto min-h-screen w-full max-w-[var(--poster-max-width)] px-6 pb-10 pt-2 sm:px-9">
        <PosterTopRail
          profile={calendar.profile}
          completedWeeks={calendar.summary.completedWeeks}
          totalWeeks={calendar.summary.totalWeeks}
          currentAgeYears={calendar.summary.currentAgeYears}
          mode={zoom.mode}
          onToggleMode={zoom.toggleMode}
          onToggleInfo={(anchor) => setLegendAnchor((current) => (current ? null : anchor))}
        />

        <main className={layoutMode === "horizontal" ? "grid grid-cols-[60%_40%] items-start" : "block"}>
          <CalendarViewport viewportRef={viewportRef} centerStage={centerStage}>
            <CalendarStage scale={zoom.scale} contentRef={stageContentRef}>
              <LifeCalendarGrid
                weeks={calendar.weeks}
                currentWeekIndex={calendar.summary.currentWeekIndex}
                currentAgeYears={calendar.summary.currentAgeYears}
                selectedWeekIndex={selectedWeekIndex}
                onSelectWeek={(weekIndex, anchor) => {
                  setSelectedWeekIndex(weekIndex);
                  setSelectedAnchor(anchor);
                }}
              />
            </CalendarStage>
          </CalendarViewport>

          {layoutMode === "horizontal" ? <ReflectionSpace selectedWeek={selectedWeek} /> : null}
        </main>
      </div>

      {legendAnchor ? (
        <div ref={legendRef} className="fixed z-40" style={{ left: legendAnchor.x + 14, top: legendAnchor.y - 8 }}>
          <CalendarLegend />
        </div>
      ) : null}

      <WeekPopover week={selectedWeek} anchor={selectedAnchor} onClose={() => setSelectedAnchor(null)} />
    </>
  );
}
