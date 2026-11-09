import type { Metadata } from "next";
import { Suspense } from "react";
import { Explorer } from "@/components/universities/explorer";
import { UNIVERSITIES } from "@/data/universities";

export const metadata: Metadata = { title: "Universities" };

export default function UniversitiesPage() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">Universities</h1>
      <p className="mt-3 measure text-lg text-muted-foreground">
        {UNIVERSITIES.length} real universities across the EU, United States,
        Canada, China, South Korea and Japan. For now each entry confirms the
        institution and its official website. Programs, fees and requirements
        are not yet assessed, and are marked as such.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={
            <p className="text-muted-foreground">Loading universities…</p>
          }
        >
          <Explorer />
        </Suspense>
      </div>
    </section>
  );
}
