import type { PropsWithChildren } from "react";

export function ModalFooter({ children }: PropsWithChildren) {
  return <div className="mt-4 flex shrink-0 items-center justify-between gap-3 border-t border-[var(--border-soft)] pt-4">{children}</div>;
}
