import { ChevronDown } from "lucide-react";
import type { ReactNode, SelectHTMLAttributes } from "react";

type FloatingSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  leadingIcon?: ReactNode;
};

export function FloatingSelect({ className, children, leadingIcon, ...props }: FloatingSelectProps) {
  return (
    <div className="relative">
      {leadingIcon ? <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]/85">{leadingIcon}</span> : null}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
        <ChevronDown size={16} />
      </span>
      <select
        {...props}
        className={["floating-field h-[46px] appearance-none px-4 pr-10 text-[14px]", leadingIcon ? "pl-12" : "", className ?? ""].join(" ")}
      >
        {children}
      </select>
    </div>
  );
}
