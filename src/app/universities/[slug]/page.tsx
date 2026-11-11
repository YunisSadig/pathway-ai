import type { Metadata } from "next";
import { Suspense } from "react";
import { preload } from "react-dom";
import { apiBaseUrl } from "@/lib/api/client";
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

/** See PreloadProgram: starts the request early; the client component still owns the data. */
async function PreloadUniversity({
  params,
}: {
  params: PageProps<"/universities/[slug]">["params"];
}) {
  const { slug } = await params;
  const base = apiBaseUrl();
  if (base && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    preload(`${base}/api/v1/universities/${slug}`, {
      as: "fetch",
      crossOrigin: "anonymous",
    });
  }
  return null;
}

export default function UniversityPage(
  props: PageProps<"/universities/[slug]">,
) {
  return (
    <Suspense
      fallback={
        <div className="page-container min-h-[100svh] section-y">
          <LoadingState label="Loading university" rows={3} />
        </div>
      }
    >
      <PreloadUniversity params={props.params} />
      <UniversityDetailView />
    </Suspense>
  );
}
