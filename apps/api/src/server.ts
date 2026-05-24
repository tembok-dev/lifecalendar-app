import Fastify from "fastify";
import cors from "@fastify/cors";
import { healthRoutes } from "./routes/health.js";
import { profileRoutes } from "./routes/profiles.js";
import { eventRoutes } from "./routes/events.js";
import { settingsRoutes } from "./routes/settings.js";
import { calendarRoutes } from "./routes/calendar.js";
import { RequestValidationError } from "./lib/validation.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
});

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof RequestValidationError) {
    reply.status(400).send({ error: "Bad Request", message: error.message });
    return;
  }

  if (reply.statusCode < 400) {
    reply.status(500);
  }
  reply.send({ error: "Internal Server Error", message: error.message });
});

await app.register(healthRoutes);
await app.register(profileRoutes);
await app.register(eventRoutes);
await app.register(settingsRoutes);
await app.register(calendarRoutes);

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
