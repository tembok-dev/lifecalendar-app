# Design System

This file is the single source of truth for Life Calendar UI/UX.

## Product Feel
- Interactive cinematic life poster.
- Calm wall art.
- Emotional time visualization.
- Ambient, reflective, private.
- Not dashboard.
- Not productivity app.
- Not admin UI.
- Not analytics UI.

## Core Direction
- The week grid is the hero.
- Default view should feel like a premium poster.
- UI chrome should almost disappear.
- Controls are hidden or quiet.
- Whitespace is part of the design.
- The app should look good as screenshot, wallpaper, or print.

## Composition Modes
Support two intentional compositions. These are explicit product modes, not accidental breakpoint behavior.

### 1. Vertical Poster Composition
- Centered grid as dominant visual mass.
- Sticky translucent top rail for minimal context/actions.
- On first load, current life year should be centered in viewport.
- Poster should feel contemplative and balanced.

### 2. Horizontal Poster Composition
- Grid on one side.
- Contextual reflection space on the other side.
- Reflection space stays quiet, low-density, and non-dashboard.
- Grid must still remain visual hero.

## Responsive Composition Rules
- Do not design by random breakpoints only.
- Use simple maintainable composition switching rules.
- Keep component boundaries stable across compositions.
- Avoid ad-hoc per-component layout exceptions.

## Layout Rules
- No sidebar.
- No admin-style topbar.
- No dashboard panels.
- No giant cards competing with grid.
- No large bordered containers in default view.
- Keep tonal layering subtle; rely on spacing and depth, not box outlines.

## Typography
- Use `Outfit`.
- Large text only where emotionally useful.
- Keep metadata minimal.
- Avoid all-caps except tiny labels.

## Palette Direction
- Soft dark canvas, never pure black.
- Warm off-white text, never pure white.
- Muted ink / charcoal / stone / mist / moonlight tones.
- Accent is restrained and event-driven.
- No neon dashboard color language.
- No gamer-glow treatment.

## Product Visual Identity
- Premium life poster, not SaaS control panel.
- Floating surfaces should feel deliberate and calm, never plastic or hyper-glossy.
- Visual tuning should come from shared tokens, not one-off component styling.

## Color System
- Semantic color tokens live in `apps/web/src/index.css`.
- Core token groups:
- background: `--color-bg`, `--color-bg-soft`, `--color-poster`
- surfaces: `--color-surface`, `--color-surface-raised`, `--color-surface-floating`, `--color-surface-field`
- borders: `--color-border-soft`, `--color-border-strong`
- text: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
- accents: `--color-accent`, `--color-accent-soft`, `--color-accent-strong`
- danger: `--color-danger`
- Component styling should reference semantic tokens instead of hard-coded random colors.

## Dark Theme Tokens
- Dark theme is the active theme and is defined under `:root`.
- Existing working visuals should be preserved by updating token values rather than rewriting layout primitives.

## Light Mode Preparation
- A `[data-theme="light"]` scaffold exists for future light mode.
- Light mode should override semantic tokens only.
- Do not fork component markup or duplicate primitives for light mode.

## Radius Rules
- Use a reduced squircle-like system:
- `--radius-xs: 6px`
- `--radius-sm: 10px`
- `--radius-md: 14px`
- `--radius-lg: 18px`
- `--radius-xl: 22px`
- `--radius-modal: 22px`
- `--radius-pill: 999px`
- Avoid giant bubbly corner radii unless the shape is intentionally pill-like.

## Surface Hierarchy
- Page/background uses `--surface-page` and poster gradients.
- Raised contextual surfaces use `--color-surface-raised`.
- Modal surfaces use `--surface-floating`.
- Fields use `--surface-field`.
- Keep layering subtle; rely on depth and spacing more than heavy borders.

## Modal Rules
- Modal width tokens:
- `--modal-width-compact`
- `--modal-width-default`
- `--modal-width-wide`
- Modal radius should use `--radius-modal`.
- Modal shadow should use `--shadow-modal`.
- Modal body should scroll internally with styled scrollbars when content exceeds height.
- Large forms inside modals must stay compact; avoid full-page form feeling.

