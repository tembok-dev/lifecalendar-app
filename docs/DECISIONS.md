# Decisions

## D-001 Monorepo
Use pnpm workspaces for coordinated web/api/shared development.

## D-002 Data Foundation
Keep calendar engine logic in shared pure TypeScript utilities.

## D-003 UI Source of Truth
`docs/DESIGN_SYSTEM.md` is the single UI/UX source of truth.

## D-004 Document Scope Separation
- `AI_CONTEXT.md`: agent briefing only.
- `FRONTEND_CONVENTIONS.md`: code structure and boundaries only.
- `DECISIONS.md`: decision log only.

## D-005 No Separate Visual Composition Doc
Do not introduce a separate `VISUAL_COMPOSITION.md` for now.
Composition rules remain inside `DESIGN_SYSTEM.md`.

## D-006 Default View Policy
Default canvas must not show dashboard cards, fixed side panels, or visible refresh controls.

## D-007 Zoom Strategy
Use transform-scale `CalendarViewport/CalendarStage` architecture first.
Do not move to SVG unless export/precision/performance demands it.

## D-008 Recurring Event Marker Rule
- Current year: show colored recurring markers.
- Past: show first occurrence only.
- Future recurring: conservative rendering until recurrence logic is finalized.

## D-009 Calendar Visual Mapping Semantics
- Visual grid uses calendar-year alignment for usability.
- Rows are real years (Jan..Dec), not birthday-offset years.
- Visual event placement is date-based (`event.date`) into real week/month slots.
- Lifetime metrics (`lifetimeWeekIndex`, age-based totals) remain metadata and must not drive visual slot position.

## D-010 Hybrid Icon System
- `lucide-react` is reserved for UI/navigation/action controls.
- `@phosphor-icons/react` is used for life-event glyphs in cells and row-side markers.
- Event icon mapping is centralized and must not be scattered across components.

## D-011 Recurring Anticipation Marker (Staged)
- Before full recurrence data model exists, anticipation styling is allowed as a visual stage.
- Current-year upcoming recurring markers should use a softer anticipation style.
- Full recurrence semantics remain TODO until recurrence fields are added.

## D-012 Temporary Profile Loading Rule (Pre-Auth)
- If profiles exist, app loads the latest created profile.
- If no profiles exist, app shows in-canvas onboarding overlay.
- No separate setup page or dashboard onboarding flow.

## D-013 In-Canvas Settings Modal
- Profile and calendar basics are edited through a calm overlay modal on top of the poster.
- No separate settings page is introduced.
- Settings changes apply via existing profile/settings APIs and refresh the calendar view.

## D-014 Local View Defaults
- Default display mode and scale mode are persisted as local UI preferences.
- API-backed settings continue to own server-side calendar marker toggles.

## D-015 Temporary Vertical Layout Sandbox Route
- Added temporary dev-only `/layoutvertical` route for manual vertical poster composition refinement.
- This sandbox is for low-risk layout tuning only and does not alter API/Prisma, event creation logic, or the main route behavior.

## D-016 Vertical Sandbox Simplicity Rule
- `/layoutvertical` is intentionally a simple, disposable visual proof-of-concept file.
- Keep it easy to edit manually during composition exploration.
- Do not enforce reusable component architecture in this sandbox until layout direction is approved.

## D-017 Yearly Recurrence Foundation
- Life events now support `isRecurring` and `recurrenceType` (`yearly` currently).
- Category-based defaults are applied on create, and on category change when recurrence was not explicitly set by the user.
- Current-year upcoming recurring occurrences are rendered as anticipation previews only (no completed-memory semantics).
