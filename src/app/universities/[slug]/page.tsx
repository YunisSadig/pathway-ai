import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/shared/loading-state";
import { UniversityDetailView } from "@/components/universities/university-detail-view";

export const metadata: Metadata = {
  title: "University details",
  description: "A university and the degree programs it offers.",
};

/**
 * Real ids are unknown at build time and are fetched in the browser. A placeholder lets Next.js prerender the page
 * shell (Cache Components needs one concrete param); every other value is rendered on demand.
 */
export function generateStaticParams() {
  return [{ slug: "example" }];
}

export default function UniversityPage() {
  return (
    <div className="page-container section-y">
      <Suspense fallback={<LoadingState label="Loading university" rows={3} />}>
        <UniversityDetailView />
      </Suspense>
    </div>
  );
}
