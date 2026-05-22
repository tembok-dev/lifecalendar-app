import type { FastifyInstance } from "fastify";
import type {
  CreateLifeEventInput,
  GetProfileEventsResponse,
  MutationEventResponse,
  PatchLifeEventInput
} from "@lifecalendar/shared";
import { deriveEventVisuals } from "@lifecalendar/shared";
import { prisma } from "../lib/prisma.js";
import { toEvent } from "../lib/mappers.js";
import {
  createEventSchema,
  eventIdParamsSchema,
  parseOrThrow,
  patchEventSchema,
  profileIdParamsSchema
} from "../lib/validation.js";

export async function eventRoutes(app: FastifyInstance) {
  app.get("/profiles/:profileId/events", async (request): Promise<GetProfileEventsResponse> => {
    const { profileId } = parseOrThrow(profileIdParamsSchema, request.params);

    const events = await prisma.lifeEvent.findMany({
      where: { profileId },
      orderBy: [{ date: "asc" }, { createdAt: "asc" }]
    });

    return { events: events.map(toEvent) };
  });

  app.post("/profiles/:profileId/events", async (request): Promise<MutationEventResponse> => {
    const { profileId } = parseOrThrow(profileIdParamsSchema, request.params);
    const input = parseOrThrow<CreateLifeEventInput>(createEventSchema, request.body);
    const defaults = deriveEventVisuals(input.category);

    const event = await prisma.lifeEvent.create({
      data: {
        profileId,
        date: new Date(input.date),
        weekIndex: input.weekIndex,
        category: input.category,
        title: input.title,
        note: input.note ?? null,
        emotionalTone: defaults.emotionalTone,
        iconKey: defaults.iconKey,
        colorKey: defaults.colorKey,
        isPrivate: input.isPrivate ?? false,
        showOnExport: input.showOnExport ?? true
      }
    });

    return { event: toEvent(event) };
  });

  app.patch("/events/:eventId", async (request): Promise<MutationEventResponse> => {
    const { eventId } = parseOrThrow(eventIdParamsSchema, request.params);
    const input = parseOrThrow<PatchLifeEventInput>(patchEventSchema, request.body);

    const data: Record<string, unknown> = {
      ...(input.date !== undefined ? { date: new Date(input.date) } : {}),
      ...(input.weekIndex !== undefined ? { weekIndex: input.weekIndex } : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.note !== undefined ? { note: input.note } : {}),
      ...(input.isPrivate !== undefined ? { isPrivate: input.isPrivate } : {}),
      ...(input.showOnExport !== undefined ? { showOnExport: input.showOnExport } : {})
    };

    if (input.category !== undefined) {
      const defaults = deriveEventVisuals(input.category);
      data.category = input.category;
      data.emotionalTone = defaults.emotionalTone;
      data.iconKey = defaults.iconKey;
      data.colorKey = defaults.colorKey;
    }

    const event = await prisma.lifeEvent.update({
      where: { id: eventId },
      data
    });

    return { event: toEvent(event) };
  });

  app.delete("/events/:eventId", async (request) => {
    const { eventId } = parseOrThrow(eventIdParamsSchema, request.params);

    await prisma.lifeEvent.delete({ where: { id: eventId } });
    return { ok: true };
  });
}