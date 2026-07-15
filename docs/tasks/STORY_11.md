# STORY_11: UI System Refactor (Design Tokens & Page Shell)

## Metadata

- Issue type: Story
- Priority: Medium
- Status: COMPLETED
- Version: 2.2

---

## Goal

Apply the Precision Modern design system's tokens and restructure the page into a sidebar/header/breadcrumb/title shell, without changing any existing behavior.

## Context

The current UI uses default Tailwind styling and a single unstyled heading, with no navigational shell. `docs/DESIGN.md` defines a full design system (colors, typography, spacing, shape) that hasn't been applied anywhere. A reference screenshot showed the target page-shell pattern (sidebar, header, breadcrumb, title) — this story adopts that layout structure only, not the extra business widgets the reference depicted.

## Scope

**In Scope:**
- **Design Tokens**: Tailwind theme (`app/globals.css`'s `@theme`) updated with `DESIGN.md`'s colors, typography, border radius, and spacing
- **Fonts**: Hanken Grotesk (headlines), Inter (body), JetBrains Mono (labels) via `next/font`, replacing the current Geist fonts
- **Page Shell**: a left sidebar with one "Inventory" nav item, an empty header bar above the main content, a breadcrumb line, and a main title
- **Restyling**: existing filters, table, pagination, badges, and forms restyled with the new tokens — no behavior change
- **Action-logging modal**: the aging-vehicle action form/history moved from an inline expand into a modal dialog, triggered by a "Log action" button
- **Table column split**: the table's combined Status column split into Status / Log / Action, all columns fixed-width (`table-fixed` + `colgroup`), with Log wrapping and flexing to fill remaining width
- **Interaction polish**: hover states on buttons and table rows, `cursor-pointer` on buttons, consistent centered/padded/larger-font styling for empty/loading/error states, the aging-count banner restyled as a metric card, bolder/larger table header text

**Out of Scope:**
- **Any business feature or widget from the layout reference**: search bar, filter chips, Export/Add Vehicle buttons, summary cards, vehicle thumbnails, row checkboxes — not part of the SRS, layout reference only
- **New navigation**: the sidebar's single item doesn't need to route anywhere — there's only one page
- **New routes, new data, new business logic**

## Acceptance Criteria

- Given the app renders, when compared to `docs/DESIGN.md`, then colors, typography, radius, and spacing match the documented tokens.
- Given the page loads, when viewed, then a left sidebar shows exactly one nav item, labeled "Inventory".
- Given the page loads, when viewed, then an empty header bar renders above the main content, a breadcrumb renders above the main title, and the main title renders below that.
- Given any existing feature (filter, pagination, aging badge, action form/history), when exercised, then it behaves exactly as before — only its appearance changed.
- Given the responsive breakpoints from STORY_10, when re-verified, then the layout still adapts correctly at desktop/tablet/mobile widths.

## Dependencies

- **STORY_06, STORY_07, STORY_08**: restyles their existing output; adds no new functionality to any of them

## Component Breakdown

The shell is composed of four single-purpose components under `shared/components/`, wired together directly in `app/layout.tsx` (not hidden behind a combined wrapper):

- **`Sidebar.tsx`**: the `<aside>` — wordmark ("DMS") plus renders `Nav`
- **`Nav.tsx`**: the primary nav itself — the single "Inventory" item
- **`Header.tsx`**: the empty header bar
- **`Breadcrumb.tsx`**: the static "Dashboard / Inventory" breadcrumb line

`app/layout.tsx` composes these around `{children}` inside the existing `MockingProvider`/`Providers` wrapping. `app/page.tsx` now holds only the main title and the `InventoryPage` composition — no shell markup lives there.

A general-purpose **`Modal.tsx`** also lives in `shared/components/` (plain div-based overlay, not the native `<dialog>` — jsdom doesn't implement `showModal()`). It's used by `AgingVehicleExtras` (the Action column's trigger + modal), composed alongside two new sibling extension points: `AgingStock`'s `AgingBadge` (Status column, badge only) and `ActionLogging`'s new `LatestActionLog` (Log column, the denormalized `currentStatus` text). `VehicleTable` takes three render props (`renderStatus`/`renderLog`/`renderAction`) instead of one combined `renderRowExtra`.

## Technical Notes

- Tailwind v4's config is CSS-first (`@theme` in `app/globals.css`) — no `tailwind.config.js` exists or should be added; tokens go there.
- **Resolved**: `DESIGN.md`'s front matter previously listed `rounded.DEFAULT` as 4px, conflicting with its prose's "6px border radius for all standard interactive elements." Fixed by setting `rounded.DEFAULT` to 6px (`0.375rem`) and dropping the now-redundant `md` step that held that value; see `DESIGN.md`'s Shapes section for the documented resolution. Implementation should use the `DEFAULT`/`rounded` token for buttons, inputs, cards, and chips per the prose.
- Sidebar/header/breadcrumb are layout primitives, not features — they live in `app/layout.tsx` (see Component Breakdown), wrapping the existing `InventoryPage` composition from `app/page.tsx` without changing what it renders internally.
- STORY_10's Playwright suite asserts against the current DOM/text; expect it to need re-running and likely updating once markup/classes change.
- Existing Jest tests that query by role or visible text should mostly survive; any asserting exact Tailwind classes will need updating.
- **Gap, not silently dropped**: `DESIGN.md` defines no "warning" color role. The aging-stock badge/banner previously used Tailwind's built-in amber palette and still does — there's no design-system token for this semantic state. Flagged here rather than invented.
- **Dark mode dropped**: the pre-existing `dark:` Tailwind variants (leftover from the Next.js starter template) were removed. `DESIGN.md` defines a single light palette with no dark counterpart, so keeping them would have meant inventing colors not in the design system.

## Definition of Done

- [x] `app/globals.css`'s `@theme` updated with `DESIGN.md`'s color, typography, radius, and spacing tokens
- [x] Fonts switched to Hanken Grotesk / Inter / JetBrains Mono via `next/font`
- [x] Page shell implemented: sidebar (single "Inventory" item), empty header, breadcrumb, main title — as four separate `shared/components/` components (`Sidebar`, `Nav`, `Header`, `Breadcrumb`) composed in `app/layout.tsx`, see Component Breakdown
- [x] All existing components restyled with the new tokens; no behavioral change
- [x] No new business features/widgets added beyond what the layout structure requires
- [x] Full test suite (Jest + Playwright) passes, updated as needed for new markup/styling — passed unchanged (80/80 Jest, 12/12 Playwright), no test updates were needed
- [x] Border-radius ambiguity (4px front matter vs. 6px prose) resolved and documented — `DEFAULT` is now 6px
- [x] Action form/history moved into a modal dialog, triggered by a "Log action" button (submit relabeled "Submit" to disambiguate)
- [x] Table split into fixed-width Status / Log / Action columns; Log wraps and flexes to fill remaining width
- [x] Hover states on buttons and table rows; `cursor-pointer` on buttons; empty/loading/error states centered, padded, larger font; aging-count banner restyled as a metric card; table header bolder/larger

---

## Changelog

### v2.2
- Action form/history converted from an inline expand to a modal dialog (new `shared/components/Modal.tsx`); table's Status column split into Status/Log/Action (new `LatestActionLog` component, `VehicleTable`'s single `renderRowExtra` replaced by three render props), all columns fixed-width via `table-fixed` + `colgroup`, Log column flexes and wraps.
- UI polish pass: trigger button relabeled "Log action" (styled as a real button) and the modal's submit relabeled "Submit"; hover states + `cursor-pointer` added to buttons and table rows; empty/loading/error messages restyled consistently (centered, padded, larger font); aging-count banner redesigned as a metric card; table header text made bolder and slightly larger.
- Found and fixed along the way: custom `--spacing-xs/sm/md/lg/xl` tokens were shadowing Tailwind's built-in `--container-md` (used by `max-w-md`), collapsing the modal's width — removed those tokens in favor of Tailwind's native numeric spacing scale. Also fixed a z-index stacking bug where the modal's backdrop intercepted clicks meant for the dialog panel.
- Full test suite passes (81/81 Jest, 12/12 Playwright), updated where button labels/markup changed.

### v2.1
- Corrected the shell's placement and structure: sidebar/header/breadcrumb had been implemented as a single `AppShell` wrapper inline in `app/page.tsx`. Split into four single-purpose components (`Sidebar`, `Nav`, `Header`, `Breadcrumb`) under `shared/components/`, composed directly in `app/layout.tsx`; `app/page.tsx` now holds only the title and `InventoryPage`. Added the Component Breakdown section. Full test suite still passes unchanged (80/80 Jest, 12/12 Playwright).

### v2.0
- Implemented: design tokens applied to `app/globals.css`'s `@theme`; fonts switched to Hanken Grotesk/Inter/JetBrains Mono; sidebar/header/breadcrumb/title shell added in `app/page.tsx`; all existing components restyled. Full test suite passes unchanged (80/80 Jest, 12/12 Playwright). Two gaps documented in Technical Notes (no design-system "warning" color; dark-mode variants dropped).

### v1.1
- Resolved the border-radius ambiguity in `DESIGN.md` (`DEFAULT` set to 6px); checked off the corresponding Definition of Done item.

### v1.0
- Initial version
