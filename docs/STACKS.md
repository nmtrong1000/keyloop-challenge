# Technical Decisions

## 1. Language

### [ ] JavaScript

| Pros                                          | Cons                                          |
| --------------------------------------------- | --------------------------------------------- |
| - No compilation step                         | - No compile-time type safety                 |
| - Simplest setup, no type-annotation overhead | - Easier to introduce runtime bugs            |
|                                               | - Weaker IDE autocomplete/refactoring support |

### [x] TypeScript

| Pros                                                               | Cons                                |
| ------------------------------------------------------------------ | ----------------------------------- |
| - Compile-time type safety, catches bugs earlier                   | - Requires a compilation/build step |
| - Strong IDE autocomplete/refactoring support                      | - Added type-annotation overhead    |
| - First-class support across React/Vue/Svelte, TanStack Query, MSW | - Learning curve if unfamiliar      |

---

## 2. Application Framework

### [ ] React + Vite

| Pros                                                    | Cons                                          |
| ------------------------------------------------------- | --------------------------------------------- |
| - Widest community familiarity                          | - More boilerplate than Svelte for simple UI  |
| - First-class MSW and TanStack Query support            | - JSX has a learning curve for non-React devs |
| - No SSR/routing machinery needed for a client-only SPA | - No built-in file-based routing              |
| - Fast dev-server startup                               |                                               |

### [x] Next.js

| Pros                                              | Cons                                                                |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| - Arguably the default React starting point today | - SSR/SSG value goes unused in a purely client-interactive SPA      |
| - File-based routing, zero-config build tooling   | - Server/Client Component split adds friction for client-heavy apps |
| - Strong documentation                            | - MSW integration less battle-tested with the App Router            |
| - Valuable hands-on portfolio/learning experience |                                                                     |

### [ ] Vue 3 + Vite

| Pros                                           | Cons                                              |
| ---------------------------------------------- | ------------------------------------------------- |
| - Gentler learning curve                       | - Smaller ecosystem than React                    |
| - Built-in reactivity reduces some boilerplate | - Narrower familiarity among developers generally |
| - Fast dev-server startup                      | - MSW/TanStack Query support less mature for Vue  |

### [ ] Nuxt.js

| Pros                                        | Cons                                            |
| ------------------------------------------- | ----------------------------------------------- |
| - Vue's equivalent meta-framework           | - Same SSR-unused-weight issue as Next.js       |
| - File-based routing, zero-config tooling   | - Smaller overall ecosystem than even plain Vue |
| - Strong integration with the Vue ecosystem | - MSW integration friction similar to Next.js   |

---

## 3. Mock Strategy

### [x] Mock Service Worker (MSW)

| Pros                                                   | Cons                                                 |
| ------------------------------------------------------ | ---------------------------------------------------- |
| - Intercepts at the network layer, real HTTP semantics | - Handlers must be hand-written                      |
| - Single-process, no second server to run              | - Requires understanding service-worker registration |
| - Swappable for a real backend with zero UI changes    |                                                      |

### [ ] Static JSON + in-memory store

| Pros                              | Cons                                                    |
| --------------------------------- | ------------------------------------------------------- |
| - Simplest possible setup         | - Bypasses the network entirely, no realistic semantics |
| - Zero network layer to configure | - Weaker observability, no Network tab visibility       |
|                                   | - Harder to swap for a real backend later               |

### [ ] json-server

| Pros                                                   | Cons                                            |
| ------------------------------------------------------ | ----------------------------------------------- |
| - Real HTTP server                                     | - Requires running/documenting a second process |
| - Minimal config, auto-generates REST routes from JSON | - An extra moving part to set up and demo       |
| - Realistic latency/network behavior                   |                                                 |

---

## 4. Data Fetching (Server State)

### [x] TanStack Query

| Pros                                                     | Cons                                                 |
| -------------------------------------------------------- | ---------------------------------------------------- |
| - Built-in caching, deduplication, background refetching | - One more dependency                                |
| - Built-in loading/error states                          | - Cache-invalidation semantics have a learning curve |
| - Built-in polling (`refetchInterval`), no custom code   |                                                      |
| - Mutate-then-invalidate fits persisting user actions    |                                                      |

