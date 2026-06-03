import type { PropsWithChildren } from "react";

export function ModalBody({ children }: PropsWithChildren) {
  return <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto" style={{ marginTop: "var(--section-gap)", paddingRight: "var(--space-1)" }}>{children}</div>;
}
