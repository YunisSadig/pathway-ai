import type { Metadata } from "next";
import { ScholarshipList } from "@/components/scholarships/scholarship-list";
import { SCHOLARSHIPS } from "@/data/scholarships";

export const metadata: Metadata = { title: "Scholarships" };

export default function ScholarshipsPage() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">Scholarships</h1>
      <p className="mt-3 measure text-lg text-muted-foreground">
        {SCHOLARSHIPS.length} real scholarship programmes with links to their
        official pages. Many are for master&rsquo;s or doctoral study only, so
        each entry states its level. Deadlines change every cycle and are not
        shown until verified.
      </p>
      <div className="mt-8">
        <ScholarshipList />
      </div>
    </section>
  );
}
