# Life Calendar App

Stage: `v0.1.0` foundation only.

## Current Scope
- Monorepo structure with pnpm workspaces
- `apps/web` (React + Vite + TypeScript + Tailwind)
- `apps/api` (Fastify + TypeScript)
- `packages/shared` shared package scaffold
- Initial docs and design direction
- Minimal app shell page only

Not included yet:
- Calendar logic
- Onboarding
- Event CRUD
- Auth

## Run
1. `pnpm install`
2. Web: `pnpm dev:web`
3. API: `pnpm dev:api`

## Build / Typecheck
- `pnpm build`
- `pnpm typecheck`

See roadmap in [ROADMAP.md](./ROADMAP.md).