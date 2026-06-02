import type { PropsWithChildren } from "react";

interface FieldProps extends PropsWithChildren {
  label: string;
  htmlFor?: string;
}

export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <label className="block text-[11px] text-zinc-300/82" htmlFor={htmlFor}>
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

