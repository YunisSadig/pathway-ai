import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">
        This page took a different path
      </h1>
      <p className="mt-2 text-muted-foreground">
        The page you are looking for does not exist or has moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
