import type { LifeEvent } from "@lifecalendar/shared";
import { EVENT_CATEGORY_LABEL } from "../utils/eventIcons";

interface EventListProps {
  events: LifeEvent[];
  deletingEventId: string | null;
  onAdd: () => void;
  onEdit: (event: LifeEvent) => void;
  onDelete: (event: LifeEvent) => void;
}

export function EventList({ events, deletingEventId, onAdd, onEdit, onDelete }: EventListProps) {
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
        <div key={event.id} className="rounded-md border border-line/55 bg-zinc-900/22 px-2 py-1.5">
          <p className="text-[11px] font-medium text-zinc-100">{event.title}</p>
          <p className="mt-0.5 text-[10px] text-zinc-300/72">
            {EVENT_CATEGORY_LABEL[event.category]} • {new Date(event.date).toISOString().slice(0, 10)}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <button type="button" onClick={() => onEdit(event)} className="text-[10px] text-zinc-200/88">
              Edit
            </button>
            <button
              type="button"
              disabled={deletingEventId === event.id}
              onClick={() => onDelete(event)}
              className="text-[10px] text-rose-300 disabled:opacity-55"
            >
              {deletingEventId === event.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
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
