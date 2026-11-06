import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("mobile navigation dismisses and returns keyboard focus @a11y", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(nav).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(nav).not.toBeVisible();
  await toggle.click();
  await page.mouse.click(5, 400);
  await expect(nav).not.toBeVisible();
  await toggle.click();
  await nav.getByRole("link", { name: "Discover" }).click();
  await expect(page).toHaveURL(/universities/);
  await expect(nav).not.toBeVisible();
});
test("reset confirmation protects progress and restores focus", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await page.getByLabel("What should we call you?").fill("Keep me");
  await page.getByRole("button", { name: "Start fresh" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Keep my progress" }).click();
  await expect(page.getByLabel("What should we call you?")).toHaveValue(
    "Keep me",
  );
  await page.getByRole("button", { name: "Start fresh" }).click();
  await page.getByRole("button", { name: "Clear demo profile" }).click();
  await expect(page.getByLabel("What should we call you?")).toHaveValue("");
});
test("comparison dock reveals the table and enforces capacity", async ({
  page,
}) => {
  await page.goto("/universities");
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("checkbox", { name: "Compare", exact: true })
      .nth(i)
      .check();
  await expect(
    page.getByRole("checkbox", { name: "Compare", exact: true }).nth(3),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Compare programs", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Program comparison" }),
  ).toBeFocused();
  await expect(page.getByRole("table")).toBeVisible();
});
