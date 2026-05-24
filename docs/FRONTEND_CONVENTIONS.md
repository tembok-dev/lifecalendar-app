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
- `LifeCalendarGrid` owns row/column grid mechanics.
- `WeekCell` owns visual state and in-cell marker rendering.
- `WeekPopover` owns selected week detail surface.
- `FloatingControls` owns hidden controls/menu behavior.

## Data and Interaction Flow
- Hooks/controllers handle API and viewport behavior.
- Components consume already-shaped view models where possible.
- Avoid ad-hoc data fetch or mutation logic inside leaf visual components.

## Icons
- Use `lucide-react` for UI/navigation/action icons.
- Use `@phosphor-icons/react` for emotional event glyphs.
- Event icon mapping must be centralized in one resolver utility.
- Do not import event glyphs ad hoc in random components.
- `WeekCell` should consume resolved event icon/visual metadata where possible.

## Layout Code Rules
- Avoid ad-hoc layout logic inside cells.
- Keep composition switching logic centralized and maintainable.
- Avoid one-off breakpoint hacks in many files.

## Quality Checklist
- Page remains orchestration-only.
- Grid remains horizontally stable at 52 columns.
- Control surfaces remain hidden/quiet by default.
- No component introduces dashboard card patterns unless explicitly approved in specs.
