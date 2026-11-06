import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("assessment validates, persists, and finishes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Let’s find your path" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText("Enter a nickname of 1–40 characters."),
  ).toBeVisible();
  await page.getByLabel("What should we call you?").fill("Demo Alex");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("IELTS overall band").fill("6.5");
  await page.reload();
  await expect(page.getByLabel("IELTS overall band")).toHaveValue("6.5");
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(page.getByLabel("What should we call you?")).toHaveValue(
    "Demo Alex",
  );
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Annual budget (€)").fill("0");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText("Enter an annual budget between €3,000 and €150,000."),
  ).toBeVisible();
  await page.getByLabel("Annual budget (€)").fill("20000");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Finland", { exact: true }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "See my starting point" }).click();
  await expect(page).toHaveURL(/dashboard/);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("pathway-profile-v1")!).completed,
    ),
  ).toBe(true);
  await expect(
    page.getByRole("heading", { name: /Demo Alex, here/ }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Student workspace" })
    .getByRole("link", { name: "Discover" })
    .click();
  await page.getByLabel("Study field filter").selectOption("Computer science");
  await expect(page.getByRole("status")).toContainText("4 fictional programs");
  await page
    .getByRole("navigation", { name: "Student workspace" })
    .getByRole("link", { name: "Improvement Lab" })
    .click();
  await page.getByLabel("IELTS target", { exact: true }).fill("7");
  await page.getByRole("button", { name: "Save preparation goal" }).click();
  await page
    .getByRole("navigation", { name: "Student workspace" })
    .getByRole("link", { name: "My pathway" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Give your future a plan B." }),
  ).toBeVisible();
});
test("corrupt and blocked storage are recoverable", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("pathway-profile-v1", "broken"),
  );
  await page.goto("/onboarding");
  await expect(page.getByLabel("What should we call you?")).toHaveValue("");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page.getByLabel("What should we call you?").fill("Local demo");
  await expect(page.getByRole("status")).toContainText(
    "Browser storage is unavailable",
  );
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("IELTS overall band")).toBeVisible();
});
test("onboarding initial state @a11y", async ({ page }) => {
  await page.goto("/onboarding");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
