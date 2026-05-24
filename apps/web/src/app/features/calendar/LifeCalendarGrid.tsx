import {
  ChevronDown,
  LucideArrowLeft,
  LucideArrowRight,
  Sparkles
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CalendarWeek, ColorKey, EventCategory } from "@lifecalendar/shared";
import { WeekCell } from "./WeekCell";
import { EVENT_CATEGORY_LABEL, EVENT_COLOR_TEXT_CLASS, resolveEventIcon } from "./utils/eventIcons";

interface LifeCalendarGridProps {
  weeks: CalendarWeek[];
  currentWeekIndex: number;
  currentAgeYears: number;
  selectedWeekIndex: number | null;
  onSelectWeek: (weekIndex: number, anchor: { x: number; y: number }) => void;
}

type DisplayMode = "auto" | "weeks" | "months";
type EffectiveDisplayMode = "weeks" | "months";

type YearGroup = {
  lifeYear: number;
  weeks: CalendarWeek[];
  rowMarkers: Array<{ title: string; category: EventCategory; colorKey: ColorKey }>;
};

type DisplayCell = {
  week: CalendarWeek;
  disabled: boolean;
  preBirth: boolean;
};

function chunk<T>(items: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    output.push(items.slice(i, i + size));
  }
  return output;
}

function toYearGroups(weeks: CalendarWeek[], birthYear: number): YearGroup[] {
  const map = new Map<number, YearGroup>();

  weeks.forEach((week) => {
    const existing = map.get(week.lifeYear);
    if (!existing) {
      map.set(week.lifeYear, { lifeYear: week.lifeYear, weeks: [week], rowMarkers: [] });
      return;
    }
    existing.weeks.push(week);
  });

  const groups = Array.from(map.values()).sort((a, b) => a.lifeYear - b.lifeYear);

  groups.forEach((group) => {
    const calendarYear = birthYear + group.lifeYear;
    const rowEvents = group.weeks
      .flatMap((week) => week.events)
      .filter((event) => new Date(event.date).getUTCFullYear() === calendarYear);

    const markers = rowEvents
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3)
      .map((event) => ({
        title: event.title,
        category: event.category,
        colorKey: event.colorKey
      }));

    group.rowMarkers = markers;
  });

  return groups;
}

function getUtcDayOfYear(date: Date): number {
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  const current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - yearStart) / (24 * 60 * 60 * 1000));
}

function getCalendarYearSlot(date: Date): number {
  return Math.min(51, Math.floor(getUtcDayOfYear(date) / 7));
}

