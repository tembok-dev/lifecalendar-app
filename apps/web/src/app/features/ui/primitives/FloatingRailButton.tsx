import type { MouseEvent, ReactNode } from "react";

interface FloatingRailButtonProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  hint?: string | null;
}

export function FloatingRailButton({ icon, label, active = false, onClick, hint }: FloatingRailButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "ui-radius-pill group relative h-7 w-7 backdrop-blur transition hover:text-zinc-100",
        active ? "bg-surface/58 text-zinc-100" : "bg-surface/45 text-zinc-300/80"
      ].join(" ")}
      aria-label={label}
    >
      {icon}
      <span className="pointer-events-none absolute right-9 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] text-zinc-200/85 opacity-0 transition group-hover:opacity-100">
        {label}
      </span>
      {hint ? (
        <span className="ui-radius-xs pointer-events-none absolute right-9 top-1/2 -translate-y-1/2 whitespace-nowrap bg-surface/92 px-1.5 py-0.5 text-[10px] text-zinc-200/85 shadow-soft">
          {hint}
        </span>
      ) : null}
    </button>
  );
}
