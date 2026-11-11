import { AlertTriangle, Info } from "lucide-react";
import { ExternalLink } from "@/components/shared/fact-ui";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SourceRef } from "@/types/program";

/**
 * Building blocks of the detail pages (program, university, future scholarship).
 * Principle: structure comes from whitespace, rules and type, not from boxing every fact.
 * A bordered surface is reserved for the one summary band and for notices.
 */

/**
 * An editorial section: the title and intro sit in a narrow left column on wide screens and the content
 * on the right, divided from the previous section by a single rule. `scroll-mt` keeps the heading clear of
 * the sticky header (4rem) and section navigation when reached through an anchor.
 */
export function DetailSection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-32 border-t border-border py-8 first:border-t-0 sm:py-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10"
    >
      <div className="mb-5 lg:mb-0">
        <h2 id={`${id}-title`} className="text-xl font-bold">
          {title}
        </h2>
        {intro ? (
          <p className="mt-1.5 text-sm text-pretty text-muted-foreground">
            {intro}
          </p>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** Label/value rows separated by hairlines. Replaces a grid of one-fact boxes. */
export function DataRows({ children }: { children: React.ReactNode }) {
  return <dl className="divide-y divide-border">{children}</dl>;
}

export function DataRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-0.5 py-3 first:pt-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-medium break-words">{children}</dd>
    </div>
  );
}

/** Absence of data: one short, plain sentence. Never implies "free", "none" or "not required". */
export function Missing({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-prose text-sm text-pretty text-muted-foreground">
      {children}
    </p>
  );
}

/** A concise contextual notice. Tone is carried by the icon and label as well as colour. */
export function Notice({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "warning" | "danger";
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = tone === "info" ? Info : AlertTriangle;
  return (
    <p
      className={cn(
        "flex items-start gap-2 text-sm text-pretty",
        tone === "info" && "text-muted-foreground",
        tone === "warning" && "text-warning",
        tone === "danger" && "text-danger",
        className,
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/**
 * Compact citation. Collapsed it is one quiet line ("Source · read date"); expanded it shows the
 * publisher, the page and anything the source said verbatim. "Read on" is when we looked at the page:
 * it does not confirm the fact is still current, which is what the status chip is for.
 */
export function Evidence({
  source,
  note,
  className,
}: {
  source: SourceRef;
  note?: string | null;
  className?: string;
}) {
  return (
    <details className={cn("group text-sm", className)}>
      <summary className="inline-flex min-h-6 cursor-pointer list-none items-center gap-1 text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground [&::-webkit-details-marker]:hidden">
        Evidence
        <span aria-hidden className="transition group-open:rotate-90">
          ›
        </span>
      </summary>
      <div className="mt-2 grid gap-1.5 border-l-2 border-border pl-3 text-muted-foreground">
        {note ? <p>Source wording: “{note}”</p> : null}
        <p>
          Source:{" "}
          <ExternalLink href={source.url} className="text-sm">
            {source.publisher ? `${source.publisher}: ` : ""}
            {source.title}
          </ExternalLink>
        </p>
        <p>
          Page read on {formatDate(source.retrievedOn)}. This is when the page
          was read, not a guarantee that it is still current.
        </p>
      </div>
    </details>
  );
}
