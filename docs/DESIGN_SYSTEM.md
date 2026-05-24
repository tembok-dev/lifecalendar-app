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

## Grid System
- 52 columns per life year.
- 1 horizontal row per life year.
- Weeks flow horizontally.
- Grid should be centered and balanced like printable artwork.
- Week cells are small rounded squares.

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
- No fixed selected-week dashboard panel.
- Controls use quiet floating icons.
- Icon nav may expand slightly on hover and reveal labels.
- Use backdrop blur and soft ray-traced style shadows sparingly.

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

## Acceptance Test
When opened, the first impression must be:
- "beautiful quiet life poster"

If first impression is:
- "dashboard"
- "admin panel"
- "analytics app"

then the implementation is incorrect.
