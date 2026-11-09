import type { Metadata } from "next";
import { SavedView } from "@/components/saved-view";

export const metadata: Metadata = { title: "Saved" };

export default function SavedPage() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">Saved</h1>
      <p className="mt-3 measure text-lg text-muted-foreground">
        Universities and scholarships you saved. They stay in this browser only.
      </p>
      <div className="mt-8">
        <SavedView />
      </div>
    </section>
  );
}
