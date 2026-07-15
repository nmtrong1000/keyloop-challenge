# STORY_04: Data Access Layer

## Metadata

- Issue type: Story
- Priority: High
- Status: COMPLETED
- Version: 1.0

---

## Goal

Give the rest of the app a single, typed way to read and write mock data, without knowing MSW is involved.

## Context

SDD §2 assigns the Data Access Layer the job of isolating UI/state code from the mock implementation detail, easing a future swap to a real backend.

## Scope

**In Scope:**
- **Typed Client Functions**: `getVehicles({ page, pageSize, filters })`, `postVehicleAction(vehicleId, action, { correlationId })`, typed against STORY_02's types
- **Correlation ID Pass-Through**: `postVehicleAction` accepts an optional `correlationId` and forwards it as the `X-Correlation-Id` request header (SDD §6.3)
- **Error Handling**: surfaces network/validation failures to callers in a typed shape

**Out of Scope:**
- **Caching/Refetching Behavior**: handled by STORY_05
- **UI Rendering**: handled by STORY_06–08

## Acceptance Criteria

- Given `getVehicles({ page, pageSize, filters })` is called, when the mock responds, then it returns a typed paged result.
- Given `postVehicleAction()` is called with a valid action, when the mock responds, then the function returns the created `AgingVehicleAction` record.
- Given the mock returns an error, when a DAL function is called, then the error is surfaced in a typed, catchable form — not swallowed.
- Given `postVehicleAction` is called with a `correlationId`, when the request is sent, then the mock receives it as the `X-Correlation-Id` header.

## Dependencies

- **STORY_02**: consumes the generated types directly, no hand-duplicated shapes
- **STORY_03**: calls the real mock endpoints, not stubs

## Technical Notes

- No React hooks here — this layer is framework-agnostic; STORY_05 wraps it in TanStack Query hooks.
- Unit-test with the mock handlers running, not with a further-mocked DAL.

## Definition of Done

- [x] `getVehicles({ page, pageSize, filters })` and `postVehicleAction()` implemented and typed (`shared/dal/index.ts`)
- [x] `postVehicleAction()` forwards an optional `correlationId` as the `X-Correlation-Id` header
- [x] Unit tests cover the success path for both functions
- [x] Unit tests cover at least one error-path case per function
- [x] No direct MSW imports in `shared/dal/index.ts` (only its test imports `msw`/mocks for setup)

---

## Changelog

### v1.0
- Initial version
