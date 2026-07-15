# Intelligent Inventory Dashboard

Frontend implementation of the Intelligent Inventory Dashboard (Next.js, TypeScript, Tailwind), per `SDD.md` and `docs/SRS_SUPPLY.md`. Backend is mocked (MSW) — no real database, per the SRS constraint.

Implementation is tracked as an epic + stories in `docs/tasks/`, executed per the loop in `docs/EXECUTION_LOOP.md`.

## Directory Structure

Feature-based: `modules/` holds one folder per user-facing capability, `shared/` holds the cross-cutting code they all depend on.

```
.
├── app/                   Next.js routes — no business logic lives here
│   ├── layout.tsx         Wires up the mocked backend and data-fetching client for the whole app
│   └── page.tsx           The dashboard's single page, assembling the modules below
├── modules/               One folder per user-facing capability, each with a single public entry point
│   ├── Inventory/         Displays and filters the vehicle inventory
│   ├── AgingStock/        Flags vehicles past the aging threshold and shows their status
│   └── ActionLogging/     Lets a manager log and review follow-up actions on aging vehicles
├── shared/                Cross-cutting code used by more than one module
│   ├── components/        App-wide setup: the mocked backend and the data-fetching client
│   ├── domain/            Pure business rules — aging, filtering, pagination
│   ├── types/             Contract types generated from and matching the API spec
│   ├── dal/               Typed functions for reading and writing inventory data
│   ├── mocks/             The mocked backend itself
│   ├── store/             Caches server data and holds client-side selections (filters, page)
│   ├── observability/     Structured logging
│   └── constants.ts       Shared constant values
├── contracts/
│   └── openapi.yaml       The API contract this app is built against
├── e2e/
│   └── dashboard.spec.ts  End-to-end suite: full flow, responsive layout, performance
├── docs/
│   ├── SRS_SUPPLY.md      Software Requirement Specification
│   ├── BUSINESS_IDEA.md   The original business idea
│   ├── STACKS.md          Technology stack decisions
│   ├── DESIGN.md          The design system
│   ├── EXECUTION_LOOP.md  The implementation loop and test-placement rules
│   └── tasks/             Planning and tracking documents
├── SDD.md                 System Design Document
└── README.md              You are here
```

Tests are colocated in `__tests__/` subfolders next to what they cover (e.g. `shared/domain/__tests__/aging.test.ts`), not gathered in one top-level test tree.

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
