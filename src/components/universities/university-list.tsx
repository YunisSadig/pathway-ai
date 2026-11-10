import { UniversityCard } from "./university-card";
import type { University } from "@/types/university";

/** Renders nothing for an empty array: show an `EmptyState` instead. */
export function UniversityList({
  universities,
}: {
  universities: University[];
}) {
  if (universities.length === 0) return null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {universities.map((u) => (
        <li key={u.id}>
          <UniversityCard university={u} />
        </li>
      ))}
    </ul>
  );
}
