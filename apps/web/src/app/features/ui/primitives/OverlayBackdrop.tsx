interface OverlayBackdropProps {
  onClick?: () => void;
}

export function OverlayBackdrop({ onClick }: OverlayBackdropProps) {
  return <div className="fixed inset-0 bg-zinc-950/36 backdrop-blur-[2px]" onClick={onClick} aria-hidden="true" />;
}

