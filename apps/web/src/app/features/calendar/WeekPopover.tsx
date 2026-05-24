import { useEffect, useRef } from "react";
import type { CalendarWeek } from "@lifecalendar/shared";

interface WeekPopoverProps {
  week: CalendarWeek | null;
  anchor: { x: number; y: number } | null;
  onClose: () => void;
}

export function WeekPopover({ week, anchor, onClose }: WeekPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!anchor) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [anchor, onClose]);

  if (!week || !anchor) {
    return null;
  }

  const showAbove = anchor.y > window.innerHeight * 0.56;
  const top = showAbove ? Math.max(14, anchor.y - 92) : anchor.y + 14;

  return (
    <div
      ref={ref}
      className="fixed z-50 w-[188px] -translate-x-1/2 rounded-md bg-surface/95 p-2.5 text-[11px] text-muted shadow-soft backdrop-blur"
      style={{ left: anchor.x, top }}
      role="dialog"
      aria-label="Week details"
    >
      <span
        className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-surface/95"
        style={showAbove ? { bottom: -4 } : { top: -4 }}
      />

      <p className="font-medium text-zinc-100">Week {week.weekIndex + 1}</p>
      <p className="mt-0.5">Year {week.lifeYear + 1}</p>
      <p className="mt-0.5 capitalize">{week.status}</p>
      <p className="mt-0.5">Events {week.events.length}</p>
    </div>
  );
}