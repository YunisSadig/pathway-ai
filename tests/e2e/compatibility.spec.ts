import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("secondary screens in light/dark remain usable @a11y", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    for (const route of [
      "/dashboard",
      "/improvement",
      "/planner",
      "/life-abroad",
      "/finance",
      "/advisor",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveClass(theme);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} overflow`,
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze()
        ).violations,
        `${route} ${theme}`,
      ).toEqual([]);
    }
  }
});
test("goals, backup scenarios, budgets and scripted responses connect", async ({
  page,
}) => {
  await page.goto("/improvement");
  await page.getByLabel("IELTS target", { exact: true }).fill("7.5");
  await page.getByRole("button", { name: "Save preparation goal" }).click();
  await page.reload();
  await expect(
    page.getByText("IELTS 7.5 · SAT not planned", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Student workspace" })
    .getByRole("link", { name: "My pathway" })
    .click();
  await page.getByRole("button", { name: "Budget drops 25%" }).click();
  await expect(
    page.getByRole("heading", { name: "Revised budget: €13,500" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "I need 6 more months" }).click();
  await expect(
    page.getByRole("heading", { name: "Preparation window: 18 months" }),
  ).toBeVisible();
  await page.goto("/finance");
  const before = await page.getByTestId("total-cost").textContent();
  await page.getByLabel("Monthly rent", { exact: true }).fill("1100");
  await expect(page.getByTestId("total-cost")).not.toHaveText(before!);
  await page.goto("/life-abroad");
  await page
    .getByRole("button", { name: "Let’s look a little closer" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Three small ways to prepare" }),
  ).toBeVisible();
  await page.goto("/advisor");
  await page
    .getByRole("button", { name: "What if I improve my IELTS?" })
    .click();
  await expect(page.getByRole("log")).toContainText("Scripted preview:");
  await expect(page.getByLabel("Your demo question")).toBeFocused();
});
test("reflow, reduced motion and focus visibility @a11y", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.emulateMedia({
    reducedMotion: "reduce",
    ...(browserName === "chromium" ? { forcedColors: "active" as const } : {}),
  });
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "Continue" }).click();
  const field = page.getByLabel("What should we call you?");
  await expect(field).toBeFocused();
  await expect(field).toHaveAttribute("aria-invalid", "true");
  expect(
    await field.evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe("none");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const animations = await page
    .locator(".form-grid")
    .evaluate((el) =>
      el.getAnimations().map((a) => a.effect?.getComputedTiming().duration),
    );
  expect(
    animations.every(
      (duration) => typeof duration === "number" && duration < 1,
    ),
  ).toBe(true);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
