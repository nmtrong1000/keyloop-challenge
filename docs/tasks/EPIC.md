# EPIC: Intelligent Inventory Dashboard (Frontend Implementation)

## Metadata

- Issue type: Epic
- Priority: High
- Status: COMPLETED
- Version: 1.8

---

## Goal

Implement the Intelligent Inventory Dashboard's frontend, fulfilling every SRS-SUPPLY requirement against a contract-first, mocked backend.

## Context

Dealership managers currently have no dedicated view of vehicle stock, no way to spot aging inventory, and no way to log follow-up actions against it. This epic delivers that dashboard as a Next.js frontend per SDD.md, with the backend mocked per the SRS's no-persistent-database constraint.

## Scope

**In Scope:**
- **Inventory Visualization**: paginated, filterable vehicle list by make, model, and age
- **Aging Stock Identification**: flagging and prominent display of vehicles over 90 days
- **Actionable Insights**: append-only logging of manager status/actions on aging vehicles
- **API Contract**: OpenAPI-defined contract for the mocked backend, authored before implementation
- **Mocked Backend**: MSW-based mock serving the contract, without persistent storage
- **Observability**: logging, performance metrics, and correlation-ID tracing per SDD §6
- **Cross-Browser and Responsive Verification**: Chrome, Edge, Safari; desktop, tablet, mobile

**Out of Scope:**
- **Backend Persistence**: handled by future work, per SRS
- **Multi-Dealership Support**: handled by future work, per SRS's Single-Dealership assumption
- **Internationalization**: handled by future work, per SDD §7's ambiguity note

## Child Stories

- **STORY_01**: Project Scaffold (COMPLETED)
- **STORY_02**: API Contract Definition (COMPLETED)
- **STORY_03**: Mocked Backend (MSW) (COMPLETED)
- **STORY_04**: Data Access Layer (COMPLETED)
- **STORY_05**: State Management (COMPLETED)
- **STORY_06**: Inventory Module (COMPLETED — reopened for page-size selection + column sorting, see story file)
- **STORY_07**: Aging Stock Module (COMPLETED — SSR deviation flagged; module-boundary drift found and fixed, see story file)
- **STORY_08**: Action Logging Module (COMPLETED — added GET /vehicles/:id/actions, see story file)
- **STORY_09**: Observability Instrumentation (COMPLETED — re-scoped, see story file)
- **STORY_10**: Responsive, Cross-Browser & Accessibility Verification (COMPLETED — found & fixed a real mobile overflow bug)
- **STORY_11**: UI System Refactor (Design Tokens & Page Shell) (COMPLETED)
- **STORY_12**: Module-Owned Types (COMPLETED)
- **STORY_13**: Module-Owned Domain Logic (COMPLETED)
- **STORY_14**: Module-Owned Data Access Layer (COMPLETED)
- **STORY_15**: Module-Owned State (Store & Hooks Split) (COMPLETED)
- **STORY_16**: Inventory Composition Rename (COMPLETED)
- **STORY_17**: Observability Completion (Metrics & Traces) (COMPLETED)
- **STORY_18**: Shared Component Library (Generic Primitives) (COMPLETED)
- **STORY_19**: Atomic Design Reorganization (COMPLETED)
- **STORY_20**: Server-Side Rendering (SSR) Implementation (COMPLETED)

## Dependencies

- N/A

## Risks / Assumptions

- Risk of scope creep from SRS ambiguities not caught during design, despite SDD §7's mitigation.
- Risk of story-boundary drift, since STORY_06–08 all share State Management as a common dependency.
- Assumed that SDD.md and SRS_SUPPLY.md remain frozen for the duration of this epic.
- Assumed that no real backend integration will be requested before this epic completes.
- Assumed inventory scale can reach millions of records, requiring server-side paging (SRS Assumptions).

## Success Metrics

- **Story Completion**: 20/20 child stories COMPLETED
- **Test Coverage**: 99 Jest tests covering aging calc, filters, sorting, pagination, DAL, state, and all three UI modules — met
- **Cross-Browser Pass Rate**: 16/16 Playwright tests pass on Chrome and Safari; Edge represented via Chromium (see STORY_10) — met with a documented substitution
- **Render Performance**: Verified ~300-700ms per page in practice, against the 2s/500-vehicle target — met

## Known Gaps (carried from child stories, not silently dropped)

- **"Edge" browser coverage is Chromium, not the real msedge channel** (STORY_10): installing real Edge needs `sudo`, unavailable in this sandboxed environment.
- **`docs/tasks/STORY_02.md`'s frozen contract needed three follow-up amendments** (`currentStatus` in STORY_07, `GET /vehicles/:id/actions` in STORY_08, `sortBy`/`sortDir` in STORY_06) — contract-first didn't fully anticipate the read side of Actionable Insights or column sorting. All three amendments are backward-compatible additions, not breaking changes.
- **`DESIGN.md` has no "warning" color role** (STORY_11): the aging-stock badge/banner still uses Tailwind's built-in amber palette rather than a design-system token, since none exists for that semantic state.
- **Dark mode dropped** (STORY_11): the starter template's `dark:` Tailwind variants were removed rather than restyled, since `DESIGN.md` defines only one (light) palette.

---

## Changelog

### v1.8
- STORY_20 (Server-Side Rendering Implementation) completed: epic re-closed at 20/20. Resolved the "SSR is actively used" Known Gap flagged in STORY_07 — `app/page.tsx` now genuinely server-prefetches the first page via `msw/node`, hydrated into the browser. Also corrected the Story Completion metric (18/18 → 19/19 → 20/20), which had gone stale after STORY_19.

### v1.7
- STORY_19 (Atomic Design Reorganization) completed: epic re-closed at 19/19.

### v1.6
- Reopened: added STORY_19 — reorganize `shared/components` into Atomic Design tiers (`elements/`, `blocks/`, `sections/`) and refresh `README.md`'s stale directory structure. Not a new SRS requirement.

### v1.5
- STORY_18 (Shared Component Library) completed: epic re-closed at 18/18. STORY_12–18's module-boundary and shared-component cleanup pass is done — `shared/domain`, `shared/dal`, and `shared/store` no longer exist as flat, undifferentiated folders; each module owns its own domain logic, DAL, and state; `shared/types` holds only the API contract; observability's three pillars (Logs/Metrics/Traces) are all wrapped consistently; and six generic UI primitives (`Select`, `Table`, `PaginationControls`, `Badge`, `MetricCard`, `Button`) replace what were hand-rolled, drifted implementations. No SRS requirement changed — this was an internal architecture and reusability pass, verified with the full Jest (99/99) and Playwright (16/16) suites passing unchanged throughout.

### v1.4
- Reopened: added STORY_12–18 — a module-boundary cleanup pass (types, domain, DAL, state, naming, observability, shared UI primitives). Not a new SRS requirement — code that was placed in `shared/` without actually being shared by more than one module gets relocated to the module that owns it, and generic UI patterns get extracted into reusable primitives.

### v1.3
- Reopened and re-closed STORY_06: added page-size selection and column sorting (Make/Model/Intake Date) to the Inventory module, with a third backward-compatible contract amendment (`sortBy`/`sortDir`). Not a new SRS requirement — a usability improvement to the existing pagination/list feature.

### v1.2
- STORY_11 (UI System Refactor) completed: design tokens, fonts, and page shell applied; epic re-closed at 11/11.

### v1.1
- Reopened: added STORY_11 (UI System Refactor) — the shipped UI's visual quality was found lacking after the epic was marked complete; not a new SRS requirement, a design-system application pass.

### v1.0
- Initial version
