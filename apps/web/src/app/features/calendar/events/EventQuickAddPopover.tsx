import { useEffect, useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import type { LifeEvent } from "@lifecalendar/shared";
import { ModalAccentOrb } from "../../ui/primitives/ModalAccentOrb";
import { ModalBody } from "../../ui/primitives/ModalBody";
import { ModalFooter } from "../../ui/primitives/ModalFooter";
import { ModalHeader } from "../../ui/primitives/ModalHeader";
import { ModalSurface } from "../../ui/primitives/ModalSurface";
import { EventMiniForm } from "./EventMiniForm";

interface EventQuickAddPopoverProps {
  open: boolean;
  anchor?: { x: number; y: number } | null;
  mode?: "create" | "edit";
  defaultDate?: string;
  contextLabel?: string;
  initialEvent?: LifeEvent | null;
  saving: boolean;
  deleting?: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: {
    category: LifeEvent["category"];
    title: string;
    date: string;
    note: string | null;
    isPrivate: boolean;
    showOnExport: boolean;
    isRecurring: boolean;
    recurrenceType: "yearly" | null;
  }) => Promise<void>;
  onDelete?: (eventId: string) => Promise<void>;
}

export function EventQuickAddPopover({
  open,
  mode = "create",
  defaultDate,
  contextLabel,
  initialEvent,
  saving,
  deleting = false,
  error,
  onClose,
  onSubmit,
  onDelete
}: EventQuickAddPopoverProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const formId = "add-memory-modal-form";

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  useEffect(() => {
    setConfirmDelete(false);
  }, [initialEvent?.id, open]);

  if (!open) {
    return null;
  }

  const resolvedDate = defaultDate ?? initialEvent?.date ?? new Date().toISOString();
  const label = contextLabel ?? `Today - ${new Date().toLocaleDateString()}`;
  const title = mode === "edit" ? "Edit memory" : "Add memory";
  const submitLabel = mode === "edit" ? "Save changes" : "Save memory";

  return (
    <ModalSurface open={open} onClose={onClose} ariaLabel={title} size="compact" className="bg-[rgba(16,22,30,0.96)]">
      <ModalHeader
        title={title}
        subtitle={label}
        onClose={onClose}
        ornament={
          <ModalAccentOrb>
            <Sparkles size={14} className="text-[var(--accent-primary)]" />
          </ModalAccentOrb>
        }
      />

      <ModalBody>
        <EventMiniForm
          formId={formId}
          showFooter={false}
          mode={mode}
          defaultDate={resolvedDate}
          initialEvent={initialEvent ?? undefined}
          saving={saving}
          error={localError}
          onCancel={onClose}
          onSubmit={async (input) => {
            try {
              await onSubmit(input);
              onClose();
            } catch (err) {
              setLocalError(err instanceof Error ? err.message : mode === "edit" ? "Unable to update event" : "Unable to create event");
            }
          }}
        />
        {mode === "edit" && initialEvent && onDelete && confirmDelete ? (
          <div className="mt-4 rounded-[14px] bg-white/[0.03] px-3 py-3">
            <p className="text-[12px] font-medium text-[var(--text-primary)]">Delete this memory?</p>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">This cannot be undone.</p>
          </div>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border-soft)] px-4 py-2 text-[12px] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
          {mode === "edit" && initialEvent && onDelete ? (
            confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-full border border-[var(--border-soft)] px-4 py-2 text-[12px] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              >
                Never mind
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 rounded-full border border-rose-300/25 bg-rose-400/10 px-4 py-2 text-[12px] text-rose-200 transition hover:border-rose-300/40 hover:bg-rose-400/14"
              >
                <Trash2 size={14} />
                <span>Delete event</span>
              </button>
            )
          ) : null}
        </div>
        {confirmDelete && mode === "edit" && initialEvent && onDelete ? (
          <button
            type="button"
            disabled={deleting}
            onClick={async () => {
              try {
                await onDelete(initialEvent.id);
                onClose();
              } catch (err) {
                setLocalError(err instanceof Error ? err.message : "Unable to delete event");
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-rose-400/92 px-5 py-2 text-[12px] font-medium text-slate-950 disabled:opacity-60"
          >
            <Trash2 size={14} />
            <span>{deleting ? "Deleting..." : "Delete"}</span>
          </button>
        ) : (
          <button
            type="submit"
            form={formId}
            disabled={saving}
            className="rounded-full bg-[linear-gradient(135deg,rgba(112,232,224,0.94),rgba(83,185,205,0.9))] px-5 py-2 text-[12px] font-medium text-slate-950 disabled:opacity-65"
          >
            {saving ? "Saving..." : submitLabel}
          </button>
        )}
      </ModalFooter>
    </ModalSurface>
  );
}
