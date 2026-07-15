import type { Config } from "jest";

/**
 * A standalone (non next/jest) project for tests that exercise msw/node
 * directly. next/jest's transform pipeline ignores all of node_modules
 * unless a package is listed in next.config.ts's transpilePackages AND
 * that config loads successfully in the Jest config-loading phase — which
 * proved unreliable for msw's ESM-only transitive deps here. ts-jest +
 * babel-jest with permissive transformIgnorePatterns sidesteps that
 * entirely.
 *
 * Node environment, not jsdom: tests here don't render React — they hit
 * msw/node's setupServer directly (handlers, DAL). Anything needing React
 * Testing Library mocks the DAL boundary instead and runs under the
 * "jsdom" project (see jest.config.jsdom.ts) — trying to run real
 * msw/node under jsdom needs polyfilling half of Node's globals
 * (TextEncoder, ReadableStream, MessageChannel...) for no real benefit,
 * since the DAL/handlers are already exhaustively covered here.
 */
const ESM_DEPS = [
  "msw",
  "@mswjs",
  "@bundled-es-modules",
  "rettime",
  "@open-draft",
  "strict-event-emitter",
  "outvariant",
  "is-node-process",
  "until-async",
  "headers-polyfill",
].join("|");

const config: Config = {
  displayName: "integration",
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/shared/mocks/**/*.test.ts",
    "<rootDir>/shared/dal/**/*.integration.test.ts",
  ],
  transformIgnorePatterns: [`/node_modules/(?!(${ESM_DEPS})/)`],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
    "^.+\\.(js|mjs)$": [
      "babel-jest",
      { presets: [["@babel/preset-env", { targets: { node: "current" } }]] },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default config;
