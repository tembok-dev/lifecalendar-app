# LifeStep

Stage: `v0.5.0` minimal onboarding overlay.

LifeStep is the product. The Life Calendar is the core grid mechanic that powers the experience.

## Current Scope
- Working calendar engine and API-backed canvas flow
- Poster-first LifeStep canvas UI
- First-run onboarding overlay for profile creation (name + birthdate)
- Existing profile auto-load (latest profile for now)

## Documentation Authority
- UI/UX source of truth: `docs/DESIGN_SYSTEM.md`
- Agent briefing: `docs/AI_CONTEXT.md`
- Code structure rules: `docs/FRONTEND_CONVENTIONS.md`
- Decision log: `docs/DECISIONS.md`

## Run
1. `pnpm.cmd install`
2. `pnpm.cmd --filter @lifecalendar/api prisma:migrate`
3. `pnpm.cmd dev:api`
4. `pnpm.cmd dev:web`
5. `pnpm.cmd -r typecheck`

See roadmap in [ROADMAP.md](./ROADMAP.md).
