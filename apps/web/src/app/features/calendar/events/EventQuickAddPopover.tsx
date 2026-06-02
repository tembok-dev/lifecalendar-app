import { useEffect, useState } from "react";
import type { LifeEvent } from "@lifecalendar/shared";
import { ModalSurface } from "../../ui/primitives/ModalSurface";
import { EventMiniForm } from "./EventMiniForm";

interface EventQuickAddPopoverProps {
  open: boolean;
  anchor?: { x: number; y: number } | null;
  defaultDate?: string;
  contextLabel?: string;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onCreate: (input: {
    category: LifeEvent["category"];
    title: string;
    date: string;
    note: string | null;
    isPrivate: boolean;
    showOnExport: boolean;
    isRecurring: boolean;
    recurrenceType: "yearly" | null;
  }) => Promise<void>;
}

export function EventQuickAddPopover({ open, defaultDate, contextLabel, saving, error, onClose, onCreate }: EventQuickAddPopoverProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  if (!open) {
    return null;
  }

  const resolvedDate = defaultDate ?? new Date().toISOString();
  const label = contextLabel ?? `Today • ${new Date().toLocaleDateString()}`;

  return (
    <ModalSurface open={open} onClose={onClose} ariaLabel="Add event">
      <p className="font-medium text-zinc-100">Add event</p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>

      <EventMiniForm
        mode="create"
        defaultDate={resolvedDate}
        saving={saving}
        error={localError}
        onCancel={onClose}
        onSubmit={async (input) => {
          try {
            await onCreate(input);
            onClose();
          } catch (err) {
            setLocalError(err instanceof Error ? err.message : "Unable to create event");
          }
        }}
      />
    </ModalSurface>
  );
}
