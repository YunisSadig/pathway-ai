"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DestinationPicker } from "@/components/shared/destination-picker";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { API_NOT_CONFIGURED } from "@/lib/api/client";
import { resolveSelection, selectionLabel } from "@/lib/geography";
import {
  countryFilter,
  resolveView,
  toApiQuery,
  universitiesHref,
} from "@/lib/university-query";
import { UniversityList } from "./university-list";
import { UniversityPagination } from "./university-pagination";
import { UniversityToolbar } from "./university-toolbar";
import { useUniversities } from "./use-universities";

/** Geographic discovery backed by the university API. Every filter lives in the URL. */
export function UniversitiesExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const selection = resolveSelection(
    params.get("region"),
    params.get("country"),
  );
  const label = selectionLabel(selection);
  const base = {
    region: selection.region?.id,
    country: selection.country?.slug,
  };

  const view = resolveView((n) => params.get(n));
  const country = countryFilter((n) => params.get(n));
  const pending = country === "pending";
  const query = useMemo(
    () => (pending ? null : toApiQuery(view, country)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pending, country, view.q, view.page, view.sort, view.direction],
  );
  const { state, retry } = useUniversities(query);

  return (
    <div className="grid gap-8">
      <DestinationPicker basePath="/universities" />
      {pending ? null : (
        <UniversityToolbar
          view={view}
          onChange={(next) =>
            router.push(universitiesHref(base, { ...view, ...next, page: 1 }), {
              scroll: false,
            })
          }
        />
      )}
      <section aria-labelledby="results-title" aria-live="polite">
        <h2 id="results-title" className="sr-only">
          Results
        </h2>
        {pending ? (
          <EmptyState
            title="Choose a member state"
            description="The European Union is made up of 27 countries, each with its own universities and rules. Pick one above to see its universities."
          />
        ) : state === null || state.status === "loading" ? (
          <LoadingState label="Loading universities" />
        ) : state.status === "error" ? (
          <ErrorState
            title={
              state.error.message === API_NOT_CONFIGURED
                ? "The university service isn't configured"
                : "We couldn't load universities"
            }
            description={errorDescription(
              state.error.status,
              state.error.message,
            )}
            onRetry={
              state.error.message === API_NOT_CONFIGURED ? undefined : retry
            }
          />
        ) : state.page.content.length === 0 ? (
          <NoResults
            label={label}
            q={view.q}
            beyondLastPage={state.page.totalElements > 0}
            base={base}
          />
        ) : (
          <div className="grid gap-5">
            <p className="text-sm text-muted-foreground">
              {state.page.totalElements}{" "}
              {state.page.totalElements === 1 ? "university" : "universities"}
              {label ? ` in ${label}` : ""}
              {view.q ? ` matching “${view.q}”` : ""}
            </p>
            <UniversityList universities={state.page.content} />
            <UniversityPagination
              page={state.page.number + 1}
              totalPages={state.page.totalPages}
              hrefFor={(page) => universitiesHref(base, { ...view, page })}
            />
            <p className="text-sm text-muted-foreground">
              Tuition, admission requirements and source verification are not
              provided yet, so they are not shown.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function errorDescription(status: number, message: string): string {
  if (message === API_NOT_CONFIGURED)
    return "Set NEXT_PUBLIC_API_BASE_URL to the backend address and restart the app.";
  if (status === 0)
    return "The university service could not be reached. Check your connection and try again.";
  if (status === 400)
    return "The search was not accepted. Adjust it and try again.";
  return "The university service had a problem. Please try again in a moment.";
}

function NoResults({
  label,
  q,
  beyondLastPage,
  base,
}: {
  label: string | null;
  q: string;
  beyondLastPage: boolean;
  base: { region?: string | null; country?: string | null };
}) {
  const filtered = Boolean(q || label);
  return (
    <EmptyState
      title={
        beyondLastPage
          ? "That page doesn't exist"
          : filtered
            ? `No universities found${label ? ` for ${label}` : ""}${q ? ` matching “${q}”` : ""}.`
            : "No universities have been added yet."
      }
      description={
        beyondLastPage
          ? "There are fewer pages of results than that."
          : filtered
            ? "Nothing is listed for this search yet. Listings only include universities whose information has been checked against official sources."
            : "Nothing is listed until it has been checked against official sources."
      }
    >
      {beyondLastPage || q ? (
        <Button asChild variant="outline">
          <Link href={universitiesHref(base, {})} scroll={false}>
            {beyondLastPage ? "Go to the first page" : "Clear search"}
          </Link>
        </Button>
      ) : null}
      {label ? (
        <Button asChild variant="outline">
          <Link href="/universities" scroll={false}>
            View all destinations
          </Link>
        </Button>
      ) : null}
    </EmptyState>
  );
}
