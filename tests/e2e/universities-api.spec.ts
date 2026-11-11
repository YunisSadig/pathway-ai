import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import {
  API,
  apiError,
  json,
  mockUniversities,
  universityPage,
} from "./helpers/api";

// Next.js adds its own role=alert route announcer, so scope to the results region.
const inResults = (page: Page) => page.getByRole("region", { name: "Results" });

const none = {
  content: [],
  number: 0,
  size: 12,
  totalElements: 0,
  totalPages: 0,
};

test("renders API records without inventing anything", async ({ page }) => {
  await mockUniversities(page);
  await page.goto("/universities");
  const first = page.getByRole("article").first();
  await expect(first.getByRole("heading")).toHaveText(
    "Synthetic Test University 01",
  );
  await expect(first).toContainText("Testburg, Germany");
  await expect(
    first.getByRole("link", { name: "University website" }),
  ).toHaveAttribute("href", "https://example.test/u/1");
  // Record 02 has no website: no link at all, never a placeholder.
  await expect(page.getByRole("article").nth(1).getByRole("link")).toHaveCount(
    0,
  );
  // Unknown data stays unknown.
  await expect(page.getByRole("article").first()).not.toContainText(
    /€|\$|tuition|ranking|deadline|verified/i,
  );
});

test("shows a loading state while the request is in flight", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  await mockUniversities(page, async (route, url) => {
    await gate;
    await json(route, universityPage(url));
  });
  await page.goto("/universities");
  await expect(page.getByText("Loading universities…")).toBeAttached();
  await expect(page.locator('[aria-busy="true"]')).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
  release();
  await expect(page.getByRole("article")).toHaveCount(12);
});

test("honest empty state when the database has no universities", async ({
  page,
}) => {
  await mockUniversities(page, (route) => json(route, none));
  await page.goto("/universities");
  await expect(
    page.getByText("No universities have been added yet."),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
  await expect(inResults(page).getByRole("alert")).toHaveCount(0);
});

test("backend unavailable: error state, no fallback data, retry recovers", async ({
  page,
}) => {
  let up = false;
  await mockUniversities(page, (route, url) =>
    up ? json(route, universityPage(url)) : route.abort("connectionrefused"),
  );
  await page.goto("/universities");
  const alert = inResults(page).getByRole("alert");
  await expect(alert).toContainText("We couldn't load universities");
  await expect(alert).toContainText("could not be reached");
  await expect(page.getByRole("article")).toHaveCount(0);
  up = true;
  await alert.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("article")).toHaveCount(12);
  await expect(inResults(page).getByRole("alert")).toHaveCount(0);
});

test("server error shows an error state with retry", async ({ page }) => {
  await mockUniversities(page, (route) =>
    json(route, apiError(500, "Unexpected error"), 500),
  );
  await page.goto("/universities");
  await expect(inResults(page).getByRole("alert")).toContainText(
    "had a problem",
  );
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("a malformed success response is an error, not an empty list", async ({
  page,
}) => {
  await mockUniversities(page, (route) => json(route, { unexpected: true }));
  await page.goto("/universities");
  await expect(inResults(page).getByRole("alert")).toBeVisible();
});

test("search sends q, resets paging and is shareable via the URL", async ({
  page,
}) => {
  const api = await mockUniversities(page);
  await page.goto("/universities?page=2");
  await expect(page.getByRole("article")).toHaveCount(3);
  await page.getByLabel("University name").fill("  test university 07 ");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/q=test\+university\+07/);
  await expect(page).not.toHaveURL(/page=/);
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByText(/matching “test university 07”/)).toBeVisible();
  expect(api.requests.at(-1)?.get("q")).toBe("test university 07");

  await page.getByLabel("University name").fill("zzz");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(
    page.getByText("No universities found matching “zzz”."),
  ).toBeVisible();
  await page.getByRole("link", { name: "Clear search" }).click();
  await expect(page.getByRole("article")).toHaveCount(12);
  await expect(page.getByLabel("University name")).toHaveValue("");

  // A direct visit restores the same search.
  await page.goto("/universities?q=university+14");
  await expect(page.getByLabel("University name")).toHaveValue("university 14");
  await expect(page.getByRole("article")).toHaveCount(1);
});

