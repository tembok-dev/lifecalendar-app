import type { PropsWithChildren, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalHeaderProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  ornament?: ReactNode;
  onClose?: () => void;
}

export function ModalHeader({ title, subtitle, ornament, onClose, children }: ModalHeaderProps) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        {ornament ? <div className="pt-0.5">{ornament}</div> : null}
        <div>
          <p className="text-[22px] font-semibold leading-none text-[var(--text-primary)]">{title}</p>
          {subtitle ? <p className="mt-1 text-[12px] text-[var(--text-muted)]">{subtitle}</p> : null}
          {children}
        </div>
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-soft)] bg-white/[0.02] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}
