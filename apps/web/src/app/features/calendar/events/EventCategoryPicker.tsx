import { deriveEventVisuals, EVENT_CATEGORIES, type EventCategory } from "@lifecalendar/shared";
import { EVENT_CATEGORY_LABEL, EVENT_COLOR_FILL_CLASS, resolveEventIcon } from "../utils/eventIcons";

interface EventCategoryPickerProps {
  value: EventCategory;
  onChange: (value: EventCategory) => void;
}

export function EventCategoryPicker({ value, onChange }: EventCategoryPickerProps) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-1.5">
      {EVENT_CATEGORIES.map((category) => {
        const Icon = resolveEventIcon(category);
        const selected = category === value;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={[
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] transition",
              selected ? "border-zinc-200/70 bg-zinc-100/10 text-zinc-100" : "border-line/55 bg-zinc-900/25 text-zinc-300/85"
            ].join(" ")}
          >
            <span className={["flex h-4 w-4 items-center justify-center rounded-[4px]", EVENT_COLOR_FILL_CLASS[deriveEventVisuals(category).colorKey]].join(" ")}>
              <Icon size={10} weight="fill" className="text-zinc-950" />
            </span>
            <span>{EVENT_CATEGORY_LABEL[category]}</span>
          </button>
        );
      })}
    </div>
  );
}
