import { expect, test } from "@playwright/test";
import { mockUniversities } from "./helpers/api";

test("universities starts with all regions and lists programs first", async ({
  page,
}) => {
  await mockUniversities(page);
  await page.goto("/universities");
  const regions = page.getByRole("navigation", { name: "Destination regions" });
  await expect(regions.getByRole("link")).toHaveText([
    "European Union",
    "United States",
    "Canada",
    "China",
    "South Korea",
    "Japan",
  ]);
  await expect(page.getByRole("article")).toHaveCount(12);
  await expect(page.getByText("14 programs")).toBeVisible();
  const tabs = page.getByRole("navigation", { name: "Browse by" });
  await expect(tabs.getByRole("link", { name: "Programs" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("EU shows its 27 member states and not non-members", async ({ page }) => {
  await mockUniversities(page);
  await page.goto("/universities");
  await page.getByRole("link", { name: "European Union" }).click();
  await expect(page).toHaveURL(/region=eu/);
  const states = page.getByRole("navigation", {
    name: "European Union member states",
  });
  await expect(states.getByRole("link")).toHaveCount(27);
  await expect(states.getByRole("link", { name: /Poland/ })).toBeVisible();
  await expect(
    states.getByRole("link", { name: /Switzerland|Norway|United Kingdom/ }),
  ).toHaveCount(0);
  // The API filters by one country, so the EU alone asks for a member state.
  await expect(page.getByText("Choose a member state")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("selecting a country filters programs through the API, changing and clearing it", async ({
  page,
}) => {
  const api = await mockUniversities(page);
  await page.goto("/universities?region=eu");
  const states = page.getByRole("navigation", {
    name: "European Union member states",
  });
  await states.getByRole("link", { name: /Poland/ }).click();
  await expect(page).toHaveURL(/region=eu&country=poland/);
  await expect(
    page.getByRole("heading", { name: "Synthetic Program 14" }),
  ).toBeVisible();
  await expect(page.getByText("1 program in Poland")).toBeVisible();
  const lastProgramRequest = () =>
    api.requests.filter((r) => r.get("size") === "12").at(-1);
  // the picker collapses to a summary once a destination is chosen
  await expect(page.getByText("Poland, European Union")).toBeVisible();
  await expect(states).toBeHidden();
  await page.getByRole("button", { name: "Change", exact: true }).click();
  await expect(states.getByRole("link", { name: /Poland/ })).toHaveAttribute(
    "aria-current",
    "true",
  );

  await states.getByRole("link", { name: /Czechia/ }).click();
  await expect(page.getByText("No programs found for Czechia.")).toBeVisible();

  await page.getByRole("link", { name: "Clear selection" }).click();
  await expect(page).toHaveURL(/\/universities$/);
  await expect(page.getByRole("article")).toHaveCount(12);
  expect(lastProgramRequest()?.has("country")).toBe(false);
});

test("a non-EU region filters by its own country code", async ({ page }) => {
  await mockUniversities(page);
  await page.goto("/universities");
  await page.getByRole("link", { name: "Japan" }).click();
  await expect(page.getByText("No programs found for Japan.")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "European Union member states" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Clear selection" }).click();
  await expect(page).toHaveURL(/\/universities$/);
});

test("invalid query parameters are ignored safely", async ({ page }) => {
  const api = await mockUniversities(page);
  for (const url of [
    "/universities?region=mars",
    "/universities?region=eu&country=atlantis",
    "/universities?region=us&country=poland",
    "/universities?country=poland",
    "/universities?region=<script>",
    "/universities?page=-4&sort=ranking&direction=up",
    "/universities?level=phd&field=NOT%20A%20SLUG&language=english&tuitionMax=-5&currency=euro",
    "/universities?view=everything",
  ]) {
    const res = await page.goto(url);
    expect(res?.status(), url).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Universities",
    );
  }
  // The API never receives the invalid values.
  for (const q of api.requests) {
    expect(q.get("sort") ?? "name").toMatch(/^(name|city|university|level)$/);
    expect(q.get("direction") ?? "asc").toMatch(/^(asc|desc)$/);
    expect(Number(q.get("page") ?? 0)).toBeGreaterThanOrEqual(0);
    if (q.has("level")) expect(q.get("level")).toMatch(/^(bachelor|master)/);
    expect(q.has("tuitionMax")).toBe(false);
    expect(q.get("language") ?? "en").toMatch(/^[a-z]{2,3}$/);
  }
  await page.goto("/universities?region=eu&country=atlantis");
  await expect(page.getByText("Choose a member state")).toBeVisible();
});

test("country selection works with the keyboard", async ({ page }) => {
  await mockUniversities(page);
  await page.goto("/universities?region=eu");
  const link = page.getByRole("link", { name: /Germany/ });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("13 programs in Germany")).toBeVisible();
});

test("scholarships: honest empty state with no dead filters", async ({
  page,
}) => {
  await page.goto("/scholarships");
  await expect(
    page.getByText("Scholarship listings aren't available yet."),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Master's" })).toHaveCount(0);
  await page.getByRole("link", { name: "Browse universities" }).click();
  await expect(page).toHaveURL(/\/universities$/);
});