### [ ] Native Fetch API

| Pros                                               | Cons                                                     |
| -------------------------------------------------- | -------------------------------------------------------- |
| - Zero dependency, built into every modern browser | - Only rejects on network failure, not HTTP error status |
| - No bundle size cost                              | - No built-in interceptors for cross-cutting concerns    |
| - Full control over request logic                  | - Caching, dedup, refetching, polling all hand-rolled    |

### [ ] Axios

| Pros                                              | Cons                                                  |
| ------------------------------------------------- | ----------------------------------------------------- |
| - Auto-throws on non-2xx responses, unlike fetch  | - Third-party dependency, adds to bundle size         |
| - Built-in interceptors for headers/auth tokens   | - Still requires hand-rolling caching, dedup, polling |
| - Automatic JSON transform for requests/responses | - Not a web standard, can diverge from fetch          |

---

## 5. Client State Management

### [ ] React Context / local component state only (no library)

| Pros                                                            | Cons                                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------------ |
| - Zero dependencies                                             | - Needs manual context setup if state must span distant components |
| - Sufficient for a small, well-contained client-state footprint |                                                                    |
| - Simplest possible option                                      |                                                                    |

### [ ] Redux Toolkit

| Pros                                      | Cons                                                                   |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| - Industry-standard                       | - Boilerplate disproportionate once server state is handled separately |
| - Highly predictable state updates        |                                                                        |
| - Strong devtools (time-travel debugging) |                                                                        |

### [x] Zustand

| Pros                                   | Cons                                                            |
| -------------------------------------- | --------------------------------------------------------------- |
| - Minimal boilerplate                  | - Still more setup than plain local state for a small footprint |
| - Flexible (single or multiple stores) |                                                                 |
| - Easy to learn                        |                                                                 |

### [ ] Pinia

| Pros                                                  | Cons                                                   |
| ----------------------------------------------------- | ------------------------------------------------------ |
| - Vue's official, current recommended state library   | - Requires Vue as the framework, not usable with React |
| - Minimal boilerplate, similar simplicity to Zustand  |                                                        |
| - Deep integration with Vue's reactivity and DevTools |                                                        |

---

## 6. Styling / CSS Approach

### [x] Tailwind CSS

| Pros                                                | Cons                                              |
| --------------------------------------------------- | ------------------------------------------------- |
| - Utility-first, fast UI without separate CSS files | - Class-name verbosity in JSX                     |
| - Responsive utilities built in                     | - Learning curve for the utility-class vocabulary |
| - Widely adopted, huge community                    |                                                   |

### [ ] CSS Modules

| Pros                                             | Cons                                                            |
| ------------------------------------------------ | --------------------------------------------------------------- |
| - Built into Vite/Next.js, zero extra dependency | - A separate `.module.css` file per component to manage         |
| - Scoped CSS, no global collision                | - No built-in design-system primitives, consistency hand-rolled |
| - Familiar plain-CSS syntax                      |                                                                 |

### [ ] Component library (e.g. shadcn/ui, MUI, Chakra UI)

| Pros                                                       | Cons                                                  |
| ---------------------------------------------------------- | ----------------------------------------------------- |
| - Pre-built, accessible components, accelerates build time | - Additional dependency, some fairly heavy            |
| - Strong accessibility defaults out of the box             | - Less customization freedom than hand-rolled styling |
| - Some are built on top of Tailwind                        | - Visual identity can look generic unless themed      |

---

## 7. Form Handling

### [x] React Hook Form

| Pros                                                  | Cons                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| - Most widely adopted current React form library      | - Slight learning curve around `register`/`Controller` for custom inputs |
| - Performant, uncontrolled inputs, minimal re-renders |                                                                          |
| - Integrates directly with Zod/Yup via resolvers      |                                                                          |

### [ ] Formik

| Pros                                                   | Cons                                                |
| ------------------------------------------------------ | --------------------------------------------------- |
| - Established, well-documented                         | - Controlled-input approach causes more re-renders  |
| - Was the default choice before React Hook Form's rise | - Less actively evolving; momentum has shifted away |

### [ ] Plain controlled components + useState (no library)

