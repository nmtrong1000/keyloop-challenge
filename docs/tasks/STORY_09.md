# STORY_09: Observability Instrumentation

## Metadata

- Issue type: Story
- Priority: Medium
- Status: COMPLETED
- Version: 1.0

---

## Goal

Make the dashboard's key user actions and performance visible in DevTools, per the SRS's logging and performance requirements.

## Context

SRS's Logging NFR and Time Behaviour NFR, plus SDD §6's reinterpretation of tracing as a correlation ID, are fulfilled by this story — it instruments the modules STORY_06–08 already built.

## Scope

**In Scope:**
- **Logging Utility**: `logEvent()` wrapping `console.log`, called at view/filter/action-logged events (SDD §6.1)
- **Performance Marks**: `performance.mark`/`measure` around inventory list render (SDD §6.2)
- **Correlation ID**: generated on action submission, carried through the log entry and the mock API call header (SDD §6.3)

**Out of Scope:**
- **New UI Behavior**: this story only observes existing behavior from STORY_06–08, it doesn't change it
- **A Metrics/Tracing Backend**: explicitly out of scope per SDD §6.2/§6.3

## Acceptance Criteria

- Given a manager views a page, when loaded, then `inventory.viewed` logs the page number, page size, and timestamp.
- Given a manager applies a filter, when applied, then an `inventory.filtered` log entry appears with the filter criteria.
- Given a manager submits an action, when submitted, then an `aging_vehicle.action_logged` entry appears with a correlation ID, and the same ID appears on the outgoing POST request header.
- Given the inventory list renders, when measured, then a `performance.measure` entry named `inventory-render` is recorded.

## Dependencies

- **STORY_04**: provides the header pass-through `postVehicleAction` needs to carry the correlation ID
- **STORY_06**: instruments its view/filter actions
- **STORY_07**: instruments aging-stock-related view events, if distinct from STORY_06's
- **STORY_08**: instruments its action-submission event

## Technical Notes

- `logEvent` should be a small, swappable utility — the destination is `console.log` today, but call sites shouldn't hardcode that assumption (SDD §6.1).
- Correlation ID uses `crypto.randomUUID()`, carried in an `X-Correlation-Id` header (SDD §6.3).
- **Re-scoped mid-epic** (EXECUTION_LOOP Observability Checklist): the actual call sites for logging/metrics/traces were pulled forward into STORY_06 and STORY_08, since instrumentation is required as part of the story that introduces the touched behavior, not deferred. This story ended up being the utility itself (already built in STORY_06) plus a verification pass over the three call sites and the correlation-ID round-trip, rather than net-new implementation.
- Checking `inventory.viewed`'s payload against this story's AC surfaced a real gap: STORY_06's original implementation only logged `{ count }`, not `page`/`pageSize`. Fixed in `modules/Inventory/pages/InventoryPage.tsx`.

## Definition of Done

- [x] `logEvent` utility implemented and unit-tested (`shared/observability/logEvent.ts`, built in STORY_06)
- [x] All three named log events fire at the correct trigger points — `inventory.viewed` (with page/pageSize, fixed here), `inventory.filtered` in `modules/Inventory/pages/InventoryPage.tsx`; `aging_vehicle.action_logged` in `useSubmitAction.ts` (STORY_08)
- [x] Performance mark/measure recorded around inventory render (STORY_06, `InventoryPage.test.tsx`)
- [x] Correlation ID present in both the log entry and the POST request header — proven across three existing tests rather than one new one: `ActionForm.test.tsx` (log contains a valid UUID), `dal.integration.test.ts` (DAL forwards it as `X-Correlation-Id`), `handlers.test.ts` (mock echoes it back)

---

## Changelog

### v1.0
- Initial version
