"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { UNIVERSITY_BY_SLUG } from "@/data/universities";
import { useStore } from "@/lib/store";
import {
  CompareButton,
  SaveButton,
} from "@/components/universities/university-actions";
import { SaveScholarship } from "@/components/scholarships/scholarship-list";

export function SavedView() {
  const store = useStore();
  const unis = store.savedUniversities
    .map((id) => UNIVERSITY_BY_SLUG.get(id))
    .filter((u) => u !== undefined);
  const schs = store.savedScholarships
    .map((id) => SCHOLARSHIPS.find((s) => s.id === id))
    .filter((s) => s !== undefined);

  return (
    <div className="grid gap-8">
      <section aria-labelledby="saved-unis">
        <h2 id="saved-unis" className="text-xl font-bold">
          Universities ({unis.length})
        </h2>
        {unis.length === 0 ? (
          <div className="mt-3 card p-6">
            <p className="text-muted-foreground">No saved universities yet.</p>
            <Button asChild className="mt-3">
              <Link href="/universities">Browse universities</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-3 grid gap-3">
            {unis.map((u) => (
              <li
                key={u.id}
                className="flex flex-wrap items-center justify-between gap-3 card p-4"
              >
                <div>
                  <Link
                    href={`/universities/${u.slug}`}
                    className="font-bold underline"
                  >
                    {u.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {u.city}, {u.country}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <CompareButton id={u.id} name={u.name} />
                  <SaveButton id={u.id} name={u.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
        {unis.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {store.compare.length > 0 ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/compare">
                  Open comparison ({store.compare.length})
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link href="/pathway-planner">Open pathway planner</Link>
            </Button>
          </div>
        ) : null}
      </section>

      <section aria-labelledby="saved-sch">
        <h2 id="saved-sch" className="text-xl font-bold">
          Scholarships ({schs.length})
        </h2>
        {schs.length === 0 ? (
          <div className="mt-3 card p-6">
            <p className="text-muted-foreground">No saved scholarships yet.</p>
            <Button asChild className="mt-3">
              <Link href="/scholarships">Browse scholarships</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-3 grid gap-3">
            {schs.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 card p-4"
              >
                <div>
                  <Link
                    href={`/scholarships/${s.slug}`}
                    className="font-bold underline"
                  >
                    {s.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{s.sponsor}</p>
                </div>
                <SaveScholarship id={s.id} name={s.name} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="text-sm text-muted-foreground">
        Remove everything from{" "}
        <Link href="/settings" className="underline">
          Settings
        </Link>
        .
      </p>
    </div>
  );
}
