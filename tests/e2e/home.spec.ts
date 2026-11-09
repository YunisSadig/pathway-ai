import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("hero shows the headline and both calls to action", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your future deserves more than a guess.",
  );
  await expect(
    page.getByRole("link", { name: "Build my pathway" }).first(),
  ).toHaveAttribute("href", "/assessment");
  await expect(
    page.getByRole("link", { name: "Explore universities" }).first(),
  ).toHaveAttribute("href", "/universities");
});

test("improvement what-if updates requirement status", async ({ page }) => {
  await page.goto("/");
  const slider = page.getByRole("slider", { name: /if your ielts were/i });
  await slider.scrollIntoViewIfNeeded();
  const results = page.locator('ul[aria-live="polite"]');
  await expect(results.getByText("Not met")).toBeVisible();
  await slider.fill("7");
  await expect(results.getByText("Met", { exact: true })).toBeVisible();
  await expect(results.getByText("Not met")).toHaveCount(0);
  await expect(page.getByText(/never guarantees admission/i)).toBeVisible();
});

test("expectation vs reality tabs switch with the keyboard", async ({
  page,
}) => {
  await page.goto("/");
  const first = page.getByRole("tab", { name: "Making friends" });
  await first.scrollIntoViewIfNeeded();
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Living alone" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByText(/cooking, budgeting/)).toBeVisible();
});

test("CTA targets resolve", async ({ page }) => {
  for (const href of ["/assessment", "/universities"]) {
    const res = await page.goto(href);
    expect(res?.status(), href).toBe(200);
  }
});

for (const width of [360, 375, 390, 430, 768, 1024, 1280, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

for (const scheme of ["light", "dark"] as const) {
  test(`full homepage has no axe violations (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await page.waitForTimeout(1600); // let the hero entrance finish
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`),
    ).toEqual([]);
  });
}
