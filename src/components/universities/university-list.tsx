import { UniversityCard } from "./university-card";
import type { UniversitySummary } from "@/types/university";

/** Renders nothing for an empty array: show an `EmptyState` instead. */
export function UniversityList({
  universities,
}: {
  universities: UniversitySummary[];
}) {
  if (universities.length === 0) return null;
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {universities.map((u) => (
        <li key={u.slug}>
          <UniversityCard university={u} />
        </li>
      ))}
    </ul>
  );
}
