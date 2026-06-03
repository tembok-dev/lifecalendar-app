import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { deriveEventVisuals, EVENT_CATEGORIES, type EventCategory } from "@lifecalendar/shared";
import { EVENT_CATEGORY_LABEL, EVENT_COLOR_TEXT_CLASS, resolveEventIcon } from "../utils/eventIcons";
import { IconChoiceChip } from "../../ui/primitives/IconChoiceChip";

interface EventCategoryPickerProps {
  value: EventCategory;
  onChange: (value: EventCategory) => void;
}

const COLLAPSED_COUNT = 8;
const CATEGORY_PICKER_ORDER: EventCategory[] = [
  "memory",
  "newborn",
  "birthday",
  "relationship",
  "family",
  "travel",
  "home",
  "career",
  "education",
  "health",
  "loss",
  "achievement",
  "challenge",
  "goal",
  "custom"
];

export function EventCategoryPicker({ value, onChange }: EventCategoryPickerProps) {
  const [showAll, setShowAll] = useState(!CATEGORY_PICKER_ORDER.slice(0, COLLAPSED_COUNT).includes(value));

  const orderedCategories = useMemo(
    () => CATEGORY_PICKER_ORDER.filter((category) => EVENT_CATEGORIES.includes(category)),
    []
  );

  const collapsedCategories = orderedCategories.slice(0, COLLAPSED_COUNT);
  const expandedCategories = orderedCategories.slice(COLLAPSED_COUNT);

  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] tracking-[0.03em] text-[var(--text-muted)]">Category</span>
        {expandedCategories.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="inline-flex items-center gap-1 text-[11px] text-[var(--accent-primary)] transition hover:text-[var(--text-primary)]"
          >
            <span>{showAll ? "Show less" : "Show all"}</span>
            <ChevronDown size={14} className={["transition-transform duration-200", showAll ? "rotate-180" : ""].join(" ")} />
          </button>
        ) : null}
      </div>

      <div className="grid min-w-0 grid-cols-3 gap-1.5 sm:grid-cols-4">
        {collapsedCategories.map((category) => {
          const Icon = resolveEventIcon(category);
          const colorClass = EVENT_COLOR_TEXT_CLASS[deriveEventVisuals(category).colorKey];

          return (
            <IconChoiceChip
              key={category}
              label={EVENT_CATEGORY_LABEL[category]}
              selected={category === value}
              onClick={() => onChange(category)}
              icon={<Icon size={18} weight="duotone" className={colorClass} />}
            />
          );
        })}
      </div>

      <div
        className={[
          "overflow-hidden transition-[max-height,opacity,margin] duration-200 ease-out",
          showAll ? "mt-0 max-h-[320px] opacity-100" : "max-h-0 opacity-0"
        ].join(" ")}
      >
        <div className="grid min-w-0 grid-cols-3 gap-1.5 pt-0.5 sm:grid-cols-4">
          {expandedCategories.map((category) => {
            const Icon = resolveEventIcon(category);
            const colorClass = EVENT_COLOR_TEXT_CLASS[deriveEventVisuals(category).colorKey];

            return (
              <IconChoiceChip
                key={category}
                label={EVENT_CATEGORY_LABEL[category]}
                selected={category === value}
                onClick={() => onChange(category)}
                icon={<Icon size={18} weight="duotone" className={colorClass} />}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
