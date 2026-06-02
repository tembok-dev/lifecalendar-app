# Roadmap

## Phase 1 - Foundation (Done)
- Repo structure
- Web/API/shared scaffolding
- Base docs and conventions

## Phase 2 - Core Data + Storage (Done)
- Prisma + SQLite setup
- Models: `Profile`, `LifeEvent`, `AppSettings`
- CRUD/settings routes + validation

## Phase 3 - Calendar Engine (Done)
- Shared week generation and summary
- Deterministic date/index utilities
- Event attachment and grouping
- Calendar aggregate API endpoint

## Phase 4 - Canvas Visual Direction
### 4.0-4.2 (Done, Iterative)
- Initial canvas UI skeleton and correction passes

### 4.3A (Current)
- Consolidate and lock design documentation
- Establish single UI/UX source of truth

### 4.3B (Next)
- Implement visual repair strictly from consolidated design rules
- Enforce poster compositions (vertical/horizontal)
- Introduce zoom-ready viewport structure

## Phase 5 - Onboarding Overlay (Done)
- In-canvas name + birthdate capture
- Create first profile without leaving canvas
- First-run profile detection and existing-profile auto-load

## Phase 5.5 - Contextual Event Popover (Done)
- Click week/month cell to open contextual popover
- Add/edit/delete lightweight life events inline
- Keep poster visible; no event manager page

## Phase 6 - Event Interaction Layer
- Lightweight week-level event interactions
- Recurring event rendering refinement

## Phase 6.5 - Settings Modal (Done)
- In-canvas calm settings modal (no separate page)
- Profile basics editing (name, birthdate, expected lifespan)
- Calendar view preferences and marker toggles
