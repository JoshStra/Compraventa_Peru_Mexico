import { defineConfig, devices } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
process.env.E2E_TEST_KEY ||= randomUUID();
const baseURL = "http://127.0.0.1:4180";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  globalTeardown: "./e2e/teardown.js",
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run e2e:server --workspace backend",
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    url: baseURL,
    reuseExistingServer: false,
    env: { NODE_ENV: "test", E2E_TEST_KEY: process.env.E2E_TEST_KEY },
  },
});
