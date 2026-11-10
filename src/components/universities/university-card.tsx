import { MapPin } from "lucide-react";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { countryName } from "@/lib/geography";
import type { University } from "@/types/university";

const link = "text-primary-soft-foreground underline-offset-4 hover:underline";

/** Presentational: renders one university from API data passed in as props. */
export function UniversityCard({ university }: { university: University }) {
  const { name, city, countryCode, websiteUrl, sourceUrl, verification } =
    university;
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold">{name}</h3>
        <VerificationBadge status={verification} />
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin aria-hidden className="size-4 shrink-0" />
        {city}, {countryName(countryCode)}
      </p>
      <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
        {websiteUrl ? (
          <a href={websiteUrl} rel="noopener noreferrer" className={link}>
            University website
          </a>
        ) : null}
        <a href={sourceUrl} rel="noopener noreferrer" className={link}>
          Official source
        </a>
      </p>
    </article>
  );
}
