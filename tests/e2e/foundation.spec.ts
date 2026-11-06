import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("homepage is reachable", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Your future/ }),
  ).toBeVisible();
});
test("homepage @a11y", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-art")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero-copy")).toHaveCSS("opacity", "1");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
