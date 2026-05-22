import { type PropsWithChildren } from "react";

export function Frame({ children }: PropsWithChildren) {
  return (
    <section className="w-full rounded-2xl border border-line bg-surface/60 p-8 shadow-soft backdrop-blur">
      {children}
    </section>
  );
}