interface OverlayBackdropProps {
  onClick?: () => void;
  visible?: boolean;
}

export function OverlayBackdrop({ onClick, visible = true }: OverlayBackdropProps) {
  return (
    <div
      className={[
        "fixed inset-0 bg-[var(--surface-overlay)] backdrop-blur-[18px] transition-opacity duration-150",
        visible ? "opacity-100" : "opacity-0"
      ].join(" ")}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
