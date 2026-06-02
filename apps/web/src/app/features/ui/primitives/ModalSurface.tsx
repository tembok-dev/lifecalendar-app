import { useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";
import { OverlayBackdrop } from "./OverlayBackdrop";

interface ModalSurfaceProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  className?: string;
  ariaLabel: string;
}

export function ModalSurface({ open, onClose, className, ariaLabel, children }: ModalSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    ref.current?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <OverlayBackdrop onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className={[
          "relative z-[1] w-full max-w-[560px] rounded-[24px] border border-[rgba(220,230,240,0.08)] bg-[rgba(18,24,29,0.88)]",
          "p-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-[16px] outline-none motion-safe:transition-all motion-safe:duration-150",
          "sm:p-6",
          className ?? ""
        ].join(" ")}
        role="dialog"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>
  );
}

