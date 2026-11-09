import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { SCHOLARSHIPS } from "../../src/data/scholarships";
import { UNIVERSITIES } from "../../src/data/universities";
import { WORKSPACE_NAV } from "../../src/lib/site";

const DELFT = "Delft University of Technology";
const TUM = "Technical University of Munich";

async function fillEssentials(page: Page) {
  await page.getByRole("radio", { name: "In a bachelor's program" }).check();
  await page.getByLabel("Country you study or live in now").fill("Azerbaijan");
  await page.getByRole("radio", { name: "Master's", exact: true }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("checkbox", { name: "Computer science and IT" }).check();
  await page.getByLabel("Average grade").fill("4.5");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("checkbox", { name: "European Union" }).check();
  await page.getByLabel("Yearly tuition limit (EUR)").fill("5000");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Year you want to start").selectOption({ index: 2 });
  await page.getByRole("button", { name: "Continue" }).click();
}

test("Journey A: first-time visitor builds a profile and reaches the dashboard", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Build my pathway" }).first().click();
  await expect(page).toHaveURL(/onboarding/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Build your profile",
  );

  // Validation: cannot continue with nothing chosen.
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText("Choose where you are in your education."),
  ).toBeVisible();

  await page.getByRole("radio", { name: "In a bachelor's program" }).check();
  await page.getByLabel("Country you study or live in now").fill("Azerbaijan");
  await page.getByRole("radio", { name: "Master's", exact: true }).check();
  await page.getByRole("button", { name: "Continue" }).click();

  // Resume after refresh.
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your studies" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByLabel("Country you study or live in now")).toHaveValue(
    "Azerbaijan",
  );
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("checkbox", { name: "Computer science and IT" }).check();
  await page.getByLabel("Average grade").fill("4.5");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("checkbox", { name: "European Union" }).check();
  await page.getByLabel("Yearly tuition limit (EUR)").fill("5000");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Year you want to start").selectOption({ index: 2 });
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Skip this step" }).click();

  await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
  await expect(page.getByText("Azerbaijan").first()).toBeVisible();
  await page
    .getByRole("button", { name: "Save profile and open dashboard" })
    .click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(
    page.getByText("Master's in Computer science and IT"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your next step" }),
  ).toBeVisible();
  await expect(page.getByText(/not saved any universities/i)).toBeVisible();
});

test("Journey B: research a university, save it and find it again", async ({
  page,
}) => {
  await page.goto("/universities");
  await page.getByLabel("Search").fill("DELFT");
  await expect(
    page.getByRole("status").filter({ hasText: "Showing" }),
  ).toContainText("1 of");
  await page.getByRole("link", { name: `View details ${DELFT}` }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(DELFT);
  await expect(page.getByText("Not verified").first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Official website/ }),
  ).toHaveAttribute("href", /tudelft\.nl/);
  await page.getByRole("button", { name: `Save ${DELFT}` }).click();
  await expect(
    page.getByRole("button", { name: `Saved ${DELFT}` }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.goto("/universities?saved=1");
  await expect(page.getByRole("heading", { name: DELFT })).toBeVisible();
  await expect(
    page.getByRole("status").filter({ hasText: "Showing" }),
  ).toContainText("1 of");

  // Empty state and clearing filters.
  await page.goto("/universities?q=zzzz");
  await expect(
    page.getByText("No universities match these filters."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).first().click();
  await expect(page.getByRole("heading", { name: DELFT })).toBeVisible();
});

test("Journey C: compare universities and update the selection", async ({
  page,
}) => {
  await page.goto("/universities");
  for (const name of [DELFT, TUM]) {
    await page.getByLabel("Search").fill(name);
    await page.getByRole("button", { name: `Compare ${name}` }).click();
  }
  await page.goto("/compare");
  const table = page.getByRole("region", { name: "Comparison table" });
  await expect(
    table.getByRole("link", { name: DELFT, exact: true }),
  ).toBeVisible();
  await expect(
    table.getByRole("link", { name: TUM, exact: true }),
  ).toBeVisible();
  await expect(table.getByText("Not verified").first()).toBeVisible();

  await page
    .getByRole("button", { name: `Remove ${DELFT} from comparison` })
    .click();
  await expect(
    table.getByRole("link", { name: DELFT, exact: true }),
  ).toHaveCount(0);

  await page
    .getByLabel("Add a university")
    .selectOption({ label: "Utrecht University" });
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(
    table.getByRole("link", { name: "Utrecht University", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    table.getByRole("link", { name: "Utrecht University", exact: true }),
  ).toBeVisible();
});

test("Journey D: build a primary route with tasks and keep it after refresh", async ({
  page,
}) => {
  await page.goto(`/universities/delft-university-of-technology`);
  await page.getByRole("button", { name: "Add to plan" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "now your primary route" }),
  ).toBeVisible();

  await page.goto("/pathway-planner");
  await expect(
    page.getByRole("combobox", { name: "University" }).first(),
  ).toHaveValue("delft-university-of-technology");
  await page
    .getByRole("button", { name: "Add suggested starter tasks" })
    .first()
    .click();
  await page
    .getByRole("checkbox", { name: /Read the program page/ })
    .first()
    .check();

  await page
    .getByLabel("Situation")
    .selectOption({ label: "My language score is not high enough" });
  await expect(
    page.getByRole("region", { name: "Scenario result" }),
  ).toContainText("Language score falls short");

  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "University" }).first(),
  ).toHaveValue("delft-university-of-technology");
  await expect(
    page.getByRole("checkbox", { name: /Read the program page/ }).first(),
  ).toBeChecked();

  await page.goto("/dashboard");
  await expect(page.getByText(DELFT).first()).toBeVisible();
});

