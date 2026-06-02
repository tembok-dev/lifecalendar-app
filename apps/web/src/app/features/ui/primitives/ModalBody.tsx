import type { PropsWithChildren } from "react";

export function ModalBody({ children }: PropsWithChildren) {
  return <div className="modal-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto pr-1">{children}</div>;
}
