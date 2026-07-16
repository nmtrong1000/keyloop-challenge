# STORY_20: Server-Side Rendering (SSR) Implementation

## Metadata

- Issue type: Story
- Priority: Medium
- Status: COMPLETED
- Version: 1.0

---

## Goal

Make the SDD's SSR claim true: server-prefetch the first page of vehicles so the dashboard's initial paint doesn't depend on client JS.

## Context

SDD §5.3/§7 states SSR is used for the initial fetch, but STORY_07 found and documented that this was never actually implemented — composing `InventoryPage` with render-prop slots forced `app/page.tsx` to become a Client Component, so the whole page has always been client-rendered (EPIC.md Known Gaps). This story closes that gap.

## Scope

**In Scope:**
- **Server-Side Prefetch**: `app/page.tsx` becomes an async Server Component that prefetches the first page of vehicles via TanStack Query's `prefetchQuery`, intercepted by `msw/node`
- **Hydration Boundary**: the prefetched cache is handed to the browser via `HydrationBoundary`/`dehydrate`, consumed unchanged by the existing client-side `useVehiclesQuery`
- **Non-Blocking Mock Startup**: `MockingProvider` no longer blocks rendering until `msw/browser` finishes starting — that would hide the new SSR content behind a blank screen; client-triggered requests instead await worker readiness inside `shared/http.ts`
- **SDD Sync**: Architecture (§1) and Data Flow (§4) diagrams updated to match, delivered as a separate docs commit

**Out of Scope:**
- **Composition Root Restructuring**: considered merging `dashboard-content.tsx`'s render-prop wiring directly into `InventoryView`; rejected — `modules/ActionLogging` already imports `VEHICLES_QUERY_KEY` from `modules/Inventory`, so a direct import back would create a circular dependency
- **Unrelated Test Fixes**: the `AgingBadge`/`LatestActionLog` date-drift test fix is a separate, pre-existing bug, unrelated to SSR — handled outside this story

## Acceptance Criteria

- Given the dashboard is requested, when the raw HTML response is inspected before any client JS executes, then the first page of vehicles is already present in the markup.
- Given the initial page load, when the browser's Network tab is inspected, then no client-side `/vehicles` request fires for the first page — it was server-prefetched.
- Given a manager interacts (filter/page/sort) within the first tens of milliseconds after load, when the browser's mock worker hasn't finished starting yet, then the request still succeeds once the worker is ready, rather than missing interception and failing.
- Given the full Jest + Playwright suite, when run after this change, then it passes.

## Dependencies

- **STORY_07**: originally found and documented the SSR gap this story closes
- **STORY_15**: this story's prefetch calls `modules/Inventory/dal.ts` directly, which STORY_15 made module-owned
- **STORY_16**: this story builds on the `InventoryView` composition shape STORY_16 established

## Technical Notes

- `shared/providers/queryClient.ts` (new): shared `QueryClient` factory — a fresh instance per request on the server, one singleton in the browser, per TanStack Query's documented Next.js App Router SSR pattern.
- `app/page.tsx` is now `async`; the former client-rendered content moved unchanged into `app/dashboard-content.tsx` (a Server Component can't itself carry `"use client"`, so the interactive composition needs its own file regardless).
- Prefetch params (`page=1, pageSize=PAGE_SIZE, filters={}, sortBy=undefined, sortDir="asc"`) must exactly match `useFilterStore`'s initial state so the client's first query hits the hydrated cache instead of refetching.
- `shared/mocks/browser.ts` now exports a `workerReady` promise; `shared/http.ts` awaits it before any client-side fetch. Server-side calls skip this entirely — `msw/node` is already listening before Next.js serves any request, via `instrumentation.ts`.
- One Playwright test needed adjusting: the `inventory-render` performance measure is recorded in a post-hydration `useEffect`, but the table can now paint from server-rendered HTML before hydration completes — the test was asserting on the measure before it necessarily existed. Fixed by waiting for the measure explicitly (`page.waitForFunction`) instead of assuming it's present as soon as the table is visible.

## Definition of Done

- [x] `app/page.tsx` is an async Server Component performing a real `prefetchQuery` intercepted by `msw/node`
- [x] Prefetched cache hydrated into the browser via `HydrationBoundary`; verified via raw HTML (`curl`) containing vehicle data before any client JS runs
- [x] `MockingProvider` no longer blocks rendering; `shared/http.ts` awaits worker readiness for client-side calls only
- [x] Full Jest suite passes (99/99)
- [x] Full Playwright suite passes (16/16), including the adjusted performance-measure timing check
- [x] `EPIC.md`'s "SSR is actively used" Known Gap marked resolved
- [x] SDD.md Architecture (§1) and Data Flow (§4) sections updated to match the real implementation

---

## Changelog

### v1.0
- Initial version — implemented server-side prefetch via TanStack Query's `prefetchQuery`/`dehydrate`/`HydrationBoundary`, closing the SSR gap flagged in STORY_07. Verified via raw SSR HTML inspection and the full Jest (99/99) and Playwright (16/16) suites; SDD.md's Architecture/Data Flow diagrams updated to match in a follow-up docs commit.
