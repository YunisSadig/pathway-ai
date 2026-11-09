import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SaveScholarship } from "@/components/scholarships/scholarship-list";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SCHOLARSHIPS, SCHOLARSHIP_BY_SLUG } from "@/data/scholarships";
import { UNIVERSITIES } from "@/data/universities";
import { DEGREE_LABEL } from "@/lib/domain/types";

export function generateStaticParams() {
  return SCHOLARSHIPS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/scholarships/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = SCHOLARSHIP_BY_SLUG.get(slug);
  return { title: s ? s.name : "Scholarship" };
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
      <dt className="font-semibold">{term}</dt>
      <dd className="text-muted-foreground">{children}</dd>
    </div>
  );
}

export default async function ScholarshipPage({
  params,
}: PageProps<"/scholarships/[slug]">) {
  const { slug } = await params;
  const s = SCHOLARSHIP_BY_SLUG.get(slug);
  if (!s) notFound();
  const unis = UNIVERSITIES.filter(
    (u) =>
      u.country === s.country ||
      (s.country === "European Union" && u.region === "EU"),
  );

  return (
    <article className="page-container section-y">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap gap-1.5">
          <li>
            <Link href="/scholarships" className="underline">
              Scholarships
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page">{s.name}</li>
        </ol>
      </nav>
      <h1 className="mt-4 title-page">{s.name}</h1>
      <p className="mt-2 text-lg text-muted-foreground">{s.sponsor}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge status="verified">
          Official page checked {s.verifiedOn}
        </StatusBadge>
        <StatusBadge status="unknown">Deadline not verified</StatusBadge>
        {s.nomination ? (
          <StatusBadge status="unmet">Nomination required</StatusBadge>
        ) : null}
      </div>
      <div className="mt-6 flex flex-wrap items-start gap-2">
        <Button asChild>
          <a href={s.officialUrl} target="_blank" rel="noopener noreferrer">
            Official page <ExternalLink aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Button>
        <SaveScholarship id={s.id} name={s.name} size="md" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_20rem]">
        <section className="card p-5" aria-labelledby="facts">
          <h2 id="facts" className="text-xl font-bold">
            At a glance
          </h2>
          <p className="mt-2 measure">{s.summary}</p>
          <dl className="mt-3 divide-y divide-border">
            <Row term="Degree level">
              {s.levels.map((l) => DEGREE_LABEL[l]).join(", ")}
            </Row>
            <Row term="Funding type">{s.fundingType}</Row>
            <Row term="Destination">{s.country}</Row>
            <Row term="Who can apply">{s.whoCanApply}</Row>
            <Row term="How to apply">{s.howToApply}</Row>
            <Row term="Nomination">
              {s.nomination ??
                "Not stated as required. Check the official page."}
            </Row>
            <Row term="Deadline">Not verified for the current cycle.</Row>
            <Row term="Amount">
              Not verified. Amounts vary by programme and year.
            </Row>
          </dl>
        </section>
        <aside className="space-y-5">
          <section className="card p-5" aria-labelledby="caveats">
            <h2 id="caveats" className="text-lg font-bold">
              Read before you apply
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              {s.caveats.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
          <section className="card p-5" aria-labelledby="unis">
            <h2 id="unis" className="text-lg font-bold">
              Universities in this destination
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Listed because they are in {s.country}, not because they are
              linked to this scholarship.
            </p>
            <p className="mt-2 text-sm">{unis.length} in our directory.</p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link
                href={`/universities?${s.country === "European Union" ? "region=EU" : `country=${encodeURIComponent(s.country)}`}`}
              >
                Browse them
              </Link>
            </Button>
          </section>
        </aside>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        This summary is general. Eligibility, amounts and deadlines change, so
        confirm everything on the official page.
      </p>
    </article>
  );
}
