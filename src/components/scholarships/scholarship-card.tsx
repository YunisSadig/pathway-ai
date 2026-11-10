import { VerificationBadge } from "@/components/ui/verification-badge";
import { countryName } from "@/lib/geography";
import type { DegreeLevel } from "@/types/common";
import type { Scholarship } from "@/types/scholarship";

const LEVEL: Record<DegreeLevel, string> = {
  bachelor: "Bachelor's",
  master: "Master's",
  doctorate: "Doctorate",
};

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
}

/** Presentational: renders one scholarship from API data passed in as props. */
export function ScholarshipCard({
  scholarship: s,
}: {
  scholarship: Scholarship;
}) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{s.name}</h3>
          <p className="text-sm text-muted-foreground">{s.sponsor}</p>
        </div>
        <VerificationBadge status={s.verification} />
      </div>
      <dl className="mt-4 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[7rem_1fr]">
        <dt className="font-semibold">Countries</dt>
        <dd>{s.countryCodes.map(countryName).join(", ")}</dd>
        <dt className="font-semibold">Levels</dt>
        <dd>{s.levels.map((l) => LEVEL[l]).join(", ")}</dd>
        {s.coverage.length ? (
          <>
            <dt className="font-semibold">Covers</dt>
            <dd>{s.coverage.join(", ")}</dd>
          </>
        ) : null}
        <dt className="font-semibold">Deadline</dt>
        <dd>{s.deadline ? formatDate(s.deadline) : "Not stated"}</dd>
      </dl>
      <p className="mt-4 text-sm font-semibold">
        <a
          href={s.sourceUrl}
          rel="noopener noreferrer"
          className="text-primary-soft-foreground underline-offset-4 hover:underline"
        >
          Official source
        </a>
      </p>
    </article>
  );
}
