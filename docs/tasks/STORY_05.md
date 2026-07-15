# STORY_05: State Management

## Metadata

- Issue type: Story
- Priority: High
- Status: COMPLETED
- Version: 1.0

---

## Goal

Give UI modules one shared, reactive source of truth for vehicles and actions, kept fresh automatically.

## Context

SDD §2 assigns State Management as the single source of truth for re-renders and background polling (SRS's "Real-Time" definition), per the TanStack Query + Zustand split in SDD §5.3.

## Scope

**In Scope:**
- **Server State**: TanStack Query hooks keyed by page/filters, wrapping STORY_04's DAL, with `refetchInterval` polling (SDD §4.1)
- **Client State**: Zustand store for UI-only state (active filter selection and current page number)
- **Mutate-then-Invalidate**: action submission invalidates the vehicle/action query cache

**Out of Scope:**
- **Rendering**: handled by STORY_06–08
- **DAL Implementation**: handled by STORY_04

## Acceptance Criteria

- Given the app loads, when the initial fetch resolves, then the first page of vehicle data is available to consumers.
- Given 30–60 seconds pass, when the background poll fires, then the current page updates without a manual refresh.
- Given a new action is submitted, when the mutation succeeds, then the action-record cache is invalidated and refetched.
- Given a manager sets a filter, when the filter changes, then the client-state store reflects the new selection.
- Given the manager changes page or filter, when changed, then a new page-and-filter-keyed query runs automatically.

## Dependencies

- **STORY_04**: wraps its functions; does not call MSW directly

## Technical Notes

- Keep server state (TanStack Query) and client-only state (Zustand) in separate stores — do not mix concerns (SDD §5.3).
- Filter *matching* now happens server-side (STORY_03); this story only holds the *selected* filter values and page number.
- Tests mock `@/shared/dal` rather than running real MSW — the DAL/handlers are already exhaustively covered in STORY_03/04; this story only verifies TanStack Query/Zustand wiring.

## Definition of Done

- [x] TanStack Query hook(s) for vehicles and actions implemented (`useVehiclesQuery`, `useSubmitAction`)
- [x] Background polling configured per SDD §4.1's interval (45s — midpoint of the 30-60s range)
- [x] Zustand store for filter selection implemented (`useFilterStore`, holds page + filters)
- [x] Mutation invalidates/refetches on success (verified: no invalidation on failure either)
- [x] Unit tests cover polling and invalidation behavior (DAL mocked at the boundary, not real MSW — see Technical Notes)
- [x] Query is keyed by page and filter selection, refetching automatically when either changes

---

## Changelog

### v1.0
- Initial version
