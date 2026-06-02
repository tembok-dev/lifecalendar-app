import { useEffect, useMemo, useState } from "react";
import type { CalendarWeek, LifeEvent } from "@lifecalendar/shared";
import { EventList } from "./events/EventList";
import { EventMiniForm } from "./events/EventMiniForm";
import { InlineError } from "../ui/primitives/InlineError";
import { PopoverSurface } from "../ui/primitives/PopoverSurface";

interface WeekPopoverProps {
  week: CalendarWeek | null;
  eventsOverride?: LifeEvent[] | null;
  anchor: { x: number; y: number; defaultDate: string; contextLabel: string } | null;
  onClose: () => void;
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
}

type PopoverMode = "list" | "create" | "edit";

export function WeekPopover({ week, eventsOverride, anchor, onClose, onCreateEvent, onUpdateEvent, onDeleteEvent }: WeekPopoverProps) {
  const [mode, setMode] = useState<PopoverMode>("list");
  const [editingEvent, setEditingEvent] = useState<LifeEvent | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode("list");
    setEditingEvent(null);
    setSaving(false);
    setDeletingEventId(null);
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

      {mode === "list" ? (
        <EventList
          events={sortedEvents}
          deletingEventId={deletingEventId}
          onAdd={() => {
            setMode("create");
            setEditingEvent(null);
            setError(null);
          }}
          onEdit={(event) => {
            setMode("edit");
            setEditingEvent(event);
            setError(null);
          }}
          onDelete={async (event) => {
            setDeletingEventId(event.id);
            setError(null);
            try {
              await onDeleteEvent(event.id);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Delete failed");
            } finally {
              setDeletingEventId(null);
            }
          }}
        />
      ) : (
        <EventMiniForm
          mode={mode === "create" ? "create" : "edit"}
          defaultDate={anchor.defaultDate}
          initialEvent={editingEvent ?? undefined}
          saving={saving}
          error={error}
          onCancel={() => {
            setMode("list");
            setEditingEvent(null);
            setError(null);
          }}
          onSubmit={async (input) => {
            setSaving(true);
            setError(null);
            try {
              if (mode === "edit" && editingEvent) {
                await onUpdateEvent(editingEvent.id, input);
              } else {
                await onCreateEvent(input);
              }
              setMode("list");
              setEditingEvent(null);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Save failed");
            } finally {
              setSaving(false);
            }
          }}
        />
      )}

      {mode === "list" ? <InlineError message={error} /> : null}
    </PopoverSurface>
  );
}
