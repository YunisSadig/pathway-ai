/** Skeleton placeholder for a list that is still loading. */
export function LoadingState({
  label = "Loading",
  rows = 3,
}: {
  label?: string;
  rows?: number;
}) {
  return (
    <div role="status" aria-busy="true" className="grid gap-3">
      <span className="sr-only">{label}…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          aria-hidden
          className="h-28 animate-pulse card bg-muted shadow-none"
        />
      ))}
    </div>
  );
}
