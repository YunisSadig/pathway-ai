import { ScholarshipCard } from "./scholarship-card";
import type { Scholarship } from "@/types/scholarship";

/** Renders nothing for an empty array: show an `EmptyState` instead. */
export function ScholarshipList({
  scholarships,
}: {
  scholarships: Scholarship[];
}) {
  if (scholarships.length === 0) return null;
  return (
    <ul className="grid gap-3">
      {scholarships.map((s) => (
        <li key={s.id}>
          <ScholarshipCard scholarship={s} />
        </li>
      ))}
    </ul>
  );
}
