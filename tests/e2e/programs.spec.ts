import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  apiError,
  json,
  mockPrograms,
  mockUniversities,
  PROGRAMS,
  programDetail,
  programPage,
} from "./helpers/api";

const none = {
  content: [],
  number: 0,
  size: 12,
  totalElements: 0,
  totalPages: 0,
};

/** Program list requests only (the page also asks once for 100 programs to build the filter choices). */
const listRequests = (api: { requests: URLSearchParams[] }) =>
  api.requests.filter((r) => r.get("size") === "12");

test.describe("program discovery", () => {
  test("lists programs with their university and honest facts", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto("/universities");
    const first = page.getByRole("article").first();
    await expect(first.getByRole("heading")).toHaveText("Synthetic Program 01");
    await expect(first).toContainText("Synthetic Test University 01");
    await expect(first).toContainText("Testburg, Germany");
    await expect(first).toContainText("3 years · Full-time");
    await expect(first).toContainText("English");
    await expect(first).toContainText("Read from official pages on 2 Jan 2026");
    // program 02 has no stated duration: it says so and invents nothing
    await expect(page.getByRole("article").nth(1)).toContainText("Not stated");
    await expect(page.getByRole("article").first()).not.toContainText(
      /rank|probability|chance|guarantee|scholarship awarded/i,
    );
  });

  test("filters by level, discipline and language through the API and the URL", async ({
    page,
  }) => {
    const api = await mockUniversities(page);
    await page.goto("/universities");
    await expect(page.getByRole("article")).toHaveCount(12);

    await page
      .getByRole("combobox", { name: "Degree level" })
      .selectOption("master");
    await expect(page).toHaveURL(/level=master/);
    await expect(page.getByText("7 programs")).toBeVisible();
    expect(listRequests(api).at(-1)?.get("level")).toBe("master");

    await page
      .getByRole("combobox", { name: "Discipline" })
      .selectOption("synthetic-arts");
    await expect(page).toHaveURL(/field=synthetic-arts/);
    await expect(page.getByText("6 programs")).toBeVisible();
    expect(listRequests(api).at(-1)?.get("field")).toBe("synthetic-arts");

    await page
      .getByRole("combobox", { name: "Teaching language" })
      .selectOption("de");
    await expect(page).toHaveURL(/language=de/);
    await expect(page.getByText("6 programs")).toBeVisible();

    await page.getByRole("link", { name: "Clear filters" }).click();
    await expect(page).toHaveURL(/\/universities$/);
    await expect(page.getByText("14 programs")).toBeVisible();
  });

  test("filter choices come from the API data, never a hard-coded catalogue", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto("/universities");
    const discipline = page.getByRole("combobox", { name: "Discipline" });
    await expect(discipline.locator("option")).toHaveText([
      "Any discipline",
      "Synthetic Arts",
      "Synthetic Engineering",
    ]);
    await expect(
      page
        .getByRole("combobox", { name: "Teaching language" })
        .locator("option"),
    ).toHaveText(["Any language", "German", "English", "Polish"]);
  });

  test("tuition filter sends amount and currency, and explains what it excludes", async ({
    page,
  }) => {
    const api = await mockUniversities(page);
    await page.goto("/universities");
    await page.getByLabel("Maximum yearly tuition").fill("3000");
    await page.getByRole("combobox", { name: "Currency" }).selectOption("EUR");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page).toHaveURL(/tuitionMax=3000&currency=EUR/);
    await expect(page.getByText("3 programs")).toBeVisible();
    const req = listRequests(api).at(-1);
    expect(req?.get("tuitionMax")).toBe("3000");
    expect(req?.get("tuitionCurrency")).toBe("EUR");
    await expect(
      page.getByText(/cannot be compared, so they are left out/),
    ).toBeVisible();
  });

  test("name search, sorting and pagination keep the filters in the URL", async ({
    page,
  }) => {
    const api = await mockUniversities(page);
    await page.goto("/universities");
    const nav = page.getByRole("navigation", { name: "Pagination" });
    await expect(nav).toContainText("Page 1 of 2");
    await nav.getByRole("link", { name: "Next" }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByRole("article")).toHaveCount(2);
    expect(listRequests(api).at(-1)?.get("page")).toBe("1");

    await page
      .getByRole("searchbox", { name: "Program name" })
      .fill("program 07");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page).toHaveURL(/q=program\+07/);
    await expect(page).not.toHaveURL(/page=/);
    await expect(page.getByRole("article")).toHaveCount(1);

    await page.getByRole("link", { name: "Clear filters" }).click();
    // wait for the cleared view before changing the sort, or the sort would apply to the old search
    await expect(page).not.toHaveURL(/q=/);
    await expect(page.getByRole("article")).toHaveCount(12);
    await page
      .getByRole("combobox", { name: "Sort by" })
      .selectOption("name:desc");
    await expect(page).toHaveURL(/direction=desc/);
    await expect(
      page.getByRole("article").first().getByRole("heading"),
    ).toHaveText("Synthetic Program 14");
  });

  test("each view issues the expected API requests and no duplicates", async ({
    page,
  }) => {
    const api = await mockUniversities(page);
    await page.goto("/universities");
    await expect(page.getByRole("article")).toHaveCount(12);
    const choices = () => api.requests.filter((r) => r.get("size") === "100");
    // one list request and one request for the filter choices
    expect(listRequests(api)).toHaveLength(1);
    expect(choices()).toHaveLength(1);
    await page
      .getByRole("combobox", { name: "Degree level" })
      .selectOption("master");
    await expect(page.getByText("7 programs")).toBeVisible();
    await page.waitForTimeout(300);
    expect(listRequests(api)).toHaveLength(2);
    // the choices are not fetched again when only a filter changes
    expect(choices()).toHaveLength(1);
  });

  test("tabs switch between programs and universities and keep the destination", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto("/universities?region=eu&country=germany");
    await expect(page.getByText("13 programs in Germany")).toBeVisible();
    await page
      .getByRole("navigation", { name: "Browse by" })
      .getByRole("link", { name: "Universities" })
      .click();
    await expect(page).toHaveURL(/view=universities/);
    await expect(page).toHaveURL(/country=germany/);
    await expect(page.getByText("13 universities in Germany")).toBeVisible();
    await page
      .getByRole("navigation", { name: "Browse by" })
      .getByRole("link", { name: "Programs" })
      .click();
    await expect(page.getByText("13 programs in Germany")).toBeVisible();
  });

  test("empty, loading, server error and malformed responses are honest", async ({
    page,
  }) => {
    // empty
    await mockUniversities(page);
    await mockPrograms(page, (route) => json(route, none));
    await page.goto("/universities?q=zzz");
    await expect(page.getByText("No programs found.")).toBeVisible();
    await expect(page.getByRole("article")).toHaveCount(0);

    // loading is shown while the request is in flight
    await page.unrouteAll();
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    await mockUniversities(page);
    await mockPrograms(page, async (route, url) => {
      await gate;
      await json(route, programPage(url));
    });
    await page.goto("/universities");
    await expect(page.getByText("Loading programs…")).toBeAttached();
    release();
    await expect(page.getByRole("article")).toHaveCount(12);

    // server error with retry
    await page.unrouteAll();
    let up = false;
    await mockUniversities(page);
    await mockPrograms(page, (route, url) =>
      up
        ? json(route, programPage(url))
        : json(route, apiError(500, "Unexpected error"), 500),
    );
    await page.goto("/universities");
    const results = page.getByRole("region", { name: /results/i });
    await expect(results.getByRole("alert")).toContainText("had a problem");
    await expect(page.getByRole("article")).toHaveCount(0);
    up = true;
    await results.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("article")).toHaveCount(12);

    // malformed 200 is an error, not an empty list
    await page.unrouteAll();
    await mockUniversities(page);
    await mockPrograms(page, (route) => json(route, { unexpected: true }));
    await page.goto("/universities");
    await expect(
      page.getByRole("region", { name: /results/i }).getByRole("alert"),
    ).toBeVisible();
  });

  test("backend unreachable shows an error and never invents programs", async ({
    page,
  }) => {
    await mockUniversities(page);
    await mockPrograms(page, (route) => route.abort("connectionrefused"));
    await page.goto("/universities");
    const alert = page
      .getByRole("region", { name: /results/i })
      .getByRole("alert");
    await expect(alert).toContainText("could not be reached");
    await expect(page.getByRole("article")).toHaveCount(0);
  });
});

