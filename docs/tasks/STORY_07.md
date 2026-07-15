# STORY_07: Aging Stock Module

## Metadata

- Issue type: Story
- Priority: High
- Status: COMPLETED
- Version: 1.1

---

## Goal

Make aging vehicles impossible to miss, and show a manager what's already been done about each one.

## Context

SRS's aging-stock requirement and the current-status display requirement are fulfilled by this story, per SDD §2's Aging Stock Module responsibility.

## Scope

**In Scope:**
- **Aging Calculation**: `daysInInventory` derived from `intakeDate`; >90 days = aging stock
- **Prominent Display**: visual flag/badge on aging vehicles within the Inventory Module's list
- **Current Status**: renders each aging vehicle's most recently logged `AgingVehicleAction`
- **Aging Count**: displays the server-computed total aging-stock count, independent of the current page

**Out of Scope:**
- **Submitting New Actions**: handled by STORY_08
- **Vehicle List Rendering Itself**: handled by STORY_06 (this story augments it)

## Acceptance Criteria

- Given a vehicle's `intakeDate` is more than 90 days ago, when the list renders, then it is visually flagged as aging stock.
- Given a vehicle's `intakeDate` is exactly or fewer than 90 days ago, when the list renders, then it is not flagged as aging stock.
- Given an aging vehicle has one or more logged actions, when rendered, then the most recent action's text is shown as its current status.
- Given an aging vehicle has no logged actions, when rendered, then no current status is shown (not an error state).
- Given any filter is active, when the aging count renders, then it shows the global aging-stock count, not the filtered or paginated subset.

## Dependencies

- **STORY_05**: reads vehicle and action data from State Management
- **STORY_06**: augments its rendered list rather than rendering its own

## Technical Notes

- Aging calculation must be a pure, unit-testable function — do not store `daysInInventory` or the aging flag as separate state (SDD §3.1: derive, don't cache).
- "Most recent" is determined by `timestamp`, not array order — don't assume the DAL returns actions pre-sorted.
- Per-row aging flag stays a client-side derivation from `intakeDate`; only the total count is server-computed.
- **Module boundary fixed**: this story's own components (`AgingBadge`, `AgingCountBanner`) originally landed inside `modules/Inventory` for convenience during implementation, rather than getting their own module folder — a drift from SDD §1.2/§2's three-module design (Inventory, Aging Stock, Action Logging) that went unnoticed until a later review. Extracted to `modules/AgingStock/components/`; `modules/ActionLogging`'s `AgingVehicleExtras` and `app/page.tsx` now import from there instead of reaching into `Inventory`.
- **Contract gap found during implementation**: the frozen STORY_02 contract had no way to read back logged actions — only `POST` existed. Fixed by adding an optional `currentStatus` field to `Vehicle` (server-computed via a new `mostRecentAction` pure function), denormalized onto `GET /vehicles` responses. `AgingVehicleAction` remains the source of truth; this is a read-side convenience. Amended `contracts/openapi.yaml`, regenerated types.
- **SDD deviation found while wiring this in**: composing `InventoryPage` with render-prop slots (`renderAgingSummary`, `renderVehicleExtra`) from `app/page.tsx` requires passing functions across the Server→Client boundary, which Next.js disallows — `app/page.tsx` had to become a Client Component (`"use client"`). Combined with STORY_06's plain client-fetch (no RSC prefetch/hydration), the SDD §5.3/§7 claim that "SSR is actively used" for the initial fetch is **not actually true in this implementation** — the whole page is client-rendered. Flagging honestly rather than silently shipping a gap between design and code.

## Definition of Done

- [x] Aging calculation (>90 days) covered by unit tests, including the exact-90-day boundary (reused from STORY_03's `shared/domain/aging.ts`)
- [x] Aging vehicles are visually distinguished in the rendered list (`modules/AgingStock/components/AgingBadge.tsx`)
- [x] Current-status derivation (most recent action) covered by unit tests (`mostRecentAction`, both as a pure function and via the mock handler)
- [x] Integration test: aging flag and status update after a simulated background poll (fake timers, `modules/Inventory/__tests__/InventoryPageAging.test.tsx`)
- [x] Server-computed aging count displayed and covered by an integration test (`modules/AgingStock/components/AgingCountBanner.tsx`)
- [x] Own module folder: `modules/AgingStock/components/` (previously embedded in `modules/Inventory`)

---

## Changelog

### v1.1
- Extracted `modules/AgingStock/components/` — components had been embedded in `modules/Inventory` since implementation, drifting from SDD's three-module design.

### v1.0
- Initial version
