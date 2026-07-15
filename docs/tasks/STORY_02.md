# STORY_02: API Contract Definition

## Metadata

- Issue type: Story
- Priority: High
- Status: COMPLETED
- Version: 1.0

---

## Goal

Freeze the wire contract for the mocked backend before any implementation consumes or serves it.

## Context

SDD §5.3 mandates an OpenAPI spec for the mock's two endpoints, generating TypeScript types automatically. This story authors that contract, per the domain model in SDD §3.

## Scope

**In Scope:**
- **OpenAPI Spec**: `GET /vehicles` (paginated, filterable) and `POST /vehicles/:id/actions`, schemas for `Vehicle`/`AgingVehicleAction` (SDD §3)
- **Paged Response Envelope**: `{ items, totalCount, agingCount }` shape for `GET /vehicles`
- **Type Generation**: TypeScript types generated from the spec into the project

**Out of Scope:**
- **Mock Implementation**: handled by STORY_03
- **Consuming the Types**: handled by STORY_04

## Acceptance Criteria

- Given the OpenAPI spec file, when it is linted, then it passes with no schema errors.
- Given the spec, when the type-generation command runs, then TypeScript types matching `Vehicle` and `AgingVehicleAction` (SDD §3) are produced.
- Given the generated types, when compared to SDD §3's domain model, then every field (`vin`, `make`, `model`, `intakeDate`, `vehicleId`, `action`, `timestamp`) is present.
- Given the spec, when reviewed, then `GET /vehicles` accepts `page`, `pageSize`, and filter params, returning a paged envelope.
- Given a make/model/age filter is applied, when `GET /vehicles` responds, then `agingCount` still reflects the unfiltered dataset while `totalCount` reflects only matching results.

## Dependencies

- **STORY_01**: needs the npm project shell to run the codegen tool and land its output

## Technical Notes

- `POST /vehicles/:id/actions` request/response schema must reflect append-only semantics (SRS FR) — no PATCH/PUT/DELETE on actions.
- Age filter parameter on `GET /vehicles` should model the preset ranges from SRS (0–30, 31–60, 61–90, >90).
- Pagination is offset-based (`page`/`pageSize`), per SDD §7 — simpler than cursor-based for a mocked backend.
- `agingCount` is a **global** metric — the total count of aging stock (>90 days) across the *entire* inventory, unaffected by any active make/model/age filter. `totalCount` remains filter-scoped (total matching the current query, for pagination). Both are returned in the same envelope.

## Definition of Done

- [x] OpenAPI spec file written (`contracts/openapi.yaml`) and lints clean (`npm run lint:api`)
- [x] Type-generation script added to package.json (`npm run generate:api-types`)
- [x] Generated types committed to `shared/types/api.gen.ts`
- [x] Spec reviewed against SDD §3 domain model for field-level parity (Jest test)
- [x] Spec defines `page`/`pageSize` params and a paged response envelope with `totalCount`/`agingCount`
- [x] Spec documents `agingCount` as global (unfiltered) and `totalCount` as filter-scoped (schema descriptions); runtime behavior verified in STORY_03

---

## Changelog

### v1.0
- Initial version