test.describe("program details", () => {
  const url = "/programs/synthetic-de-1--program-01";

  test("shows tuition, deadlines and requirements with explicit status", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto(url);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Synthetic Program 01",
    );
    await expect(page.getByText(/last checked 2 Jan 2026/)).toBeVisible();

    const tuition = page.getByRole("region", { name: "Tuition & funding" });
    await tuition
      .locator("details")
      .evaluateAll((els) =>
        els.forEach((e) => ((e as HTMLDetailsElement).open = true)),
      );
    await expect(tuition).toContainText("EUR 1,000");
    await expect(tuition).toContainText("per year");
    await expect(tuition).toContainText("Academic year 2099/2100");
    await expect(tuition).toContainText("International applicants");
    // outdated and period-less fees are labelled, never presented as current
    await expect(tuition).toContainText("EUR 500");
    await expect(tuition.getByText("Outdated").first()).toBeVisible();
    await expect(tuition).toContainText("This period has ended");
    await expect(tuition.getByText("Period not stated").first()).toBeVisible();
    await expect(tuition).toContainText("EUR 250");
    await expect(tuition).toContainText("per semester");
    await expect(tuition).toContainText(
      "Source wording: “Synthetic: fee as printed, no year stated”",
    );
    await expect(tuition).toContainText("Confirm it on the official page");
    // every fact cites its source
    await expect(
      tuition.getByRole("link", { name: /Synthetic source tuition\/1/ }),
    ).toHaveAttribute("href", "https://example.test/tuition/1");

    const deadlines = page.getByRole("region", {
      name: "Deadlines & intakes",
    });
    await expect(deadlines).toContainText("15 Jan 2099");
    await expect(deadlines).toContainText("This deadline has passed");

    // program 01 has no recorded requirements: the page says so instead of staying silent
    const req = page.getByRole("region", { name: "Admissions" });
    await expect(req).toContainText(
      "No admission requirements have been recorded",
    );
    await expect(req).toContainText("does not mean there are none");

    // funding is never invented
    await expect(tuition).toContainText(
      "No verified scholarship or tuition-waiver information",
    );
  });

  test("an unverified application link is never shown as an Apply button", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto(url);
    await expect(
      page.getByRole("link", { name: /Apply on the official page/ }),
    ).toHaveCount(0);
    await expect(page.getByText(/no verified application link/i)).toBeVisible();
    // the informational admissions page is offered instead, clearly labelled
    await expect(
      page.getByRole("link", { name: /Official admissions information/ }),
    ).toHaveAttribute("href", "https://example.test/admissions/1");
  });

  test("key facts come first and never present undated or outdated fees as current", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto(url);
    const facts = page.locator("dl").first();
    await expect(facts).toContainText("Tuition");
    await expect(facts).toContainText("EUR 1,000");
    await expect(facts).toContainText("Next deadline");
    await expect(facts).toContainText("15 Jan 2099");
    await expect(facts).toContainText("Funding");
    await expect(facts).not.toContainText("EUR 500");
    await expect(facts).not.toContainText("EUR 250");
  });

  test("key facts list every current fee with its applicant group and flag other uncertainty", async ({
    page,
  }) => {
    await mockUniversities(page);
    const base = programDetail(PROGRAMS[0]);
    const src = base.tuition[0].source;
    const fee = (over: Record<string, unknown>) => ({
      ...base.tuition[0],
      academicYear: "2099/2100",
      temporalStatus: "CURRENT",
      source: src,
      ...over,
    });
    await mockPrograms(page, (route) =>
      json(route, {
        ...base,
        tuition: [
          fee({ amount: 9000, studentCategory: "DOMESTIC" }),
          fee({ amount: 21000, studentCategory: "INTERNATIONAL" }),
          fee({
            amount: 7,
            studentCategory: "INTERNATIONAL",
            academicYear: null,
            temporalStatus: "UNKNOWN_YEAR",
          }),
        ],
      }),
    );
    await page.goto(url);
    const facts = page.locator("dl").first();
    await expect(facts).toContainText("EUR 9,000");
    await expect(facts).toContainText("Domestic applicants");
    await expect(facts).toContainText("EUR 21,000");
    await expect(facts).toContainText("International applicants");
    await expect(facts).toContainText("The fee depends on the applicant group");
    await expect(facts).toContainText("Another fee has no stated year");
    await expect(facts).not.toContainText("EUR 7");
    // the undated fee's warning is visible without opening any Evidence disclosure
    await expect(
      page.getByText(/The source gives no year for this fee/),
    ).toBeVisible();
  });

  test("section navigation lists only existing sections and jumps to headings", async ({
    page,
    isMobile,
  }) => {
    await mockUniversities(page);
    await page.goto(url);
    const nav = page.getByRole("navigation", { name: "On this page" });
    await expect(nav.getByRole("link")).toHaveText([
      "Overview",
      "Tuition & funding",
      "Admissions",
      "Deadlines",
      "Sources",
    ]);
    await nav.getByRole("link", { name: "Admissions" }).click();
    await expect(page).toHaveURL(/#admissions$/);
    const heading = page.getByRole("heading", { name: "Admissions", level: 2 });
    await expect(heading).toBeInViewport();
    // the sticky header and section navigation must not cover the heading
    const top = await heading.evaluate((e) => e.getBoundingClientRect().top);
    const covered = await nav.evaluate((e) => e.getBoundingClientRect().bottom);
    expect(top).toBeGreaterThanOrEqual(covered - 1);
    void isMobile;
  });

  test("evidence is collapsed by default and opens with the keyboard", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto(url);
    const summary = page
      .locator("details")
      .filter({ hasText: "tuition/1" })
      .locator("summary");
    await expect(summary).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Synthetic source tuition\/1/ }),
    ).toBeHidden();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("link", { name: /Synthetic source tuition\/1/ }),
    ).toBeVisible();
  });

  test("an active, verified apply link is shown with its official destination", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto("/programs/synthetic-de-2--program-02");
    const apply = page.getByRole("link", {
      name: /Apply on the official page/,
    });
    await expect(apply).toHaveAttribute("href", "https://example.test/apply/2");
    await expect(apply).toHaveAttribute("rel", /noopener/);
    const req = page.getByRole("region", { name: "Admissions" });
    await expect(
      req.getByRole("heading", { name: "Language proficiency" }),
    ).toBeVisible();
    await expect(req).toContainText("Synthetic language requirement");
    await expect(req).toContainText("Minimum: 6.5 IELTS overall");
    await expect(
      req.getByRole("heading", { name: "Admission tests" }),
    ).toBeVisible();
    // duration is unknown for program 02
    await expect(page.getByText("Not stated").first()).toBeVisible();
  });

  test("a program without published tuition says so and does not call it free", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto("/programs/synthetic-de-13--program-13");
    const tuition = page.getByRole("region", { name: "Tuition & funding" });
    await expect(tuition).toContainText(
      "No tuition information has been recorded",
    );
    await expect(tuition).toContainText("does not mean it is free");
  });

  test("an unknown program shows a clear not-found state", async ({ page }) => {
    await mockUniversities(page);
    await page.goto("/programs/synthetic-de-1--does-not-exist");
    await expect(page.getByText("We couldn't find this program")).toBeVisible();
    await page.getByRole("link", { name: "Browse programs" }).click();
    await expect(page).toHaveURL(/\/universities$/);
  });

  test("a failing backend shows an error with retry", async ({ page }) => {
    await mockUniversities(page);
    let up = false;
    await mockPrograms(page, (route) =>
      up
        ? json(route, programDetail(PROGRAMS[0]))
        : json(route, apiError(500, "Unexpected error"), 500),
    );
    await page.goto(url);
    await expect(
      page.getByRole("alert").filter({ hasText: "couldn't load" }),
    ).toBeVisible();
    up = true;
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Synthetic Program 01",
    );
  });

  test("breadcrumb and card links connect programs and universities", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto("/universities");
    await page.getByRole("link", { name: "Synthetic Program 03" }).click();
    await expect(page).toHaveURL(/\/programs\/synthetic-de-3--program-03/);
    await page
      .getByRole("link", { name: "Synthetic Test University 03" })
      .first()
      .click();
    await expect(page).toHaveURL(/\/universities\/synthetic-de-3/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Synthetic Test University 03",
    );
    await page.getByRole("link", { name: "Synthetic Program 03" }).click();
    await expect(page).toHaveURL(/\/programs\/synthetic-de-3--program-03/);
  });

  test("the header marks Universities as active on program pages", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "desktop nav");
    await mockUniversities(page);
    await page.goto(url);
    await expect(
      page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "Universities" }),
    ).toHaveAttribute("aria-current", "page");
  });
});

