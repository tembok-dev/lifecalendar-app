import { describe, expect, it } from "vitest";
import { buildRecurringPreviewEvents, getYearlyOccurrenceDate, isOccurrenceAfterToday } from "./recurrence.js";
import type { LifeEvent } from "../domain/models.js";

function makeEvent(overrides: Partial<LifeEvent> = {}): LifeEvent {
  return {
    id: "e1",
    profileId: "p1",
    date: "2020-06-01T00:00:00.000Z",
    weekIndex: 10,
    category: "birthday",
    title: "Birthday",
    note: null,
    emotionalTone: "joyful",
    iconKey: "cake",
    colorKey: "rose",
    isPrivate: false,
    showOnExport: true,
    isRecurring: true,
    recurrenceType: "yearly",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
  };
}

describe("recurrence helpers", () => {
  it("resolves June 1 occurrence into target year", () => {
    expect(getYearlyOccurrenceDate("2020-06-01T00:00:00.000Z", 2026)).toBe("2026-06-01T00:00:00.000Z");
  });

  it("checks occurrence is strictly after today", () => {
    const today = new Date("2026-06-01T12:00:00.000Z");
    expect(isOccurrenceAfterToday("2026-06-01T00:00:00.000Z", today)).toBe(false);
    expect(isOccurrenceAfterToday("2026-06-02T00:00:00.000Z", today)).toBe(true);
  });

  it("builds only future-in-current-year previews and skips originals in current year", () => {
    const now = new Date("2026-06-01T12:00:00.000Z");
    const previews = buildRecurringPreviewEvents(
      [
        makeEvent({ id: "e1", date: "2020-07-10T00:00:00.000Z" }),
        makeEvent({ id: "e2", date: "2026-09-10T00:00:00.000Z" }),
        makeEvent({ id: "e3", date: "2020-05-10T00:00:00.000Z" })
      ],
      now
    );

    expect(previews).toHaveLength(1);
    expect(previews[0]?.id).toBe("recurring-preview:e1:2026");
    expect(previews[0]?.date).toBe("2026-07-10T00:00:00.000Z");
  });
});
