import type { PropsWithChildren, ReactNode } from "react";

interface ModalFieldProps extends PropsWithChildren {
  label: string;
  hint?: string;
  htmlFor?: string;
  error?: ReactNode;
}

export function ModalField({ label, hint, htmlFor, error, children }: ModalFieldProps) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="text-[11px] tracking-[0.03em] text-[var(--text-muted)]">{label}</span>
      {hint ? <span className="ml-1 text-[10px] text-[var(--text-muted)]">{hint}</span> : null}
      <div className="mt-2">{children}</div>
      {error ? <div className="mt-2">{error}</div> : null}
    </label>
  );
}
