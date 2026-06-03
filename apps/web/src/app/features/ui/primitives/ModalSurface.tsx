import { useEffect, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { OverlayBackdrop } from "./OverlayBackdrop";

interface ModalSurfaceProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  className?: string;
  ariaLabel: string;
  size?: "compact" | "default" | "wide";
  maxWidthPx?: number;
  maxHeightPx?: number;
  radiusPx?: number | string;
}

const SIZE_PX: Record<NonNullable<ModalSurfaceProps["size"]>, number> = {
  compact: 420,
  default: 520,
  wide: 720
};

const SIZE_VAR: Record<NonNullable<ModalSurfaceProps["size"]>, string> = {
  compact: "var(--modal-width-compact)",
  default: "var(--modal-width-default)",
  wide: "var(--modal-width-wide)"
};

export function ModalSurface({
  open,
  onClose,
  className,
  ariaLabel,
  size = "default",
  maxWidthPx,
  maxHeightPx = 720,
  radiusPx = "var(--radius-modal)",
  children
}: ModalSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    setPortalHost(document.body);
  }, []);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }

    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

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

  if (!open || !portalHost) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <OverlayBackdrop onClick={onClose} visible={visible} />
      <div
        ref={ref}
        tabIndex={-1}
        className={[
          "modal-panel relative z-[1] w-full outline-none transition-[opacity,transform] duration-[var(--motion-base)] ease-[var(--ease-out-soft)]",
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.985] opacity-0",
          "overflow-hidden backdrop-blur-[18px]",
          className ?? ""
        ].join(" ")}
        style={{
          maxWidth: maxWidthPx
            ? `min(${maxWidthPx}px, calc(100vw - 32px))`
            : `min(${SIZE_VAR[size]}, calc(100vw - 32px))`,
          maxHeight: `min(${maxHeightPx}px, calc(100vh - 32px))`,
          borderRadius: typeof radiusPx === "number" ? `${radiusPx}px` : radiusPx
        }}
        role="dialog"
        aria-label={ariaLabel}
      >
        <div
          className="flex min-h-0 flex-col p-5 sm:p-6"
          style={{ maxHeight: `min(${maxHeightPx}px, calc(100vh - 32px))`, padding: "var(--modal-padding)" }}
        >
          {children}
        </div>
      </div>
    </div>,
    portalHost
  );
}
