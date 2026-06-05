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

## D-018 Semantic Design Tokens
- Semantic design tokens defined in `apps/web/src/index.css` are the styling source of truth for color, radius, motion, spacing, and shared surface sizes.
- Future UI changes should prefer token edits over component-specific magic values.
- This token system prepares future light mode by overriding semantic variables rather than rewriting component markup.

## D-019 Floating Surface Behavior
- Floating modals and popovers use shared primitives plus shared motion rules.
- Anchored floating surfaces must portal to `document.body` when used inside transformed/scaled containers.
- Destructive event actions remain inside edit modal flows and require confirmation.

## D-020 Calendar Payload Ownership
- The API/shared calendar factory owns canonical event derivation for calendar responses.
- `GET /profiles/:profileId/calendar` should provide:
- full stored events needed by modal/list surfaces
- visible in-range calendar weeks
- derived event slices needed for correctness, such as current-year recurring previews
- Frontend remains responsible for rendering composition, grouping, and interaction, but should not recompute business-critical event slices when the shared/API layer can provide them.

## D-021 Brand Naming Boundary
- `LifeStep` is the app/product name used in user-facing surfaces and product documentation.
- `Life Calendar` remains the name of the calendar mechanic and technical engine concepts where stability matters.
- Branding passes should avoid mass-renaming engine files, routes, helpers, or persistence structures unless product behavior changes require it.
