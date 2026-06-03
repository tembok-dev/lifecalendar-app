interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-[11px] text-[var(--text-secondary)]"
    >
      <span
        className={[
          "relative h-5 w-[34px] rounded-[var(--radius-pill)] border transition-[background,border-color,box-shadow] duration-[var(--motion-base)] ease-[var(--ease-standard)]",
          checked
            ? "border-transparent bg-[var(--accent-primary-soft)] shadow-[0_0_0_1px_rgba(112,232,224,0.18)]"
            : "border-[var(--border-soft)] bg-white/[0.05]"
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-4 w-4 rounded-[var(--radius-pill)] transition-all duration-[var(--motion-base)] ease-[var(--ease-standard)]",
            checked ? "left-[14px] bg-[var(--accent-primary)]" : "left-0.5 bg-white/[0.82]"
          ].join(" ")}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}
