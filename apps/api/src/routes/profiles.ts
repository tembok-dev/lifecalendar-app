import type { FastifyInstance } from "fastify";
import type {
  CreateProfileInput,
  GetProfileResponse,
  GetProfilesResponse,
  MutationProfileResponse,
  PatchProfileInput
} from "@lifecalendar/shared";
import { prisma } from "../lib/prisma.js";
import {
  createProfileSchema,
  parseOrThrow,
  patchProfileSchema,
  profileIdParamsSchema
} from "../lib/validation.js";
import { toProfile } from "../lib/mappers.js";

export async function profileRoutes(app: FastifyInstance) {
  app.get("/profiles", async (): Promise<GetProfilesResponse> => {
    const profiles = await prisma.profile.findMany({ orderBy: { createdAt: "asc" } });
    return { profiles: profiles.map(toProfile) };
  });

  app.post("/profiles", async (request): Promise<MutationProfileResponse> => {
    const input = parseOrThrow<CreateProfileInput>(createProfileSchema, request.body);

    const profile = await prisma.profile.create({
      data: {
        name: input.name,
        birthDate: new Date(input.birthDate),
        expectedLifespanYears: input.expectedLifespanYears ?? null
      }
    });

    await prisma.appSettings.create({ data: { profileId: profile.id } });

    return { profile: toProfile(profile) };
  });

  app.get("/profiles/:profileId", async (request, reply): Promise<GetProfileResponse> => {
    const { profileId } = parseOrThrow(profileIdParamsSchema, request.params);

    const profile = await prisma.profile.findUnique({ where: { id: profileId } });
    if (!profile) {
      reply.code(404);
      throw new Error("Profile not found");
    }

    return { profile: toProfile(profile) };
  });

  app.patch("/profiles/:profileId", async (request): Promise<MutationProfileResponse> => {
    const { profileId } = parseOrThrow(profileIdParamsSchema, request.params);
    const input = parseOrThrow<PatchProfileInput>(patchProfileSchema, request.body);

    const profile = await prisma.profile.update({
      where: { id: profileId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.birthDate !== undefined ? { birthDate: new Date(input.birthDate) } : {}),
        ...(input.expectedLifespanYears !== undefined
          ? { expectedLifespanYears: input.expectedLifespanYears }
          : {})
      }
    });

    return { profile: toProfile(profile) };
  });
}
