import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REGIONS } from "@/lib/geography";
import { SITE } from "@/lib/site";

/** Server component: no client JavaScript and no animation library. */
export function Hero() {
  return (
    <section className="page-container grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:py-20">
      <div>
        <p className="eyebrow">Study-abroad guide · Early release</p>
        <h1 className="mt-4 title-hero">{SITE.tagline}</h1>
        <p className="mt-5 measure text-lg text-muted-foreground sm:text-xl">
          Browse degree programs and universities with tuition, deadlines and
          admission requirements exactly as the university publishes them, each
          linked to its official source. Coverage is small and growing.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/universities">Explore universities</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/how-it-works">How it works</Link>
          </Button>
        </div>
      </div>

      <nav
        aria-label="Study destinations"
        className="rounded-xl border border-border bg-surface p-3 sm:p-4"
      >
        <p className="px-3 pt-2 pb-2 font-bold">Choose a destination</p>
        <ul className="divide-y divide-border">
          {REGIONS.map((r) => (
            <li key={r.id}>
              <Link
                href={`/universities?region=${r.id}`}
                className="group flex min-h-12 items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-hover"
              >
                <span className="font-semibold">{r.name}</span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  {r.multiCountry ? "27 member states" : null}
                  <ArrowUpRight aria-hidden className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
