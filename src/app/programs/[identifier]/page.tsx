import type { Metadata } from "next";
import { Suspense } from "react";
import { preload } from "react-dom";
import { apiBaseUrl } from "@/lib/api/client";
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

/**
 * Starts the program request while the page's JavaScript is still loading, so the data is usually already in
 * flight (or arrived) by the time the client component asks for it. The id is validated before use. Renders
 * nothing; the client component still owns fetching, caching, errors and retry.
 */
async function PreloadProgram({
  params,
}: {
  params: PageProps<"/programs/[identifier]">["params"];
}) {
  const { identifier } = await params;
  const base = apiBaseUrl();
  if (base && /^[a-z0-9]+(-{1,2}[a-z0-9]+)*$/.test(identifier)) {
    preload(`${base}/api/v1/programs/${identifier}`, {
      as: "fetch",
      crossOrigin: "anonymous",
    });
  }
  return null;
}

export default function ProgramPage(
  props: PageProps<"/programs/[identifier]">,
) {
  return (
    <Suspense
      fallback={
        <div className="page-container min-h-[100svh] section-y">
          <LoadingState label="Loading program" rows={4} />
        </div>
      }
    >
      <PreloadProgram params={props.params} />
      <ProgramDetailView />
    </Suspense>
  );
}
