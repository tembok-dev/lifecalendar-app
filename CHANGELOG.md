# Changelog

## v0.6.5H - Portal Floating Popovers Outside Scaled Calendar
- Portaled `PopoverSurface` to `document.body` so fixed-position popovers are no longer offset by scaled/transformed calendar ancestors.
- Kept shared anchor-rect positioning helper and side-aware arrow rendering.
- Tightened rail popover anchoring to the compact rail icon-group container instead of the broader rail wrapper.
- Preserved click-through behavior for rail list items and existing week/legend popover flows.

## v0.6.5F - Stable Rail Group Anchor + Smart Positioning
- Refactored rail popover anchoring to the rail-group container (`.calendar-event-rail-anchor`) instead of per-icon/mouse interaction.
- Compact rail icons are now visual summary only; interaction moved to popover list items.
- Added shared deterministic anchor-rect positioning helper: `computeAnchoredPopoverPosition`.
- Popover placement now prefers left of rail with right fallback and viewport clamping.
- Popover content now groups sections as `Upcoming` then `Memories`, with clickable `date · title` rows.

## v0.6.5E - Rail Popover Anchoring + Context Polish
- Polished event rail popover anchoring to row rail geometry (not pointer position), preferring left-of-rail placement with fallback.
- Added side-aware popover arrow so the panel clearly points back to the hovered year row rail.
- Added compact year context header (`Age X · YYYY`) in rail popover.
- Updated rail line format to compact date + title with upcoming prefix (`Upcoming DD Mon · Title`).
- Removed native tooltip conflict from rail hover targets; tooltip now lives on truncated inner line text.

## v0.6.5D - Anchored Event Rail Popover
- Replaced in-row event rail expansion with anchored floating popover on rail hover/focus.
- Removed rail hover behavior that expanded/clipped row flow; row rhythm now stays stable.
- Compact rail remains icon-only (`max 3 +N`), with subdued upcoming-preview icon tone.
- Popover now shows row event list (`max 6 +N`) with `Upcoming: ...` labels for preview items.
- Rail popover items keep click-through behavior to the same event detail/list flow.

## v0.6.5C - Rail Expansion + Grouped Hover Simplification
- Simplified grouped event-cell hover: removed detached text hover card; grouped cells now scale and reveal compact tiny icon stack + optional `+N`.
- Kept full grouped event details in click popover flow (no hover popover/list behavior).
- Added explicit `.calendar-year-row` + rail expansion classes for reliable row-hover expansion behavior.
- Reworked event rail expansion to max-height/opacity transition with unclipped vertical list rendering.
- Compact rail remains icon-first; expanded state shows icon + label rows and `Upcoming: ...` labels for preview items.

## v0.6.5B - Event Presentation Polish
- Added shared display-item helper for calendar events/previews: `buildCalendarEventDisplayItems`.
- Grouped event cells now keep compact count by default and reveal a small overlay list on hover/focus (max 3 + `+N more`).
- Upcoming preview items now render with muted foreground treatment vs real event category emphasis.
- Event rail compact mode remains icon-only; expanded row-hover mode now renders full vertical icon+label list for all row items.
- Current-year ordering now keeps real events first and upcoming previews after.
- Rail and cell click behavior still routes into the same detail popover flow.

## v0.6.5 - Recurring Event Foundation + Upcoming Markers
- Added recurrence fields to life events (`isRecurring`, `recurrenceType`) across Prisma, shared models, and API contracts.
- Added yearly recurrence defaults helper (`deriveRecurrenceDefaults`) with category-based defaults:
- birthday and relationship default to yearly.
- family defaults to yearly only when birth-like wording is detected.
- loss defaults to non-recurring.
- Added shared recurrence date helpers:
- `getYearlyOccurrenceDate`
- `isOccurrenceAfterToday`
- `buildRecurringPreviewEvents`
- Updated event create/edit form with quiet `Repeat yearly` toggle and guarded auto-default behavior when category changes.
- Added current-year upcoming recurring preview markers in calendar rows/cells.
- Updated event rail to include subtle upcoming recurring items and show `Upcoming: ...` labels.
- Kept upcoming recurring markers as anticipation visuals so they stay secondary to current week/month emphasis.

## v0.6.4 - Calendar Interaction Engine
- Shifted interaction model to row-first for performance: empty slots are now passive visuals.
- Added shared row-click date estimator utility: `estimateDateFromRowClick`.
- Year-row grid click now opens add-event flow with estimated date (week/month mode aware, pre-birth clamped).
- Event cells remain directly interactive and now use stronger hover magnification.
- Event rail icons/items are clickable and open the same event detail popover flow as event cells.
- Reused add-event popover for both top quick-add and row-click add flows via shared default date/context props.
- Added adaptive behavior for constrained widths:
- auto mode flips to month layout earlier on narrow containers.
- right event rail hides when container width is too constrained.
- month mode now uses wider slot width to use available row space better.
- No API/Prisma changes.

## v0.6.3 - Calendar Rendering Engine v2 (Row-Based Stage)
- Refactored calendar rendering to a row-first visual model with precomputed visual rows.
- Added reusable calendar stage components:
- `CalendarStage`
- `CalendarAxisLabels`
- `CalendarYearRow`
- `CalendarCell`
- `CalendarEventRail`
- Added `buildVisualCalendarRows` utility to preprocess row/cell visual state with calendar-year date mapping.
- Moved row hover expansion behavior to CSS (`group-hover`/`focus-within`) for event-rail icon-to-title expansion.
- Preserved existing poster composition, 4-slot grouping rhythm, decade spacing, and right-side event rail behavior.
- Kept event placement date-based (`event.date`) in real calendar year slots.
- No API/Prisma changes.

