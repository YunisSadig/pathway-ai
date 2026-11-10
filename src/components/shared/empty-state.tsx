import { Compass } from "lucide-react";

/** Honest, compact empty state. Actions are passed in so every one is a real link or button. */
export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="flex animate-[rise-in_240ms_var(--ease-out-soft)] flex-col items-start gap-4 rounded-xl border border-dashed border-border-strong bg-surface p-6 sm:flex-row sm:p-8"
    >
      <span
        aria-hidden
        className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-soft-foreground"
      >
        <Compass className="size-5" />
      </span>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 max-w-prose text-muted-foreground">{description}</p>
        {children ? (
          <div className="mt-4 flex flex-wrap gap-3">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
