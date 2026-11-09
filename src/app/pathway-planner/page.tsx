import type { Metadata } from "next";
import { PlannerView } from "@/components/planner/planner-view";

export const metadata: Metadata = { title: "Pathway planner" };

export default function PlannerPage() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">Pathway planner</h1>
      <p className="mt-3 measure text-lg text-muted-foreground">
        Build a primary route and two alternatives, with preparation tasks for
        each.
      </p>
      <div className="mt-8">
        <PlannerView />
      </div>
    </section>
  );
}
