import Link from "next/link";
import {
  BadgeCheck,
  Clock,
  Languages,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import {
  DEGREE_LABELS,
  durationLabel,
  formatDate,
  languagesLabel,
  NOT_STATED,
  STUDY_MODE_LABELS,
} from "@/lib/format";
import type { ProgramListItem } from "@/types/program";

/**
 * One program as a result row, not a card: rows divide with hairlines inside a single list container, so a
 * page of results reads as one scannable list. The whole row is clickable through the title link (stretched
 * with an overlay); the university link sits above the overlay so it stays independently usable.
 * The list endpoint carries no tuition, so none is shown here.
 */
export function ProgramCard({ program }: { program: ProgramListItem }) {
  const { university, field, verification } = program;
  const place = [university.city, university.countryName]
    .filter(Boolean)
    .join(", ");
  const verified =
    verification.status === "VERIFIED" && verification.verifiedOn;
  return (
    <article className="relative grid gap-x-8 gap-y-2 px-4 py-4 transition-colors hover:bg-hover sm:px-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="min-w-0">
        <h3 className="text-lg leading-snug font-bold">
          <Link
            href={`/programs/${program.identifier}`}
            className="underline-offset-4 outline-offset-4 after:absolute after:inset-0 hover:underline focus-visible:underline"
          >
            {program.name}
          </Link>
        </h3>
        <p className="mt-1">
          <Link
            href={`/universities/${university.slug}`}
            className="relative z-10 font-semibold underline-offset-4 hover:underline"
          >
            {university.name}
          </Link>
          <span className="mt-0.5 flex items-center gap-1 text-muted-foreground sm:mt-0 sm:ml-1 sm:inline-flex">
            <span aria-hidden className="hidden sm:inline">
              ·
            </span>
            <MapPin aria-hidden className="size-3.5 shrink-0" />
            {place}
          </span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {DEGREE_LABELS[program.degreeLevel]}
          </span>
          {field ? ` · ${field.name}` : ""}
        </p>
      </div>

      <ul className="flex flex-wrap content-start gap-x-4 gap-y-1 text-sm text-muted-foreground lg:grid">
        <li className="flex items-center gap-1.5">
          <Clock aria-hidden className="size-4 shrink-0" />
          {program.durationMonths
            ? durationLabel(program.durationMonths)
            : `Duration ${NOT_STATED.toLowerCase()}`}
          {program.studyMode
            ? ` · ${STUDY_MODE_LABELS[program.studyMode]}`
            : ""}
        </li>
        <li className="flex items-center gap-1.5">
          <Languages aria-hidden className="size-4 shrink-0" />
          {program.teachingLanguages.length
            ? languagesLabel(program.teachingLanguages)
            : `Language ${NOT_STATED.toLowerCase()}`}
        </li>
        <li
          className={
            verified
              ? "flex items-center gap-1.5"
              : "flex items-center gap-1.5 font-medium text-warning"
          }
        >
          {verified ? (
            <BadgeCheck aria-hidden className="size-4 shrink-0 text-success" />
          ) : (
            <TriangleAlert aria-hidden className="size-4 shrink-0" />
          )}
          {verified
            ? `Read from official pages on ${formatDate(verification.verifiedOn)}`
            : "Not verified against official pages"}
        </li>
      </ul>
    </article>
  );
}
