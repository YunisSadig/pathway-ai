import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Previous/Next as real links, so pages are shareable and keyboard friendly. */
export function UniversityPagination({
  page,
  totalPages,
  hrefFor,
}: {
  /** One-based. */
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const cls = buttonVariants({ variant: "outline" });
  const off = cn(cls, "pointer-events-none opacity-50");
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} scroll={false} className={cls}>
          <ChevronLeft aria-hidden /> Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={off}>
          <ChevronLeft aria-hidden /> Previous
        </span>
      )}
      <p className="text-sm font-semibold">
        Page {page} of {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} scroll={false} className={cls}>
          Next <ChevronRight aria-hidden />
        </Link>
      ) : (
        <span aria-disabled="true" className={off}>
          Next <ChevronRight aria-hidden />
        </span>
      )}
    </nav>
  );
}
