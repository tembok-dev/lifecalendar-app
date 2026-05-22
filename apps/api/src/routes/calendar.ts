import type { FastifyInstance } from "fastify";
import type { GetProfileCalendarResponse } from "@lifecalendar/shared";
import { buildLifeCalendar } from "@lifecalendar/shared";
import { prisma } from "../lib/prisma.js";
import { toEvent, toProfile, toSettings } from "../lib/mappers.js";
import { parseOrThrow, profileIdParamsSchema } from "../lib/validation.js";

export async function calendarRoutes(app: FastifyInstance) {
  app.get("/profiles/:profileId/calendar", async (request, reply): Promise<GetProfileCalendarResponse> => {
    const { profileId } = parseOrThrow(profileIdParamsSchema, request.params);

    const profileModel = await prisma.profile.findUnique({ where: { id: profileId } });
    if (!profileModel) {
      reply.code(404);
      throw new Error("Profile not found");
    }

    let settingsModel = await prisma.appSettings.findUnique({ where: { profileId } });
    if (!settingsModel) {
      settingsModel = await prisma.appSettings.create({ data: { profileId } });
    }

    const eventsModel = await prisma.lifeEvent.findMany({
      where: { profileId },
      orderBy: [{ weekIndex: "asc" }, { createdAt: "asc" }]
    });

    const profile = toProfile(profileModel);
    const settings = toSettings(settingsModel);
    const events = eventsModel.map(toEvent);

    const calendar = buildLifeCalendar({ profile, events });

    return {
      profile,
      settings,
      summary: calendar.summary,
      weeks: calendar.weeks
    };
  });
}