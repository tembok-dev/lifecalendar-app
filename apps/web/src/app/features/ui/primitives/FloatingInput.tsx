import type { InputHTMLAttributes, ReactNode } from "react";

type FloatingInputProps = InputHTMLAttributes<HTMLInputElement> & {
  fieldSize?: "normal" | "large";
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function FloatingInput({ className, fieldSize = "normal", leadingIcon, trailingIcon, type, ...props }: FloatingInputProps) {
  return (
    <div className="relative">
      {leadingIcon ? <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]/85">{leadingIcon}</span> : null}
      {trailingIcon ? <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{trailingIcon}</span> : null}
      <input
        {...props}
        type={type}
        className={[
          "floating-field px-4 text-[14px]",
          type === "date" ? "floating-date-input" : "",
          leadingIcon ? "pl-12" : "",
          trailingIcon ? "pr-12" : "",
          fieldSize === "large" ? "text-[16px]" : "",
          className ?? ""
        ].join(" ")}
        style={{ height: fieldSize === "large" ? "var(--field-height-lg)" : "var(--field-height-md)" }}
      />
    </div>
  );
}
