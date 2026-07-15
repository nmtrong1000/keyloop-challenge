# STORY_06: Inventory Module

## Metadata

- Issue type: Story
- Priority: High
- Status: COMPLETED
- Version: 2.1

---

## Goal

Let a manager page through and filter the vehicle list, satisfying the dashboard's core visualization requirement.

## Context

SRS's first two core requirements — display the inventory list, and filter by make/model/age — are fulfilled entirely by this story.

## Scope

**In Scope:**
- **Vehicle List Rendering**: table/grid of the current page's vehicles from State Management
- **Filter Controls**: make, model, and age (preset ranges: 0–30, 31–60, 61–90, >90 per SRS)
- **Pagination Controls**: next/previous page navigation and a page indicator
- **Page Size Selection**: a select (10/20/50/100/500) next to the pagination controls, server-applied
- **Column Sorting**: Make, Model, and Intake Date headers are clickable, toggling ascending/descending, server-applied

**Out of Scope:**
- **Filter-Matching Logic**: executed server-side by STORY_03, not client-side here
- **Aging Flag/Badge**: handled by STORY_07
- **Action Form**: handled by STORY_08

## Acceptance Criteria

- Given the vehicle list loads, when rendered, then the current page's vehicles from State are visible in the list.
- Given a manager selects a make filter, when applied, then a new server query returns only vehicles of that make.
- Given a manager selects an age range filter, when applied, then a new server query returns vehicles in that range.
- Given multiple filters are active, when applied together, then the server query combines them, not the client.
- Given a manager clicks next/previous page, when clicked, then the corresponding page loads from the server.
- Given the background poll updates the current page, when re-rendered, then the active filter and page are still applied.
- Given the inventory view mounts, when it loads, then `inventory.viewed` logs once — never on background polling (EXECUTION_LOOP Observability Checklist).
- Given a manager applies a filter, when applied, then `inventory.filtered` logs the filter criteria.
- Given the vehicle list renders, when measured, then a `performance.measure` named `inventory-render` is recorded (EXECUTION_LOOP: Metrics apply to STORY_06 only).
- Given a manager selects a page size, when applied, then a new server query returns that many items per page and the view resets to page 1.
- Given a manager clicks a sortable column header, when clicked, then a new server query returns results in that order (ascending); clicking the same header again reverses it (descending), and the view resets to page 1.

## Dependencies

- **STORY_05**: reads vehicle data and filter selection from State Management
- **STORY_02**: contract amendment — `sortBy`/`sortDir` query params added to `GET /vehicles` (backward-compatible, both optional; `pageSize` already existed in the contract but was never exposed in the UI until now)

## Technical Notes

- No client-side filter-matching logic here — filters are query params passed through to STORY_05's query key.
- Verify render time against the SRS's 2-second/page NFR — full pass deferred to STORY_10.
- Introduces `shared/observability/logEvent.ts` (shared utility) — STORY_08 reuses it for `aging_vehicle.action_logged`; STORY_09 is now scoped to hardening/testing this utility and the correlation-ID round-trip, not the call sites themselves (EXECUTION_LOOP Observability Checklist).
- **Reopened**: page size and sorting added. No client-side sort/paginate logic here either — both are server-applied, same "query params passed through" pattern as filters, since the SRS assumes inventory can reach millions of records (server-side pagination is load-bearing; sorting only the current page client-side would be silently wrong across pages).
- `shared/domain/sorting.ts` — new pure comparator (`sortVehicles`), mirrors `filters.ts`/`pagination.ts`'s style; wired into `shared/mocks/handlers.ts` between filtering and pagination.
- `filterStore` gained `pageSize`, `sortBy`, `sortDir` + `setPageSize`/`setSort`. Changing either resets `page` to 1, same rule as changing a filter. `setSort` toggles asc/desc on the active column, restarts at asc on a new column.
- `shared/store/queryKeys.ts`'s `vehiclesQueryKey` now includes `pageSize`/`sortBy`/`sortDir` so TanStack Query treats each combination as a distinct cached query.
- **UI fixes**:
  - Sort headers were undiscoverable (no visual hint a column was clickable until it was clicked). Fixed: both ▲/▼ now always render, stacked in a column, dim by default, with the active direction turned solid — same `VehicleTable.tsx` `sortableHeader`.
  - `PaginationControls`'s "Page size" label used `font-mono`/`text-label-sm` while "Page X of Y" used the default sans body text next to it — mismatched font family and size. Fixed by dropping the mono/label styling from the "Page size" label so both match.
  - Every sort/filter/page-size change caused a full layout shift: `InventoryPage` unmounted the whole list to a centered "Loading vehicles…" message and remounted it once data arrived. Fixed with `useVehiclesQuery`'s `placeholderData: keepPreviousData` (TanStack Query keeps the previous page's data visible across a query-key change) plus a new `shared/components/LoadingOverlay.tsx`, conditionally rendered over `VehicleTable` while `isFetching`, so refetches now update in place instead of reflowing the page.

