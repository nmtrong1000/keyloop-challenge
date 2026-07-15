# STORY_03: Mocked Backend (MSW)

## Metadata

- Issue type: Story
- Priority: High
- Status: COMPLETED
- Version: 1.0

---

## Goal

Serve vehicle and action data that conforms exactly to STORY_02's contract, without a real database.

## Context

SRS constrains the backend to mocked, non-persistent data. SDD §5.3 requires a dual `msw/node` + `msw/browser` setup so the Next.js SSR fetch and client-side calls both get intercepted.

## Scope

**In Scope:**
- **msw/node Setup**: registered via `instrumentation.ts`, intercepts the server-side initial fetch
- **msw/browser Setup**: intercepts client-initiated polling and mutations
- **Mock Fixtures**: a representative sample (thousands, not millions) of vehicle and action data, including aging vehicles
- **Pagination Handling**: handlers respect `page`/`pageSize`/filter params, returning a paged envelope with `totalCount`/`agingCount`
- **Shared Handlers**: one handler array consumed by both entry points

**Out of Scope:**
- **Data Access Layer**: handled by STORY_04
- **Persistence Beyond Session**: explicitly out of scope per SRS constraint

## Acceptance Criteria

- Given the app starts server-side, when the initial vehicle list is requested, then `msw/node` intercepts and returns fixture data matching the contract.
- Given the app is running in the browser, when `GET /vehicles` or `POST /vehicles/:id/actions` is called, then `msw/browser` intercepts and responds per the contract.
- Given the mock fixtures, when inspected, then at least one vehicle has `intakeDate` more than 90 days in the past.
- Given a POST to `/vehicles/:id/actions`, when submitted twice for the same vehicle, then both records persist for the session — the second does not overwrite the first.
- Given `GET /vehicles?page=2`, when requested, then a different page of results is returned, not page 1 again.
- Given any valid query, when responded to, then `totalCount`/`agingCount` reflect the full fixture set, not the page.

## Dependencies

- **STORY_01**: needs the Next.js shell to register `instrumentation.ts`
- **STORY_02**: implements exactly the frozen contract, not an improvised shape

## Technical Notes

- Both entry points must share one handler definition — no duplicated mock logic (SDD §5.3).
- Fixture data should include enough records and make/model/age spread to exercise pagination and filtering meaningfully.
- `agingCount` is computed over the full fixture set regardless of query filters; `totalCount` is computed over the filtered set (STORY_02).

## Definition of Done

- [x] `msw/node` intercepts the server-side fetch — `instrumentation.ts` wired, dev server boots clean; handler behavior proven via `setupServer` in Jest (27 tests)
- [ ] `msw/browser` intercepts client-side calls — worker registered via `MockingProvider`, but no client fetch exists yet to prove it against; deferred to STORY_04/05 (first consumer) and STORY_10 (Playwright)
- [x] Fixtures include aging (>90 day) and non-aging vehicles
- [x] POST endpoint appends rather than overwrites action records
- [x] Handlers support `page`/`pageSize`/filter params and return `totalCount`/`agingCount`
- [x] Filter-matching predicate (make/model/age-range) is a pure function covered by Jest unit tests, independent of the HTTP handler wiring

---

## Changelog

### v1.0
- Initial version
