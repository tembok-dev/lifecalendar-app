import type { ReactNode, TextareaHTMLAttributes } from "react";

type FloatingTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  leadingIcon?: ReactNode;
};

export function FloatingTextarea({ className, leadingIcon, ...props }: FloatingTextareaProps) {
  return (
    <div className="relative">
      {leadingIcon ? <span className="pointer-events-none absolute left-4 top-4 text-[var(--accent-primary)]/85">{leadingIcon}</span> : null}
      <textarea
        {...props}
        className={[
          "floating-field min-h-[120px] resize-none px-4 py-3 text-[14px]",
          leadingIcon ? "pl-12" : "",
          className ?? ""
        ].join(" ")}
      />
    </div>
  );
}
