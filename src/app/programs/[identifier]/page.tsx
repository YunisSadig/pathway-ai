import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/shared/loading-state";
import { ProgramDetailView } from "@/components/programs/program-detail-view";

export const metadata: Metadata = {
  title: "Program details",
  description:
    "Tuition, deadlines and admission requirements for a degree program, exactly as published, with official sources.",
};

/**
 * Real ids are unknown at build time and are fetched in the browser. A placeholder lets Next.js prerender the page
 * shell (Cache Components needs one concrete param); every other value is rendered on demand.
 */
export function generateStaticParams() {
  return [{ identifier: "example" }];
}

export default function ProgramPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container section-y">
          <LoadingState label="Loading program" rows={4} />
        </div>
      }
    >
      <ProgramDetailView />
    </Suspense>
  );
}
