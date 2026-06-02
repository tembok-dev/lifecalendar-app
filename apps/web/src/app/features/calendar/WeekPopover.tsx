import { useEffect, useMemo, useState } from "react";
import type { CalendarWeek, LifeEvent } from "@lifecalendar/shared";
import { EventList } from "./events/EventList";
import { InlineError } from "../ui/primitives/InlineError";
import { PopoverSurface } from "../ui/primitives/PopoverSurface";

interface WeekPopoverProps {
  week: CalendarWeek | null;
  eventsOverride?: LifeEvent[] | null;
  anchor: { x: number; y: number; defaultDate: string; contextLabel: string } | null;
  onClose: () => void;
  onRequestCreate: (input: { defaultDate: string; contextLabel: string }) => void;
  onRequestEdit: (event: LifeEvent, contextLabel: string) => void;
}

export function WeekPopover({ week, eventsOverride, anchor, onClose, onRequestCreate, onRequestEdit }: WeekPopoverProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [week?.weekIndex, anchor?.x, anchor?.y]);

  const sortedEvents = useMemo(() => {
    if (eventsOverride && eventsOverride.length > 0) {
      return [...eventsOverride].sort((a, b) => a.date.localeCompare(b.date));
    }
    if (!week) {
      return [];
    }
    return [...week.events].sort((a, b) => a.date.localeCompare(b.date));
  }, [week, eventsOverride]);

  if (!week || !anchor) {
    return null;
  }

  return (
    <PopoverSurface open={Boolean(anchor && week)} anchor={anchor} width={280} onClose={onClose} ariaLabel="Week details and events">
      <p className="font-medium text-zinc-100">{anchor.contextLabel}</p>
      <p className="mt-0.5 text-[10px] text-zinc-300/78">
        {new Date(anchor.defaultDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <EventList
        events={sortedEvents}
        onAdd={() => {
          setError(null);
          onClose();
          onRequestCreate({ defaultDate: anchor.defaultDate, contextLabel: anchor.contextLabel });
        }}
        onEdit={(event) => {
          setError(null);
          onClose();
          onRequestEdit(event, anchor.contextLabel);
        }}
      />

      <InlineError message={error} />
    </PopoverSurface>
  );
}
