import { expect, test } from "@playwright/test";
test("records local production loading and runtime errors", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".hero-art")).toHaveCSS("opacity", "1");
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    const scripts = (
      performance.getEntriesByType("resource") as PerformanceResourceTiming[]
    ).filter((r) => r.initiatorType === "script");
    return {
      context: "Local Chromium production run; not field Core Web Vitals",
      domContentLoadedMs: navigation.domContentLoadedEventEnd,
      responseMs: navigation.responseEnd,
      scriptTransferBytes: scripts.reduce((n, r) => n + r.transferSize, 0),
      scriptDecodedBytes: scripts.reduce((n, r) => n + r.decodedBodySize, 0),
      scriptRequests: scripts.length,
    };
  });
  await testInfo.attach("local-loading.json", {
    body: JSON.stringify(metrics, null, 2),
    contentType: "application/json",
  });
  console.log(JSON.stringify(metrics));
  expect(errors).toEqual([]);
});
