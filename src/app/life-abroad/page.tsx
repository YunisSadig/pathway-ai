import type { Metadata } from "next";
import Link from "next/link";
import { LifeAbroadPreview } from "@/components/home/life-abroad-preview";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Life Abroad" };

const PREP = [
  [
    "Housing",
    "Find out how housing works at your university before you arrive, and what it costs. Do not assume campus housing is guaranteed.",
  ],
  [
    "Money",
    "Plan the first month separately from the monthly budget. Setup costs come all at once.",
  ],
  [
    "Support",
    "Look for the international office, student advisers and counselling services on the official website.",
  ],
  [
    "Language",
    "Practise everyday language, not only exam English. Daily life and lectures are different tests.",
  ],
];

export default function LifeAbroadPage() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">Life Abroad</h1>
      <p className="mt-3 measure text-lg text-muted-foreground">
        What students often expect, and what tends to happen. This is general
        guidance, not facts about a particular university or country.
      </p>
      <div className="mt-8">
        <LifeAbroadPreview />
      </div>
      <h2 className="mt-12 title-section">Practical preparation</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {PREP.map(([t, d]) => (
          <div key={t} className="card p-5">
            <dt className="font-bold">{t}</dt>
            <dd className="mt-1 text-muted-foreground">{d}</dd>
          </div>
        ))}
      </dl>
      <Button asChild className="mt-8">
        <Link href="/financial-planner">Plan your budget</Link>
      </Button>
    </section>
  );
}
