"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { API_NOT_CONFIGURED } from "@/lib/api/client";
import { listUniversities } from "@/lib/api/universities";
import {
  discoveryHref,
  toUniversitiesQuery,
  type DiscoveryParams,
} from "@/lib/discovery-query";
import { useApiQuery } from "@/lib/use-api-query";
import type { Page } from "@/types/api";
import type { UniversitySummary } from "@/types/university";
import { UniversityList } from "./university-list";
import { UniversityPagination } from "./university-pagination";
import { UniversityToolbar } from "./university-toolbar";

type Base = { region?: string | null; country?: string | null };

export function UniversitiesPanel({
  params,
  country,
  base,
  label,
  onChange,
}: {
  params: DiscoveryParams;
  country: string | null;
  base: Base;
  label: string | null;
  onChange: (next: Partial<DiscoveryParams>) => void;
}) {
  const query = useMemo(
    () => toUniversitiesQuery(params, country),
    [params, country],
  );
  const { state, retry } = useApiQuery<Page<UniversitySummary>>(
    JSON.stringify(query),
    (signal) => listUniversities(query, { signal }),
    (page) => Array.isArray(page?.content),
  );
  const home = discoveryHref(base, { view: "universities" });

  return (
    <div className="grid gap-6">
      <UniversityToolbar view={params} onChange={onChange} />
      <section
        aria-labelledby="results-title"
        aria-live="polite"
        className="min-h-[75vh]"
      >
        <h2 id="results-title" className="sr-only">
          University results
        </h2>
        {state === null || state.status === "loading" ? (
          <LoadingState label="Loading universities" />
        ) : state.status === "error" ? (
          <ErrorState
            title={
              state.error.message === API_NOT_CONFIGURED
                ? "The university service isn't configured"
                : "We couldn't load universities"
            }
            description={
              state.error.message === API_NOT_CONFIGURED
                ? "Set NEXT_PUBLIC_API_BASE_URL to the backend address and restart the app."
                : state.error.status === 0
                  ? "The university service could not be reached. Check your connection and try again."
                  : state.error.status === 400
                    ? "The search was not accepted. Adjust it and try again."
                    : "The university service had a problem. Please try again in a moment."
            }
            onRetry={
              state.error.message === API_NOT_CONFIGURED ? undefined : retry
            }
          />
        ) : state.data.content.length === 0 ? (
          <EmptyState
            title={
              state.data.totalElements > 0
                ? "That page doesn't exist"
                : params.q || label
                  ? `No universities found${label ? ` for ${label}` : ""}${params.q ? ` matching “${params.q}”` : ""}.`
                  : "No universities have been added yet."
            }
            description={
              state.data.totalElements > 0
                ? "There are fewer pages of results than that."
                : "Nothing is listed until it has been checked against official sources."
            }
          >
            {state.data.totalElements > 0 || params.q ? (
              <Button asChild variant="outline">
                <Link href={home} scroll={false}>
                  {state.data.totalElements > 0
                    ? "Go to the first page"
                    : "Clear search"}
                </Link>
              </Button>
            ) : null}
            {label ? (
              <Button asChild variant="outline">
                <Link href="/universities?view=universities" scroll={false}>
                  View all destinations
                </Link>
              </Button>
            ) : null}
          </EmptyState>
        ) : (
          <div className="grid gap-5">
            <p className="font-semibold">
              {state.data.totalElements}{" "}
              {state.data.totalElements === 1 ? "university" : "universities"}
              {label ? ` in ${label}` : ""}
              {params.q ? ` matching “${params.q}”` : ""}
            </p>
            <UniversityList universities={state.data.content} />
            <UniversityPagination
              page={state.data.number + 1}
              totalPages={state.data.totalPages}
              hrefFor={(page) => discoveryHref(base, { ...params, page })}
            />
          </div>
        )}
      </section>
    </div>
  );
}
