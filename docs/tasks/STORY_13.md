# STORY_13: Module-Owned Domain Logic

## Metadata

- Issue type: Story
- Priority: Medium
- Status: COMPLETED
- Version: 1.1

---

## Goal

Give each module ownership of its own business rules instead of dumping all domain logic into one flat `shared/domain`.

## Context

`shared/domain` currently holds five files with no shared reason to sit together: `aging.ts` is AgingStock's rule, `currentStatus.ts` is ActionLogging's rule, `filters.ts`/`sorting.ts` are Inventory's rules, and `pagination.ts` is a generic, domain-agnostic algorithm that doesn't belong to any module. `shared/mocks/handlers.ts` (the mock backend) consumes all five today; after this story it consumes them via each module's `index.ts` instead — an accepted exception to shared→module layering, since the mock is a stand-in that disappears once a real backend exists.

## Scope

**In Scope:**
- **`modules/AgingStock/domain/aging.ts`**: `AGING_THRESHOLD_DAYS`, `daysInInventory`, `isAgingVehicle` (moved from `shared/domain/aging.ts`), exported via `AgingStock/index.ts`
- **`modules/ActionLogging/domain/currentStatus.ts`**: `actionsForVehicle`, `mostRecentAction` (moved from `shared/domain/currentStatus.ts`), exported via `ActionLogging/index.ts`
- **`modules/Inventory/domain/filters.ts`** and **`modules/Inventory/domain/sorting.ts`**: `matchesFilters`, `sortVehicles` (moved from `shared/domain/`), exported via `Inventory/index.ts`
- **`shared/utils/pagination.ts`**: `paginate()` (moved from `shared/domain/pagination.ts`) — generic, no domain meaning, doesn't belong to any module
- **Cross-module import**: Inventory's `filters.ts` imports `daysInInventory` from AgingStock's `index.ts` (age-range matching needs day-count)
- **`shared/mocks/handlers.ts`** updated to import domain functions from each module's `index.ts` instead of `shared/domain`

**Out of Scope:**
- **`shared/types` changes**: handled by STORY_12, assumed complete before this story starts
- **DAL, store, or component relocation**: handled by STORY_14/15/18

## Acceptance Criteria

- Given `shared/domain`, when this story completes, then the folder no longer exists
- Given `AgingBadge`/`LatestActionLog`/`AgingVehicleExtras`, when they need aging or current-status logic, then they import from their owning module's `index.ts`, not a relative path into another module's internals
- Given `modules/Inventory/domain/filters.ts`, when it needs day-count logic, then it imports `daysInInventory` from `modules/AgingStock/index.ts`
- Given `shared/mocks/handlers.ts`, when it needs any domain rule, then it imports from the owning module's `index.ts`
- Given `paginate()`, when inspected, then it lives in `shared/utils/pagination.ts` with no `Vehicle`-specific typing
- Given the full test suite, when run after this change, then it passes, with domain tests relocated to `modules/*/domain/__tests__/` and `shared/utils/__tests__/`

## Dependencies

- **STORY_12**: Inventory's `filters.ts`/`sorting.ts` import `AgeRange`/`SortField`/`SortDir` from `modules/Inventory/types.ts`

## Technical Notes

- Preserve each function's existing behavior exactly — this is a relocation, not a rewrite.
- `shared/mocks/handlers.ts` importing from `modules/*` is a deliberate, accepted exception to the shared→module dependency direction — document it inline with a short comment if the reasoning isn't obvious from context.
- Test files move with their source files (e.g. `shared/domain/__tests__/aging.test.ts` → `modules/AgingStock/domain/__tests__/aging.test.ts`).

## Definition of Done

- [x] `shared/domain` removed entirely
- [x] Five files relocated per the module mapping above, each exported via its module's `index.ts`
- [x] `paginate()` in `shared/utils`, no domain-specific typing
- [x] `shared/mocks/handlers.ts` imports updated
- [x] All domain tests relocated and passing

---

## Changelog

### v1.1
- Implemented: `aging.ts`→`modules/AgingStock/domain/`, `currentStatus.ts`→`modules/ActionLogging/domain/`, `filters.ts`+`sorting.ts`→`modules/Inventory/domain/`, `paginate()`→`shared/utils/pagination.ts`. Inventory's `filters.ts` imports `daysInInventory` from AgingStock's `index.ts` (cross-module). `AgingBadge` (same-module) imports its domain file directly; `LatestActionLog`/`AgingVehicleExtras` (cross-module) import via `@/modules/AgingStock`. `shared/mocks/handlers.ts` imports from each module's `index.ts` plus `shared/utils/pagination`. `shared/domain` removed. `tsc --noEmit`, lint, and full Jest suite (99/99) pass unchanged.

### v1.0
- Initial version
