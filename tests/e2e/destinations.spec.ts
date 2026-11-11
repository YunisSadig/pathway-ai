import { expect, test } from "@playwright/test";
import { FIXTURES, mockUniversities } from "./helpers/api";

test("universities starts with all regions and lists API results", async ({
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
  await expect(page.getByText("15 universities")).toBeVisible();
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

test("selecting a country filters through the API, changing and clearing it", async ({
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
    page.getByRole("heading", { name: "Synthetic Test University 14" }),
  ).toBeVisible();
  await expect(page.getByText("1 university in Poland")).toBeVisible();
  expect(api.requests.at(-1)?.get("country")).toBe("PL");
  await expect(states.getByRole("link", { name: /Poland/ })).toHaveAttribute(
    "aria-current",
    "true",
  );

  await states.getByRole("link", { name: /Czechia/ }).click();
  await expect(
    page.getByText("No universities found for Czechia."),
  ).toBeVisible();
  expect(api.requests.at(-1)?.get("country")).toBe("CZ");

  await page.getByRole("link", { name: "Clear selection" }).click();
  await expect(page).toHaveURL(/\/universities$/);
  await expect(page.getByRole("article")).toHaveCount(12);
  expect(api.requests.at(-1)?.has("country")).toBe(false);
});

test("a non-EU region filters by its own country code", async ({ page }) => {
  const api = await mockUniversities(page);
  await page.goto("/universities");
  await page.getByRole("link", { name: "Japan" }).click();
  await expect(
    page.getByRole("heading", { name: "Synthetic Test University 15" }),
  ).toBeVisible();
  expect(api.requests.at(-1)?.get("country")).toBe("JP");
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
  ]) {
    const res = await page.goto(url);
    expect(res?.status(), url).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Universities",
    );
  }
  // The API never receives the invalid values.
  for (const q of api.requests) {
    expect(q.get("sort") ?? "name").toMatch(/^(name|city)$/);
    expect(q.get("direction") ?? "asc").toMatch(/^(asc|desc)$/);
    expect(Number(q.get("page"))).toBeGreaterThanOrEqual(0);
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
  const germany = FIXTURES.filter((u) => u.countryCode === "DE").length;
  await expect(
    page.getByText(`${germany} universities in Germany`),
  ).toBeVisible();
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
