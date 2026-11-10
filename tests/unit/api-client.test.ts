import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiGet, buildQuery } from "@/lib/api/client";
import { listUniversities } from "@/lib/api/universities";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("buildQuery", () => {
  it("skips undefined values and empty arrays, joins arrays", () => {
    expect(buildQuery()).toBe("");
    expect(buildQuery({ page: 0, search: undefined, countryCodes: [] })).toBe(
      "?page=0",
    );
    expect(buildQuery({ countryCodes: ["PL", "DE"], size: 20 })).toBe(
      "?countryCodes=PL%2CDE&size=20",
    );
  });
});

describe("apiGet", () => {
  it("fails clearly when no backend is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(apiGet("/api/x")).rejects.toMatchObject({ status: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requests the configured origin and returns parsed JSON", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test/");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [],
          number: 0,
          size: 20,
          totalElements: 0,
          totalPages: 0,
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const page = await listUniversities({ countryCodes: ["PL"], page: 0 });
    expect(page.totalElements).toBe(0);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.test/api/universities?countryCodes=PL&page=0",
    );
  });

  it("throws ApiError with the backend message on non-2xx", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: 404, message: "Not found" }), {
          status: 404,
        }),
      ),
    );
    const err = await apiGet("/api/x").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 404, message: "Not found" });
  });
});
