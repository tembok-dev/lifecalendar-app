import type { EventCategory } from "./event-categories.js";

export type RecurrenceType = "yearly";

export interface RecurrenceDefaults {
  isRecurring: boolean;
  recurrenceType: RecurrenceType | null;
}

function impliesFamilyBirth(text: string): boolean {
  const value = text.toLowerCase();
  return ["birth", "born", "baby"].some((token) => value.includes(token));
}

export function deriveRecurrenceDefaults(input: { category: EventCategory; title?: string | null; note?: string | null }): RecurrenceDefaults {
  const { category, title, note } = input;
  if (category === "birthday" || category === "relationship" || category === "newborn") {
    return { isRecurring: true, recurrenceType: "yearly" };
  }
  if (category === "family") {
    const combined = `${title ?? ""} ${note ?? ""}`.trim();
    const recurring = combined.length > 0 && impliesFamilyBirth(combined);
    return { isRecurring: recurring, recurrenceType: recurring ? "yearly" : null };
  }
  if (category === "loss") {
    return { isRecurring: false, recurrenceType: null };
  }
  return { isRecurring: false, recurrenceType: null };
}
