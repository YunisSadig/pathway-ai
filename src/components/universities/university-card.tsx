import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import type { UniversitySummary } from "@/types/university";

/**
 * Presentational: renders one university exactly as the API returns it, as a result row (see ProgramCard).
 * The API carries no tuition, requirements or verification data for universities, so none is shown or implied.
 */
export function UniversityCard({
  university,
}: {
  university: UniversitySummary;
}) {
  const { name, city, countryName, websiteUrl } = university;
  return (
    <article className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-4 transition-colors hover:bg-hover sm:px-5">
      <div className="min-w-0">
        <h3 className="text-lg leading-snug font-bold">
          <Link
            href={`/universities/${university.slug}`}
            className="underline-offset-4 outline-offset-4 after:absolute after:inset-0 hover:underline focus-visible:underline"
          >
            {name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
          <MapPin aria-hidden className="size-4 shrink-0" />
          {city ? `${city}, ${countryName}` : countryName}
        </p>
      </div>
      {websiteUrl ? (
        <a
          href={websiteUrl}
          rel="noopener noreferrer"
          className="relative z-10 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary-soft-foreground underline underline-offset-4 hover:no-underline"
        >
          University website
          <ExternalLink aria-hidden className="size-3.5" />
        </a>
      ) : null}
    </article>
  );
}
