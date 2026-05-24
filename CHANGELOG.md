# Changelog

## v0.4.7 - Event Visual System Polish
- Added `@phosphor-icons/react` for emotional event glyphs in the web app.
- Introduced centralized event icon resolver:
  - `apps/web/src/app/features/calendar/utils/eventIcons.ts`
- Kept `lucide-react` for UI/navigation controls only.
- Updated `WeekCell` event rendering:
  - Phosphor event glyphs inside cells
  - restrained event tint overlays for readability
  - subtle anticipation marker styling for upcoming current-year event cells
  - added recurrence TODO note pending recurrence model fields
- Updated row-side event markers:
  - Phosphor glyphs, real category labels, restrained colors
  - tiny hover labels and subtle row-hover brighten behavior
- Preserved calendar-year event mapping by `event.date`.

## v0.4.6 - Poster Polish + Visual QA Lock
- Polished poster spacing and top-rail composition to better match mockup proportions.
- Refined scale mode UX:
  - kept a single quiet fit/contain toggle
  - subtle active-state indication on the toggle icon
- Refined first-load positioning:
  - fit-width centers current row once without repeated jump
  - contain resets to full-grid overview position
- Refined axis labels:
  - week mode labels aligned to columns at `4, 8, 12, ...`
  - month mode labels aligned to calendar slots (`Jan, Apr, Jul, Oct`)
- Softened week-cell visual tokens:
  - calmer past fill
  - restrained current glow
  - quieter future outlines
- Locked row-side event icon alignment to real calendar year by filtering icon summaries via `event.date` year.
- Removed remaining debug-ish mode caption noise from the grid header.

## v0.4.3B - Poster Composition Refinement
- Added poster composition architecture components:
  - `CalendarViewport`
  - `CalendarStage`
  - `PosterTopRail`
  - `LifeProgressRail`
  - `PosterNavIcons`
  - `ReflectionSpace`
- Added composition mode switching (`vertical` / `horizontal`) with simple maintainable layout rules
- Added first-load current life-year centering inside viewport
- Added transform-scale zoom architecture with quiet icon controls
- Refined grid rendering and row emphasis:
  - strict 52 columns per life-year row
  - subtle current-life-year row emphasis
  - distant future fade treatment
- Refined week interaction and polish:
  - tiny contextual popover on click
  - calmer hover lift/brighten behavior
- Switched event glyph rendering to `lucide-react` icons inside cells
- Added recurrence-display TODO guardrail in week cell for future Stage 5+ recurrence model work

## v0.4.3A - Design Doc Consolidation
- Consolidated UI/UX governance into `docs/DESIGN_SYSTEM.md` as single source of truth
- Reduced `docs/DESIGN_LANGUAGE.md` to pointer-only document
- Reduced `docs/UI_SPEC.md` to pointer-only document
- Updated `docs/AI_CONTEXT.md` to short agent briefing with mandatory design-system pointer
- Updated `docs/FRONTEND_CONVENTIONS.md` to code architecture/component boundaries only
- Updated `docs/DECISIONS.md` with documentation governance, zoom strategy, and recurring marker rules
- Updated README/ROADMAP to reflect documentation lock before Stage 4.3B

## v0.4.1 - Canvas UI Correction Pass
- Reworked calendar screen from dashboard-like layout to art-first poster composition
- Removed default visible stats panel and fixed selected-week side card
- Replaced visible control row with one quiet floating info button
- Moved legend behind optional info toggle as a minimal caption
- Changed selected-week details to tiny floating click-near popover
- Refined week-cell visual language to be calmer:
  - past = soft fill
  - current = subtle glow
  - future = light outline
- Kept event markers inside week cells with compact density rules
- Corrected year-row grid rendering to strict horizontal 52-column composition

## v0.4.0 - Primary Calendar Canvas UI Skeleton
- Added canvas-first calendar page orchestration
- Added reusable calendar components
- Added calendar data loading hook/controller
- Added event marker rendering in week cells

## v0.3.0 - Calendar Engine Foundation
- Added shared calendar engine utilities and tests
- Added `GET /profiles/:profileId/calendar` route

## v0.2.0 - Core Data + Storage
- Added Prisma + SQLite data layer and CRUD routes

## v0.1.0 - Foundation
- Initialized monorepo and baseline apps/packages/docs
