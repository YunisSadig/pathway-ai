import { expect, test } from "@playwright/test";
import { PUBLIC_NAV } from "../../src/lib/site";

test("every public nav link resolves", async ({ page, isMobile }) => {
  for (const item of PUBLIC_NAV) {
    const response = await page.goto(item.href);
    expect(response?.status(), item.href).toBe(200);
  }
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("link", { name: "How It Works" }).click();
    await expect(page).toHaveURL(/how-it-works/);
  }
});

test("unknown route shows the custom 404", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "different path",
  );
});