## Popover Rules
- Popover width uses `--popover-width-md` unless a justified override is needed.
- Popovers use `--shadow-popover` and `--radius-lg`.
- Motion should be opacity + small translate only.
- Popovers must appear at their anchor, not visibly travel from screen origin.

## Tooltip Rules
- Tooltips should use the shared floating glass primitive, not browser-native tooltip chrome.
- Tooltip sizing should stay compact:
- font `11-12px`
- padding `6px 8px`
- max width `260px`
- Tooltips are preview-only and should never replace click-based detail flows.
- Calendar event cells may show short tooltip previews, but multi-event hover must remain icon/count-first rather than text-card heavy.

## Field Rules
- Field heights:
- `--field-height-sm`
- `--field-height-md`
- `--field-height-lg`
- Field radius uses `--radius-md`.
- Focus ring and active emphasis use accent tokens, not browser defaults.

## Toggle Rules
- Toggles stay quiet and compact.
- Accent only appears when active.
- Never use oversized glossy switches.

## Category Chip Rules
- Chips use shared radius tokens and subtle borders.
- Selected state may use accent ring/glow, but event/category icons should preserve category color when appropriate.
- Avoid giant kiosk-like category grids.

## Event Marker Rules
- Event markers should remain quieter than the current time marker.
- Recurring anticipation markers must stay softer than completed memories.
- Destructive actions are never exposed directly from event list rows.

## Calendar Grid Rules
- Calendar-specific geometry tokens stay in `index.css` beside general design tokens.
- Shared token edits should be enough to tune spacing, rail width, month cell proportions, and current-cell emphasis globally.

## Motion Rules
- Motion tokens:
- `--motion-fast: 120ms`
- `--motion-base: 160ms`
- `--motion-slow: 220ms`
- `--ease-standard`
- `--ease-out-soft`
- Use snappy reveal motion for overlays.
- Avoid bounce, springy theatrics, or long AI-like float animations.

## Grid System
- 52 columns per life year.
- 1 horizontal row per life year.
- Weeks flow horizontally.
- Grid should be centered and balanced like printable artwork.
- Week cells are small rounded squares.
- Row-first behavior:
- right-side event rail belongs to each year row.
- compact icons by default; row hover/focus may expand icon + title list.
- decade spacing and 4-week group rhythm must remain stable.

## Calendar Mapping Semantics
- Visual grid is calendar-year aligned, not birthday-offset aligned.
- Each row represents a real calendar year from January to December.
- Week mode:
- Columns represent week slots in that real calendar year.
- Current week highlight is based on actual current date position in that calendar year.
- Event in April must render around April slots.
- Month mode:
- Columns are Jan..Dec.
- Event in April must render in the April column.
- Birth year:
- Cells before birth week/month are pre-birth and visually inactive/hidden.
- Do not style pre-birth slots as past or future.
- Status rules per slot date range:
- `pre-birth`: slot range ends before birthDate.
- `past`: slot range ends before now.
- `current`: now is inside slot range.
- `future`: slot range starts after now.
- Event placement:
- Place by `event.date` into calendar-year row + real week/month slot.
- Do not place by lifetime week index.
- Lifetime age/week values are metadata, not slot-placement coordinates.

## Week State Language
- Past weeks: solid or soft fill.
- Current week: soft glow or active marker.
- Future weeks: border-only.
- Distant future: additional subtle fade.
- Current year/current age row: subtle emotional emphasis only.

## Event Rendering Rules
- Use `@phosphor-icons/react` for emotional event glyphs.
- Keep `lucide-react` for UI/navigation/action icons only.
- Event markers/icons stay inside week cells.
- Event category controls icon, tone, and color.
- Do not allow infinite icon picking.
- Events should feel like life punctuation, not task labels.
- Event cells use restrained tint overlays, never loud badge chips.

