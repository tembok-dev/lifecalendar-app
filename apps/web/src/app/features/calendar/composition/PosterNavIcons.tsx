import { Cog, Plus } from "lucide-react";
import { useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Tooltip } from "../../ui/primitives/TooltipSurface";

interface PosterNavIconsProps {
  onQuickAdd: (anchor: { x: number; y: number }) => void;
  onOpenSettings: () => void;
  showHint: boolean;
  compact?: boolean;
}

export function PosterNavIcons({ onQuickAdd, onOpenSettings, showHint, compact = false }: PosterNavIconsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [pointerX, setPointerX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = hoveredIndex ?? focusedIndex;

  const items = useMemo(
    () => [
      {
        key: "quick-add",
        label: "Add event",
        icon: <Plus size={18} strokeWidth={2} />,
        onClick: (event: MouseEvent<HTMLButtonElement>) => onQuickAdd({ x: event.clientX, y: event.clientY })
      },
      {
        key: "settings",
        label: "Settings",
        icon: <Cog size={18} strokeWidth={2} />,
        onClick: () => onOpenSettings()
      }
    ],
    [onOpenSettings, onQuickAdd]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setFocusedIndex(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className={compact ? "group mx-auto flex w-full items-center justify-center gap-3 px-2 py-1.5 transition-all duration-300" : "group mx-auto flex w-full items-center justify-center gap-4 px-3 py-2 transition-all duration-300"}
      onMouseMove={(event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) {
          return;
        }
        const localX = event.clientX - rect.left;
        setPointerX(localX);
        let nearest = 0;
        let minDist = Number.POSITIVE_INFINITY;
        buttonRefs.current.forEach((button, index) => {
          if (!button) {
            return;
          }
          const center = button.offsetLeft + button.offsetWidth / 2;
          const dist = Math.abs(center - localX);
          if (dist < minDist) {
            minDist = dist;
            nearest = index;
          }
        });
        setHoveredIndex(nearest);
      }}
      onMouseLeave={() => {
        setHoveredIndex(null);
        setPointerX(null);
      }}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => {
        const distance = activeIndex === null ? 3 : Math.abs(index - activeIndex);
        const scale = activeIndex === null ? 0.92 : distance === 0 ? 1.38 : distance === 1 ? 1.12 : 0.86;
        const opacity = activeIndex === null ? 0.7 : distance === 0 ? 1 : distance === 1 ? 0.84 : 0.52;
        const glow = distance === 0 ? "drop-shadow(0_0_14px_rgba(231,238,245,0.22))" : "none";
        const button = buttonRefs.current[index];
        const center = button ? button.offsetLeft + button.offsetWidth / 2 : null;
        const delta = pointerX !== null && center !== null ? pointerX - center : 0;
        const range = 120;
        const strength = Math.max(0, 1 - Math.abs(delta) / range);
        const pullX = pointerX === null ? 0 : (delta / range) * 8 * strength;
        const tooltipLabel = item.key === "quick-add" && showHint ? "Add memories by clicking a week or using +" : item.label;
        return (
          <Tooltip key={item.key} content={tooltipLabel} className="inline-flex" tooltipClassName="max-w-[220px]" showArrow={false}>
            <button
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              type="button"
              aria-label={tooltipLabel}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[rgba(227,235,244,0.62)] transition-[color,transform,opacity,filter] duration-200 hover:text-[rgba(244,248,251,0.98)] focus-visible:text-[rgba(244,248,251,0.98)] focus-visible:outline-none"
              style={{ transform: `translateX(${pullX}px) translateY(${distance === 0 ? "-2px" : "0px"}) scale(${scale})`, opacity, filter: glow }}
              onMouseEnter={() => setHoveredIndex(index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              onClick={item.onClick}
            >
              {item.icon}
            </button>
          </Tooltip>
        );
      })}
      <div className="sr-only" aria-live="polite">
        {showHint ? "Add memories by clicking a week or using plus." : ""}
      </div>
    </div>
  );
}
