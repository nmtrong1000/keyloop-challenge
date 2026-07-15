# STORY_18: Shared Component Library (Generic Primitives)

## Metadata

- Issue type: Story
- Priority: Medium
- Status: COMPLETED
- Version: 1.1

---

## Goal

Extract the generic, repeated pieces of the existing UI (selects, tables, badges, metric cards, buttons, pagination) into reusable `shared/components` primitives, so each module's own component becomes a thin configuration layer instead of hand-rolled markup.

## Context

Several patterns are duplicated or hand-rolled per call site today: three near-identical `<select>` blocks in `FilterControls` (plus a fourth in `PaginationControls`), a `Vehicle`-specific table that's mostly generic table mechanics, a one-off badge and metric-style banner with no shared styling primitive, and eight `<button>` elements across four different hand-rolled visual treatments — despite `DESIGN.md` documenting a filled "primary" button variant that's never been implemented anywhere.

## Scope

**In Scope:**
- **`shared/components/Select.tsx`**: generic labeled select (`label`, `value`, `onChange`, `options`, `placeholder`), replacing `FilterControls`'s three selects and `PaginationControls`'s page-size select
- **`shared/components/Table.tsx`**: generic `Table<T>` (fixed-width `colgroup` layout, sortable-header indicator, empty-state message, row/cell styling), with `VehicleTable` reduced to building a `Column<Vehicle>[]` config on top of it
- **`shared/components/PaginationControls.tsx`**: moved from `modules/Inventory/components/`, made fully controlled (`page`, `totalPages`, `onPageChange`, `pageSize`, `pageSizeOptions`, `onPageSizeChange`) — no direct store dependency
- **`shared/components/Badge.tsx`**: generic `tone`-based badge, with `AgingBadge` reduced to `<Badge tone="amber">Aging Stock</Badge>`
- **`shared/components/MetricCard.tsx`**: generic `label`/`value`/`tone`/`live` card, with `AgingCountBanner` reduced to a config call
- **`shared/components/Button.tsx`**: `primary`/`secondary`/`ghost`/`link` variants, `type="button"` default, applied to every existing `<button>` in the codebase except Modal's backdrop click-catcher

**Out of Scope:**
- **Modal's backdrop click-catcher**: stays a plain `<button>` — it's an accessible full-screen dismiss target with no visual chrome, not a design-system button
- **Any new visual variant beyond what's observed in current usage or explicitly documented in `DESIGN.md`**: no speculative variants
- **Behavioral changes**: filtering, sorting, pagination, badge/banner logic, and form submission all behave exactly as before — only the implementation is generalized

## Acceptance Criteria

- Given `FilterControls` and `PaginationControls`'s page-size dropdown, when inspected, then both use `shared/components/Select`
- Given `VehicleTable`, when inspected, then it builds a column config and renders it through `shared/components/Table`, with all existing render-prop slots (status/log/action) and sorting behavior unchanged
- Given `PaginationControls`, when inspected, then it lives in `shared/components` and takes no dependency on any store
- Given `AgingBadge` and `AgingCountBanner`, when inspected, then they're built on `Badge` and `MetricCard` respectively
- Given every visible button in the app except Modal's backdrop, when inspected, then it renders through `shared/components/Button` with an appropriate variant
- Given the existing Playwright suite (STORY_10) and Jest suite, when run after this change, then they pass, updated only where markup structure changed (not where behavior changed)

## Dependencies

- **STORY_15, STORY_16**: these primitives are built against final module-owned store/hook/type import paths and the renamed `InventoryView`, avoiding rework

## Technical Notes

- `Table<T>`'s `Column<T>.key` is a generic string; `VehicleTable` maps it back to the typed `SortField` union when calling `onSort`.
- `Badge`'s `tone` prop stays open-ended (not hardcoded to "amber") given the documented gap from STORY_11: `DESIGN.md` defines no "warning" color role yet.
- `MetricCard`'s `live` prop conditionally sets `role="status"` — opt-in, since that's specific to `AgingCountBanner`'s polling-driven updates, not every metric card.
- Re-run STORY_10's Playwright suite after markup changes, per its own precedent of needing updates when structure shifts even if behavior doesn't.

## Definition of Done

- [x] `Select`, `Table`, `PaginationControls`, `Badge`, `MetricCard`, `Button` added to `shared/components`
- [x] `FilterControls`, `VehicleTable`, `AgingBadge`, `AgingCountBanner` reduced to thin config layers
- [x] All existing buttons (except Modal's backdrop) use `Button`
- [x] No behavioral change: full Jest + Playwright suite passes

---

## Changelog

### v1.1
- Implemented all six primitives in `shared/components`. Found and fixed a real duplicate while building `Select`: the "filter selection" `<select>`s already had drifted class strings across `FilterControls` (3 selects) and `PaginationControls`'s page-size dropdown — all four now share one `Select`. `Table`'s column widths use inline `style` rather than dynamic Tailwind arbitrary-value classes (`w-[${width}]`), since Tailwind's static scanner can't see runtime-interpolated class strings — this is the one place the implementation deliberately diverges from the rest of the codebase's Tailwind-only styling, for a concrete technical reason.
- `PaginationControls` moved to `shared/components`, now fully controlled (`page`/`totalPages`/`onPageChange`/`pageSize`/`pageSizeOptions`/`onPageSizeChange`) — `InventoryView` computes `totalPages` itself and wires `useFilterStore` directly; the old Inventory-local wrapper is gone. `PAGE_SIZE_OPTIONS` stays as a local constant in `InventoryView`, since it's business config, not something the generic component should hardcode.
- `Button` variants (`primary`/`secondary`/`ghost`/`link`) applied to all 7 real buttons (`PaginationControls` Previous/Next, `ActionForm` Submit, `AgingVehicleExtras`'s "Log action" trigger, `ActionHistory`'s Show more/less, `VehicleTable`'s sortable column headers via `Table`, `Modal`'s close ✕). Modal's backdrop click-catcher stays a plain `<button>` as scoped — it has no visual chrome to consolidate into a variant. `primary` is defined per `DESIGN.md` but not yet used anywhere, same as before this story.
- Verified end-to-end, not just unit-level: full Jest suite (22 suites, 99/99) passes unchanged, and the full Playwright suite (16/16, Chrome + Safari — full flow, pagination, sorting, responsive layout at desktop/tablet/mobile, and the 2-second render NFR) passes unchanged against the refactored markup. `tsc --noEmit` and lint both clean.

### v1.0
- Initial version