test("Journey E: improvement lab what-if and restore", async ({ page }) => {
  await page.goto("/improvement-lab");
  await page.getByLabel("Required language score").fill("6.5");
  const results = page.locator('ul[aria-live="polite"]');
  await expect(results.getByText("Not verified").first()).toBeVisible();
  await page.getByLabel(/^Language score \(now/).fill("5.5");
  await expect(results.getByText("Not met")).toHaveCount(1);
  await page.getByLabel(/^Language score \(now/).fill("7");
  await expect(results.getByText("Met", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Restore my real values" }).click();
  await expect(page.getByLabel(/^Language score \(now/)).toHaveValue("");
});

test("saved scholarships and delete-my-data", async ({ page }) => {
  await page.goto("/scholarships");
  await page.getByLabel("Degree level").selectOption("bachelor");
  await expect(
    page.getByRole("heading", { name: /Global Korea/ }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /Vanier/ })).toHaveCount(0);
  await page.getByRole("button", { name: /^Save Global Korea/ }).click();
  await page.goto("/saved");
  await expect(page.getByRole("link", { name: /Global Korea/ })).toBeVisible();

  await page.goto("/settings");
  await page.getByRole("button", { name: "Delete my data" }).click();
  await page.getByRole("button", { name: "Delete everything" }).click();
  await expect(page.getByText("All data deleted.")).toBeVisible();
  await page.goto("/saved");
  await expect(page.getByText("No saved scholarships yet.")).toBeVisible();
});

test("every university and scholarship page renders", async ({ request }) => {
  for (const u of UNIVERSITIES) {
    const r = await request.get(`/universities/${u.slug}`);
    expect(r.status(), u.slug).toBe(200);
  }
  for (const s of SCHOLARSHIPS) {
    const r = await request.get(`/scholarships/${s.slug}`);
    expect(r.status(), s.slug).toBe(200);
  }
  for (const item of WORKSPACE_NAV) {
    const r = await request.get(item.href);
    expect(r.status(), item.href).toBe(200);
  }
});

for (const path of [
  "/universities",
  "/universities/delft-university-of-technology",
  "/scholarships",
  "/scholarships/global-korea-scholarship",
  "/onboarding",
  "/dashboard",
  "/pathway-planner",
  "/compare",
  "/improvement-lab",
  "/financial-planner",
  "/settings",
  "/life-abroad",
  "/advisor-preview",
]) {
  test(`no axe violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`),
    ).toEqual([]);
  });
}

test("financial planner totals and saved scenario", async ({ page }) => {
  await page.goto("/financial-planner");
  await page.getByLabel("Amount (EUR)").nth(0).fill("2000");
  await page.getByLabel("Amount (EUR)").nth(1).fill("500");
  const totals = page.getByRole("region", { name: "Totals" });
  await expect(totals).toContainText("8,000 EUR");
  await page.getByLabel("Scenario name").fill("Plan one");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: 'Saved "Plan one"' }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText("Plan one")).toBeVisible();
});
