import type { ProgramListItem } from "@/types/program";
import { ProgramCard } from "./program-card";

/** Renders nothing for an empty array: show an `EmptyState` instead. */
export function ProgramList({ programs }: { programs: ProgramListItem[] }) {
  if (programs.length === 0) return null;
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {programs.map((p) => (
        <li key={p.identifier}>
          <ProgramCard program={p} />
        </li>
      ))}
    </ul>
  );
}
