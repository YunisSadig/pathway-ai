"use client";

import Link from "next/link";
import { useState } from "react";
import { ListFilter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CURRENCIES,
  discoveryHref,
  LEVELS,
  MAX_SEARCH_LENGTH,
  type DiscoveryParams,
} from "@/lib/discovery-query";
import { DEGREE_LABELS, languageName } from "@/lib/format";
import type { ProgramDegreeLevel } from "@/types/program";

const controlBase =
  "h-11 rounded-lg border border-border-strong bg-surface px-3 text-sm text-foreground";
const control = `${controlBase} w-full`;
const label = "grid gap-1 text-sm font-medium";

export interface Facets {
  fields: { slug: string; name: string }[];
  languages: string[];
}

type Base = { region?: string | null; country?: string | null };

type Props = {
  params: DiscoveryParams;
  base: Base;
  facets: Facets;
  clearHref: string;
  onChange: (next: Partial<DiscoveryParams>) => void;
};

/** Program filters. Every value lives in the URL; text fields apply on submit, selects apply at once. */
export function ProgramFilters(props: Props) {
  const { level, field, language, tuitionMax } = props.params;
  // Collapsed behind a button on narrow screens unless a filter is already active; always open from lg up.
  // Held here, not in the keyed form, so applying a search does not collapse the panel again.
  const [open, setOpen] = useState(
    Boolean(level || field || language || tuitionMax),
  );
  // The form re-mounts when URL-driven text values change (back button, clear filters).
  const key = `${props.params.q}|${props.params.tuitionMax ?? ""}|${props.params.currency}`;
  return <FiltersForm key={key} {...props} open={open} setOpen={setOpen} />;
}

