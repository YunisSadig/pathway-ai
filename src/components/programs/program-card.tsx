import Link from "next/link";
import { Clock, Languages, MapPin } from "lucide-react";
import {
  DEGREE_LABELS,
  durationLabel,
  formatDate,
  languagesLabel,
  STUDY_MODE_LABELS,
} from "@/lib/format";
import type { ProgramListItem } from "@/types/program";

const chip =
  "inline-flex items-center rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary-soft-foreground";

/** One program, program-first: the program is the heading, the university that offers it is secondary. */
export function ProgramCard({ program }: { program: ProgramListItem }) {
  const { university, field, verification } = program;
  const place = [university.city, university.countryName]
    .filter(Boolean)
    .join(", ");
  return (
    <article className="flex h-full flex-col card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={chip}>{DEGREE_LABELS[program.degreeLevel]}</span>
        {field ? (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">
            {field.name}
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 text-lg leading-snug font-bold">
        <Link
          href={`/programs/${program.identifier}`}
          className="underline-offset-4 hover:underline"
        >
          {program.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm font-semibold">
        <Link
          href={`/universities/${university.slug}`}
          className="text-primary-soft-foreground underline-offset-4 hover:underline"
        >
          {university.name}
        </Link>
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin aria-hidden className="size-4 shrink-0" />
        {place}
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <Clock aria-hidden className="size-4" />
          {durationLabel(program.durationMonths)}
          {program.studyMode
            ? ` · ${STUDY_MODE_LABELS[program.studyMode]}`
            : ""}
        </li>
        <li className="flex items-center gap-1.5">
          <Languages aria-hidden className="size-4" />
          {languagesLabel(program.teachingLanguages)}
        </li>
      </ul>
      <p className="mt-auto pt-4 text-xs text-muted-foreground">
        {verification.status === "VERIFIED" && verification.verifiedOn
          ? `Read from official pages on ${formatDate(verification.verifiedOn)}`
          : "Not verified against official pages"}
      </p>
    </article>
  );
}
