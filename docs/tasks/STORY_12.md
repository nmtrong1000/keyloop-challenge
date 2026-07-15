# STORY_12: Module-Owned Types

## Metadata

- Issue type: Story
- Priority: Medium
- Status: COMPLETED
- Version: 1.1

---

## Goal

Narrow `shared/types` to the API contract only, and give each module its own `types.ts` for the business vocabulary it owns.

## Context

`shared/types/api.ts` currently mixes contract-generated types (`Vehicle`, `AgingVehicleAction`, `PagedVehicles`, `ApiError`) with hand-authored business types (`AgeRange`, `SortField`, `SortDir`) that only Inventory actually uses. Separately, the same "filter selection" shape is defined three times: `VehicleFilters` in `shared/domain/filters.ts`, `VehicleFilterSelection` in `shared/store/filterStore.ts`, and an anonymous inline duplicate in `shared/dal/index.ts`'s `GetVehiclesParams`. This story is foundational for STORY_13–15, which relocate the files that consume these types.

## Scope

**In Scope:**
- **Contract-only `shared/types`**: `api.ts` keeps only `Vehicle`, `AgingVehicleAction`, `PagedVehicles`, `ApiError` — types generated from or directly aliasing `api.gen.ts`'s named schema components
- **`modules/Inventory/types.ts`**: new file holding `AgeRange`, `SortField`, `SortDir` (moved from `shared/types/api.ts`), and one consolidated `VehicleFilters` type
- **Duplicate consolidation**: `VehicleFilters`, `VehicleFilterSelection`, and the inline anonymous filter shape in `GetVehiclesParams` collapse into the single `VehicleFilters` in `modules/Inventory/types.ts`
- **Cross-module type import rule**: `types.ts` is directly importable by any module or by `shared/mocks/handlers.ts` — no detour through `index.ts` required, since type-only imports carry no runtime coupling

**Out of Scope:**
- **Moving the functions that use these types**: handled by STORY_13 (domain), STORY_14 (DAL), STORY_15 (store/hooks) — this story only moves type declarations, updating imports at each current call site to point at the new location
- **AgingStock or ActionLogging `types.ts`**: neither module has a type that rises above single-file, primitive-typed usage; no file created for either

## Acceptance Criteria

- Given `shared/types/api.ts`, when inspected, then it exports only `Vehicle`, `AgingVehicleAction`, `PagedVehicles`, `ApiError`
- Given `modules/Inventory/types.ts`, when inspected, then it exports `AgeRange`, `SortField`, `SortDir`, and `VehicleFilters`
- Given any former consumer of `VehicleFilters`/`VehicleFilterSelection`/the inline filter shape, when inspected, then it imports the single consolidated `VehicleFilters` from `modules/Inventory/types.ts`
- Given `shared/mocks/handlers.ts`, when it needs `AgeRange`/`SortField`/`SortDir`/`VehicleFilters`, then it imports them directly from `modules/Inventory/types`, not via `modules/Inventory/index.ts`
- Given the full test suite, when run after this change, then it passes unchanged (import-path updates only, no behavior change)

## Dependencies

- N/A

## Technical Notes

- This story only moves/consolidates type declarations. Files that import them (domain, dal, store, components) get their import paths updated here too, since a type-only move is otherwise a no-op — but their own relocation into module folders is STORY_13/14/15's job, not this one's.
- `api.gen.ts` is untouched — it's generated, not hand-maintained.
- The `types.ts`-bypasses-`index.ts` rule applies only to type-only exports. Runtime exports (functions, components, hooks) still must go through `index.ts` — this story doesn't change that.

## Definition of Done

- [x] `shared/types/api.ts` narrowed to `Vehicle`, `AgingVehicleAction`, `PagedVehicles`, `ApiError`
- [x] `modules/Inventory/types.ts` created with `AgeRange`, `SortField`, `SortDir`, `VehicleFilters`
- [x] All three duplicate filter shapes consolidated into one `VehicleFilters`
- [x] Every current consumer's import path updated
- [x] Full test suite passes unchanged

---

## Changelog

### v1.1
- Implemented: `modules/Inventory/types.ts` created; `shared/types/api.ts` narrowed to the four contract types; `VehicleFilters`/`VehicleFilterSelection`/the inline `GetVehiclesParams.filters` duplicate consolidated into one `VehicleFilters`; all consumers (`handlers.ts`, `dal/index.ts`, `domain/filters.ts`, `domain/sorting.ts`, `store/filterStore.ts`, `store/queryKeys.ts`, `FilterControls.tsx`, `VehicleTable.tsx`) updated to import from the new location. `tsc --noEmit`, lint, and full Jest suite (99/99) pass unchanged.

### v1.0
- Initial version
