# Intelligent Inventory Dashboard

Frontend implementation of the Intelligent Inventory Dashboard (Next.js, TypeScript, Tailwind), per `SDD.md` and `docs/SRS_SUPPLY.md`. Backend is mocked (MSW) — no real database, per the SRS constraint.

Implementation is tracked as an epic + stories in `docs/tasks/`, executed per the loop in `docs/EXECUTION_LOOP.md`.

## Directory Structure

Feature-based: `modules/` holds one folder per user-facing capability, `shared/` holds the cross-cutting code they all depend on.

```
.
├── app/
│   ├── layout.tsx              Root application layout
│   └── page.tsx                Default landing page
├── modules/                    Feature modules organized by business capability
│   └── <Module>/
│       ├── components/         UI components specific to the module
│       ├── domain/             Business logic and domain rules
│       ├── hooks/              Data-fetching and server-state hooks
│       ├── store/              Client-side state management
│       ├── dal.ts              Data access layer for backend communication
│       └── types.ts            Types and interfaces for the module
├── shared/                     Reusable code shared across multiple modules
│   ├── components/             Shared UI building blocks
│   │   ├── elements/           Basic UI primitives
│   │   ├── blocks/             Reusable composed components
│   │   └── sections/           Common page-level layout sections
│   ├── providers/              Application-wide context providers
│   ├── mocks/                  Mock API handlers, fixtures, and setup
│   ├── types/                  Shared API and application types
│   ├── http.ts                 Common HTTP client utilities
│   ├── observability/          Logging, monitoring, and tracing utilities
│   ├── utils/                  General-purpose helper functions
│   └── constants.ts            Shared constant values
├── contracts/
│   └── openapi.yaml            OpenAPI specification
├── e2e/                        End-to-end tests
├── docs/
│   ├── SRS_SUPPLY.md           Software Requirements Specification
│   ├── BUSINESS_IDEA.md        Product vision and business goals
│   ├── STACKS.md               Technology stack documentation
│   ├── DESIGN.md               Design system documentation
│   ├── EXECUTION_LOOP.md       Development workflow and testing guidelines
│   └── tasks/                  Project planning and task tracking
├── SDD.md                      System Design Document
└── README.md                   Project overview and setup guide
```

Tests are colocated in `__tests__/` subfolders next to what they cover (e.g. `modules/AgingStock/domain/__tests__/aging.test.ts`), not gathered in one top-level test tree.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To view the API contract, generate the docs page once after editing `contracts/openapi.yaml`:

```bash
npm run generate:api-docs
```

This renders it (via Redoc) into `public/api-docs.html`, gitignored and regenerated on demand — Next.js serves static files in `public/` automatically, so it's viewable at [http://localhost:3000/api-docs.html](http://localhost:3000/api-docs.html), or by opening the file directly without a server running. Note the rendered page still loads Redoc's renderer from `cdn.redocly.com` at view time — the spec itself is local, but rendering it needs an internet connection.

## Build

```bash
npm run build
npm run start
```

## Test

```bash
npm run lint     # ESLint + eslint-plugin-jsx-a11y
npm test         # Jest unit/integration tests
npm run test:e2e # Playwright — Chrome, Safari, responsive, performance (auto-starts the dev server)
```
