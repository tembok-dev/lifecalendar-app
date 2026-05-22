import type { FastifyInstance } from "fastify";
import type { GetProfileSettingsResponse, MutationSettingsResponse, PatchAppSettingsInput } from "@lifecalendar/shared";
import { prisma } from "../lib/prisma.js";
import { toSettings } from "../lib/mappers.js";
import { parseOrThrow, patchSettingsSchema, profileIdParamsSchema } from "../lib/validation.js";

export async function settingsRoutes(app: FastifyInstance) {
  app.get("/profiles/:profileId/settings", async (request): Promise<GetProfileSettingsResponse> => {
    const { profileId } = parseOrThrow(profileIdParamsSchema, request.params);

    let settings = await prisma.appSettings.findUnique({ where: { profileId } });
    if (!settings) {
      settings = await prisma.appSettings.create({ data: { profileId } });
    }

    return { settings: toSettings(settings) };
  });

  app.patch("/profiles/:profileId/settings", async (request): Promise<MutationSettingsResponse> => {
    const { profileId } = parseOrThrow(profileIdParamsSchema, request.params);
    const input = parseOrThrow<PatchAppSettingsInput>(patchSettingsSchema, request.body);

    const settings = await prisma.appSettings.upsert({
      where: { profileId },
      create: {
        profileId,
        ...input
      },
      update: input
    });

    return { settings: toSettings(settings) };
  });
}