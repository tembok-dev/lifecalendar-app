import type { FastifyInstance } from "fastify";
import type { ApiHealthResponse } from "@lifecalendar/shared";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async (): Promise<ApiHealthResponse> => ({ status: "ok" }));
}