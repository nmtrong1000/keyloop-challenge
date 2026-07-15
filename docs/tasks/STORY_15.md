# STORY_15: Module-Owned State (Store & Hooks Split)

## Metadata

- Issue type: Story
- Priority: Medium
- Status: COMPLETED
- Version: 1.1

---

## Goal

Eliminate `shared/store` — every file in it is module-specific by actual consumer — and split what remains by state kind: Zustand (`store/`) vs. TanStack Query (`hooks/`), per SDD §5.3's own distinction between client and server state.

## Context

`shared/store` holds five files. None are consumed by more than one module: `filterStore.ts`/`queryKeys.ts`/`useVehiclesQuery.ts` are Inventory's; `useVehicleActionsQuery.ts`/`useSubmitAction.ts` are ActionLogging's. Unlike domain or DAL, there's no generic primitive left behind — `useQuery`/`useMutation`/`create()` are themselves the reusable layer, supplied by the libraries.

## Scope

**In Scope:**
- **`modules/Inventory/store/filterStore.ts`**: the Zustand store (only actual "store" — client UI state)
- **`modules/Inventory/hooks/queryKeys.ts`** and **`modules/Inventory/hooks/useVehiclesQuery.ts`**: TanStack Query wrappers, moved from `shared/store`
- **`modules/ActionLogging/hooks/useVehicleActionsQuery.ts`** and **`modules/ActionLogging/hooks/useSubmitAction.ts`**: TanStack Query wrappers, moved from `shared/store`
- **Same-module DAL imports**: `useVehiclesQuery.ts` imports `getVehicles` from its own module's `../dal` (no longer `shared/dal`); `useSubmitAction.ts` imports `postVehicleAction` from its own module's `../dal`
- **Cross-module query-key invalidation**: `useSubmitAction`'s `invalidateQueries({ queryKey: ["vehicles"] })` sources that key/prefix from Inventory's public surface instead of a hardcoded string literal

**Out of Scope:**
- **`InventoryPage` rename**: handled by STORY_16, which will consume these hooks from their new locations
- **Correlation-ID generation**: `useSubmitAction`'s inline `crypto.randomUUID()` stays as-is here; wrapping it in `generateCorrelationId()` is STORY_17's job

## Acceptance Criteria

- Given `shared/store`, when this story completes, then the folder no longer exists
- Given `modules/Inventory`, when inspected, then it has both a `store/` folder (Zustand only) and a `hooks/` folder (TanStack Query only)
- Given `modules/ActionLogging`, when inspected, then it has a `hooks/` folder only — no `store/` folder is created, since it holds no Zustand state
- Given `useSubmitAction`'s success handler, when it invalidates Inventory's vehicles query, then it does so via a key/prefix sourced from Inventory's public surface, not a duplicated literal
- Given the full test suite, when run after this change, then it passes, with tests relocated alongside their source files

## Dependencies

- **STORY_14**: hooks import DAL functions from their own module's `dal.ts`

## Technical Notes

- `queryKeys.ts` isn't a hook itself but exists solely to support `useVehiclesQuery` — it belongs in `hooks/`, not `store/`.
- Components consuming `useFilterStore` (`FilterControls`, `PaginationControls`, the soon-to-be-renamed `InventoryPage`) need their import paths updated in this story even though their own relocation is out of scope.

## Definition of Done

- [x] `shared/store` removed
- [x] Inventory has `store/filterStore.ts` and `hooks/{queryKeys,useVehiclesQuery}.ts`
- [x] ActionLogging has `hooks/{useVehicleActionsQuery,useSubmitAction}.ts`, no `store/` folder
- [x] Cross-module query-key invalidation no longer uses a duplicated literal
- [x] Full test suite passes, tests relocated

---

## Changelog

### v1.1
- Implemented: `shared/store` removed. Inventory: `store/filterStore.ts`, `hooks/{queryKeys,useVehiclesQuery}.ts`. ActionLogging: `hooks/{useVehicleActionsQuery,useSubmitAction}.ts`, no `store/` folder. Same-module hooks now import their `dal.ts` and sibling folders via relative paths, no longer the absolute `@/modules/X/dal` used transitionally in STORY_14.
- `queryKeys.ts` gained `VEHICLES_QUERY_KEY` (the string prefix, exported alongside `vehiclesQueryKey`), re-exported from `Inventory/index.ts`. ActionLogging's `useSubmitAction` imports it from there instead of the hardcoded `["vehicles"]` literal — a genuine production cross-module dependency, so it goes through `index.ts` per the established rule (unlike DAL, importing it doesn't create a cycle: `Inventory/index.ts`'s existing `InventoryPage` re-export already pulls in the same files).
- **Deviation**: `useVehiclesQuery` itself is *not* exported via `Inventory/index.ts` — no production consumer needs it outside Inventory, only the cross-module test (`ActionLogging/hooks/__tests__/useSubmitAction.test.tsx`, which verifies that submitting an action invalidates Inventory's list) does. That test imports it via a deep path instead, since adding a public export solely for test convenience would misrepresent the module's real public surface.
- `tsc --noEmit`, lint, and full Jest suite (22 suites, 99/99) pass.

### v1.0
- Initial version
