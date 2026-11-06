import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("homepage is reachable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Pathway AI" })).toBeVisible();
});
test("homepage @a11y", async ({ page }) => {
  await page.goto("/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