## v0.6.2B Cleanup - Vertical Sandbox Simplification
- Simplified `/layoutvertical` back to a single-file proof-of-concept layout sketch.
- Removed sandbox-only component extraction and restored an intentionally manual editable structure.
- Removed sandbox date/business logic and replaced identity/progress values with static placeholders.
- Kept the route temporary and disposable; main `/` route behavior remains unchanged.

## v0.6.2B - Vertical Poster Sandbox Layout Refinement
- Refactored `/layoutvertical` sandbox into reusable poster layout components:
- `VerticalPosterSandboxPage`
- `PosterTopDock`
- `PosterIdentityHeader`
- `PosterFadeMasks`
- `CalendarCompositionFrame`
- `CalendarAxisLabels`
- `CalendarEventColumn`
- `FloatingActionRail`
- Reworked top dock behavior:
- sticky top-centered composition with max `300px` dock width
- icon hover now scales from `75%` to `100%` with muted non-hover state
- progress rail visually attached and width-locked to the dock
- Rebuilt calendar composition as a stage frame with reserved spaces for:
- axis labels
- grid body
- event column
- Added explicit `CalendarStage` scale-unit readiness comment and `transform-origin: top left` structure for future fit/contain scaling.
- Added tunable vertical poster CSS variables for spacing and geometry:
- `--poster-max-width`
- `--poster-page-padding-x`
- `--poster-top-dock-width`
- `--poster-top-dock-offset`
- `--poster-identity-height`
- `--calendar-axis-x`
- `--calendar-axis-y`
- `--calendar-event-column-width`
- `--calendar-stage-gap`
- `--calendar-cell-gap`
- `--calendar-decade-gap`
- `--poster-fade-height`
- Kept `/` route and core calendar engine behavior unchanged; `/layoutvertical` remains a temporary sandbox route only.

## v0.6.1 - Interaction Primitives + Overlay System
- Added reusable interaction primitives:
- `ModalSurface`
- `PopoverSurface`
- `TooltipSurface`
- `OverlayBackdrop`
- `FloatingRailButton`
- `Field`
- `InlineError`
- Refactored poster interactions to use shared surfaces:
- Settings modal now uses `ModalSurface`
- Week event popover uses `PopoverSurface`
- Quick add popover uses `PopoverSurface`
- Legend panel uses `PopoverSurface`
- Row-side marker labels use `TooltipSurface`
- Standardized overlay behavior:
- anchor-based positioning
- above/below popover placement
- viewport clamping with safe margin
- outside-click close + Escape close
- Updated event/profile/settings forms to use shared field/error primitives for calmer, consistent inputs.
- Added docs rules making overlay primitives mandatory and banning ad-hoc feature-level popover positioning.

## v0.6.0 - Settings Modal
- Connected settings icon to open a calm in-canvas modal overlay.
- Added settings sections:
  - Profile: name, birthdate, expected lifespan years
  - Calendar view: default display mode, default scale mode, show year markers, show event markers
  - Data: profile id and reload calendar action
- Added inline validation:
  - name required
  - birthdate required
  - expected lifespan range `1-130`
- Wired save flows through existing APIs:
  - profile updates via `PATCH /profiles/:profileId`
  - settings updates via `PATCH /profiles/:profileId/settings`
- After save, calendar refetches and poster stays visible behind modal.
- Added persisted local view defaults:
  - display mode (`auto/weeks/months`)
  - scale mode (`fit-width/contain`)

## v0.5.6 - Event UX Usability Pass
- Added quiet floating `+` action in right rail for quick event creation without selecting a cell.
- Added global quick-add popover:
  - default date = today
  - manual date edit allowed
  - saves through existing event API flow
- Improved clicked-cell event UX:
  - clearer contextual date helper header (`Week N of YYYY` / `Month YYYY`)
  - add action copy changed to `Add memory here`
  - slot date default preserved (week start or month start)
- Improved discoverability:
  - subtle first-use hint near `+` action when no events exist
- Kept poster-first interaction with compact contextual forms and no dashboard/event-manager pages.

## v0.5.5 - Click Week -> Add Event Flow
- Added contextual week popover event flow:
  - empty cell: `Add memory`
  - populated cell: compact event list with `Edit`, `Delete`, and `Add another`
- Added extracted mini components:
  - `EventList`
  - `EventMiniForm`
  - `EventCategoryPicker`
- Added inline event form fields:
  - category, title, date, optional note, showOnExport, isPrivate
- Added date defaults by selected view granularity:
  - week mode: selected week start date
  - month mode: first day of selected month
- Wired event CRUD through `useCalendarData`:
  - create/update/delete event methods
  - safe calendar refresh after mutation
- Preserved calendar-year visual mapping by `event.date`.

## v0.5.0 - Minimal Onboarding Overlay
- Added first-run profile detection in web data layer:
  - no profiles => onboarding overlay
  - profiles exist => latest profile auto-load
- Added in-canvas minimal onboarding overlay:
  - Step 1 intro (`Begin`)
  - Step 2 name + birthdate form
  - profile creation via API
- Added graceful states:
  - loading
  - create validation errors
  - API create errors
  - retry remains available for load failures
- After successful profile creation:
  - calendar data loads immediately
  - onboarding overlay closes
  - poster canvas is shown directly (no setup page)

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
