import type { PropsWithChildren } from "react";

interface ModalSectionProps extends PropsWithChildren {
  title?: string;
  description?: string;
  className?: string;
}

export function ModalSection({ title, description, className, children }: ModalSectionProps) {
  return (
    <section className={["floating-island rounded-[24px] p-4 sm:p-5", className ?? ""].join(" ")}>
      {title ? <p className="text-[13px] font-medium text-[var(--text-primary)]">{title}</p> : null}
      {description ? <p className="mt-1 text-[11px] text-[var(--text-muted)]">{description}</p> : null}
      <div className={title || description ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