| Pros                                              | Cons                                                        |
| ------------------------------------------------- | ----------------------------------------------------------- |
| - Zero dependency                                 | - No resolver-pattern integration with a validation library |
| - Proportionate for very small forms (1-2 fields) | - Doesn't scale if the form grows                           |

---

## 8. DTO / Runtime Validation

### [x] Zod

| Pros                                                            | Cons                                     |
| --------------------------------------------------------------- | ---------------------------------------- |
| - Schema IS the type, infers TS types directly                  | - Added dependency                       |
| - Best-in-class TypeScript inference                            | - Another concept to learn if unfamiliar |
| - Integrates with React Hook Form; can generate OpenAPI schemas |                                          |

### [ ] Yup

| Pros                                           | Cons                                   |
| ---------------------------------------------- | -------------------------------------- |
| - Mature, widely used                          | - Weaker TypeScript inference than Zod |
| - Works with React Hook Form via resolvers too | - Less ecosystem momentum currently    |

### [ ] Manual validation functions (no library)

| Pros                                      | Cons                                                  |
| ----------------------------------------- | ----------------------------------------------------- |
| - Zero dependency                         | - No resolver-pattern integration with a form library |
| - Trivial for a form with very few fields | - Doesn't scale if validation rules grow              |
|                                           | - More error-prone than a schema library              |

---

## 9. API Contract

### [x] OpenAPI / Swagger spec

| Pros                                                       | Cons                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| - Industry-standard, self-documenting format               | - Extra tooling: writing/maintaining a spec, wiring type-generation |
| - Can generate TypeScript types automatically              | - Meaningful overhead for very few endpoints                        |
| - Forward-compatible if a real backend is introduced later |                                                                     |

### [ ] Postman Collection

| Pros                                              | Cons                                                            |
| ------------------------------------------------- | --------------------------------------------------------------- |
| - Widely used, practical, familiar tooling        | - Oriented around manual testing, not formal API description    |
| - Importable into Postman for interactive testing | - Weak/no native TypeScript type-generation compared to OpenAPI |
| - Supports inline request/response examples       | - Less rigorous as a single source of truth                     |

### [ ] TypeScript types

| Pros                                              | Cons                                                |
| ------------------------------------------------- | --------------------------------------------------- |
| - Zero extra tooling, reuses domain-model types   | - Not self-documenting outside the codebase         |
| - Simplest option for a small number of endpoints | - No deliverable artifact for a future backend team |
| - Compiler enforces consistency automatically     |                                                     |

---

## 10. Testing (Test Runner)

### [ ] Vitest

| Pros                                           | Cons                                                 |
| ---------------------------------------------- | ---------------------------------------------------- |
| - Native Vite integration, shares config, fast | - Younger than Jest, smaller (but growing) ecosystem |
| - Jest-compatible API                          |                                                      |
| - Modern default for Vite-based projects       |                                                      |

### [x] Jest

| Pros                                              | Cons                                                |
| ------------------------------------------------- | --------------------------------------------------- |
| - Most established, largest ecosystem/community   | - Slower than Vitest for Vite-based projects        |
| - Default in many React/Next.js starter templates | - More config needed to work smoothly with Vite/ESM |

---

## 11. Logging

### [x] console.log (native, wrapped in a utility)

| Pros                                     | Cons                                                  |
| ---------------------------------------- | ----------------------------------------------------- |
| - Zero dependency                        | - No severity levels without manual convention        |
| - Universally available in every browser | - No pluggable transports/destinations                |
| - Simplest possible option               | - Doesn't scale to log aggregation without extra work |

### [ ] loglevel

| Pros                                           | Cons                                                    |
| ---------------------------------------------- | ------------------------------------------------------- |
| - Lightweight (~1kb)                           | - Added dependency for a fairly small win at this scale |
| - Adds severity levels and per-level filtering | - Still wraps console, no built-in remote transport     |
| - Minimal API surface, close to console.log    |                                                         |

### [ ] pino (browser build)

| Pros                                         | Cons                                     |
| -------------------------------------------- | ---------------------------------------- |
| - Structured JSON logging by default         | - Primarily designed for server-side use |
| - Extremely fast                             | - Heavier setup for a client-only app    |
| - Industry-standard on the Node/backend side |                                          |

