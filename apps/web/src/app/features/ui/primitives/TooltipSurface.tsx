import type { PropsWithChildren } from "react";

interface TooltipSurfaceProps extends PropsWithChildren {
  className?: string;
}

export function TooltipSurface({ className, children }: TooltipSurfaceProps) {
  return (
    <span
      className={[
        "pointer-events-none whitespace-nowrap rounded-[10px] border border-[rgba(220,230,240,0.08)] bg-[rgba(16,22,27,0.92)]",
        "px-1.5 py-0.5 text-[11px] text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-[12px]",
        "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
        className ?? ""
      ].join(" ")}
      role="tooltip"
    >
      {children}
    </span>
  );
}

