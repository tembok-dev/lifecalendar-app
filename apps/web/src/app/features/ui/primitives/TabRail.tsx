interface TabRailItem<T extends string> {
  value: T;
  label: string;
}

interface TabRailProps<T extends string> {
  items: readonly TabRailItem<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function TabRail<T extends string>({ items, value, onChange }: TabRailProps<T>) {
  return (
    <div className="mt-4 flex items-center gap-2 border-b border-[var(--border-soft)] pb-3">
      {items.map((item) => {
        const selected = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={[
              "rounded-[12px] px-3 py-1.5 text-[12px] transition",
              selected
                ? "bg-[rgba(112,232,224,0.10)] text-[var(--text-primary)] shadow-[inset_0_-1px_0_0_rgba(112,232,224,0.42)]"
                : "text-[var(--text-muted)] hover:bg-white/[0.03] hover:text-[var(--text-secondary)]"
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
