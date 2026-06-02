import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { computeAnchoredPopoverPosition } from "./popoverPositioning";

interface PopoverSurfaceProps extends PropsWithChildren {
  open: boolean;
  anchor: { x: number; y: number } | null;
  anchorRect?: DOMRect | null;
  width?: number;
  onClose: () => void;
  className?: string;
  showArrow?: boolean;
  placement?: "auto" | "right" | "left";
  ariaLabel: string;
}

export function PopoverSurface({
  open,
  anchor,
  anchorRect,
  width = 280,
  onClose,
  className,
  showArrow = true,
  placement = "auto",
  ariaLabel,
  children
}: PopoverSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number; above: boolean; side: "top" | "bottom" | "left" | "right" }>({
    left: 0,
    top: 0,
    above: false,
    side: "top"
  });

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    setPortalHost(document.body);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target)) {
        onClose();
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [onClose, open]);

  useLayoutEffect(() => {
    if (!open || !anchor || !ref.current) {
      return;
    }
    const margin = 12;
    const offset = 14;
    const rect = ref.current.getBoundingClientRect();

    if (placement === "right" || placement === "left") {
      if (anchorRect) {
        const anchored = computeAnchoredPopoverPosition({
          anchorRect,
          popoverRect: rect,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          margin,
          offset,
          placement
        });
        setPosition({ left: anchored.left, top: anchored.top, above: false, side: anchored.side === "left" ? "right" : "left" });
        return;
      }

      const fallbackRect = new DOMRect(anchor.x, anchor.y, 0, 0);
      const anchored = computeAnchoredPopoverPosition({
        anchorRect: fallbackRect,
        popoverRect: rect,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        margin,
        offset,
        placement
      });
      setPosition({ left: anchored.left, top: anchored.top, above: false, side: anchored.side === "left" ? "right" : "left" });
      return;
    }

    const above = anchor.y > window.innerHeight * 0.58 && anchor.y - rect.height - offset > margin;
    const top = above ? anchor.y - rect.height - offset : anchor.y + offset;
    const clampedTop = Math.max(margin, Math.min(top, window.innerHeight - rect.height - margin));
    const left = anchor.x - rect.width / 2;
    const clampedLeft = Math.max(margin, Math.min(left, window.innerWidth - rect.width - margin));

    setPosition({ left: clampedLeft, top: clampedTop, above, side: above ? "bottom" : "top" });
  }, [anchor, anchorRect, open, width, children, placement]);

  if (!open || !anchor || !portalHost) {
    return null;
  }

  return createPortal(
    <div
      ref={ref}
      className={[
        "fixed z-[100] border border-[rgba(220,230,240,0.08)] bg-[rgba(16,22,27,0.92)] shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-[16px]",
        "rounded-[18px] p-[14px] text-[13px] text-zinc-300 motion-safe:transition-all motion-safe:duration-150 motion-safe:data-[open=true]:translate-y-0 motion-safe:data-[open=true]:opacity-100",
        className ?? ""
      ].join(" ")}
      data-open={open ? "true" : "false"}
      style={{ left: position.left, top: position.top, width }}
      role="dialog"
      aria-label={ariaLabel}
    >
      {showArrow ? (
        <span
          className="absolute h-2 w-2 rotate-45 border-l border-t border-[rgba(220,230,240,0.08)] bg-[rgba(16,22,27,0.92)]"
          style={{
            ...(position.side === "bottom" ? { left: "50%", bottom: -5, transform: "translateX(-50%) rotate(225deg)" } : {}),
            ...(position.side === "top" ? { left: "50%", top: -5, transform: "translateX(-50%) rotate(45deg)" } : {}),
            ...(position.side === "left" ? { left: -5, top: "50%", transform: "translateY(-50%) rotate(-45deg)" } : {}),
            ...(position.side === "right" ? { right: -5, top: "50%", transform: "translateY(-50%) rotate(135deg)" } : {})
          }}
        />
      ) : null}
      {children}
    </div>,
    portalHost
  );
}
