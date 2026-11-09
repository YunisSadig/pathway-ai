import type { Metadata } from "next";
import { ImprovementLab } from "@/components/tools/improvement-lab";

export const metadata: Metadata = { title: "Improvement Lab" };

export default function Page() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">Improvement Lab</h1>
      <p className="mt-3 measure text-lg text-muted-foreground">
        Try what-if changes to a score or budget and see which requirements you
        would meet. Your real profile is never changed.
      </p>
      <div className="mt-8">
        <ImprovementLab />
      </div>
    </section>
  );
}
