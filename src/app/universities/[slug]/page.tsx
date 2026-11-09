import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import { AddToPathway } from "@/components/universities/add-to-pathway";
import {
  CompareButton,
  SaveButton,
} from "@/components/universities/university-actions";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { UNIVERSITIES, UNIVERSITY_BY_SLUG } from "@/data/universities";

export function generateStaticParams() {
  return UNIVERSITIES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/universities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const u = UNIVERSITY_BY_SLUG.get(slug);
  return { title: u ? u.name : "University" };
}

function Unknown({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-muted-foreground">
      <StatusBadge status="unknown">Not verified</StatusBadge>
      {children}
    </p>
  );
}

export default async function UniversityPage({
  params,
}: PageProps<"/universities/[slug]">) {
  const { slug } = await params;
  const uni = UNIVERSITY_BY_SLUG.get(slug);
  if (!uni) notFound();

  const related = SCHOLARSHIPS.filter(
    (s) =>
      s.country === uni.country ||
      (s.country === "European Union" && uni.region === "EU"),
  );

  return (
    <article className="page-container section-y">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap gap-1.5">
          <li>
            <Link href="/universities" className="underline">
              Universities
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page">{uni.name}</li>
        </ol>
      </nav>

      <header className="mt-4 grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-10">
        <div>
          <h1 className="title-page">{uni.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-lg text-muted-foreground">
            <MapPin aria-hidden className="size-5" />
            {uni.city}, {uni.country}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge status="verified">
              Website checked {uni.sources[0].checkedOn}
            </StatusBadge>
            <StatusBadge status="unknown">Programs not assessed</StatusBadge>
          </div>
          <div className="mt-6 flex flex-wrap items-start gap-2">
            <Button asChild>
              <a href={uni.website} target="_blank" rel="noopener noreferrer">
                Official website <ExternalLink aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Button>
            <SaveButton id={uni.id} name={uni.name} size="md" />
            <CompareButton id={uni.id} name={uni.name} size="md" />
          </div>
        </div>
        <aside className="card p-5" aria-label="Add to pathway">
          <AddToPathway id={uni.id} name={uni.name} />
        </aside>
      </header>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <section className="card p-5 lg:col-span-2" aria-labelledby="overview">
          <h2 id="overview" className="text-xl font-bold">
            Overview
          </h2>
          {uni.overview ? (
            <>
              <p className="mt-2 measure">{uni.overview}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                The university&rsquo;s own wording from its website.
              </p>
            </>
          ) : (
            <div className="mt-2">
              <Unknown>
                No readable English description was captured from the official
                website.
              </Unknown>
            </div>
          )}
        </section>

        <section className="card p-5" aria-labelledby="programs">
          <h2 id="programs" className="text-xl font-bold">
            Programs and requirements
          </h2>
          <div className="mt-2 space-y-2">
            <Unknown>Degree programs have not been assessed.</Unknown>
            <p className="text-sm text-muted-foreground">
              Requirements, language scores and deadlines differ by program.
              None are shown at university level. Check the program page on the
              official website.
            </p>
          </div>
        </section>

        <section className="card p-5" aria-labelledby="costs">
          <h2 id="costs" className="text-xl font-bold">
            Tuition and living costs
          </h2>
          <div className="mt-2 space-y-2">
            <Unknown>Tuition and fees have not been verified.</Unknown>
            <p className="text-sm text-muted-foreground">
              Use the{" "}
              <Link
                href="/financial-planner"
                className="font-semibold underline"
              >
                Financial Planner
              </Link>{" "}
              to enter the figures you find on the official fee page.
            </p>
          </div>
        </section>

        <section className="card p-5" aria-labelledby="life">
          <h2 id="life" className="text-xl font-bold">
            Housing, campus life and careers
          </h2>
          <div className="mt-2">
            <Unknown>
              Housing, student services and career resources have not been
              verified.
            </Unknown>
          </div>
        </section>

        <section className="card p-5" aria-labelledby="funding">
          <h2 id="funding" className="text-xl font-bold">
            Scholarships for {uni.country}
          </h2>
          {related.length ? (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                National or programme-level scholarships, not specific to this
                university. Check each one&rsquo;s eligibility.
              </p>
              <ul className="mt-3 space-y-2">
                {related.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/scholarships/${s.slug}`}
                      className="font-semibold underline"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-2">
              <Unknown>
                No scholarship in our directory is linked to {uni.country} yet.
              </Unknown>
            </div>
          )}
        </section>

        <section className="card p-5 lg:col-span-2" aria-labelledby="sources">
          <h2 id="sources" className="text-xl font-bold">
            Sources
          </h2>
          <ul className="mt-2 space-y-3">
            {uni.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <p className="text-sm text-muted-foreground">
                  Checked {s.checkedOn}. {s.scope}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
