import { useMemo, useState } from "react";
import { deriveRecurrenceDefaults, type EventCategory, type LifeEvent } from "@lifecalendar/shared";
import { EventCategoryPicker } from "./EventCategoryPicker";
import { Field } from "../../ui/primitives/Field";
import { InlineError } from "../../ui/primitives/InlineError";

interface EventMiniFormProps {
  mode: "create" | "edit";
  defaultDate: string;
  initialEvent?: LifeEvent;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (input: {
    category: EventCategory;
    title: string;
    date: string;
    note: string | null;
    isPrivate: boolean;
    showOnExport: boolean;
    isRecurring: boolean;
    recurrenceType: "yearly" | null;
  }) => Promise<void> | void;
}

export function EventMiniForm({ mode, defaultDate, initialEvent, saving, error, onCancel, onSubmit }: EventMiniFormProps) {
  const [category, setCategory] = useState<EventCategory>(initialEvent?.category ?? "memory");
  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [date, setDate] = useState(toDateInput(initialEvent?.date ?? defaultDate));
  const [note, setNote] = useState(initialEvent?.note ?? "");
  const [isPrivate, setIsPrivate] = useState(initialEvent?.isPrivate ?? false);
  const [showOnExport, setShowOnExport] = useState(initialEvent?.showOnExport ?? true);
  const [isRecurring, setIsRecurring] = useState(initialEvent?.isRecurring ?? deriveRecurrenceDefaults({ category: initialEvent?.category ?? "memory", title: initialEvent?.title, note: initialEvent?.note }).isRecurring);
  const [recurrenceTouched, setRecurrenceTouched] = useState(mode === "edit");

  const heading = useMemo(() => (mode === "create" ? "Add memory" : "Edit memory"), [mode]);
  const updateCategory = (next: EventCategory) => {
    setCategory(next);
    if (recurrenceTouched) {
      return;
    }
    const defaults = deriveRecurrenceDefaults({ category: next, title, note });
    setIsRecurring(defaults.isRecurring);
  };

  return (
    <form
      className="mt-2"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit({
          category,
          title,
          date: `${date}T00:00:00.000Z`,
          note: note.trim() ? note.trim() : null,
          isPrivate,
          showOnExport,
          isRecurring,
          recurrenceType: isRecurring ? "yearly" : null
        });
      }}
    >
      <p className="text-xs font-medium text-zinc-200/95">{heading}</p>

      <Field label="Title">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-md border border-line/60 bg-zinc-900/35 px-2 py-1.5 text-[12px] text-zinc-100 outline-none focus:border-zinc-300/65"
          placeholder="A meaningful moment"
        />
      </Field>

      <Field label="Date">
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-full rounded-md border border-line/60 bg-zinc-900/35 px-2 py-1.5 text-[12px] text-zinc-100 outline-none focus:border-zinc-300/65"
        />
      </Field>

      <label className="mt-2 block text-[11px] text-zinc-300/82">Category</label>
      <EventCategoryPicker value={category} onChange={updateCategory} />

      <Field label="Note (optional)">
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={2}
          className="w-full resize-none rounded-md border border-line/60 bg-zinc-900/35 px-2 py-1.5 text-[12px] text-zinc-100 outline-none focus:border-zinc-300/65"
        />
      </Field>

      <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-300/85">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={showOnExport} onChange={(event) => setShowOnExport(event.target.checked)} />
          Export
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={isPrivate} onChange={(event) => setIsPrivate(event.target.checked)} />
          Private
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(event) => {
              setRecurrenceTouched(true);
              setIsRecurring(event.target.checked);
            }}
          />
          Repeat yearly
        </label>
      </div>

      <InlineError message={error} />

      <div className="mt-3 flex items-center gap-2">
        <button type="button" onClick={onCancel} className="rounded-full border border-line/60 px-2.5 py-1 text-[11px] text-zinc-200/86">
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-zinc-100/95 px-3 py-1 text-[11px] font-medium text-zinc-900 disabled:opacity-65"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function toDateInput(dateIso: string): string {
  return new Date(dateIso).toISOString().slice(0, 10);
}
