import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { defaultProfile } from "../../lib/profile";
const routes = [
  "/onboarding",
  "/dashboard",
  "/universities",
  "/improvement",
  "/planner",
  "/life-abroad",
  "/finance",
  "/advisor",
];
test("unfinished numeric drafts do not leak NaN into planning", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await page.getByLabel("What should we call you?").fill("Demo");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Annual budget (€)").fill("");
  await page
    .getByRole("link", { name: "Find your university", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Find a place to become you." }),
  ).toBeVisible();
  await expect(page.locator("body")).not.toContainText("NaN");
  await expect(
    page.getByRole("checkbox", { name: /Within my €18,000 budget/ }),
  ).toBeVisible();
});
test("saved profile changes update matching and long text wraps", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/universities");
  await page.getByRole("checkbox", { name: /Within my/ }).check();
  await expect(page.getByRole("status")).not.toContainText(
    "0 fictional programs",
  );
  await page.evaluate(
    (profile) =>
      localStorage.setItem(
        "pathway-profile-v1",
        JSON.stringify({
          version: 1,
          profile,
          completed: true,
          step: 4,
          goals: [],
          primary: "",
          backup: "",
        }),
      ),
    {
      ...defaultProfile,
      name: "A".repeat(40),
      career: "B".repeat(100),
      expectations: "C".repeat(500),
      budget: 3000,
      ielts: 4,
    },
  );
  await page.reload();
  await page.getByRole("checkbox", { name: /Within my/ }).check();
  await expect(page.getByRole("status")).toContainText("0 fictional programs");
  for (const route of ["/dashboard", "/life-abroad", "/advisor"]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${route} long text overflow`,
    ).toBe(true);
  }
});
for (const [device, width, height] of [
  ["mobile", 375, 812],
  ["tablet", 768, 1024],
  ["desktop", 1440, 900],
] as const) {
  for (const theme of ["light", "dark"]) {
    test(`${device} ${theme} all screens @a11y`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(
        (theme) => localStorage.setItem("theme", theme),
        theme,
      );
      for (const route of routes) {
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
          `${route} accessibility`,
        ).toEqual([]);
        await page.screenshot({
          path: testInfo.outputPath(`${route.slice(1)}-${theme}-${device}.png`),
          fullPage: true,
          animations: "disabled",
        });
      }
    });
  }
}
test("scenario goals, backups, finances, reflections, and advisor work", async ({
  page,
}) => {
  await page.goto("/improvement");
  await page.getByLabel("IELTS target", { exact: true }).fill("7.5");
  await page.getByLabel("SAT target", { exact: true }).fill("1400");
  await page.getByRole("button", { name: "Save preparation goal" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Preparation goal saved",
  );
  await page.reload();
  await expect(
    page.getByText("IELTS 7.5 · SAT 1400", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Student workspace" })
    .getByRole("link", { name: "My pathway" })
    .click();
  await page.getByLabel("Primary program").selectOption("northstar-cs");
  await page.getByLabel("Backup program").selectOption("elmbridge-cs");
  await page.getByRole("button", { name: "Save my pathways" }).click();
  await page.reload();
  await expect(page.getByLabel("Primary program")).toHaveValue("northstar-cs");
  await page.getByRole("button", { name: "Budget drops 25%" }).click();
  await expect(
    page.getByRole("heading", { name: "Revised budget: €13,500" }),
  ).toBeVisible();
  await page.goto("/finance");
  const before = await page.getByTestId("total-cost").textContent();
  await page.getByLabel("Monthly rent", { exact: true }).fill("1200");
  await expect(page.getByTestId("total-cost")).not.toHaveText(before!);
  await page.goto("/life-abroad");
  await page.getByRole("button", { name: "Housing", exact: true }).click();
  await page
    .getByRole("button", { name: "Let’s look a little closer" })
    .click();
  await expect(page.getByText("Budget for a deposit and setup")).toBeVisible();
  await page.goto("/advisor");
  await page.getByRole("button", { name: "How can I plan my budget?" }).click();
  await expect(page.getByRole("log")).toContainText(
    "Scripted preview: begin with tuition",
  );
});
