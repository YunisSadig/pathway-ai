import { ExternalLink as ExternalIcon } from "lucide-react";
import { formatDate, TEMPORAL_HELP, TEMPORAL_LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SourceRef, TemporalStatus } from "@/types/program";

const TEMPORAL_STYLES: Record<TemporalStatus, string> = {
  CURRENT: "bg-success-soft text-success",
  HISTORICAL: "bg-danger-soft text-danger",
  UNKNOWN_YEAR: "bg-warning-soft text-warning",
};

/** Says whether a year-specific fact is current, outdated or of unknown period. Never colour-only. */
export function TemporalBadge({ status }: { status: TemporalStatus }) {
  return (
    <span
      title={TEMPORAL_HELP[status]}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        TEMPORAL_STYLES[status],
      )}
    >
      {TEMPORAL_LABELS[status]}
    </span>
  );
}

const linkClass =
  "inline-flex items-center gap-1 font-semibold text-primary-soft-foreground underline underline-offset-4 hover:no-underline";

/** An external, official page. Opens in the same tab with safe `rel`; the icon is decorative. */
export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className={cn(linkClass, className)}
    >
      {children}
      <ExternalIcon aria-hidden className="size-3.5 shrink-0" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Every fact cites where it came from and when that page was read. */
export function SourceLine({ source }: { source: SourceRef }) {
  return (
    <p className="text-xs text-muted-foreground">
      Source:{" "}
      <ExternalLink href={source.url} className="text-xs">
        {source.publisher ? `${source.publisher}: ` : ""}
        {source.title}
      </ExternalLink>{" "}
      · read {formatDate(source.retrievedOn)}
    </p>
  );
}

/** A labelled value. Missing values read "Not stated", never blank. */
export function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium break-words">{children}</dd>
    </div>
  );
}
