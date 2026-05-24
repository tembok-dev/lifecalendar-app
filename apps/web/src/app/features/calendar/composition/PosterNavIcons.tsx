import { CalendarDays, Cog, Info, Scan } from "lucide-react";
import type { CalendarScaleMode } from "../hooks/useCalendarZoom";
import type { ReactNode } from "react";

interface PosterNavIconsProps {
  mode: CalendarScaleMode;
  onToggleMode: () => void;
  onToggleInfo: (anchor: { x: number; y: number }) => void;
}

function TopIcon({ icon }: { icon: ReactNode }) {
  return <span className="flex h-8 w-8 items-center justify-center text-zinc-300/85">{icon}</span>;
}

export function PosterNavIcons({ mode, onToggleMode, onToggleInfo }: PosterNavIconsProps) {
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={(event) => onToggleInfo({ x: event.clientX, y: event.clientY })}
          className="group relative h-7 w-7 rounded-full bg-surface/45 text-zinc-300/80 backdrop-blur transition hover:text-zinc-100"
          aria-label="Toggle legend"
        >
          <Info size={13} className="mx-auto" />
          <span className="pointer-events-none absolute right-9 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] text-zinc-200/80 opacity-0 transition group-hover:opacity-100">
            Legend
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleMode}
          className={[
            "group relative h-7 w-7 rounded-full backdrop-blur transition hover:text-zinc-100",
            mode === "fit-width" ? "bg-surface/58 text-zinc-100" : "bg-surface/45 text-zinc-300/80"
          ].join(" ")}
          aria-label="Toggle scale mode"
        >
          {mode === "fit-width" ? <CalendarDays size={13} className="mx-auto" /> : <Scan size={13} className="mx-auto" />}
          <span className="pointer-events-none absolute right-9 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] text-zinc-200/80 opacity-0 transition group-hover:opacity-100">
            {mode === "fit-width" ? "Fit Width" : "Contain"}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <TopIcon icon={<CalendarDays size={16} strokeWidth={1.9} />} />
        <TopIcon icon={<Cog size={16} strokeWidth={1.9} />} />
      </div>
    </>
  );
}
