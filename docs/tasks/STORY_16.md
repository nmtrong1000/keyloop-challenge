# STORY_16: Inventory Composition Rename

## Metadata

- Issue type: Story
- Priority: Low
- Status: COMPLETED
- Version: 1.1

---

## Goal

Stop calling the Inventory composition component a "page" — it isn't one — and stop filing it under a `pages/` folder that implies Next.js routing significance it doesn't have.

## Context

`modules/Inventory/pages/InventoryPage.tsx` is a plain composition component: it fetches vehicles, wires filter/sort state, and assembles `FilterControls`/`VehicleTable`/`PaginationControls` plus render-prop slots. It's rendered from `app/page.tsx` like any other component — the only actual Next.js page in this app is `app/page.tsx` itself. The `pages/` folder name doubly misleads here, echoing Next's old Pages Router convention, which `AGENTS.md` already flags as a trap in this project's non-standard Next.js version.

## Scope

**In Scope:**
- **Rename**: `InventoryPage` → `InventoryView`, `InventoryPageProps` → `InventoryViewProps`
- **Move**: `modules/Inventory/pages/InventoryPage.tsx` → `modules/Inventory/components/InventoryView.tsx`; `modules/Inventory/pages/` removed
- **Tests**: `InventoryPage.test.tsx` → `InventoryView.test.tsx`, `InventoryPageAging.test.tsx` → `InventoryViewAging.test.tsx`, relocated to `modules/Inventory/components/__tests__/`
- **Consumers**: `Inventory/index.ts`'s export path, and `app/page.tsx`'s `<InventoryPage ... />` usage, updated to the new name

**Out of Scope:**
- **Any behavioral change**: rename and relocation only
- **Observability wrapper wiring**: handled by STORY_17

## Acceptance Criteria

- Given `modules/Inventory`, when inspected, then no `pages/` folder exists
- Given `modules/Inventory/components/InventoryView.tsx`, when inspected, then it exports `InventoryView` and `InventoryViewProps`
- Given `app/page.tsx`, when inspected, then it renders `<InventoryView ... />`
- Given the full test suite, when run after this change, then it passes with the renamed test files

## Dependencies

- **STORY_15**: this file's `useFilterStore`/`useVehiclesQuery` imports must already point at their final module-owned locations before the rename, so the diff here is rename-only, not rename-plus-import-fixes

## Technical Notes

- Internal imports (`../components/FilterControls` etc.) become sibling imports (`./FilterControls`) once the file sits in `components/` alongside them.

## Definition of Done

- [x] File moved and renamed, `pages/` folder removed
- [x] `InventoryPageProps` renamed to `InventoryViewProps`
- [x] `Inventory/index.ts` and `app/page.tsx` updated
- [x] Tests renamed, relocated, and passing

---

## Changelog

### v1.1
- Implemented: `InventoryPage`/`InventoryPageProps` renamed to `InventoryView`/`InventoryViewProps`, moved from `modules/Inventory/pages/` to `modules/Inventory/components/`. Internal `../components/*` imports became sibling `./*` imports. Tests renamed and relocated to `components/__tests__/`. `Inventory/index.ts` and `app/page.tsx` updated; confirmed no other file (including the Playwright e2e suite) referenced the old name.
- `tsc --noEmit`, lint, and full Jest suite (22 suites, 99/99) pass unchanged.

### v1.0
- Initial version