test.describe("university details", () => {
  test("lists the university's programs and links to them", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto("/universities/synthetic-de-1");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Synthetic Test University 01",
    );
    await expect(
      page.getByRole("heading", { name: "Degree programs (1)" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Synthetic Program 01" }).click();
    await expect(page).toHaveURL(/\/programs\/synthetic-de-1--program-01/);
  });

  test("an unknown university shows a clear not-found state", async ({
    page,
  }) => {
    await mockUniversities(page);
    await page.goto("/universities/no-such-university");
    await expect(
      page.getByText("We couldn't find this university"),
    ).toBeVisible();
  });
});

test.describe("accessibility and layout of the new pages", () => {
  const pages = [
    "/universities",
    "/universities?level=master&field=synthetic-arts",
    "/programs/synthetic-de-1--program-01",
    "/programs/synthetic-de-2--program-02",
    "/universities/synthetic-de-1",
  ];
  for (const scheme of ["light", "dark"] as const) {
    for (const path of pages) {
      test(`no axe violations on ${path} (${scheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await mockUniversities(page);
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.getByText(/^Loading/)).toHaveCount(0);
        await page.waitForTimeout(500);
        const results = await new AxeBuilder({ page }).analyze();
        expect(
          results.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`),
        ).toEqual([]);
      });
    }
  }

  for (const width of [360, 390, 768, 1280]) {
    test(`no horizontal overflow on program detail at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await mockUniversities(page);
      await page.goto("/programs/synthetic-de-1--program-01");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("filters are usable with the keyboard", async ({ page }) => {
    await mockUniversities(page);
    await page.goto("/universities");
    await page.getByRole("combobox", { name: "Degree level" }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(page).toHaveURL(/level=/);
  });
});
