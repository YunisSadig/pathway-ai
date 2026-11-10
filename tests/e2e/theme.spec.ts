import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const isDark = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.classList.contains("dark"));

test.describe("first visit follows the device preference", () => {
  test.describe("dark device", () => {
    test.use({ colorScheme: "dark" });
    test("loads dark", async ({ page }) => {
      await page.goto("/");
      expect(await isDark(page)).toBe(true);
    });
  });
  test.describe("light device", () => {
    test.use({ colorScheme: "light" });
    test("loads light", async ({ page }) => {
      await page.goto("/");
      expect(await isDark(page)).toBe(false);
    });
  });
});

test("theme menu has only Light and Dark; explicit choice persists", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "Change theme" }).click();
  await expect(page.getByRole("menuitemradio")).toHaveText(["Light", "Dark"]);
  await page.getByRole("menuitemradio", { name: "Dark" }).click();
  expect(await isDark(page)).toBe(true);
  await page.reload();
  expect(await isDark(page)).toBe(true);
  // The explicit choice wins over the device preference.
  await page.emulateMedia({ colorScheme: "light" });
  await page.reload();
  expect(await isDark(page)).toBe(true);
});

test("Escape closes the theme menu", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Change theme" }).click();
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toBeHidden();
});

for (const scheme of ["light", "dark"] as const) {
  test(`home has no axe violations (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await page.waitForTimeout(1600); // let the hero entrance finish
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
