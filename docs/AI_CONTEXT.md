# AI Context

## Project State
- Stage: calendar engine foundation (`v0.3.0`)
- Shared package now contains pure calendar computation logic
- API exposes aggregated calendar output for one profile

## Calendar Engine
- Input: plain typed `profile` + `events`
- Output: `summary` + generated `weeks` with `events`
- No React or Prisma dependency in shared engine
- Handles:
  - future birth date (graceful)
  - missing lifespan (fallback default)
  - invalid lifespan (clamped)
  - out-of-range event indices (ignored safely)

## API Scope Additions
- `GET /profiles/:profileId/calendar`
- Response includes `profile`, `settings`, `summary`, `weeks`

## Do Not Add Yet
- Final calendar canvas UI
- Onboarding
- Auth
- Export UI