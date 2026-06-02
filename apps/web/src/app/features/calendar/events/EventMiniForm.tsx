import { useState } from "react";
import { CalendarDays, ChevronDown, FileText, PenLine, Tag } from "lucide-react";
import { deriveRecurrenceDefaults, type EventCategory, type LifeEvent } from "@lifecalendar/shared";
import { EventCategoryPicker } from "./EventCategoryPicker";
import { ExpandableSection } from "../../ui/primitives/ExpandableSection";
import { FloatingInput } from "../../ui/primitives/FloatingInput";
import { FloatingTextarea } from "../../ui/primitives/FloatingTextarea";
import { InlineError } from "../../ui/primitives/InlineError";
import { ToggleSwitch } from "../../ui/primitives/ToggleSwitch";

interface EventMiniFormProps {
  mode: "create" | "edit";
  defaultDate: string;
  initialEvent?: LifeEvent;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  formId?: string;
  showFooter?: boolean;
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

export function EventMiniForm({ mode, defaultDate, initialEvent, saving, error, onCancel, onSubmit, formId, showFooter = true }: EventMiniFormProps) {
  const [category, setCategory] = useState<EventCategory>(initialEvent?.category ?? "memory");
  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [date, setDate] = useState(toDateInput(initialEvent?.date ?? defaultDate));
  const [note, setNote] = useState(initialEvent?.note ?? "");
  const [isPrivate, setIsPrivate] = useState(initialEvent?.isPrivate ?? false);
  const [showOnExport, setShowOnExport] = useState(initialEvent?.showOnExport ?? true);
  const [isRecurring, setIsRecurring] = useState(initialEvent?.isRecurring ?? deriveRecurrenceDefaults({ category: initialEvent?.category ?? "memory", title: initialEvent?.title, note: initialEvent?.note }).isRecurring);
  const [recurrenceTouched, setRecurrenceTouched] = useState(mode === "edit");

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
      id={formId}
      className="min-h-0"
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
      <div className="grid gap-3">
        <FloatingInput
          className="h-12"
          leadingIcon={<PenLine size={16} />}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What happened?"
        />

        <div className="grid gap-3">
          <FloatingInput
            type="date"
            leadingIcon={<CalendarDays size={16} />}
            trailingIcon={<ChevronDown size={16} />}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-11"
          />
          <EventCategoryPicker value={category} onChange={updateCategory} />
        </div>

        <ExpandableSection title="Add note (optional)" defaultOpen={Boolean(note)} compactLabel="Expand" icon={<FileText size={14} />}>
          <FloatingTextarea
            leadingIcon={<FileText size={16} />}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            className="max-h-[180px]"
            placeholder="Anything worth remembering..."
          />
        </ExpandableSection>

        <ExpandableSection title="Preferences" defaultOpen={false} compactLabel="Advanced" icon={<Tag size={14} />}>
          <div className="flex flex-wrap gap-4">
            <ToggleSwitch checked={showOnExport} onChange={setShowOnExport} label="Export" />
            <ToggleSwitch checked={isPrivate} onChange={setIsPrivate} label="Private" />
            <ToggleSwitch
              checked={isRecurring}
              onChange={(checked) => {
                setRecurrenceTouched(true);
                setIsRecurring(checked);
              }}
              label="Repeat yearly"
            />
          </div>
        </ExpandableSection>

        <InlineError message={error} />
      </div>

      {showFooter ? (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border-soft)] pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[var(--border-soft)] px-4 py-2 text-[12px] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[linear-gradient(135deg,rgba(112,232,224,0.94),rgba(83,185,205,0.9))] px-5 py-2 text-[12px] font-medium text-slate-950 disabled:opacity-65"
          >
            {saving ? "Saving..." : "Save memory"}
          </button>
        </div>
      ) : null}
    </form>
  );
}

function toDateInput(dateIso: string): string {
  return new Date(dateIso).toISOString().slice(0, 10);
}
