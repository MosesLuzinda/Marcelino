import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const VIDEO_DIR = path.join(__dirname, "../dist/demo/videos");

test.use({
  video: { mode: "on", size: { width: 1920, height: 1080 } },
});

test("marcelino full demo walkthrough", async ({ page }) => {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });

  // Homepage
  await page.goto("/");
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(1000);

  // Navigation
  await page.click('text=About');
  await page.waitForTimeout(1500);
  await page.click('text=Admissions');
  await page.waitForTimeout(1500);

  // Login
  await page.goto("/auth/login");
  await page.waitForTimeout(1000);
  await page.fill('input[type="email"]', "admin@marcelino.edu");
  await page.fill('input[type="password"]', "Admin@123456");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // Admin dashboard
  await page.goto("/portal/admin");
  await page.waitForTimeout(2500);

  // Parent fees
  await page.goto("/auth/login");
  await page.fill('input[type="email"]', "parent1@marcelino.edu");
  await page.fill('input[type="password"]', "Password@123");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  await page.goto("/portal/parent/fees");
  await page.waitForTimeout(2500);

  // Student portal
  await page.goto("/auth/login");
  await page.fill('input[type="email"]', "student1@marcelino.edu");
  await page.fill('input[type="password"]', "Password@123");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  await page.goto("/portal/student");
  await page.waitForTimeout(2500);

  // Dark mode
  await page.goto("/");
  const themeBtn = page.locator('button[aria-label="Toggle theme"]');
  if (await themeBtn.count()) {
    await themeBtn.click();
    await page.waitForTimeout(1000);
  }

  // Mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForTimeout(2000);
});

test.afterAll(async () => {
  console.log("Videos saved to test-results/. Run scripts/merge-demo-video.ps1 to create final MP4.");
});
