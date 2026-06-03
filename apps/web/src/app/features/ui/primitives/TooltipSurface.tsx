import { useEffect, useId, useLayoutEffect, useRef, useState, type PropsWithChildren, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipSurfaceProps extends PropsWithChildren {
  open: boolean;
  anchorRect: DOMRect | null;
  className?: string;
  showArrow?: boolean;
  maxWidth?: number;
  id?: string;
}

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  tooltipClassName?: string;
  disabled?: boolean;
  showArrow?: boolean;
  delayShow?: number;
  delayHide?: number;
  maxWidth?: number;
}

function computeTooltipPosition(anchorRect: DOMRect, tooltipRect: DOMRect, viewportWidth: number, viewportHeight: number) {
  const margin = 12;
  const offset = 10;
  const fitsAbove = anchorRect.top - tooltipRect.height - offset >= margin;
  const top = fitsAbove ? anchorRect.top - tooltipRect.height - offset : anchorRect.bottom + offset;
  const left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;

  return {
    left: Math.max(margin, Math.min(left, viewportWidth - tooltipRect.width - margin)),
    top: Math.max(margin, Math.min(top, viewportHeight - tooltipRect.height - margin)),
    side: fitsAbove ? "bottom" : "top"
  } as const;
}

export function TooltipSurface({
  open,
  anchorRect,
  className,
  showArrow = true,
  maxWidth = 260,
  id,
  children
}: TooltipSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [isPositioned, setIsPositioned] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number; side: "top" | "bottom" }>({
    left: 0,
    top: 0,
    side: "top"
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      setPortalHost(document.body);
    }
  }, []);

  useLayoutEffect(() => {
    if (!open || !anchorRect || !ref.current) {
      setIsPositioned(false);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const next = computeTooltipPosition(anchorRect, rect, window.innerWidth, window.innerHeight);
    setPosition(next);
    setIsPositioned(true);
  }, [open, anchorRect, children, maxWidth]);

  if (!open || !anchorRect || !portalHost) {
    return null;
  }

  return createPortal(
    <div
      ref={ref}
      id={id}
      role="tooltip"
      className={[
        "fixed z-[110] border border-[var(--color-border-soft)] bg-[var(--color-surface-floating)] px-2 py-1.5 text-[11px] leading-[1.35] text-[var(--text-secondary)] shadow-[var(--shadow-popover)] backdrop-blur-[12px]",
        "ui-radius-sm motion-safe:transition-[opacity,transform] motion-safe:duration-[var(--motion-fast)] motion-safe:ease-[var(--ease-standard)]",
        isPositioned ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0",
        className ?? ""
      ].join(" ")}
      style={{
        left: position.left,
        top: position.top,
        maxWidth,
        visibility: isPositioned ? "visible" : "hidden"
      }}
    >
      {showArrow ? (
        <span
          className="absolute h-2 w-2 rotate-45 border-l border-t border-[var(--color-border-soft)] bg-[var(--color-surface-floating)]"
          style={
            position.side === "bottom"
              ? { left: "50%", bottom: -5, transform: "translateX(-50%) rotate(225deg)" }
              : { left: "50%", top: -5, transform: "translateX(-50%) rotate(45deg)" }
          }
        />
      ) : null}
      {children}
    </div>,
    portalHost
  );
}

export function Tooltip({
  content,
  children,
  className,
  tooltipClassName,
  disabled = false,
  showArrow = true,
  delayShow = 250,
  delayHide = 80,
  maxWidth = 260
}: TooltipProps) {
  const tooltipId = useId();
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const clearTimers = () => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const updateAnchorRect = () => {
    setAnchorRect(anchorRef.current?.getBoundingClientRect() ?? null);
  };

  const openTooltip = () => {
    if (disabled) return;
    clearTimers();
    updateAnchorRect();
    showTimerRef.current = window.setTimeout(() => {
      updateAnchorRect();
      setOpen(true);
    }, delayShow);
  };

  const closeTooltip = () => {
    clearTimers();
    hideTimerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, delayHide);
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <>
      <span
        ref={anchorRef}
        className={className ?? "inline-flex"}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
        onFocus={openTooltip}
        onBlur={closeTooltip}
      >
        {children}
      </span>
      <TooltipSurface
        open={open && !disabled}
        anchorRect={anchorRect}
        className={tooltipClassName}
        showArrow={showArrow}
        maxWidth={maxWidth}
        id={tooltipId}
      >
        {content}
      </TooltipSurface>
    </>
  );
}
