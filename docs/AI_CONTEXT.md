# AI Context

## Current Stage
- Stage `5.0`: minimal onboarding overlay.
- First-run users create profile directly over poster canvas (no setup page).

## Mandatory Read Before UI Work
1. `docs/DESIGN_SYSTEM.md` (UI/UX single source of truth)
2. `docs/FRONTEND_CONVENTIONS.md` (implementation structure)
3. `docs/DECISIONS.md` (decision constraints)
4. `apps/web/src/index.css` (semantic design token source)

## Agent Guardrails
- Do not invent dashboard UI.
- Do not add stat cards, panels, or admin chrome in default view.
- Use the user mockup direction: vertical and horizontal poster compositions.
- If a UI choice conflicts with `DESIGN_SYSTEM.md`, `DESIGN_SYSTEM.md` wins.
- Do not improvise AI-glow, gamer-glow, or bubbly generic modal UI.
- Use shared tokens and overlay primitives before adding one-off Tailwind styling.

## Product Reminder
LifeStep is an emotional time poster, not productivity software.
- The Life Calendar is the core grid mechanic inside the product.
