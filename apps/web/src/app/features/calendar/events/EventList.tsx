import type { LifeEvent } from "@lifecalendar/shared";
import { EventListItem } from "./EventListItem";

interface EventListProps {
  events: LifeEvent[];
  onAdd: () => void;
  onEdit: (event: LifeEvent) => void;
}

export function EventList({ events, onAdd, onEdit }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="mt-2">
        <p className="text-[11px] text-zinc-300/76">No memories in this cell yet.</p>
        <button
          type="button"
          onClick={onAdd}
          className="mt-2 rounded-full bg-zinc-100/95 px-3 py-1 text-[11px] font-medium text-zinc-900"
        >
          Add memory here
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-1.5">
      {events.map((event) => (
        <EventListItem key={event.id} event={event} onClick={onEdit} />
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="mt-1 rounded-full border border-line/60 px-2.5 py-1 text-[10px] text-zinc-200/88"
      >
        Add memory here
      </button>
    </div>
  );
}
