import { defineConfig } from "@playwright/test";
const compatibility =
  /(?:theme|interactions|onboarding|explorer|compatibility)\.spec\.ts/;
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  snapshotPathTemplate: "{testDir}/visual/{arg}{ext}",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "firefox-desktop",
      testMatch: compatibility,
      use: { browserName: "firefox", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "firefox-mobile",
      testMatch: compatibility,
      use: { browserName: "firefox", viewport: { width: 375, height: 812 } },
    },
    {
      name: "webkit-desktop",
      testMatch: compatibility,
      use: { browserName: "webkit", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "webkit-mobile",
      testMatch: compatibility,
      use: { browserName: "webkit", viewport: { width: 375, height: 812 } },
    },
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
