# Frontend Conventions

## Structure
- `src/app/pages/*` for orchestration-first route components.
- `src/app/features/*` for domain-focused UI blocks.
- `src/app/primitives/*` for reusable low-level UI.

## File Size Discipline
- Prefer small components and helpers.
- Split when one file starts mixing orchestration and UI detail.

## Styling
- Tailwind utility-first with tokenized CSS variables.
- Keep global CSS focused on tokens and base layers.

## Naming
- React components: `PascalCase`.
- Hooks/helpers: `camelCase`.
- Keep naming semantic to product intent (canvas, week cell, timeline).