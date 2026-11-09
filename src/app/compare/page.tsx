import type { Metadata } from "next";
import { ComparisonView } from "@/components/universities/comparison-view";

export const metadata: Metadata = { title: "Compare universities" };

export default function ComparePage() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">Compare universities</h1>
      <p className="mt-3 measure text-lg text-muted-foreground">
        Compare up to three universities side by side. Rows with no verified
        data say so instead of guessing.
      </p>
      <div className="mt-8">
        <ComparisonView />
      </div>
    </section>
  );
}
