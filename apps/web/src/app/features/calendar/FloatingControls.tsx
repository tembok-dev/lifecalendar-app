interface FloatingControlsProps {
  showInfo: boolean;
  onToggleInfo: () => void;
}

export function FloatingControls({ showInfo, onToggleInfo }: FloatingControlsProps) {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        type="button"
        aria-label="Toggle calendar help"
        onClick={onToggleInfo}
        className="h-9 w-9 rounded-full bg-surface/72 text-[13px] text-zinc-300 shadow-soft backdrop-blur transition hover:text-zinc-100"
      >
        {showInfo ? "·" : "?"}
      </button>
    </div>
  );
}