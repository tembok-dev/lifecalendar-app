# AI Context

## Project State
- Stage: core data + storage (`v0.2.0`)
- API now persists to SQLite via Prisma
- Shared package defines domain contracts and event category defaults

## Data Model
- `Profile` has many `LifeEvent`
- `Profile` has one `AppSettings`
- `AppSettings.profileId` is unique

## API Scope (Implemented)
- Health, profile CRUD-lite, event CRUD-lite, settings read/update
- Validation is centralized in `apps/api/src/lib/validation.ts`
- Event visuals (`emotionalTone`, `iconKey`, `colorKey`) derive from category defaults

## Do Not Add Yet
- Calendar week engine
- Onboarding
- Auth
- Export UI