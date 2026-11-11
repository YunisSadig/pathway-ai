import { cn } from "@/lib/utils";

/** How trustworthy a piece of information is. Shown wherever facts appear. */
export type Status =
  "verified" | "user" | "hypothetical" | "unknown" | "met" | "unmet";

const STYLES: Record<Status, string> = {
  verified: "bg-success-soft text-success",
  user: "bg-mint text-mint-foreground",
  hypothetical: "bg-primary-soft text-primary-soft-foreground",
  unknown: "bg-warning-soft text-warning",
  met: "bg-success-soft text-success",
  unmet: "bg-danger-soft text-danger",
};

const LABELS: Record<Status, string> = {
  verified: "Verified",
  user: "You entered",
  hypothetical: "What-if",
  unknown: "Not verified",
  met: "Met",
  unmet: "Not met",
};

export function StatusBadge({
  status,
  children,
  className,
}: {
  status: Status;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-sm font-semibold whitespace-nowrap",
        STYLES[status],
        className,
      )}
    >
      {children ?? LABELS[status]}
    </span>
  );
}
