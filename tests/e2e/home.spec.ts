import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("hero shows the headline and both calls to action", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your future deserves more than a guess.",
  );
  await expect(
    page.getByRole("link", { name: "Build my pathway" }).first(),
  ).toHaveAttribute("href", "/onboarding");
  await expect(
    page.getByRole("link", { name: "Explore universities" }).first(),
  ).toHaveAttribute("href", "/universities");
});

test("feature tabs switch with the keyboard", async ({ page }) => {
  await page.goto("/");
  const first = page.getByRole("tab", { name: "Find universities" });
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute("aria-selected", "true");
  await first.focus();
  await page.keyboard.press("ArrowRight");
  const second = page.getByRole("tab", { name: "Find scholarships" });
  await expect(second).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText(/fine print first/i)).toBeVisible();
});

test("fit tab what-if updates requirement status", async ({ page }) => {
  await page.goto("/");
  const tab = page.getByRole("tab", { name: "Check your fit" });
  await tab.scrollIntoViewIfNeeded();
  await tab.click();
  const slider = page.getByRole("slider", { name: /if your ielts were/i });
  const results = page.locator('ul[aria-live="polite"]');
  await expect(results.getByText("Not met")).toHaveCount(2); // language + budget
  await slider.fill("7");
  await expect(results.getByText("Met", { exact: true })).toBeVisible();
  await expect(results.getByText("Not met")).toHaveCount(1); // budget only
  await expect(page.getByText(/never guarantees admission/i)).toBeVisible();
});

test("every call to action resolves", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator("main a[href^='/']")
    .evaluateAll((links) => [
      ...new Set(links.map((l) => l.getAttribute("href"))),
    ]);
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    const res = await page.request.get(href!);
    expect(res.status(), href!).toBe(200);
  }
});

test("homepage stays concise", async ({ page }) => {
  // The previous homepage was ~6,800px tall at 1440 wide; it must not grow.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  expect(height).toBeLessThan(3200);
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

test("mobile drawer closes with Escape and returns focus", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});
