interface EstimateDateFromRowClickInput {
  calendarYear: number;
  mode: "weeks" | "months";
  x: number;
  rowRect: DOMRect;
  totalSlots: number;
  birthDate: string;
}

export function estimateDateFromRowClick({ calendarYear, mode, x, rowRect, totalSlots, birthDate }: EstimateDateFromRowClickInput): string {
  if (totalSlots <= 0 || rowRect.width <= 0) {
    return new Date(birthDate).toISOString();
  }

  const relativeX = Math.max(0, Math.min(rowRect.width, x - rowRect.left));
  const ratio = relativeX / rowRect.width;
  const slotIndex = Math.max(0, Math.min(totalSlots - 1, Math.floor(ratio * totalSlots)));

  const estimatedDate =
    mode === "weeks"
      ? new Date(Date.UTC(calendarYear, 0, 1 + slotIndex * 7, 0, 0, 0, 0))
      : new Date(Date.UTC(calendarYear, slotIndex, 1, 0, 0, 0, 0));

  const birth = new Date(birthDate);
  const estimatedTime = Date.UTC(estimatedDate.getUTCFullYear(), estimatedDate.getUTCMonth(), estimatedDate.getUTCDate());
  const birthTime = Date.UTC(birth.getUTCFullYear(), birth.getUTCMonth(), birth.getUTCDate());
  if (estimatedTime < birthTime) {
    return birth.toISOString();
  }

  return estimatedDate.toISOString();
}
