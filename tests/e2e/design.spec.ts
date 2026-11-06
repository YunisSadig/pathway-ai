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
      await page.getByRole("button", { name: /Color theme:/ }).click();
      await page
        .getByRole("menuitemradio", { name: new RegExp(`^${theme}`, "i") })
        .click();
      await expect(page.locator("html")).toHaveClass(theme);
      await expect(page.locator(".closing .button-primary")).toHaveCSS(
        "background-color",
        theme === "dark" ? "rgb(165, 180, 252)" : "rgb(79, 70, 229)",
      );
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(".hero-art")).toHaveCSS("opacity", "1");
      await expect(page.locator(".hero-copy")).toHaveCSS("opacity", "1");
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
      await expect(
        page.getByRole("button", { name: new RegExp(`Color theme: ${theme}`) }),
      ).toBeVisible();
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
  await page.getByRole("button", { name: /Color theme:/ }).click();
  await page.getByRole("menuitemradio", { name: /^Light/ }).click();
  await expect(page.locator("html")).toHaveClass("light");
  await page.getByRole("button", { name: /Color theme:/ }).click();
  await page.getByRole("menuitemradio", { name: /^System/ }).click();
  await expect(page.locator("html")).toHaveClass("dark");
});
