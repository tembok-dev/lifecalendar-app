import type { PropsWithChildren } from "react";

export function ModalAccentOrb({ children }: PropsWithChildren) {
  return (
    <div className="ui-radius-pill flex h-12 w-12 items-center justify-center border border-[rgba(112,232,224,0.22)] bg-[radial-gradient(circle_at_30%_30%,rgba(112,232,224,0.24),rgba(20,29,43,0.94)_72%)] shadow-[0_0_0_1px_rgba(112,232,224,0.08),0_0_24px_var(--accent-primary-glow)]">
      {children}
    </div>
  );
}
