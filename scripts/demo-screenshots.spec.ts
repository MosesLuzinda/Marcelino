import { test } from "@playwright/test";
import path from "path";

const OUT = path.join(__dirname, "../dist/screenshots");

const pages = [
  { name: "home", url: "/" },
  { name: "about", url: "/about" },
  { name: "admissions", url: "/admissions" },
  { name: "login", url: "/auth/login" },
  { name: "student-portal", url: "/portal/student" },
  { name: "teacher-portal", url: "/portal/teacher" },
  { name: "parent-portal", url: "/portal/parent" },
  { name: "parent-fees", url: "/portal/parent/fees" },
  { name: "admin-portal", url: "/portal/admin" },
  { name: "gallery", url: "/gallery" },
  { name: "contact", url: "/contact" },
];

test.describe("Screenshots", () => {
  for (const page of pages) {
    test(`capture ${page.name}`, async ({ page: p }) => {
      await p.goto(page.url);
      await p.waitForTimeout(1500);
      await p.screenshot({ path: path.join(OUT, `${page.name}.png`), fullPage: true });
    });
  }
});
