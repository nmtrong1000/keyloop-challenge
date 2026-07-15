import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against `npm run dev`, not a production build — MSW's instrumentation.ts
 * and MockingProvider are gated to NODE_ENV !== "production" (this is a mock,
 * not a real backend), so a production `next start` would serve no data at all.
 *
 * "Edge" is represented via Chromium: both share the same rendering engine,
 * and installing the real msedge channel needs sudo, unavailable in this
 * sandboxed environment. Flagged rather than silently skipped.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    { name: "chromium (Chrome/Edge)", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit (Safari)", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
