import { expect, test } from "@playwright/test";

test("universities starts with all regions and an honest empty state", async ({
  page,
}) => {
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
  await expect(
    page.getByText("University listings aren't available yet."),
  ).toBeVisible();
  // No fabricated records: no university cards, no counts.
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("EU shows its 27 member states and not non-members", async ({ page }) => {
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
  await expect(page.getByText("Choose a member state")).toBeVisible();
});

test("selecting a country, changing it and clearing the selection", async ({
  page,
}) => {
  await page.goto("/universities?region=eu");
  const states = page.getByRole("navigation", {
    name: "European Union member states",
  });
  await states.getByRole("link", { name: /Poland/ }).click();
  await expect(page).toHaveURL(/region=eu&country=poland/);
  await expect(
    page.getByText("University listings for Poland aren't available yet."),
  ).toBeVisible();
  await expect(states.getByRole("link", { name: /Poland/ })).toHaveAttribute(
    "aria-current",
    "true",
  );

  await states.getByRole("link", { name: /Czechia/ }).click();
  await expect(
    page.getByText("University listings for Czechia aren't available yet."),
  ).toBeVisible();

  await page.getByRole("link", { name: "Clear selection" }).click();
  await expect(page).toHaveURL(/\/universities$/);
  await expect(
    page.getByText("University listings aren't available yet."),
  ).toBeVisible();
});

test("a non-EU region has no member-state grid", async ({ page }) => {
  await page.goto("/universities");
  await page.getByRole("link", { name: "Japan" }).click();
  await expect(
    page.getByText("University listings for Japan aren't available yet."),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "European Union member states" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "View all destinations" }).click();
  await expect(page).toHaveURL(/\/universities$/);
});

test("invalid query parameters are ignored safely", async ({ page }) => {
  for (const url of [
    "/universities?region=mars",
    "/universities?region=eu&country=atlantis",
    "/universities?region=us&country=poland",
    "/universities?country=poland",
    "/universities?region=<script>",
  ]) {
    const res = await page.goto(url);
    expect(res?.status(), url).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Universities",
    );
    await expect(
      page.getByText(/aren't available yet|Choose a member state/).first(),
    ).toBeVisible();
  }
  await page.goto("/universities?region=eu&country=atlantis");
  await expect(page.getByText("Choose a member state")).toBeVisible();
});

test("country selection works with the keyboard", async ({ page }) => {
  await page.goto("/universities?region=eu");
  const link = page.getByRole("link", { name: /Germany/ });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("University listings for Germany aren't available yet."),
  ).toBeVisible();
});

test("scholarships: level and destination choices, then clear", async ({
  page,
}) => {
  await page.goto("/scholarships");
  await expect(
    page.getByText("Scholarship listings aren't available yet."),
  ).toBeVisible();
  await page.getByRole("link", { name: "Master's" }).click();
  await expect(page).toHaveURL(/level=master/);
  await page.getByRole("link", { name: "European Union" }).click();
  await expect(page).toHaveURL(/region=eu/);
  await page.getByRole("link", { name: /Germany/ }).click();
  await expect(page).toHaveURL(/level=master/);
  await expect(
    page.getByText(
      "Scholarship listings for Master's study in Germany aren't available yet.",
    ),
  ).toBeVisible();
  await page.getByRole("link", { name: "Clear all choices" }).click();
  await expect(page).toHaveURL(/\/scholarships$/);
});