---

## 12. Metrics

### [x] Native Performance API

| Pros                                              | Cons                                           |
| ------------------------------------------------- | ---------------------------------------------- |
| - Zero dependency                                 | - More verbose than a simple timestamp diff    |
| - High-resolution, monotonic timestamps           | - Entries must be read and aggregated manually |
| - Entries appear in DevTools Performance timeline |                                                |
| - Queryable via `getEntriesByName()`              |                                                |

---

## 13. Tracing

### [x] Correlation ID (manual)

| Pros                                        | Cons                                                  |
| ------------------------------------------- | ----------------------------------------------------- |
| - Zero dependency                           | - No visualization/timeline UI beyond raw DevTools    |
| - Minimal code, framework-agnostic          | - Doesn't scale if the path becomes truly distributed |
| - Easy to reason about for few network hops |                                                       |

### [ ] OpenTelemetry Web SDK

| Pros                                                   | Cons                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| - Industry-standard, vendor-neutral                    | - Significant setup overhead: exporters, propagation, collectors |
| - Generates real distributed-tracing-shaped spans      | - Heavy machinery for very few network hops                      |
| - Forward-compatible with real backend instrumentation |                                                                  |

### [ ] Sentry (tracing/APM)

| Pros                                              | Cons                                          |
| ------------------------------------------------- | --------------------------------------------- |
| - Combines error tracking and performance tracing | - Third-party SaaS, data leaves the browser   |
| - Quick to integrate, auto-instrumentation        | - Overkill for tracing a small number of hops |
| - Widely used, generous free tier                 | - Adds a paid-tool dependency risk            |

---

## 14. Accessibility Testing

### [x] eslint-plugin-jsx-a11y

| Pros                                           | Cons                                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| - Static analysis at write-time, in-editor     | - Limited to JSX-detectable issues, misses color contrast, focus, and ARIA state problems |
| - Fast feedback loop, no test execution needed |                                                                                           |
| - Zero runtime cost                            |                                                                                           |

### [ ] axe-core / jest-axe

| Pros                                                          | Cons                                                      |
| ------------------------------------------------------------- | --------------------------------------------------------- |
| - Tests actual rendered DOM against real WCAG rules           | - Requires writing and running tests, no instant feedback |
| - Catches contrast/ARIA/landmark issues static analysis can't | - Only as thorough as the test cases written              |
| - Integrates directly into the test suite (§10)               |                                                           |

---

## 15. Date/Time Handling

### [ ] Native `Date` + `Intl.DateTimeFormat`

| Pros                                                             | Cons                                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| - Zero dependency                                                | - Raw `Date` arithmetic is error-prone for DST/timezone edge cases |
| - `Intl.DateTimeFormat` handles locale-aware formatting natively | - No built-in relative-time formatting without extra code          |
| - Sufficient for simple duration calculations                    |                                                                    |

### [ ] date-fns

| Pros                                              | Cons                                                |
| ------------------------------------------------- | --------------------------------------------------- |
| - Modular/tree-shakeable, import only what's used | - Added dependency                                  |
| - Immutable, pure functions                       | - More to learn than native `Date` for simple cases |
| - Large, well-tested library covering edge cases  |                                                     |

### [x] dayjs

| Pros                                             | Cons                                                |
| ------------------------------------------------ | --------------------------------------------------- |
| - Very small bundle size (~2kb core)             | - Mutable API in some plugins can cause subtle bugs |
| - Moment.js-like chainable API, familiar to many | - Smaller core than date-fns, relies on plugins     |
| - Plugin system, extend only what's needed       |                                                     |

---

## 16. Package Manager

### [x] npm

| Pros                                                | Cons                                                 |
| --------------------------------------------------- | ---------------------------------------------------- |
| - Ships with Node.js, zero extra install            | - Slower installs than pnpm                          |
| - Universal, works everywhere without configuration | - Flat `node_modules` can allow phantom dependencies |
| - Most widely documented/supported                  |                                                      |

### [ ] pnpm

