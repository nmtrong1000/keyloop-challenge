# EPIC: Intelligent Inventory Dashboard (Frontend Implementation)

## Metadata

- Issue type: Epic
- Priority: High
- Status: TODO
- Version: 1.0

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

- **STORY_01**: Project Scaffold (TODO)
- **STORY_02**: API Contract Definition (TODO)
- **STORY_03**: Mocked Backend (MSW) (TODO)
- **STORY_04**: Data Access Layer (TODO)
- **STORY_05**: State Management (TODO)
- **STORY_06**: Inventory Module (TODO)
- **STORY_07**: Aging Stock Module (TODO)
- **STORY_08**: Action Logging Module (TODO)
- **STORY_09**: Observability Instrumentation (TODO)
- **STORY_10**: Responsive, Cross-Browser & Accessibility Verification (TODO)

## Dependencies

- N/A

## Risks / Assumptions

- Risk of scope creep from SRS ambiguities not caught during design, despite SDD §7's mitigation.
- Risk of story-boundary drift, since STORY_06–08 all share State Management as a common dependency.
- Assumed that SDD.md and SRS_SUPPLY.md remain frozen for the duration of this epic.
- Assumed that no real backend integration will be requested before this epic completes.
- Assumed inventory scale can reach millions of records, requiring server-side paging (SRS Assumptions).

## Success Metrics

- **Story Completion**: 10/10 child stories COMPLETED
- **Test Coverage**: automated tests covering domain logic, DAL, state, and all three UI modules
- **Cross-Browser Pass Rate**: full pass on Chrome, Edge, and Safari; desktop, tablet, and mobile
- **Render Performance**: within the 2s/500-vehicle target (SRS Time Behaviour NFR)

---

## Changelog

### v1.0
- Initial version
