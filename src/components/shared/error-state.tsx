import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Failed-request state. Pass `onRetry` only when retrying can actually help. */
export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this information. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex animate-[rise-in_240ms_var(--ease-out-soft)] flex-col items-start gap-4 rounded-xl border border-danger bg-danger-soft p-6 sm:flex-row sm:p-8"
    >
      <span
        aria-hidden
        className="grid size-11 shrink-0 place-items-center rounded-lg bg-surface text-danger"
      >
        <TriangleAlert className="size-5" />
      </span>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 max-w-prose text-muted-foreground">{description}</p>
        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            className="mt-4"
          >
            Try again
          </Button>
        ) : null}
      </div>
    </div>
  );
}
