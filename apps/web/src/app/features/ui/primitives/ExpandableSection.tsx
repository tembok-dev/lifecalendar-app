import { ChevronDown } from "lucide-react";
import { useState, type PropsWithChildren, type ReactNode } from "react";

interface ExpandableSectionProps extends PropsWithChildren {
  title: string;
  defaultOpen?: boolean;
  compactLabel?: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  icon?: ReactNode;
}

export function ExpandableSection({ title, defaultOpen = false, compactLabel, open: controlledOpen, onToggle, icon, children }: ExpandableSectionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;

  return (
    <div className="rounded-[18px] border border-[var(--border-soft)] bg-white/[0.02]">
      <button
        type="button"
        onClick={() => {
          const next = !open;
          if (controlledOpen === undefined) {
            setInternalOpen(next);
          }
          onToggle?.(next);
        }}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
          {icon ? <span className="text-[var(--accent-primary)]">{icon}</span> : null}
          <span>{title}</span>
        </span>
        <span className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <span>{open ? "Hide" : compactLabel ?? "Show"}</span>
          <ChevronDown size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
        </span>
      </button>
      {open ? <div className="border-t border-[var(--border-soft)] px-4 py-3">{children}</div> : null}
    </div>
  );
}