/** One removable chip per active filter: what is applied, and a link that undoes just that one. */
function ActiveFilters({
  params,
  base,
  facets,
  clearHref,
}: Pick<Props, "params" | "base" | "facets" | "clearHref">) {
  const without = (patch: Partial<DiscoveryParams>) =>
    discoveryHref(base, { ...params, ...patch, page: 1 });
  const chips: { key: string; text: string; href: string }[] = [];
  if (params.q)
    chips.push({ key: "q", text: `“${params.q}”`, href: without({ q: "" }) });
  if (params.level)
    chips.push({
      key: "level",
      text: DEGREE_LABELS[params.level.toUpperCase() as ProgramDegreeLevel],
      href: without({ level: null }),
    });
  if (params.field)
    chips.push({
      key: "field",
      text:
        facets.fields.find((f) => f.slug === params.field)?.name ??
        params.field,
      href: without({ field: null }),
    });
  if (params.language)
    chips.push({
      key: "language",
      text: languageName(params.language),
      href: without({ language: null }),
    });
  if (params.tuitionMax)
    chips.push({
      key: "tuition",
      text: `Up to ${params.currency} ${params.tuitionMax.toLocaleString("en")} per year`,
      href: without({ tuitionMax: null }),
    });
  if (chips.length === 0) return null;
  return (
    <ul
      aria-label="Active filters"
      className="flex flex-wrap items-center gap-2"
    >
      {chips.map((c) => (
        <li key={c.key}>
          <Link
            href={c.href}
            scroll={false}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 text-sm font-medium transition-colors hover:bg-hover"
          >
            {c.text}
            <X aria-hidden className="size-3.5" />
            <span className="sr-only">Remove filter</span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={clearHref}
          scroll={false}
          className="inline-flex min-h-9 items-center px-2 text-sm font-semibold text-primary-soft-foreground underline underline-offset-4 hover:no-underline"
        >
          Clear filters
        </Link>
      </li>
    </ul>
  );
}

function FiltersForm({
  params,
  base,
  facets,
  clearHref,
  onChange,
  open,
  setOpen,
}: Props & {
  open: boolean;
  setOpen: (next: (v: boolean) => boolean) => void;
}) {
  const [q, setQ] = useState(params.q);
  const [max, setMax] = useState(
    params.tuitionMax ? String(params.tuitionMax) : "",
  );
  const [currency, setCurrency] = useState(params.currency);
  const activeCount = [
    params.level,
    params.field,
    params.language,
    params.tuitionMax,
  ].filter(Boolean).length;
  // Keep a value from the URL selectable even when the facet list has not loaded or lacks it.
  const fields = [...facets.fields];
  if (params.field && !fields.some((f) => f.slug === params.field)) {
    fields.push({ slug: params.field, name: params.field });
  }
  const languages = [...facets.languages];
  if (params.language && !languages.includes(params.language)) {
    languages.push(params.language);
  }

  return (
    <div className="grid gap-3">
      <form
        role="search"
        aria-label="Filter programs"
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const value = Number(max);
          onChange({
            q: q.trim(),
            tuitionMax: Number.isFinite(value) && value > 0 ? value : null,
            currency,
          });
        }}
      >
        <div className="flex gap-2">
          <label className="grid min-w-0 flex-1 gap-1 text-sm font-medium">
            <span className="sr-only lg:not-sr-only">Program name</span>
            <input
              type="search"
              name="q"
              value={q}
              maxLength={MAX_SEARCH_LENGTH}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by program name"
              className={control}
            />
          </label>
          <Button type="submit" className="mt-auto h-11 shrink-0">
            <Search aria-hidden /> Apply filters
          </Button>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="program-filter-fields"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-11 items-center justify-between gap-2 rounded-lg border border-border-strong bg-surface px-3 text-sm font-semibold lg:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <ListFilter aria-hidden className="size-4" />
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </span>
          <span aria-hidden className="text-muted-foreground">
            {open ? "Hide" : "Show"}
          </span>
        </button>

        <div
          id="program-filter-fields"
          className={`${open ? "grid" : "hidden"} gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-5`}
        >
          <label className={label}>
            Degree level
            <select
              value={params.level ?? ""}
              onChange={(e) =>
                onChange({ level: (e.target.value || null) as never })
              }
              className={control}
            >
              <option value="">Any level</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {DEGREE_LABELS[l.toUpperCase() as ProgramDegreeLevel]}
                </option>
              ))}
            </select>
          </label>
          <label className={label}>
            Discipline
            <select
              value={params.field ?? ""}
              onChange={(e) => onChange({ field: e.target.value || null })}
              className={control}
            >
              <option value="">Any discipline</option>
              {fields.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <label className={label}>
            Teaching language
            <select
              value={params.language ?? ""}
              onChange={(e) => onChange({ language: e.target.value || null })}
              className={control}
            >
              <option value="">Any language</option>
              {languages.map((l) => (
                <option key={l} value={l}>
                  {languageName(l)}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="grid min-w-0 grid-cols-1 gap-1">
            <legend className="mb-1 text-sm font-medium">
              Maximum tuition per year
            </legend>
            <div className="flex gap-2">
              <label className="sr-only" htmlFor="tuition-max">
                Maximum yearly tuition
              </label>
              <input
                id="tuition-max"
                type="number"
                inputMode="numeric"
                min={1}
                step="any"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="e.g. 15000"
                className={`${controlBase} w-0 min-w-0 flex-1`}
              />
              <label className="sr-only" htmlFor="tuition-currency">
                Currency
              </label>
              <select
                id="tuition-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`${controlBase} w-[5.5rem] shrink-0`}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          <label className={label}>
            Sort by
            <select
              value={`${params.sort}:${params.direction}`}
              onChange={(e) => {
                const [sort, direction] = e.target.value.split(":");
                onChange({
                  sort,
                  direction: direction as DiscoveryParams["direction"],
                });
              }}
              className={control}
            >
              <option value="name:asc">Program name (A–Z)</option>
              <option value="name:desc">Program name (Z–A)</option>
              <option value="university:asc">University (A–Z)</option>
              <option value="university:desc">University (Z–A)</option>
              <option value="level:asc">Degree level</option>
            </select>
          </label>
        </div>

        {max || params.tuitionMax ? (
          <p className="text-sm text-muted-foreground">
            Only programs with a current published yearly fee in that currency
            are matched. Programs whose fee is missing, outdated or has no
            stated period cannot be compared, so they are left out of
            price-filtered results.
          </p>
        ) : null}
      </form>

      <ActiveFilters
        params={params}
        base={base}
        facets={facets}
        clearHref={clearHref}
      />
    </div>
  );
}
