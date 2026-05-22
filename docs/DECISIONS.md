# Decisions

## D-001 Monorepo
Use pnpm workspaces to keep web/api/shared coordinated with a single lockfile.

## D-002 UI Direction
Adopt a dark-first, reflective interface with minimal chrome; the canvas is the product.

## D-003 Structure Discipline
Enforce feature folders, reusable primitives, orchestration-first pages, and small files from day one.

## D-004 Stage Scope
Stage 1 intentionally excludes onboarding, event CRUD, auth, and real calendar logic.

## D-005 Data Layer
Use Prisma + SQLite for early-stage local persistence and migration discipline.

## D-006 Event Categories
Use fixed category vocabulary and derive event visuals from shared defaults to keep event creation lightweight and constrained.

## D-007 Shared Contracts
Expose API request/response contracts from `packages/shared` so web/api evolve on typed boundaries.

## D-008 Calendar Engine Placement
Keep life-week calculation and event attachment in `packages/shared` as pure deterministic utilities with no UI or ORM coupling.

## D-009 Lifespan Safety Rules
Clamp lifespan to safe bounds and provide defaults so calendar generation is resilient to incomplete or malformed profile data.