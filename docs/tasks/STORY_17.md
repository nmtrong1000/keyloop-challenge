# STORY_17: Observability Completion (Metrics & Traces)

## Metadata

- Issue type: Story
- Priority: Medium
- Status: COMPLETED
- Version: 1.1

---

## Goal

Give the Metrics and Traces pillars the same reusable-wrapper treatment the Logs pillar already has, instead of leaving them as raw inline native-API calls.

## Context

SDD §6 names three observability pillars. Only Logs (`shared/observability/logEvent.ts`) is actually wrapped. Metrics (`performance.mark`/`performance.measure`) is called directly, three raw calls inline in what's now `InventoryView`. Traces (`crypto.randomUUID()`) is called directly inline in ActionLogging's `useSubmitAction`. Both should get the same "swappable without touching call sites" treatment `logEvent.ts`'s own reasoning already establishes.

## Scope

**In Scope:**
- **`shared/observability/measure.ts`**: `markStart(name)` / `markEnd(name)`, wrapping `performance.mark`/`performance.measure`
- **`shared/observability/correlationId.ts`**: `generateCorrelationId()`, wrapping `crypto.randomUUID()`
- **`InventoryView`**: its inline `performance.mark("inventory-render-start")` / `performance.mark("inventory-render-end")` + `performance.measure(...)` calls replaced with `markStart("inventory-render")` / `markEnd("inventory-render")`
- **ActionLogging's `useSubmitAction`**: its inline `crypto.randomUUID()` replaced with `generateCorrelationId()`

**Out of Scope:**
- **New metrics or traces beyond what SDD §6 already specifies**: no new instrumentation surface, just wrapping what exists
- **Logs pillar**: already wrapped, untouched

## Acceptance Criteria

- Given `shared/observability`, when inspected, then it contains `logEvent.ts`, `measure.ts`, and `correlationId.ts`
- Given `InventoryView`'s render-timing, when triggered, then it calls `markStart`/`markEnd` rather than raw `performance.*`
- Given `useSubmitAction`'s mutation, when it runs, then it calls `generateCorrelationId()` rather than raw `crypto.randomUUID()`
- Given the render-timing and correlation-ID behavior, when observed (DevTools Performance timeline, `X-Correlation-Id` header round-trip), then it's unchanged from before this story
- Given the full test suite, when run after this change, then it passes, with any test asserting on `crypto.randomUUID`/`performance.mark` mocks updated to target the new wrapper functions

## Dependencies

- **STORY_16**: `InventoryView` must be at its final name/location before its render-timing calls are rewired
- **STORY_15**: `useSubmitAction` must be at its final module-owned location before its correlation-ID call is rewired

## Technical Notes

- `markEnd` should call both `performance.mark` (end mark) and `performance.measure` internally — callers only need the two function calls, not three.
- No new dependency — both wrappers are thin functions over existing native browser APIs, consistent with STACKS.md's Metrics/Tracing decisions (Native Performance API, manual correlation ID).

## Definition of Done

- [x] `measure.ts` and `correlationId.ts` added to `shared/observability`
- [x] `InventoryView` uses `markStart`/`markEnd`
- [x] `useSubmitAction` uses `generateCorrelationId`
- [x] No raw `performance.mark`/`performance.measure`/`crypto.randomUUID()` calls remain outside `shared/observability`
- [x] Full test suite passes

---

## Changelog

### v1.1
- Implemented: `shared/observability/measure.ts` (`markStart`/`markEnd`) and `correlationId.ts` (`generateCorrelationId`). `InventoryView`'s three raw `performance.*` calls replaced with `markStart("inventory-render")`/`markEnd("inventory-render")` — identical underlying `performance.mark`/`performance.measure` calls, so the existing test spying on `performance.measure` passed unchanged. `useSubmitAction`'s inline `crypto.randomUUID()` replaced with `generateCorrelationId()`; no test mocked `crypto.randomUUID` directly, so nothing needed updating there either.
- `tsc --noEmit`, lint, and full Jest suite (22 suites, 99/99) pass unchanged.

### v1.0
- Initial version
