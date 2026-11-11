import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiGet, buildQuery } from "@/lib/api/client";
import { getProgram, listPrograms } from "@/lib/api/programs";
import { getUniversity, listUniversities } from "@/lib/api/universities";

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
    const page = await listUniversities({
      country: "PL",
      q: "tech",
      page: 0,
      size: 12,
      sort: "city",
      direction: "desc",
    });
    expect(page.totalElements).toBe(0);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.test/api/v1/universities?country=PL&q=tech&page=0&size=12&sort=city&direction=desc",
    );
  });

  it("reports an unreachable backend as ApiError status 0", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("fetch failed")),
    );
    await expect(listUniversities()).rejects.toMatchObject({
      status: 0,
      message: "The data service could not be reached.",
    });
  });

  it("rethrows aborts instead of reporting a failure", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("aborted", "AbortError")),
    );
    const err = await listUniversities().catch((e) => e);
    expect(err).not.toBeInstanceOf(ApiError);
    expect(err.name).toBe("AbortError");
  });

  it("uses the backend ApiError body (400 with violations)", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            timestamp: "2000-01-01T00:00:00Z",
            status: 400,
            error: "Bad Request",
            message: "Invalid request parameters",
            path: "/api/v1/universities",
            violations: [
              { field: "size", message: "must be between 1 and 100" },
            ],
          }),
          { status: 400 },
        ),
      ),
    );
    await expect(listUniversities({ size: 0 })).rejects.toMatchObject({
      status: 400,
      message: "Invalid request parameters",
    });
  });

  it("falls back to the status text when the error body is not JSON", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Invalid CORS request", {
          status: 403,
          statusText: "Forbidden",
        }),
      ),
    );
    await expect(listUniversities()).rejects.toMatchObject({
      status: 403,
      message: "Forbidden",
    });
  });

  it("encodes the slug for the detail endpoint", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    await getUniversity("a b");
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.test/api/v1/universities/a%20b",
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

describe("program endpoints", () => {
  it("lists programs with filters on /api/v1/programs", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    await listPrograms({
      level: "master",
      field: "economics",
      language: "en",
      country: "FI",
      tuitionMax: 15000,
      tuitionCurrency: "EUR",
      page: 1,
      size: 12,
      sort: "university",
      direction: "desc",
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.test/api/v1/programs?level=master&field=economics&language=en&country=FI&tuitionMax=15000&tuitionCurrency=EUR&page=1&size=12&sort=university&direction=desc",
    );
  });

  it("encodes the program identifier for the detail endpoint", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    await getProgram("uni--prog");
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.test/api/v1/programs/uni--prog",
    );
  });

  it("surfaces a 404 as ApiError with the backend message", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({ status: 404, message: "Program not found: x--y" }),
            { status: 404 },
          ),
        ),
    );
    await expect(getProgram("x--y")).rejects.toMatchObject({
      status: 404,
      message: "Program not found: x--y",
    });
  });
});
