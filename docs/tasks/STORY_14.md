# STORY_14: Module-Owned Data Access Layer

## Metadata

- Issue type: Story
- Priority: Medium
- Status: COMPLETED
- Version: 1.1

---

## Goal

Give each module its own typed DAL functions instead of one flat `shared/dal`, while keeping the generic HTTP mechanics genuinely shared.

## Context

`shared/dal/index.ts` holds three endpoint-shaped functions (`getVehicles`, `getVehicleActions`, `postVehicleAction`) that map 1:1 to Inventory and ActionLogging respectively, built on shared plumbing (`getBaseUrl`, `DataAccessError`, `parseErrorMessage`) that's duplicated across all three. Splitting the file naively would spread that duplication further; instead the plumbing consolidates into one `request()` helper so the pattern doesn't repeat as more endpoints get added later.

## Scope

**In Scope:**
- **`shared/http.ts`**: `DataAccessError` (exported) and `request<T>(path, init?)` (exported) — the only public surface. `getBaseUrl` and `parseErrorMessage` become private to this file, called only by `request()`
- **`modules/Inventory/dal.ts`**: `getVehicles()`, built on `request()`
- **`modules/ActionLogging/dal.ts`**: `getVehicleActions()`, `postVehicleAction()`, built on `request()`
- **`GetVehiclesParams.filters`** references the consolidated `VehicleFilters` from `modules/Inventory/types.ts` instead of an inline duplicate

**Out of Scope:**
- **Store/hooks relocation**: handled by STORY_15, which will import these DAL functions from their new module locations
- **Domain logic relocation**: handled by STORY_13

## Acceptance Criteria

- Given `shared/dal`, when this story completes, then the folder no longer exists
- Given `shared/http.ts`, when inspected, then only `DataAccessError` and `request` are exported; `getBaseUrl`/`parseErrorMessage` are not
- Given `modules/Inventory/dal.ts` and `modules/ActionLogging/dal.ts`, when inspected, then neither contains its own fetch/error-handling logic — both call `request()`
- Given a failed request from either module's DAL, when caught by a consumer, then it's still a `DataAccessError` with the same `status`/`message` shape as before
- Given the full test suite, when run after this change, then it passes, with the DAL integration test relocated appropriately

## Dependencies

- **STORY_12**: `GetVehiclesParams.filters` needs `modules/Inventory/types.ts`'s `VehicleFilters` to exist

## Technical Notes

- `request<T>()` should own the full fetch → check `res.ok` → parse error → throw `DataAccessError` → parse JSON sequence, so each module's `dal.ts` is just URL/param shaping.
- Correlation-ID header forwarding (`X-Correlation-Id`) stays a caller-supplied `init.headers` concern — `request()` doesn't need to know about tracing.
- `shared/dal/__tests__/dal.integration.test.ts` covers both `getVehicles` and `getVehicleActions`/`postVehicleAction` — split it so each half lives with its owning module's `dal.ts`.

## Definition of Done

- [x] `shared/dal` removed, replaced by `shared/http.ts` (plumbing only) and two module-owned `dal.ts` files
- [x] `shared/http.ts` exports only `DataAccessError` and `request`
- [x] `GetVehiclesParams.filters` uses the consolidated `VehicleFilters` type
- [x] Integration tests relocated and passing

---

## Changelog

### v1.1
- Implemented: `shared/http.ts` (plumbing only), `modules/Inventory/dal.ts` (`getVehicles`), `modules/ActionLogging/dal.ts` (`getVehicleActions`, `postVehicleAction`). Integration test split into `modules/Inventory/__tests__/dal.integration.test.ts` and `modules/ActionLogging/__tests__/dal.integration.test.ts`; `jest.config.integration.ts`'s `testMatch` updated from a `shared/dal`-specific pattern to `modules/**/*.integration.test.ts`.
- **Deviation from v1.0's scope**: DAL functions are *not* exported via each module's `index.ts`. `shared/store`'s hooks (still pre-STORY_15) import them directly from `modules/X/dal` instead — routing through `index.ts` would create a circular import, since `ActionForm`/`ActionHistory` (which call these hooks) are themselves re-exported by `ActionLogging/index.ts`. Once STORY_15 moves the hooks inside their owning module, this becomes an ordinary same-module sibling import (`../dal`), same outcome without the cycle. No external consumer needs these functions any other way.
- `tsc --noEmit`, lint, and full Jest suite (22 suites, 99/99 tests — split from 21/99, same test count) pass.

### v1.0
- Initial version
