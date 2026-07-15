# STORY_08: Action Logging Module

## Metadata

- Issue type: Story
- Priority: High
- Status: COMPLETED
- Version: 1.0

---

## Goal

Let a manager record what they're doing about an aging vehicle, without ever losing a prior entry.

## Context

SRS's "Actionable Insights" requirement — persisting a status/action per aging vehicle as an append-only record — is fulfilled by this story.

## Scope

**In Scope:**
- **Action Form**: manager submits a status/action for a specific aging vehicle
- **Append-Only Submission**: each submission creates a new record; none are edited or deleted
- **Action History View**: full list of a vehicle's past actions, most recent first

**Out of Scope:**
- **Current-Status Badge in the List**: handled by STORY_07 (this story only creates the records it reads)
- **Editing/Deleting Past Actions**: explicitly out of scope — SRS models this as append-only

## Acceptance Criteria

- Given an aging vehicle, when a manager submits a new status/action, then a new `AgingVehicleAction` record is created and persisted for the session.
- Given a vehicle already has a logged action, when a manager submits another, then the prior record remains unchanged and visible in history.
- Given the form is submitted with an empty or invalid action, when validated, then submission is blocked with a visible error.
- Given a submission succeeds, when the UI updates, then no manual refresh is needed to see the new record reflected (STORY_07's current-status badge).
- Given a manager submits an action, when submitted, then a correlation ID is generated and forwarded as `X-Correlation-Id`, and `aging_vehicle.action_logged` logs it (EXECUTION_LOOP Observability Checklist).

## Dependencies

- **STORY_05**: submits through State Management's mutation, not directly to the DAL
- **STORY_07**: needs aging vehicles already identified/displayed to attach the form to

## Technical Notes

- Validate with Zod (SDD §5.3) before calling the mutation — client-side validation, since there's no backend validation layer.
- Generates the correlation ID and fires the log event itself (revised: EXECUTION_LOOP's Observability Checklist assigns Traces/Logs to whichever story adds the DAL mutation, i.e. this one — reuses STORY_06's `logEvent` utility rather than reimplementing it).
- **Contract gap found during implementation**: STORY_02's contract only had `POST /vehicles/:id/actions` — no way to read a vehicle's action history back. Added `GET /vehicles/{id}/actions` (returns `AgingVehicleAction[]`, most-recent-first) to `contracts/openapi.yaml`, regenerated types.

## Definition of Done

- [x] Form validates input before submission (React Hook Form + Zod) — `ActionForm`
- [x] Submission creates a new record without modifying prior ones (STORY_03's append-only handler, unchanged)
- [x] Action history displays all records for a vehicle, most recent first — `ActionHistory`, fetched on demand via new `GET /vehicles/:id/actions`
- [x] Integration test: submit → history and STORY_07's badge update without manual refresh (`AgingVehicleExtras.test.tsx`)
- [x] Correlation ID generated on submit (`crypto.randomUUID()`), forwarded as `X-Correlation-Id`, echoed by the mock
- [x] `aging_vehicle.action_logged` fires on successful submission, including the correlation ID

---

## Changelog

### v1.0
- Initial version
