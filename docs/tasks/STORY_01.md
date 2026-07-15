# STORY_01: Project Scaffold

## Metadata

- Issue type: Story
- Priority: High
- Status: COMPLETED
- Version: 1.0

---

## Goal

Provide a runnable Next.js + TypeScript + Tailwind project shell so every later story has somewhere to add code.

## Context

No SRS FR maps directly to this story — it is the enabling shell all contract and feature work is built inside, per SDD §5.3's Next.js/TypeScript/Tailwind decisions.

## Scope

**In Scope:**
- **Next.js App**: App Router project initialized with TypeScript
- **Tailwind CSS**: configured and building
- **Tooling**: ESLint + eslint-plugin-jsx-a11y, npm scripts (dev/build/lint/test)
- **CI Skeleton**: GitHub Actions workflow running lint + build on push

**Out of Scope:**
- **API Contract**: handled by STORY_02
- **Any Feature Code**: handled by STORY_03 onward

## Acceptance Criteria

- Given a clean clone of the repo, when a reviewer runs the documented install command, then the app builds without errors.
- Given the app is running locally, when a reviewer opens it in a browser, then a placeholder page renders with Tailwind styling applied.
- Given a push to the repository, when CI runs, then lint and build both pass.

## Dependencies

- N/A

## Technical Notes

- Use Next.js App Router (not Pages Router), per SDD §5.3.
- Reserve `instrumentation.ts` as a stub — STORY_03 fills it in for `msw/node`.
- No business logic or mock data in this story.

## Definition of Done

- [x] `npm run dev` serves a placeholder page locally
- [x] `npm run build` succeeds
- [x] `npm run lint` passes with zero errors
- [ ] GitHub Actions workflow runs lint + build on push and passes — workflow file added, steps verified locally; actual run pending a push (no git commits made per user instruction)
- [x] README documents install/run/build commands

---

## Changelog

### v1.0
- Initial version
