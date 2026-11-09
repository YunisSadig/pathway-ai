"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapPin, Search, X } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { UNIVERSITIES } from "@/data/universities";
import { REGION_LABEL, type Region } from "@/lib/domain/types";
import { useStore } from "@/lib/store";
import { CompareButton, SaveButton } from "./university-actions";

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Explorer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const store = useStore();

  const q = params.get("q") ?? "";
  const region = params.get("region") ?? "";
  const country = params.get("country") ?? "";
  const sort = params.get("sort") ?? "name";
  const onlySaved = params.get("saved") === "1";

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "region") next.delete("country");
    router.replace(next.toString() ? `${pathname}?${next}` : pathname, {
      scroll: false,
    });
  };
  const clear = () => router.replace(pathname, { scroll: false });
  const filtered = q || region || country || onlySaved;

  const countries = useMemo(
    () =>
      [
        ...new Set(
          UNIVERSITIES.filter((u) => !region || u.region === region).map(
            (u) => u.country,
          ),
        ),
      ].sort(),
    [region],
  );

  const results = useMemo(() => {
    const nq = norm(q.trim());
    return UNIVERSITIES.filter(
      (u) =>
        (!region || u.region === region) &&
        (!country || u.country === country) &&
        (!onlySaved || store.savedUniversities.includes(u.id)) &&
        (!nq || norm(`${u.name} ${u.city} ${u.country}`).includes(nq)),
    ).sort((a, b) =>
      sort === "country"
        ? a.country.localeCompare(b.country) || a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name),
    );
  }, [q, region, country, sort, onlySaved, store.savedUniversities]);

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]"
      >
        <Field
          label="Search"
          htmlFor="uni-q"
          className="sm:col-span-2 lg:col-span-1"
        >
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <TextInput
              id="uni-q"
              type="search"
              value={q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Name, city or country"
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Region" htmlFor="uni-region">
          <SelectInput
            id="uni-region"
            value={region}
            onChange={(e) => set("region", e.target.value)}
          >
            <option value="">All regions</option>
            {(Object.keys(REGION_LABEL) as Region[]).map((r) => (
              <option key={r} value={r}>
                {REGION_LABEL[r]}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Country" htmlFor="uni-country">
          <SelectInput
            id="uni-country"
            value={country}
            onChange={(e) => set("country", e.target.value)}
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Sort by" htmlFor="uni-sort">
          <SelectInput
            id="uni-sort"
            value={sort}
            onChange={(e) =>
              set("sort", e.target.value === "name" ? "" : e.target.value)
            }
          >
            <option value="name">Name (A to Z)</option>
            <option value="country">Country</option>
          </SelectInput>
        </Field>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-sm text-muted-foreground">
          Showing <strong className="text-foreground">{results.length}</strong>{" "}
          of {UNIVERSITIES.length} universities
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={onlySaved ? "secondary" : "outline"}
            size="sm"
            aria-pressed={onlySaved}
            onClick={() => set("saved", onlySaved ? "" : "1")}
          >
            Saved only ({store.savedUniversities.length})
          </Button>
          {filtered ? (
            <Button variant="ghost" size="sm" onClick={clear}>
              <X aria-hidden /> Clear filters
            </Button>
          ) : null}
          {store.compare.length > 0 ? (
            <Button asChild size="sm">
              <Link href="/compare">Compare ({store.compare.length})</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-6 card p-8 text-center">
          <p className="font-semibold">No universities match these filters.</p>
          <p className="mt-1 text-muted-foreground">
            {onlySaved && store.savedUniversities.length === 0
              ? "You have not saved any universities yet."
              : "Try a different spelling or remove a filter."}
          </p>
          <Button className="mt-4" variant="outline" onClick={clear}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((u) => (
            <li key={u.id} className="flex flex-col card p-5">
              <h2 className="text-lg leading-snug font-bold">
                <Link
                  href={`/universities/${u.slug}`}
                  className="hover:underline focus-visible:underline"
                >
                  {u.name}
                </Link>
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin aria-hidden className="size-4 shrink-0" />
                {u.city}, {u.country}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                <li>
                  <StatusBadge status="verified">Website checked</StatusBadge>
                </li>
                <li>
                  <StatusBadge status="unknown">
                    Programs not assessed
                  </StatusBadge>
                </li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <Button asChild size="sm">
                  <Link
                    href={`/universities/${u.slug}`}
                    aria-label={`View details ${u.name}`}
                  >
                    View details
                  </Link>
                </Button>
                <SaveButton id={u.id} name={u.name} />
                <CompareButton id={u.id} name={u.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
