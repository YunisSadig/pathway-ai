import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("explorer filters, compares, and opens accessible details @a11y", async ({
  page,
}) => {
  await page.goto("/universities");
  await page.getByLabel("Search programs").fill("not a university");
  await expect(
    page.getByText("No fictional programs match these filters."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByLabel("Study field filter").selectOption("Computer science");
  await expect(page.getByRole("status")).toContainText("4 fictional programs");
  await page.getByLabel("Compare", { exact: true }).nth(0).check();
  await page.getByLabel("Compare", { exact: true }).nth(1).check();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(
    page.getByRole("rowheader", { name: "Lifestyle fit" }),
  ).toBeVisible();
  const trigger = page.getByRole("button", { name: "Explore program" }).first();
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
