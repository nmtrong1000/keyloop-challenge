# STORY_10: Responsive, Cross-Browser & Accessibility Verification

## Metadata

- Issue type: Story
- Priority: Medium
- Status: COMPLETED
- Version: 1.0

---

## Goal

Confirm the whole assembled dashboard actually meets the SRS's Adaptability and Learnability requirements, not just in theory.

## Context

SRS's two Adaptability NFRs (cross-browser, responsive layout) and the Learnability NFR are verified end-to-end here, once STORY_06–08 exist to verify.

## Scope

**In Scope:**
- **Playwright E2E Suite**: full flow (open → filter → see aging flag → log action → confirm persisted) across Chrome, Edge, Safari
- **Responsive Layout Check**: desktop, tablet, mobile viewport widths
- **Accessibility Pass**: `eslint-plugin-jsx-a11y` findings resolved; basic keyboard navigability confirmed

**Out of Scope:**
- **New Features**: this story verifies STORY_06–08, it doesn't add functionality
- **Automated Axe/jest-axe Audits**: documented as a future option, not implemented here (SDD §5.3)

## Acceptance Criteria

- Given the full user flow, when run in Chrome, Edge, and Safari via Playwright, then it passes in all three.
- Given the dashboard is viewed at desktop, tablet, and mobile widths, when rendered, then no layout breaks or overlapping content occurs.
- Given `eslint-plugin-jsx-a11y`, when run against the codebase, then it reports zero errors.
- Given a page of up to 500 vehicles, when rendered, then it completes within 2 seconds, any inventory size.

## Dependencies

- **STORY_06**, **STORY_07**, **STORY_08**: verifies their combined output; nothing to test before they exist

## Technical Notes

- Use Playwright's built-in device emulation for viewport widths rather than manual CSS breakpoint testing.
- The 500-vehicle performance check can reuse STORY_09's performance marks as the measurement source.
- **"Edge" is represented via Chromium**, not the real msedge channel — installing it needs `sudo` for system deps, unavailable in this sandboxed environment. Both share the same rendering engine; flagged rather than silently skipped.
- Playwright runs against `npm run dev`, not a production build — `instrumentation.ts`/`MockingProvider` gate MSW to non-production, so `next start` would serve no data at all.
- **Real bug found and fixed by this story**: at 375px width, the vehicle table forced the whole page to overflow horizontally (SRS Adaptability NFR violated). Fixed by wrapping `VehicleTable`'s `<table>` in an `overflow-x-auto` container so the table scrolls internally instead.
- Basic keyboard navigability: all interactive elements are native `<select>`/`<input>`/`<button>` — no custom widgets requiring a dedicated keyboard-interaction test.

## Definition of Done

- [x] Playwright suite passes on Chrome and Safari (12/12); Edge represented via Chromium (see Technical Notes)
- [x] Responsive check passes at desktop, tablet, and mobile widths (fixed a real overflow bug at mobile width)
- [x] `eslint-plugin-jsx-a11y` reports zero errors (has held since STORY_01)
- [x] Per-page render (up to 500 vehicles) measured within 2 seconds (verified ~300-700ms in practice)
- [x] GitHub Actions workflow updated to run `npm test` (Jest) and the Playwright suite on push, not just lint + build

---

## Changelog

### v1.0
- Initial version