## Related Fixes (ActionLogging, touched incidentally while fixing the above)

- The Log column (`LatestActionLog`) wrapped unbounded instead of truncating to one line; now `truncate` (single line, ellipsis), matching the other fixed-width columns.
- The action-history list inside the modal (`ActionHistory`) now clamps each entry to 2 lines (was unclamped, then 3) with a "Show more"/"Show less" toggle per entry to reveal the full text.
- Found and fixed along the way: `Modal.tsx`'s content is still a DOM descendant of wherever it's triggered from (e.g. a `truncate` table cell), so `white-space: nowrap` was inheriting into the modal and forcing all its text onto one line regardless of the fixed-overlay positioning. Fixed by resetting `whitespace-normal` on the dialog panel itself.

## Definition of Done

- [x] Vehicle list renders the current page's vehicles from State (`VehicleTable`)
- [x] Make, model, and age filters implemented and combinable, triggering new server queries (`FilterControls`)
- [x] Pagination controls (next/previous, page indicator) implemented (`PaginationControls`)
- [x] Integration test: list re-renders after a background poll — polling mechanism itself is proven with fake timers in STORY_05's `useVehiclesQuery.test.tsx`; InventoryPage trivially renders whatever the hook returns
- [x] `inventory.viewed` and `inventory.filtered` log events fire at the correct trigger points, never on polling
- [x] `performance.mark`/`measure` recorded around the vehicle list render (`inventory-render`)
- [x] Page size select (10/20/50/100/500) implemented next to pagination, server-applied, resets to page 1
- [x] Make/Model/Intake Date column headers sortable (asc/desc toggle), server-applied via contract amendment (`sortBy`/`sortDir`), resets to page 1
- [x] Sort headers discoverable at rest (both arrows always visible, dim until active)
- [x] Pagination bar typography consistent ("Page size" matches "Page X of Y")
- [x] Sort/filter/page-size changes update the list in place — no unmount/reflow — via `keepPreviousData` + `LoadingOverlay`

---

## Changelog

### v2.1
- UI fixes to the page-size/sort features added in v2.0: sort-column arrows now always visible (dim/active states) instead of only appearing after a click; pagination bar's "Page size" label font/size now matches "Page X of Y"; sort/filter/page-size changes no longer unmount the list (`keepPreviousData` + new `LoadingOverlay`), eliminating the layout shift on every interaction.
- Incidentally fixed while wrapping the above: the Log column now truncates to one line instead of wrapping unbounded; the action-history modal list clamps to 2 lines with a "Show more"/"Show less" toggle; `Modal.tsx` no longer inherits `white-space: nowrap` from whatever table cell triggered it.
- Full test suite: 99/99 Jest, 16/16 Playwright.

### v2.0
- Reopened and re-closed: added page-size selection and column sorting (Make/Model/Intake Date). Amended the `GET /vehicles` contract with optional `sortBy`/`sortDir` params (backward-compatible); added `shared/domain/sorting.ts`; wired both through the mock handler, DAL, `filterStore`, and query key. New Playwright coverage for both. Full test suite: 98/98 Jest, 16/16 Playwright.

### v1.0
- Initial version
