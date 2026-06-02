interface CalendarAxisLabelsProps {
  mode: "weeks" | "months";
  colCount: number;
  gridWidth: string;
  groupSize: number;
  stageTemplateColumns: string;
  eventsCount: number;
  onOpenEvents: () => void;
  showEventHeader: boolean;
}

function chunk<T>(items: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let i = 0; i < items.length; i += size) output.push(items.slice(i, i + size));
  return output;
}

export function CalendarAxisLabels({ mode, colCount, gridWidth, groupSize, stageTemplateColumns, eventsCount, onOpenEvents, showEventHeader }: CalendarAxisLabelsProps) {
  const labels =
    mode === "weeks"
      ? Array.from({ length: colCount }, (_, index) => (index >= 3 && index % 4 === 3 ? String(index + 1) : ""))
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="mb-2 grid items-center gap-2" style={{ gridTemplateColumns: stageTemplateColumns }}>
      <div />
      {mode === "months" ? (
        <div className="grid w-full text-xs text-muted" style={{ gap: "var(--calendar-month-group-gap)", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {chunk(labels, 3).map((quarter, quarterIndex) => (
            <div
              key={`axis-q-${quarterIndex}`}
              className="grid min-w-0"
              style={{ gap: "var(--calendar-month-cell-gap)", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
            >
              {quarter.map((label, monthIndex) => (
                <span key={`axis-m-${quarterIndex}-${monthIndex}`} className="block w-full text-center">
                  {label}
                </span>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex w-full text-xs text-muted" style={{ gap: "var(--calendar-week-group-gap)", maxWidth: gridWidth }}>
          {chunk(labels, groupSize).map((group, groupIndex) => (
            <div key={`axis-g${groupIndex}`} className="grid" style={{ gap: "var(--calendar-cell-gap)", gridTemplateColumns: `repeat(${groupSize}, var(--calendar-cell-width,var(--week-cell-size)))` }}>
              {group.map((label, col) => (
                <span key={`axis-c${groupIndex}-${col}`} className="block w-[var(--calendar-cell-width,var(--week-cell-size))] text-center">
                  {label}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
      <div />
      <div className="flex justify-start">
        {showEventHeader ? (
          <button
            type="button"
            onClick={onOpenEvents}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-300/20 bg-[rgba(16,22,27,0.85)] px-2 py-1 text-xs text-zinc-200 transition hover:text-zinc-100"
          >
            <span>Events</span>
            <span className="rounded-full bg-zinc-200/12 px-1.5 py-[1px] text-[10px]">{eventsCount}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
