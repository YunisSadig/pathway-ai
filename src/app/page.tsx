import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

// Milestone A placeholder; the full homepage lands in Milestone B.
export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <h1 className="max-w-3xl font-display text-4xl font-extrabold text-balance sm:text-6xl">
        {SITE.tagline}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        {SITE.description}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/how-it-works">See how it works</Link>
        </Button>
      </div>
    </section>
  );
}
