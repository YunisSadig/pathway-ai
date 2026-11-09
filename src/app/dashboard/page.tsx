import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">Dashboard</h1>
      <p className="mt-3 measure text-lg text-muted-foreground">
        Where your plan stands and what to do next.
      </p>
      <div className="mt-8">
        <DashboardView />
      </div>
    </section>
  );
}
