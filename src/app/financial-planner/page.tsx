import type { Metadata } from "next";
import { FinancialPlanner } from "@/components/tools/financial-planner";

export const metadata: Metadata = { title: "Financial planner" };

export default function Page() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">Financial planner</h1>
      <p className="mt-3 measure text-lg text-muted-foreground">
        Add up one-time, monthly and yearly costs in one currency, then save
        scenarios to compare.
      </p>
      <div className="mt-8">
        <FinancialPlanner />
      </div>
    </section>
  );
}
