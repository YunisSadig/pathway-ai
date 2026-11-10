import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="page-container section-y text-center">
      <p className="font-display text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 title-page">This page took a different path</h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        The page you are looking for does not exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/how-it-works">See how it works</Link>
        </Button>
      </div>
    </section>
  );
}
