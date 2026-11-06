import { expect, test } from "@playwright/test";
for (const [device, width, height] of [
  ["mobile", 375, 812],
  ["desktop", 1440, 900],
] as const) {
  for (const theme of ["light", "dark"]) {
    for (const [name, route] of [
      ["home", "/"],
      ["onboarding", "/onboarding"],
      ["dashboard", "/dashboard"],
      ["explorer", "/universities"],
    ]) {
      test(`visual ${name} ${device} ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.addInitScript(
          (t) => localStorage.setItem("theme", t),
          theme,
        );
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        if (name === "home") {
          await expect(page.locator(".hero-art")).toHaveCSS("opacity", "1");
          await expect(page.locator(".hero-copy")).toHaveCSS("opacity", "1");
        }
        await expect(page).toHaveScreenshot(`${name}-${device}-${theme}.png`, {
          animations: "disabled",
          maxDiffPixelRatio: 0.02,
          threshold: 0.25,
        });
      });
    }
  }
}
