import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { NAV } from "../../src/lib/site";

test("hero shows the headline and two working calls to action", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your future deserves more than a guess.",
  );
  await expect(
    page.getByRole("link", { name: "Explore universities" }).first(),
  ).toHaveAttribute("href", "/universities");
  await expect(
    page.getByRole("link", { name: "How it works", exact: true }).last(),
  ).toHaveAttribute("href", "/how-it-works");
});

test("hero destinations open the matching region", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Study destinations" })
    .getByRole("link", { name: /European Union/ })
    .click();
  await expect(page).toHaveURL(/universities\?region=eu/);
});

test("every internal link on every page resolves", async ({
  page,
  request,
}) => {
  const seen = new Set<string>();
  for (const item of NAV) {
    await page.goto(item.href);
    const hrefs = await page
      .locator("a[href^='/']")
      .evaluateAll((a) => a.map((l) => l.getAttribute("href")!));
    hrefs.forEach((h) => seen.add(h));
  }
  expect(seen.size).toBeGreaterThan(4);
  for (const href of seen)
    expect((await request.get(href)).status(), href).toBe(200);
});

test("does not claim features or data that do not exist", async ({ page }) => {
  for (const item of NAV) {
    await page.goto(item.href);
    const text = (await page.locator("main").innerText()).toLowerCase();
    expect(text, item.href).not.toMatch(
      /\d+% |acceptance rate|apply now|recommended for you|log in|sign up/,
    );
  }
});

test("homepage stays concise", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  expect(height).toBeLessThan(2200);
});

for (const path of NAV.map((n) => n.href)) {
  for (const width of [360, 390, 430, 768, 1024, 1280, 1440]) {
    test(`no horizontal overflow on ${path} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(
        path === "/universities"
          ? "/universities?region=eu&country=germany"
          : path,
      );
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

for (const scheme of ["light", "dark"] as const) {
  for (const path of [
    ...NAV.map((n) => n.href),
    "/universities?region=eu&country=poland",
    "/scholarships?level=master&region=eu",
  ]) {
    test(`no axe violations on ${path} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await page.waitForTimeout(1200);
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`),
      ).toEqual([]);
    });
  }
}

test("stale prototype storage is removed without touching other keys", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("seeded")) {
      localStorage.setItem("pathway-ai:store", "{}");
      localStorage.setItem("unrelated", "keep");
      localStorage.setItem("seeded", "1");
    }
  });
  await page.goto("/");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("pathway-ai:store")))
    .toBeNull();
  expect(await page.evaluate(() => localStorage.getItem("unrelated"))).toBe(
    "keep",
  );
});
