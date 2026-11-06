import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const [device, width, height] of [
  ["mobile", 375, 812],
  ["tablet", 768, 1024],
  ["desktop", 1440, 900],
] as const) {
  for (const theme of ["light", "dark"]) {
    test(`${device} ${theme} responsive homepage @a11y`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      await page.getByLabel("Color theme").selectOption(theme);
      await expect(page.locator("html")).toHaveClass(theme);
      await expect(page.locator(".closing .button-primary")).toHaveCSS(
        "background-color",
        theme === "dark" ? "rgb(165, 180, 252)" : "rgb(79, 70, 229)",
      );
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`${device}-${theme}.png`),
        fullPage: true,
        animations: "disabled",
      });
      await testInfo.attach(`${device}-${theme}`, {
        path: testInfo.outputPath(`${device}-${theme}.png`),
        contentType: "image/png",
      });
      await page.reload();
      await expect(page.getByLabel("Color theme")).toHaveValue(theme);
    });
  }
}
test("system theme and keyboard skip navigation", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass("dark");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.getByLabel("Color theme").selectOption("light");
  await expect(page.locator("html")).toHaveClass("light");
  await page.getByLabel("Color theme").selectOption("system");
  await expect(page.locator("html")).toHaveClass("dark");
});