test("search and country combine, and the search survives a destination change", async ({
  page,
}) => {
  const api = await mockUniversities(page);
  await page.goto("/universities?region=eu&country=germany&q=12");
  await expect(page.getByRole("article")).toHaveCount(1);
  expect(api.requests.at(-1)?.get("country")).toBe("DE");
  expect(api.requests.at(-1)?.get("q")).toBe("12");
  await page.getByRole("link", { name: "Japan" }).click();
  await expect(page).toHaveURL(/q=12&region=jp/);
  await expect(
    page.getByText("No universities found for Japan matching “12”."),
  ).toBeVisible();
});

test("sorting is sent to the API and kept in the URL", async ({ page }) => {
  const api = await mockUniversities(page);
  await page.goto("/universities");
  await page.getByLabel("Sort by").selectOption("name:desc");
  await expect(page).toHaveURL(/direction=desc/);
  await expect(
    page.getByRole("article").first().getByRole("heading"),
  ).toHaveText("Synthetic Test University 15");
  expect(api.requests.at(-1)?.get("sort")).toBe("name");
  expect(api.requests.at(-1)?.get("direction")).toBe("desc");
  await page.getByLabel("Sort by").selectOption("city:asc");
  await expect(page).toHaveURL(/sort=city/);
  expect(api.requests.at(-1)?.get("sort")).toBe("city");
});

test("pagination uses zero-based API pages behind one-based URLs", async ({
  page,
}) => {
  const api = await mockUniversities(page);
  await page.goto("/universities");
  const nav = page.getByRole("navigation", { name: "Pagination" });
  await expect(nav).toContainText("Page 1 of 2");
  await expect(nav.getByText("Previous")).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await nav.getByRole("link", { name: "Next" }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(nav).toContainText("Page 2 of 2");
  await expect(page.getByRole("article")).toHaveCount(3);
  expect(api.requests.at(-1)?.get("page")).toBe("1");
  await expect(nav.getByText("Next")).toHaveAttribute("aria-disabled", "true");
  await nav.getByRole("link", { name: "Previous" }).click();
  await expect(page.getByRole("article")).toHaveCount(12);
});

test("a page beyond the last one offers a way back", async ({ page }) => {
  await mockUniversities(page);
  await page.goto("/universities?page=9");
  await expect(page.getByText("That page doesn't exist")).toBeVisible();
  await page.getByRole("link", { name: "Go to the first page" }).click();
  await expect(page.getByRole("article")).toHaveCount(12);
});

test("the browser only ever calls the configured API origin", async ({
  page,
}) => {
  const origins = new Set<string>();
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.pathname.startsWith("/api/")) origins.add(u.origin);
  });
  await mockUniversities(page);
  await page.goto("/universities");
  await expect(page.getByRole("article")).toHaveCount(12);
  expect([...origins]).toEqual([API]);
});

for (const scheme of ["light", "dark"] as const) {
  test(`no axe violations in empty and error states (${scheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    const cases = [
      { name: "empty", role: "status" as const, abort: false },
      { name: "error", role: "alert" as const, abort: true },
    ];
    for (const c of cases) {
      await page.unrouteAll();
      await mockUniversities(page, (route) =>
        c.abort ? route.abort("connectionrefused") : json(route, none),
      );
      await page.goto("/universities?q=axe");
      await expect(inResults(page).getByRole(c.role).first()).toBeVisible();
      await page.waitForTimeout(500);
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations.map((v) => `${c.name} ${v.id}: ${v.nodes[0]?.html}`),
      ).toEqual([]);
    }
  });
}

test("each view issues exactly one API request (no duplicates)", async ({
  page,
}) => {
  const api = await mockUniversities(page);
  await page.goto("/universities");
  await expect(page.getByRole("article")).toHaveCount(12);
  expect(api.requests).toHaveLength(1);

  await page.getByRole("link", { name: "Japan" }).click();
  await expect(page.getByRole("article")).toHaveCount(1);
  expect(api.requests).toHaveLength(2);

  await page.getByLabel("University name").fill("15");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/q=15/);
  await expect(page.getByRole("article")).toHaveCount(1);
  expect(api.requests).toHaveLength(3);

  await page.getByLabel("Sort by").selectOption("city:asc");
  await expect(page).toHaveURL(/sort=city/);
  await expect.poll(() => api.requests.length).toBe(4);
  await page.waitForTimeout(300);
  expect(api.requests).toHaveLength(4);
});
