# Life Calendar App

Stage: `v0.2.0` core data + storage foundation.

## Current Scope
- Monorepo with pnpm workspaces
- `apps/web` React shell + typed API client wrapper (unused by UI)
- `apps/api` Fastify + Prisma + SQLite + modular routes
- `packages/shared` domain constants/types/contracts
- Event categories with fixed defaults for `emotionalTone`, `iconKey`, `colorKey`

Not included yet:
- Calendar engine/canvas logic
- Onboarding
- Auth
- Export UI

## Run
1. `pnpm install`
2. Generate Prisma client: `pnpm --filter @lifecalendar/api prisma:generate`
3. Run migration: `pnpm --filter @lifecalendar/api prisma:migrate`
4. Start API: `pnpm dev:api`
5. Start web: `pnpm dev:web`

## API Routes
- `GET /health`
- `GET /profiles`
- `POST /profiles`
- `GET /profiles/:profileId`
- `PATCH /profiles/:profileId`
- `GET /profiles/:profileId/events`
- `POST /profiles/:profileId/events`
- `PATCH /events/:eventId`
- `DELETE /events/:eventId`
- `GET /profiles/:profileId/settings`
- `PATCH /profiles/:profileId/settings`

See roadmap in [ROADMAP.md](./ROADMAP.md).