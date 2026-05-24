# Life Calendar App

Stage: `v0.4.3A` design-doc consolidation before Stage 4.3B visual implementation.

## Current Scope
- Working calendar engine and API-backed canvas flow
- Consolidated design governance with one UI/UX source of truth
- No component refactor in this stage

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