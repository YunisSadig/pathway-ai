import Link from "next/link";
import { MapPin } from "lucide-react";
import type { UniversitySummary } from "@/types/university";

const link = "text-primary-soft-foreground underline-offset-4 hover:underline";

/**
 * Presentational: renders one university exactly as the API returns it. The API carries no
 * tuition, requirements or verification data yet, so none is shown or implied.
 */
export function UniversityCard({
  university,
}: {
  university: UniversitySummary;
}) {
  const { name, city, countryName, websiteUrl } = university;
  return (
    <article className="card p-5">
      <h3 className="text-lg font-bold">
        <Link
          href={`/universities/${university.slug}`}
          className="underline-offset-4 hover:underline"
        >
          {name}
        </Link>
      </h3>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin aria-hidden className="size-4 shrink-0" />
        {city ? `${city}, ${countryName}` : countryName}
      </p>
      {websiteUrl ? (
        <p className="mt-4 text-sm font-semibold">
          <a href={websiteUrl} rel="noopener noreferrer" className={link}>
            University website
          </a>
        </p>
      ) : null}
    </article>
  );
}
