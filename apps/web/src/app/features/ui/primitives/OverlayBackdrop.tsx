interface OverlayBackdropProps {
  onClick?: () => void;
  visible?: boolean;
}

export function OverlayBackdrop({ onClick, visible = true }: OverlayBackdropProps) {
  return (
    <div
      className={[
        "fixed inset-0 bg-[var(--surface-overlay)] backdrop-blur-[16px] transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
        visible ? "opacity-100" : "opacity-0"
      ].join(" ")}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
