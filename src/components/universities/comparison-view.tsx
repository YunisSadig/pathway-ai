"use client";

import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, SelectInput } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { UNIVERSITIES, UNIVERSITY_BY_SLUG } from "@/data/universities";
import { assess } from "@/lib/domain/evaluate";
import { REGION_LABEL } from "@/lib/domain/types";
import { actions, useStore } from "@/lib/store";

const Unknown = () => <StatusBadge status="unknown">Not verified</StatusBadge>;

export function ComparisonView() {
  const store = useStore();
  const [pick, setPick] = useState("");
  const unis = store.compare
    .map((id) => UNIVERSITY_BY_SLUG.get(id))
    .filter((u) => u !== undefined);
  const options = UNIVERSITIES.filter((u) => !store.compare.includes(u.id));

  const rows: {
    label: string;
    cell: (u: (typeof unis)[number]) => React.ReactNode;
  }[] = [
    { label: "Location", cell: (u) => `${u.city}, ${u.country}` },
    { label: "Region", cell: (u) => REGION_LABEL[u.region] },
    { label: "Degree programs", cell: () => <Unknown /> },
    { label: "Language of instruction", cell: () => <Unknown /> },
    { label: "Tuition", cell: () => <Unknown /> },
    { label: "Admission requirements", cell: () => <Unknown /> },
    {
      label: "Country-level scholarships",
      cell: (u) => {
        const n = SCHOLARSHIPS.filter(
          (s) =>
            s.country === u.country ||
            (s.country === "European Union" && u.region === "EU"),
        ).length;
        return n ? `${n} listed` : "None listed yet";
      },
    },
    {
      label: "Destination preference",
      cell: (u) =>
        assess(store.profile, u).find((d) => d.key === "preference")!.summary,
    },
    {
      label: "Official website",
      cell: (u) => (
        <a
          href={u.website}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Open<span className="sr-only"> {u.name} (new tab)</span>
        </a>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        {store.compare.length < 3 ? (
          <>
            <Field
              label="Add a university"
              htmlFor="cmp-add"
              className="w-full max-w-sm"
            >
              <SelectInput
                id="cmp-add"
                value={pick}
                onChange={(e) => setPick(e.target.value)}
              >
                <option value="">Choose…</option>
                {options.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Button
              disabled={!pick}
              onClick={() => {
                actions.toggleCompare(pick);
                setPick("");
              }}
            >
              Add
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            You are comparing 3, the maximum. Remove one to add another.
          </p>
        )}
      </div>

      {unis.length === 0 ? (
        <div className="mt-6 card p-8 text-center">
          <p className="font-semibold">Nothing to compare yet.</p>
          <p className="mt-1 text-muted-foreground">
            Add two or three universities above, or press Compare on any
            university.
          </p>
          <Button asChild className="mt-4">
            <Link href="/universities">Browse universities</Link>
          </Button>
        </div>
      ) : (
        <>
          {unis.length === 1 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Add at least one more to compare.
            </p>
          ) : null}
          <div
            role="region"
            aria-label="Comparison table"
            tabIndex={0}
            className="mt-6 overflow-x-auto rounded-xl border border-border"
          >
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-muted">
                  <th scope="col" className="w-40 p-3 font-semibold">
                    <span className="sr-only">Criterion</span>
                  </th>
                  {unis.map((u) => (
                    <th key={u.id} scope="col" className="p-3 align-top">
                      <Link
                        href={`/universities/${u.slug}`}
                        className="font-bold underline"
                      >
                        {u.name}
                      </Link>
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 -ml-3"
                          aria-label={`Remove ${u.name} from comparison`}
                          onClick={() => actions.toggleCompare(u.id)}
                        >
                          <X aria-hidden /> Remove
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-border">
                    <th scope="row" className="p-3 font-semibold">
                      {r.label}
                    </th>
                    {unis.map((u) => (
                      <td key={u.id} className="p-3 align-top">
                        {r.cell(u)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Scroll sideways on small screens. Unverified rows are not filled in.
          </p>
        </>
      )}
    </div>
  );
}
