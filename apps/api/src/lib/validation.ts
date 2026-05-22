import { z } from "zod";
import { EVENT_CATEGORIES } from "@lifecalendar/shared";

const isoDate = z.string().datetime();

export const profileIdParamsSchema = z.object({
  profileId: z.string().min(1)
});

export const eventIdParamsSchema = z.object({
  eventId: z.string().min(1)
});

export const createProfileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  birthDate: isoDate,
  expectedLifespanYears: z.number().int().min(1).max(140).nullable().optional()
});

export const patchProfileSchema = createProfileSchema.partial();

export const createEventSchema = z.object({
  date: isoDate,
  weekIndex: z.number().int().min(0),
  category: z.enum(EVENT_CATEGORIES),
  title: z.string().trim().min(1).max(180),
  note: z.string().max(4000).nullable().optional(),
  isPrivate: z.boolean().optional(),
  showOnExport: z.boolean().optional()
});

export const patchEventSchema = createEventSchema.partial();

export const patchSettingsSchema = z.object({
  gridDensity: z.enum(["compact", "comfortable"]).optional(),
  showYearMarkers: z.boolean().optional(),
  showWeekNumbers: z.boolean().optional(),
  showEventIcons: z.boolean().optional(),
  exportTheme: z.enum(["night", "paper"]).optional()
});

export class RequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestValidationError";
  }
}

export function parseOrThrow<T>(schema: z.Schema<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new RequestValidationError(
      result.error.issues.map((issue) => issue.message).join("; ")
    );
  }

  return result.data;
}
