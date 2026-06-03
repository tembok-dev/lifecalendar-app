# Frontend Conventions

## Purpose
This file governs code architecture and implementation boundaries only.
Visual direction lives in `docs/DESIGN_SYSTEM.md`.

## Ownership Model
- Pages orchestrate only.
- Composition components own layout modes.
- Grid components own week matrix rendering.
- Cell components own week visuals and marker rendering.
- Popover components own contextual week details.

## Required Boundaries
- `CalendarCanvas` owns composition mode and arrangement.
- `LifeCalendarGrid` owns mode selection and passes precomputed visual rows.
- `CalendarStage` owns axis labels + year rows + event rail stage composition.
- `CalendarYearRow` owns one year-row render and hover/focus expansion behavior.
- `CalendarCell` owns visual state and in-cell marker rendering from precomputed state.
- Row-level click handling for add-event date estimation belongs in `CalendarYearRow`.
- Only event-bearing cells are directly interactive; empty cells should remain passive visuals.
- `WeekPopover` owns selected week detail surface.
- `FloatingControls` owns hidden controls/menu behavior.

## Data and Interaction Flow
- Hooks/controllers handle API and viewport behavior.
- Components consume already-shaped view models where possible.
- Avoid ad-hoc data fetch or mutation logic inside leaf visual components.
- Event add/edit/delete actions should stay in hooks/controllers and be passed down to popover/form components.
- Recurrence date math and preview construction must stay centralized in shared helpers (`packages/shared/src/calendar/recurrence.ts`), not duplicated in React components.
- Calendar event presentation mapping (real vs upcoming preview labels/order/tooltips) must be centralized in one display helper and reused by cell + rail renderers.
- The calendar API payload is the canonical source for:
- full stored profile events
- in-range grid events
- current-year recurring preview slices / derived event metadata
- Frontend should compose and group that data for rendering, but should not re-own product correctness rules already available from the API/shared layer.
- Anchor-based floating surface placement should use shared positioning helpers (`computeAnchoredPopoverPosition`) instead of ad-hoc per-component math.
- Floating popovers must render through a portal outside transformed/scaled containers so viewport-based positioning remains correct.

## Tokens
- `apps/web/src/index.css` semantic tokens are the primary styling source of truth.
- New components must use shared tokens for color, radius, motion, spacing, and sizes where practical.
- Prefer CSS variables over ad-hoc Tailwind literals when the value is part of the design system.
- Avoid long component-specific Tailwind class piles when a primitive or token-backed utility already exists.

## Overlay Primitives (Mandatory)
- Use shared primitives for interaction surfaces:
- `ModalSurface`
- `ModalHeader`
- `ModalSection`
- `ModalField`
- `ModalFooter`
- `ModalAccentOrb`
- `PopoverSurface`
- `TooltipSurface`
- `OverlayBackdrop`
- `FloatingRailButton`
- `FloatingInput`
- `FloatingTextarea`
- `FloatingSelect`
- `ToggleSwitch`
- `IconChoiceChip`
- `ExpandableSection`
- `InlineError`
- `TabRail`
- Feature components must not implement ad-hoc popover positioning logic.
- Anchor, clamp, outside-click close, and Escape-close behavior should come from primitives.
- Overlay state should stay at canvas/grid level when possible to avoid per-cell re-render overhead.
- All modals must use `ModalSurface`.
- Inputs inside modals should use `FloatingInput` / `FloatingTextarea` / `FloatingSelect` where practical.
- Category choices in overlay forms should use `IconChoiceChip` via the shared picker.
- Modal tab switching should use the shared `TabRail` when a modal has multiple content groups.
- Destructive event actions must only appear inside the event edit modal and require confirmation.
- Modal/list event rows should use the shared `EventListItem` instead of ad-hoc bordered boxes.
- Visible UI should use the shared `Tooltip` / `TooltipSurface` primitive instead of native browser `title` tooltips.
- Calendar cell hover is preview-only. Full event details/lists belong to click flows, not hover cards.
- Shared primitives are mandatory for modal/popover/field surfaces before introducing custom feature-level UI wrappers.

## Icons
- Use `lucide-react` for UI/navigation/action icons.
- Use `@phosphor-icons/react` for emotional event glyphs.
- UI/action affordances should use `lucide-react` wherever practical, including destructive actions such as delete.
- Event icon mapping must be centralized in one resolver utility.
- Do not import event glyphs ad hoc in random components.
- `WeekCell` should consume resolved event icon/visual metadata where possible.

## Layout Code Rules
- Avoid ad-hoc layout logic inside cells.
- Avoid per-cell date/event calculations inside render; preprocess visual rows with memoized mapping utilities.
- Prefer row-level interaction handlers over per-cell handlers for performance.
- Keep composition switching logic centralized and maintainable.
- Avoid one-off breakpoint hacks in many files.

## Quality Checklist
- Page remains orchestration-only.
- Grid remains horizontally stable at 52 columns.
- Control surfaces remain hidden/quiet by default.
- No component introduces dashboard card patterns unless explicitly approved in specs.
