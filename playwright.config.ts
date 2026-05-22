import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./scripts",
  timeout: 120000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
