import { expect, test } from "@playwright/test";
import { NAV } from "../../src/lib/site";

test("the four primary pages resolve", async ({ page }) => {
  expect(NAV.map((n) => n.href)).toEqual([
    "/",
    "/universities",
    "/scholarships",
    "/how-it-works",
  ]);
  for (const item of NAV) {
    const response = await page.goto(item.href);
    expect(response?.status(), item.href).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("removed product routes return 404", async ({ request }) => {
  for (const path of [
    "/onboarding",
    "/dashboard",
    "/workspace",
    "/profile",
    "/saved",
    "/compare",
    "/improvement-lab",
    "/pathway-planner",
    "/financial-planner",
    "/life-abroad",
    "/advisor-preview",
    "/settings",
    "/universities/delft-university-of-technology",
    "/scholarships/daad-scholarship-database",
    "/assessment",
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("header shows only the four links and no removed features", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
  const nav = page.getByRole("navigation", {
    name: isMobile ? "Mobile" : "Main",
  });
  await expect(nav.getByRole("link")).toHaveText([
    "Home",
    "Universities",
    "Scholarships",
    "How It Works",
  ]);
  await expect(page.getByText(/workspace|login|dashboard/i)).toHaveCount(0);
});

test("active route is marked in the header", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop nav");
  await page.goto("/scholarships");
  await expect(
    page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Scholarships" }),
  ).toHaveAttribute("aria-current", "page");
});

test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("link", { name: "Universities" }).click();
  await expect(page).toHaveURL(/universities/);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("mobile menu closes with Escape and returns focus", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("unknown route shows the custom 404 with working links", async ({
  page,
}) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "different path",
  );
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL("/");
});
