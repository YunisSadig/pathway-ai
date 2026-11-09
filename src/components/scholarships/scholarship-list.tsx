"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { DEGREE_LABEL, type DegreeLevel } from "@/lib/domain/types";
import { actions, useStore } from "@/lib/store";

export function SaveScholarship({
  id,
  name,
  size = "sm",
}: {
  id: string;
  name: string;
  size?: "sm" | "md";
}) {
  const saved = useStore().savedScholarships.includes(id);
  const Icon = saved ? BookmarkCheck : Bookmark;
  return (
    <Button
      variant={saved ? "secondary" : "outline"}
      size={size}
      aria-pressed={saved}
      aria-label={`${saved ? "Saved" : "Save"} ${name}`}
      onClick={() => actions.toggleSavedScholarship(id)}
    >
      <Icon aria-hidden className="size-4" />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}

export function ScholarshipList() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<"" | DegreeLevel>("");
  const [country, setCountry] = useState("");
  const countries = [...new Set(SCHOLARSHIPS.map((s) => s.country))].sort();

  const results = (() => {
    const nq = q.trim().toLowerCase();
    return SCHOLARSHIPS.filter(
      (s) =>
        (!level || s.levels.includes(level)) &&
        (!country || s.country === country) &&
        (!nq ||
          `${s.name} ${s.sponsor} ${s.country}`.toLowerCase().includes(nq)),
    );
  })();
  const filtered = q || level || country;

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-4 sm:grid-cols-3"
      >
        <Field label="Search" htmlFor="sch-q">
          <TextInput
            id="sch-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name or sponsor"
          />
        </Field>
        <Field label="Degree level" htmlFor="sch-level">
          <SelectInput
            id="sch-level"
            value={level}
            onChange={(e) => setLevel(e.target.value as "" | DegreeLevel)}
          >
            <option value="">All levels</option>
            {(Object.keys(DEGREE_LABEL) as DegreeLevel[]).map((l) => (
              <option key={l} value={l}>
                {DEGREE_LABEL[l]}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Country" htmlFor="sch-country">
          <SelectInput
            id="sch-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
        </Field>
      </form>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p role="status" className="text-sm text-muted-foreground">
          Showing <strong className="text-foreground">{results.length}</strong>{" "}
          of {SCHOLARSHIPS.length} scholarships
        </p>
        {filtered ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQ("");
              setLevel("");
              setCountry("");
            }}
          >
            Clear filters
          </Button>
        ) : null}
      </div>
      {results.length === 0 ? (
        <div className="mt-6 card p-8 text-center">
          <p className="font-semibold">No scholarships match.</p>
          <p className="mt-1 text-muted-foreground">
            Try another degree level or country.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {results.map((s) => (
            <li key={s.id} className="flex flex-col card p-5">
              <h2 className="text-lg font-bold">
                <Link
                  href={`/scholarships/${s.slug}`}
                  className="hover:underline"
                >
                  {s.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {s.sponsor} · {s.country}
              </p>
              <p className="mt-3 text-sm">
                <span className="font-semibold">For: </span>
                {s.levels.map((l) => DEGREE_LABEL[l]).join(", ")}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {s.nomination ? (
                  <li>
                    <StatusBadge status="unmet">
                      Nomination required
                    </StatusBadge>
                  </li>
                ) : null}
                <li>
                  <StatusBadge status="unknown">
                    Deadline not verified
                  </StatusBadge>
                </li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <Button asChild size="sm">
                  <Link
                    href={`/scholarships/${s.slug}`}
                    aria-label={`View scholarship ${s.name}`}
                  >
                    View scholarship
                  </Link>
                </Button>
                <SaveScholarship id={s.id} name={s.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
