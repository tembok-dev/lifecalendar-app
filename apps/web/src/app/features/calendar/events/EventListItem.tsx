import { PencilLine, Repeat } from "lucide-react";
import type { LifeEvent } from "@lifecalendar/shared";
import { EVENT_CATEGORY_LABEL, EVENT_COLOR_TEXT_CLASS, resolveEventIcon } from "../utils/eventIcons";
import { formatEventDate, isUpcomingEvent } from "./eventListFormatting";

interface EventListItemProps {
  event: LifeEvent;
  onClick: (event: LifeEvent) => void;
}

export function EventListItem({ event, onClick }: EventListItemProps) {
  const Icon = resolveEventIcon(event.category, event.iconKey);
  const colorClass = EVENT_COLOR_TEXT_CLASS[event.colorKey];
  const upcoming = isUpcomingEvent(event.date);

  return (
    <button
      type="button"
      onClick={() => onClick(event)}
      className="event-list-item group flex w-full items-start gap-3 px-3 py-3 text-left"
    >
      <span className="ui-radius-sm mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-white/[0.04]">
        <Icon size={18} weight="duotone" className={colorClass} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[13px] font-medium text-[var(--text-primary)]">{event.title}</span>
          {event.isRecurring ? <Repeat size={12} className="shrink-0 text-[var(--text-muted)]" /> : null}
          {upcoming ? (
            <span className="ui-radius-pill shrink-0 bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">Upcoming</span>
          ) : null}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[var(--text-muted)]">
          <span>{formatEventDate(event.date)}</span>
          <span className="text-white/18">•</span>
          <span>{EVENT_CATEGORY_LABEL[event.category]}</span>
        </span>
        {event.note ? <span className="mt-1 block truncate text-[11px] text-[var(--text-secondary)]/78">{event.note}</span> : null}
      </span>

      <span className="mt-1 shrink-0 text-[var(--text-muted)] transition group-hover:text-[var(--text-secondary)]">
        <PencilLine size={14} />
      </span>
    </button>
  );
}
