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
- Anchor-based floating surface placement should use shared positioning helpers (`computeAnchoredPopoverPosition`) instead of ad-hoc per-component math.
- Floating popovers must render through a portal outside transformed/scaled containers so viewport-based positioning remains correct.

## Overlay Primitives (Mandatory)
- Use shared primitives for interaction surfaces:
- `ModalSurface`
- `PopoverSurface`
- `TooltipSurface`
- `OverlayBackdrop`
- `FloatingRailButton`
- `Field`
- `InlineError`
- Feature components must not implement ad-hoc popover positioning logic.
- Anchor, clamp, outside-click close, and Escape-close behavior should come from primitives.
- Overlay state should stay at canvas/grid level when possible to avoid per-cell re-render overhead.

## Icons
- Use `lucide-react` for UI/navigation/action icons.
- Use `@phosphor-icons/react` for emotional event glyphs.
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
