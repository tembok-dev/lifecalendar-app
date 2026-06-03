import type { IconKey, LifeEvent } from "@lifecalendar/shared";
import { EVENT_CATEGORY_LABEL } from "./eventIcons";

export interface CalendarEventDisplayItem {
  id: string;
  title: string;
  date: string;
  category: LifeEvent["category"];
  iconKey: LifeEvent["iconKey"];
  resolvedIconKey: IconKey;
  colorKey: LifeEvent["colorKey"];
  isUpcomingPreview: boolean;
  displayTitle: string;
  dateLabel: string;
  lineLabel: string;
  tooltip: string;
  event: LifeEvent;
}

function isPreviewEvent(event: LifeEvent): boolean {
  return event.id.startsWith("recurring-preview:");
}

export function buildCalendarEventDisplayItems(
  events: LifeEvent[],
  recurringPreviewEvents: LifeEvent[],
  options?: { isCurrentAgeYear?: boolean }
): CalendarEventDisplayItem[] {
  const realItems = events
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((event) => toDisplayItem(event, false));
  const previewItems = recurringPreviewEvents
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((event) => toDisplayItem(event, true));

  if (options?.isCurrentAgeYear) {
    return [...realItems, ...previewItems];
  }
  return [...realItems, ...previewItems].sort((a, b) => a.date.localeCompare(b.date));
}

function toDisplayItem(event: LifeEvent, forcePreview: boolean): CalendarEventDisplayItem {
  const isUpcomingPreview = forcePreview || isPreviewEvent(event);
  const baseTitle = event.title || EVENT_CATEGORY_LABEL[event.category] || "Event";
  return {
    id: `${event.id}:${event.date}`,
    title: baseTitle,
    date: event.date,
    category: event.category,
    iconKey: event.iconKey,
    resolvedIconKey: resolveDisplayIconKey(event, isUpcomingPreview),
    colorKey: event.colorKey,
    isUpcomingPreview,
    displayTitle: isUpcomingPreview ? `Upcoming: ${baseTitle}` : baseTitle,
    dateLabel: formatDateLabel(event.date),
    lineLabel: isUpcomingPreview ? `Upcoming ${formatDateLabel(event.date)} · ${baseTitle}` : `${formatDateLabel(event.date)} · ${baseTitle}`,
    tooltip: isUpcomingPreview ? `Upcoming ${formatDateLabel(event.date)} · ${baseTitle}` : `${formatDateLabel(event.date)} · ${baseTitle}`,
    event
  };
}

function resolveDisplayIconKey(event: LifeEvent, isUpcomingPreview: boolean): IconKey {
  if (event.category === "newborn" && event.isRecurring && isUpcomingPreview) {
    return "cake";
  }
  return event.iconKey;
}

function formatDateLabel(dateIso: string): string {
  const date = new Date(dateIso);
  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", timeZone: "UTC" });
}
