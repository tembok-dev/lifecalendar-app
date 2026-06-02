import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface IconChoiceChipProps {
  icon: ReactNode;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function IconChoiceChip({ icon, label, selected = false, onClick }: IconChoiceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex min-w-0 h-[64px] flex-col items-center justify-center gap-1 rounded-[12px] border px-2 py-2 text-center transition",
        selected
          ? "border-[rgba(112,232,224,0.42)] bg-[rgba(112,232,224,0.06)] text-[var(--text-primary)] shadow-[0_0_0_1px_rgba(112,232,224,0.12),0_0_22px_rgba(112,232,224,0.08)]"
          : "border-[var(--border-soft)] bg-white/[0.02] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
      ].join(" ")}
    >
      {selected ? (
        <span className="absolute right-1.5 top-1.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[var(--accent-primary)] text-slate-950 shadow-[0_0_12px_var(--accent-primary-glow)]">
          <Check size={9} strokeWidth={3} />
        </span>
      ) : null}
      <span
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition",
          selected
            ? "border-white/10 bg-white/[0.06]"
            : "border-[var(--border-soft)] bg-white/[0.03]"
        ].join(" ")}
      >
        {icon}
      </span>
      <span className="w-full truncate text-[10px] leading-none">{label}</span>
    </button>
  );
}
