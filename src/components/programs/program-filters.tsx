"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CURRENCIES,
  LEVELS,
  MAX_SEARCH_LENGTH,
  type DiscoveryParams,
} from "@/lib/discovery-query";
import { DEGREE_LABELS, languageName } from "@/lib/format";
import type { ProgramDegreeLevel } from "@/types/program";

const control =
  "h-11 w-full rounded-lg border border-border-strong bg-surface px-3 text-sm text-foreground";
const label = "grid gap-1 text-sm font-semibold";

export interface Facets {
  fields: { slug: string; name: string }[];
  languages: string[];
}

type Props = {
  params: DiscoveryParams;
  facets: Facets;
  clearHref: string;
  onChange: (next: Partial<DiscoveryParams>) => void;
};

/** Program filters. Every value lives in the URL; text fields apply on submit, selects apply at once. */
export function ProgramFilters(props: Props) {
  // Re-mounts when URL-driven text values change (back button, clear filters).
  const key = `${props.params.q}|${props.params.tuitionMax ?? ""}|${props.params.currency}`;
  return <FiltersForm key={key} {...props} />;
}

function FiltersForm({ params, facets, clearHref, onChange }: Props) {
  const [q, setQ] = useState(params.q);
  const [max, setMax] = useState(
    params.tuitionMax ? String(params.tuitionMax) : "",
  );
  const [currency, setCurrency] = useState(params.currency);
  const active = Boolean(
    params.q ||
    params.level ||
    params.field ||
    params.language ||
    params.tuitionMax,
  );

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
    <form
      role="search"
      aria-label="Filter programs"
      className="grid gap-4"
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
      <div className="flex flex-wrap items-end gap-3">
        <label className={`${label} min-w-0 flex-1 sm:min-w-64`}>
          Program name
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
        <Button type="submit">
          <Search aria-hidden /> Apply filters
        </Button>
        {active ? (
          <Button asChild variant="outline">
            <Link href={clearHref} scroll={false}>
              <X aria-hidden /> Clear filters
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold">
          Maximum tuition per year
        </legend>
        <div className="flex flex-wrap items-center gap-3">
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
            className={`${control} sm:w-44`}
          />
          <label className="sr-only" htmlFor="tuition-currency">
            Currency
          </label>
          <select
            id="tuition-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={`${control} sm:w-28`}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-muted-foreground">
          Only programs with a current published yearly fee in that currency are
          matched. Programs whose fee is missing, outdated or has no stated
          period cannot be compared, so they are left out of price-filtered
          results.
        </p>
      </fieldset>
    </form>
  );
}
