import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  displayName: "jsdom",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/e2e/",
    "<rootDir>/shared/mocks/",
    "\\.integration\\.test\\.tsx?$",
  ],
  // Explicit, since jest.mock()'s string argument needs Jest's own resolver
  // (not just SWC's tsconfig-paths-aware transform) to know this alias.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
