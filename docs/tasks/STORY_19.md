# STORY_19: Atomic Design Reorganization

## Metadata

- Issue type: Story
- Priority: Low
- Status: COMPLETED
- Version: 1.1

---

## Goal

Reorganize `shared/components` into Atomic Design tiers (`elements/`, `blocks/`, `sections/`), and refresh `README.md`'s directory structure to match the repo as it actually stands.

## Context

`shared/components` is a flat, undifferentiated folder mixing single-element primitives (`Button`, `Badge`), composed controls (`Select`, `Modal`, `Table`, `PaginationControls`, `MetricCard`), page-chrome (`Sidebar`, `Header`, `Breadcrumb`, `Nav`), and two non-UI provider wrappers — no organizing principle. Separately, `README.md`'s documented directory tree still reflects the pre-STORY_12 layout (`shared/domain`, `shared/dal`, `shared/store` as flat folders) and was never updated across STORY_12–18's module-ownership refactor.

## Scope

**In Scope:**
- **Three-tier reorganization** of `shared/components` into `elements/`, `blocks/`, `sections/` (mapping in Technical Notes), `Providers.tsx`/`MockingProvider.tsx` split out to `shared/providers/`, every consumer's import path updated, and `README.md`'s directory structure regenerated to match — one change, documented together

**Out of Scope:**
- **Any behavioral or visual change** — relocation only
- **New components**: no new elements/blocks/sections beyond what's being moved
- **SDD.md changes**: `shared/components` isn't part of the Container/Module diagram; no diagram impact

## Acceptance Criteria

- Given `shared/components`, when this story completes, then it contains only `elements/`, `blocks/`, `sections/` subfolders — no loose files at its root
- Given `shared/providers`, when inspected, then it contains `Providers.tsx` and `MockingProvider.tsx`
- Given every former consumer of a moved file, when inspected, then its import path is updated
- Given `README.md`'s directory structure section, when compared to the actual repo, then every listed path exists and no existing top-level path is missing
- Given the full test suite (Jest + Playwright), when run after this change, then it passes unchanged — pure relocation, no behavior change

## Dependencies

- **STORY_18**: reorganizes the shared component set STORY_18 produced; must be complete first

## Technical Notes

File-to-tier mapping, decided by composition depth (elements = no custom-component composition; blocks = compose one or more elements/other blocks into a reusable control; sections = top-level page-chrome, composed directly in `app/layout.tsx`):

| Tier | Files | Rationale |
|---|---|---|
| `elements/` | `Button.tsx`, `Badge.tsx`, `LoadingOverlay.tsx`, `Select.tsx` | Single-control wrappers, compose no other custom component — `Select` is a labeled native `<select>`, same tier as `Button` |
| `blocks/` | `Modal.tsx`, `MetricCard.tsx`, `PaginationControls.tsx`, `Table.tsx`, `Nav.tsx` | Compose elements into a reusable control (`Modal`/`Table` use `Button`; `PaginationControls` uses both `Button` and `Select`). `Nav` is a block, not a section — it's composed *within* `Sidebar`, one level below the page-chrome layer, not directly in `app/layout.tsx` |
| `sections/` | `Sidebar.tsx`, `Header.tsx`, `Breadcrumb.tsx` | Composed directly in `app/layout.tsx`; each represents one full page-chrome region |
| *(excluded — `shared/providers/`)* | `Providers.tsx`, `MockingProvider.tsx` | Context-provider wrappers, not visual UI — forcing them into an Atomic Design tier would misrepresent what they are |

- `Modal.tsx`/`Table.tsx`'s import of `Button` becomes `../elements/Button` (block importing an element — expected, one-directional: elements never import from blocks/sections).
- `PaginationControls.tsx`'s imports of `Select`/`Button` both become `../elements/{Select,Button}`.
- `Sidebar.tsx`'s import of `Nav` becomes `../blocks/Nav` (section importing a block).
- `shared/components/index.ts` (if one exists) or direct imports — check whether any barrel file needs updating alongside the moves.

## Definition of Done

- [x] `shared/components/{elements,blocks,sections}` created per the mapping table
- [x] `shared/providers/` created with `Providers.tsx`, `MockingProvider.tsx`
- [x] No loose files remain at `shared/components`'s root
- [x] Every consumer's import path updated
- [x] `README.md`'s directory structure section fully regenerated
- [x] Full Jest + Playwright suite passes unchanged

---

## Changelog

### v1.1
- Implemented per the mapping table, with one adjustment made mid-implementation: `Select.tsx` moved from `blocks/` to `elements/` — a labeled native `<select>` is a single-control primitive, same tier as `Button`, not a composed control. `PaginationControls.tsx`'s imports updated accordingly (`../elements/Select`, `../elements/Button`).
- `README.md`'s directory structure fully regenerated, now showing each module's actual internal shape (`domain/`, `hooks/`, `store/`, `dal.ts`, `types.ts` — not every module has every piece) instead of the flat one-liner-per-module it had before STORY_12.
- Verified: `tsc --noEmit` clean, Jest 22/22 suites (99/99 tests) unchanged, Playwright 16/16 (Chrome + Safari) unchanged.

### v1.0
- Initial version
