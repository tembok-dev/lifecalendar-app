# Changelog

## v0.3.0 - Calendar Engine Foundation
- Added shared calendar engine utilities in `packages/shared/src/calendar`
- Added deterministic helpers:
  - `getWeekIndexFromDate`
  - `getLifeWeekRange`
  - `getCurrentLifeWeekIndex`
  - `groupWeeksByLifeYear`
  - `attachEventsToWeeks`
- Added safe behavior for future birth dates, missing lifespan fallback, lifespan clamping, and out-of-range event indices
- Added shared calendar summary/week types and build pipeline
- Added unit tests for calendar utility behavior
- Added `GET /profiles/:profileId/calendar` route in API

## v0.2.0 - Core Data + Storage
- Added Prisma to `apps/api` with SQLite datasource
- Added schema models: `Profile`, `LifeEvent`, `AppSettings`
- Added modular Fastify routes for profiles, events, and settings
- Added centralized request validation with `zod`
- Added shared event category system and category-driven visual defaults
- Added shared typed API contracts for request/response payloads
- Added typed web API client wrapper (not yet used in UI)

## v0.1.0 - Foundation
- Initialized monorepo with pnpm workspaces
- Added `apps/web` with React + Vite + TypeScript + Tailwind
- Added `apps/api` with Fastify + TypeScript bootstrap
- Added `packages/shared` scaffold for cross-app types/helpers/constants
- Added root and docs structure for staged development
- Added minimal app shell route to verify startup