function toCalendarYearWeekCells(input: {
  group: YearGroup;
  birthDate: Date;
  birthYear: number;
  now: Date;
}): DisplayCell[] {
  const { group, birthDate, birthYear, now } = input;
  const calendarYear = birthYear + group.lifeYear;
  const sourceWeeks = [...group.weeks].sort((a, b) => a.weekIndex - b.weekIndex);
  const nowTime = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const birthTime = Date.UTC(birthDate.getUTCFullYear(), birthDate.getUTCMonth(), birthDate.getUTCDate());

  return Array.from({ length: 52 }, (_, slot) => {
    const slotStart = new Date(Date.UTC(calendarYear, 0, 1 + slot * 7, 0, 0, 0, 0));
    const slotEnd = new Date(slotStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const slotStartTime = slotStart.getTime();
    const slotEndTime = slotEnd.getTime();

    const preBirth = slotEndTime <= birthTime;
    const isCurrent = !preBirth && nowTime >= slotStartTime && nowTime < slotEndTime;
    const isPast = !preBirth && slotEndTime <= nowTime;
    const status: CalendarWeek["status"] = isCurrent ? "current" : isPast ? "past" : "future";

    const mapped = sourceWeeks.find((week) => {
      const weekStart = Date.UTC(
        new Date(week.startDate).getUTCFullYear(),
        new Date(week.startDate).getUTCMonth(),
        new Date(week.startDate).getUTCDate()
      );
      return weekStart >= slotStartTime && weekStart < slotEndTime;
    });
    const weekEvents = sourceWeeks
      .filter((week) => {
        const weekStart = Date.UTC(
          new Date(week.startDate).getUTCFullYear(),
          new Date(week.startDate).getUTCMonth(),
          new Date(week.startDate).getUTCDate()
        );
        return weekStart >= slotStartTime && weekStart < slotEndTime;
      })
      .flatMap((week) => week.events);

    const fallbackWeekIndex = group.lifeYear * 52 + slot;
    const week: CalendarWeek = mapped
      ? { ...mapped, status, events: weekEvents }
      : {
          id: `cal-${calendarYear}-w${slot + 1}`,
          weekIndex: fallbackWeekIndex,
          lifeYear: group.lifeYear,
          weekOfLifeYear: slot + 1,
          startDate: slotStart.toISOString(),
          endDate: slotEnd.toISOString(),
          status,
          events: weekEvents
        };

    return {
      week,
      disabled: preBirth,
      preBirth
    };
  });
}

function toMonthCells(input: {
  yearWeeks: CalendarWeek[];
  currentWeekIndex: number;
  rowLifeYear: number;
  currentLifeYear: number;
  currentMonthIndex: number;
  currentCalendarYear: number;
}): CalendarWeek[] {
  const { yearWeeks, currentWeekIndex, rowLifeYear, currentLifeYear, currentMonthIndex, currentCalendarYear } = input;
  const sorted = [...yearWeeks].sort((a, b) => a.weekIndex - b.weekIndex);
  if (sorted.length === 0) {
    return [];
  }

  const resolveMonthStatus = (monthIndex: number): CalendarWeek["status"] => {
    if (rowLifeYear < currentLifeYear) {
      return "past";
    }
    if (rowLifeYear > currentLifeYear) {
      return "future";
    }
    if (monthIndex < currentMonthIndex) {
      return "past";
    }
    if (monthIndex === currentMonthIndex) {
      return "current";
    }
    return "future";
  };

  const buckets: CalendarWeek[][] = Array.from({ length: 12 }, () => []);
  sorted.forEach((week) => {
    // Calendar month slots are fixed Jan..Dec so visual month position is stable.
    const weekDate = new Date(week.startDate);

    // For current life-year row in month mode, keep months anchored to the current calendar year.
    if (rowLifeYear === currentLifeYear && weekDate.getUTCFullYear() !== currentCalendarYear) {
      return;
    }

    const index = weekDate.getUTCMonth();
    const targetBucket = buckets[index];
    if (targetBucket) {
      targetBucket.push(week);
    }
  });

  return buckets.map((bucket, index) => {
    const first = bucket[0];
    const last = bucket[bucket.length - 1];
    const status = resolveMonthStatus(index);

    if (!first || !last) {
      const fallback = yearWeeks[Math.min(index * 4, Math.max(0, yearWeeks.length - 1))];
      if (!fallback) {
        throw new Error("Missing week data for month rendering");
      }
      return {
        ...fallback,
        id: `${fallback.id}-m${index + 1}`,
        weekIndex: fallback.weekIndex,
        weekOfLifeYear: index + 1,
        status,
        events: []
      };
    }

    return {
      ...first,
      id: `${first.id}-m${index + 1}`,
      weekIndex: first.weekIndex,
      startDate: first.startDate,
      endDate: last.endDate,
      weekOfLifeYear: index + 1,
      status,
      events: bucket.flatMap((week) => week.events)
    };
  });
}

export function LifeCalendarGrid({ weeks, currentWeekIndex, currentAgeYears, selectedWeekIndex, onSelectWeek }: LifeCalendarGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("auto");
  const [containerWidth, setContainerWidth] = useState(0);

  const currentDate = new Date();
  const birthDate = new Date(weeks[0]?.startDate ?? currentDate.toISOString());
  const birthYear = birthDate.getUTCFullYear();
  const groups = toYearGroups(weeks, birthYear);
  const lifetimeCurrentWeekIndex = currentWeekIndex;
  const currentLifeYear = Math.floor(lifetimeCurrentWeekIndex / 52);
  const currentMonthIndex = currentDate.getUTCMonth();
  const currentCalendarYear = currentDate.getUTCFullYear();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) {
      return;
    }

    const update = () => setContainerWidth(el.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const effectiveMode: EffectiveDisplayMode = useMemo(() => {
    if (displayMode === "weeks" || displayMode === "months") {
      return displayMode;
    }
    return containerWidth > 0 && containerWidth < 980 ? "months" : "weeks";
  }, [containerWidth, displayMode]);

  const colCount = effectiveMode === "weeks" ? 52 : 12;
  const groupCount = effectiveMode === "weeks" ? 13 : 3;
  const gridWidth = `calc((${colCount} * var(--week-cell-size)) + (${colCount - 1} * var(--week-cell-gap)) + (${groupCount - 1} * var(--week-group-gap)))`;

  const cycleDisplayMode = () => {
    setDisplayMode((mode) => (mode === "auto" ? "weeks" : mode === "weeks" ? "months" : "auto"));
  };

  const xAxisLabels = useMemo(() => {
    const labels: Array<{ index: number; text: string }> = [];
    if (effectiveMode === "weeks") {
      for (let index = 3; index < 52; index += 4) {
        labels.push({ index, text: String(index + 1) });
      }
      return labels;
    }

    const monthLabels = ["Jan", "Apr", "Jul", "Oct"];
    const positions = [0, 3, 6, 9];
    return positions.map((index, i) => ({ index, text: monthLabels[i] }));
  }, [effectiveMode]);

  return (
    <div ref={rootRef} className="relative mx-auto w-fit py-[var(--poster-top-space)]">
      <div className="*:absolute text-sm">
        <button
          type="button"
          onClick={cycleDisplayMode}
          className="flex items-center justify-center gap-1 rounded-md px-2 py-1 text-muted transition hover:text-zinc-100"
          style={{ top: 0, left: 52 }}
        >
          <span className="capitalize">{effectiveMode}</span>
          <ChevronDown size={13} />
          <LucideArrowRight size={13} />
        </button>
        <span className="flex items-center justify-center gap-3 text-muted/90" style={{ top: 104, left: -16, transform: "rotate(-90deg)" }}>
          <LucideArrowLeft size={14} />
          Years
        </span>
      </div>

      <div>
        <div
          className="mb-2 grid items-center gap-2"
          style={{ gridTemplateColumns: `var(--year-label-width) ${gridWidth} 40px` }}
        >
          <div />
          <div className="flex text-[10px] text-zinc-300/55" style={{ gap: "var(--week-group-gap)" }}>
            {chunk(Array.from({ length: effectiveMode === "weeks" ? 52 : 12 }, (_, i) => i), 4).map((colGroup, groupIndex) => (
              <div key={`axis-g${groupIndex}`} className="grid grid-cols-4" style={{ gap: "var(--week-cell-gap)" }}>
                {colGroup.map((col) => {
                  const label = xAxisLabels.find((entry) => entry.index === col);
                  return (
                    <span key={`axis-c${col}`} className="block w-[var(--week-cell-size)] text-center">
                      {label ? label.text : ""}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <div />
        </div>

        {groups.map((group) => {
          const isCurrentRow = group.lifeYear === currentLifeYear;
          const decadeLabel = group.lifeYear % 10 === 0 ? String(group.lifeYear) : "";
          const leftLabel = isCurrentRow ? `${currentAgeYears}y` : decadeLabel;
          const rowSpacingClass = group.lifeYear > 0 && group.lifeYear % 10 === 0 ? "mt-[calc(var(--week-cell-gap)*4)]" : "mt-[var(--week-cell-gap)]";

          const cells: DisplayCell[] =
            effectiveMode === "weeks"
              ? toCalendarYearWeekCells({
                  group,
                  birthDate,
                  birthYear,
                  now: currentDate
                })
              : toMonthCells({
                  yearWeeks: group.weeks,
                  currentWeekIndex: lifetimeCurrentWeekIndex,
                  rowLifeYear: group.lifeYear,
                  currentLifeYear,
                  currentMonthIndex,
                  currentCalendarYear
                }).map((week) => ({
                  week,
                  disabled: false,
                  preBirth: false
                }));
          const groupedCells = chunk(cells, 4);

          return (
            <div
              key={group.lifeYear}
              data-life-year={group.lifeYear}
              className={["group/year-row grid items-center gap-2", rowSpacingClass].join(" ")}
              style={{ gridTemplateColumns: `var(--year-label-width) ${gridWidth} 40px` }}
            >
              <div className={["text-right text-[11px]", isCurrentRow ? "text-zinc-100" : "text-zinc-200/55"].join(" ")}>{leftLabel}</div>

              <div className="flex" style={{ gap: "var(--week-group-gap)" }}>
                {groupedCells.map((cellGroup, groupIndex) => (
                  <div key={`${group.lifeYear}-g${groupIndex}`} className="grid grid-cols-4" style={{ gap: "var(--week-cell-gap)" }}>
                    {cellGroup.map((week) => (
                      <WeekCell
                        key={week.week.id}
                        week={week.week}
                        currentWeekIndex={currentWeekIndex}
                        currentLifeYear={currentLifeYear}
                        selected={selectedWeekIndex === week.week.weekIndex}
                        disabled={week.disabled}
                        preBirth={week.preBirth}
                        onSelect={onSelectWeek}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-zinc-200/72">
                {group.rowMarkers.map((marker, index) => {
                  const MarkerIcon = resolveEventIcon(marker.category);
                  return (
                    <span
                      key={`${group.lifeYear}-marker-${index}`}
                      className={[
                        "group relative transition duration-200 group-hover/year-row:brightness-110",
                        EVENT_COLOR_TEXT_CLASS[marker.colorKey] ?? "text-zinc-300/75"
                      ].join(" ")}
                    >
                      <MarkerIcon size={12} weight="duotone" />
                      <span className="pointer-events-none absolute left-[18px] top-1/2 z-20 -translate-y-1/2 whitespace-nowrap rounded bg-surface/92 px-1.5 py-0.5 text-[10px] text-zinc-100 opacity-0 shadow-soft transition group-hover:opacity-100">
                        {marker.title || EVENT_CATEGORY_LABEL[marker.category] || "Event"}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