### Recurring Event Display
- Current year: show colored recurring markers.
- Past: show only first occurrence.
- Future recurring display: conservative until recurrence logic is fully defined.
- Upcoming recurring in current year should use an anticipation marker:
- softer tinted fill
- low opacity
- subtle ring/glow
- must remain visually future (not completed).
- recurring anticipation markers should stay weaker than the active current week/month marker.

## Progress Rail Concept
- Include a top life progress rail concept.
- Purpose: quickly communicate life elapsed vs remaining.
- Treatment: subtle, emotional, not gamified.
- Must never look like KPI/progress-product UI.

## Interaction Rules
- Week hover softly reveals focus.
- Hover may gently lift/brighten cell.
- Nearby context may dim subtly.
- Week click opens tiny contextual popover.
- Empty slots should prefer row-level interaction over individual click behavior.
- Event slots can use stronger hover magnification and remain directly clickable.
- Row click may estimate slot date for add-event flow.
- Right floating rail may include a quiet `+` quick-add action.
- No fixed selected-week dashboard panel.
- Controls use quiet floating icons.
- Icon nav may expand slightly on hover and reveal labels.
- Use backdrop blur and soft ray-traced style shadows sparingly.

## Overlay Surface Rules
- Modal surface background: `rgba(18, 24, 29, 0.88)`.
- Popover surface background: `rgba(16, 22, 27, 0.92)`.
- Border: `1px solid rgba(220, 230, 240, 0.08)`.
- Shadow: `0 24px 80px rgba(0,0,0,0.38)`.
- Backdrop blur: max `16px`.
- Radius:
- modal `24px`
- popover `18px`
- floating buttons `999px` (or `14px` if contextual block button)
- Padding:
- modal `24px` desktop, `18px` compact
- popover `14-16px`
- Text scale:
- title `18-22px`
- body `13-14px`
- helper `11-12px`

## Overlay Motion + Placement
- Motion uses only opacity + translateY.
- Duration `140-180ms`, no bounce.
- Popovers must anchor to trigger rect.
- Popovers choose above/below using available viewport space.
- Popovers clamp inside viewport with `16px` margin.
- Popovers may show a small arrow pointer.
- Tooltips use a small delay and must not steal focus.
- Outside click closes popovers.
- Escape closes modal/popover.
- Modal opens centered and focus moves into modal when feasible.

## Floating Surface System
- Floating overlays should feel like deliberate objects above the poster, not flat black panels.
- Use blue-black glass surfaces with a slightly brighter value than the poster background.
- Organize content into soft islands rather than dashboard cards.
- Keep one restrained accent only; no purple-first bias and no neon glow treatment.
- Settings-style utility modals may use compact tab rails to switch sections instead of stacking large cards.
- Tab rails should feel quiet and structural, not like dashboard navigation.
- Inputs must visibly separate from the surface:
- field height `46px`
- large title input `58px`
- radius `16px`
- focus uses the app accent glow, not browser default rings
- Toggle controls should be quiet switches, not browser checkboxes.
- Category selection should be icon-first and human, with quick picks up front and advanced choices tucked behind expansion.

## Zoom Architecture Guidance
- Start with transform-scale architecture using `CalendarViewport` + `CalendarStage`.
- Do not use SVG yet unless export precision or performance requires it.
- Zoom behavior must remain simple, maintainable, and easy to debug.

## Anti-Patterns (Hard Reject)
- Stat cards on default view.
- Visible refresh button on default view.
- Legend pill over artwork by default.
- Heavy bordered containers.
- Sidebar layout.
- Dashboard panels.
- Noisy metadata.
- Giant competing cards.
- Neon/gamer glow.
- Any first impression resembling SaaS analytics.
- Native ugly scrollbars inside premium overlay surfaces.
- Random one-off colors or component-specific magic radii without documentation.
- Full-page Add Memory or full-page Settings forms inside modals.
- Delete actions exposed directly in event list rows.

## Acceptance Test
When opened, the first impression must be:
- "beautiful quiet life poster"

If first impression is:
- "dashboard"
- "admin panel"
- "analytics app"

then the implementation is incorrect.
