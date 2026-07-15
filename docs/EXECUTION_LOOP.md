# Execution Loop

How each `STORY_nn` in `docs/tasks/` gets executed, and where each test type lives. Applies to the whole EPIC in `docs/tasks/EPIC.md`.

## Loop

1. Pick the next story whose `Dependencies` are all `COMPLETED` (dependency order, not necessarily numeric order — they happen to coincide here).
2. Set `Status: IN_PROGRESS` — implement only that story's Acceptance Criteria. If a gap is found in another story's territory, it becomes a note on that story, not a scope-creep fix in the current one.
3. Instrument observability for whatever this story touches — see Observability Checklist below. This is part of the story's implementation, not a follow-up: do it before writing tests, so the tests can assert on it.
4. Write the tests that story owns (see Test Placement below), including assertions on the observability added in step 3 where applicable.
5. Set `Status: TESTING` — run those tests, walk the Acceptance Criteria manually, tick off the Definition of Done.
6. Pass → `Status: COMPLETED`, commit, update `EPIC.md`'s Child Stories. Fail → stay in `TESTING`/`IN_PROGRESS`, fix, repeat step 5.
7. Return to step 1 for the next unblocked story.

No story is started out of dependency order, and no story's implementation expands to cover another story's responsibility.

## Observability Checklist

Applied per SDD §6 before any story leaves `IN_PROGRESS`. Not every story touches every pillar — skip a row if the story adds no surface of that kind.

| Pillar | Rule | Applies to |
|---|---|---|
| Logs | `logEvent()` fires on user-triggered actions only (view, filter, action-logged) — never on background polling or internal re-renders | Any story adding a user-facing view/filter/submit action |
| Metrics | `performance.mark`/`measure` only where a Time Behaviour NFR applies (inventory list render, up to 500 vehicles) — don't instrument paths with no latency budget | STORY_06 only |
| Traces | Correlation ID generated on write paths that cross the DAL boundary (e.g. action submission), forwarded as `X-Correlation-Id`, and echoed back by the mock so the trace closes in both directions | Any story adding a mutation through the DAL |

If a story's Acceptance Criteria don't already cover a row that applies to it, add the missing AC/DoD line to that story before implementing — don't implement instrumentation the story's own doc doesn't account for.

## Test Placement

No dedicated "testing story" exists — each story ships its own tests as part of its Definition of Done, except E2E, which needs the fully assembled app and so waits for STORY_10.

| Test type | Lives in | What it covers |
|---|---|---|
| Unit (Jest) | STORY_02, STORY_06, STORY_07, STORY_08, STORY_09 | Pure logic: contract validation, filter/age-bucket matching, aging calculation, append-only mutation, logging/correlation utility |
| Integration (Jest + RTL, against MSW) | STORY_03, STORY_06, STORY_07, STORY_08 | One layer boundary at a time: MSW's two entry points, then each module's State+DAL+MSW wiring |
| E2E (Playwright) | STORY_10 only | Full user flows across Chrome/Edge/Safari and desktop/tablet/mobile |