| Pros                                                         | Cons                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| - Fast installs via content-addressable storage              | - Occasional quirks with tools expecting flat `node_modules` |
| - Strict dependency resolution prevents phantom dependencies | - Slightly less universal than npm                           |
| - Disk-space efficient across projects                       |                                                              |

### [ ] yarn

| Pros                                              | Cons                                                        |
| ------------------------------------------------- | ----------------------------------------------------------- |
| - Established, widely used                        | - Ecosystem fragmented between Classic (v1) and Berry (v2+) |
| - Yarn Berry offers Plug'n'Play for fast installs | - Less differentiated from npm/pnpm than before             |
| - Good workspace/monorepo support                 |                                                             |

---

## 17. E2E Testing

### [x] Playwright

| Pros                                                       | Cons                                                     |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| - Cross-browser (Chromium, Firefox, WebKit) out of the box | - Newer than Cypress, smaller (but growing) community    |
| - Fast, parallel test execution                            | - API differs from Cypress if a team has that experience |
| - Auto-waiting reduces flaky tests                         |                                                          |
| - Built-in trace viewer for debugging                      |                                                          |

### [ ] Cypress

| Pros                                           | Cons                                                       |
| ---------------------------------------------- | ---------------------------------------------------------- |
| - Mature, large community and plugin ecosystem | - Historically Chromium-focused, though improving          |
| - Excellent interactive test-runner UI         | - Runs inside the browser, some multi-tab scenarios harder |
| - Well-documented                              |                                                            |

---

## 18. CI/CD Platform

### [x] GitHub Actions

| Pros                                                | Cons                                              |
| --------------------------------------------------- | ------------------------------------------------- |
| - Native integration with GitHub, no external setup | - Can queue/slow down on the free tier under load |
| - Generous free tier for public/small private repos | - YAML workflow syntax has a learning curve       |
| - Large marketplace of reusable actions             |                                                   |

### [ ] GitLab CI

| Pros                                          | Cons                                               |
| --------------------------------------------- | -------------------------------------------------- |
| - Deeply integrated CI/CD if hosted on GitLab | - Requires the repo to live on or mirror to GitLab |
| - Mature pipeline visualization               |                                                    |

### [ ] CircleCI

| Pros                               | Cons                                              |
| ---------------------------------- | ------------------------------------------------- |
| - Fast build times, mature caching | - Third-party service separate from the code host |
| - Flexible orb ecosystem           | - Free tier more limited than GitHub Actions      |

---

## 19. Icons

### [x] lucide-react

| Pros                                      | Cons                                                        |
| ----------------------------------------- | ----------------------------------------------------------- |
| - Clean, consistent icon set              | - Smaller total icon count than react-icons' aggregated set |
| - Tree-shakeable, only bundles icons used |                                                             |
| - Default icon set for shadcn/ui          |                                                             |

### [ ] react-icons

| Pros                                          | Cons                                                             |
| --------------------------------------------- | ---------------------------------------------------------------- |
| - Aggregates many icon sets under one package | - Easy to accidentally import multiple families, bloating bundle |
| - Huge selection                              | - Less design consistency if icons are mixed                     |

### [ ] Heroicons

| Pros                                                 | Cons                                                  |
| ---------------------------------------------------- | ----------------------------------------------------- |
| - Designed by the Tailwind team, visually consistent | - Smaller icon count than react-icons or lucide-react |
| - Simple, clean set (outline + solid)                |                                                       |

---

## 20. Containerization

### [x] Docker

| Pros                                                  | Cons                                                 |
| ----------------------------------------------------- | ---------------------------------------------------- |
| - Industry-standard, most widely known and documented | - Requires a running daemon (Docker Desktop locally) |
| - Largest ecosystem of base images and tooling        | - Rootful by default, though rootless mode exists    |
| - Universally supported by every major platform       |                                                      |

### [ ] Podman

| Pros                                             | Cons                                                            |
| ------------------------------------------------ | --------------------------------------------------------------- |
| - Daemonless architecture                        | - Smaller ecosystem/community than Docker                       |
| - Rootless by default, stronger security posture | - Less universal support across CI/hosting platforms            |
| - Drop-in CLI compatible with Docker commands    | - Some Docker tooling/compose nuances don't translate perfectly |
