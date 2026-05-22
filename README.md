# Life Calendar App

Stage: `v0.3.0` calendar engine foundation.

## Current Scope
- Shared calendar engine in `packages/shared` (pure TypeScript)
- Life weeks generated from `birthDate` + lifespan rules
- Event-to-week mapping by `weekIndex`
- API endpoint `GET /profiles/:profileId/calendar`
- Existing profile/event/settings CRUD remains active

Not included yet:
- Full canvas grid UI
- Onboarding
- Auth
- Export workflows

## Run
1. `pnpm.cmd install`
2. `pnpm.cmd --filter @lifecalendar/api prisma:migrate`
3. `pnpm.cmd -r typecheck`
4. `pnpm.cmd --filter @lifecalendar/shared test`
5. `pnpm.cmd dev:api`
6. `pnpm.cmd dev:web`

## Calendar Endpoint
- `GET /profiles/:profileId/calendar`
- Returns `profile`, `settings`, `summary`, and generated `weeks` with attached events.

See roadmap in [ROADMAP.md](./ROADMAP.md).