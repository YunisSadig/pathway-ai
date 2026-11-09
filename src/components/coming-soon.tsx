import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Honest placeholder for routes whose milestone has not shipped yet. */
export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold">{title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      <p className="mt-2 text-muted-foreground">
        This part of the prototype is still being built.
      </p>
      <Button asChild variant="outline" className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
