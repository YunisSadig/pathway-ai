import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("theme menu keyboard, dismissal, persistence, and system preference @a11y", async ({
  page,
}, info) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /Color theme:/ });
  await expect(trigger).toBeEnabled();
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("menuitemradio", { name: /^System/ }),
  ).toBeFocused();
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("menuitemradio", { name: /^Light/ }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitemradio", { name: /^Dark/ }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveClass("dark");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(
    page.getByRole("menuitemradio", { name: /^Dark/ }),
  ).toHaveAttribute("aria-checked", "true");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath("theme-menu-dark.png") });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(5, 400);
  await expect(page.getByRole("menu")).not.toBeVisible();
  await page.reload();
  await expect(trigger).toHaveAccessibleName(/Color theme: dark/);
  await trigger.click();
  await page.getByRole("menuitemradio", { name: /^System/ }).click();
  await expect(page.locator("html")).toHaveClass("light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass("dark");
  await page.setViewportSize({ width: 375, height: 812 });
  await trigger.click();
  const box = await page.getByRole("menu").boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(375);
});
