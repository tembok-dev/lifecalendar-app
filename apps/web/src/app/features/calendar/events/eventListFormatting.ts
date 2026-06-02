export function formatEventDate(dateIso: string): string {
  const date = new Date(dateIso);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function isUpcomingEvent(dateIso: string): boolean {
  const timestamp = Date.parse(dateIso);
  return Number.isFinite(timestamp) && timestamp > Date.now();
}
