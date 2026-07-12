import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  outputDir: "test-results",
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    port: 3000,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
