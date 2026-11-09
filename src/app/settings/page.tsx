import type { Metadata } from "next";
import { SettingsView } from "@/components/tools/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">Settings</h1>
      <p className="mt-3 measure text-lg text-muted-foreground">
        Manage the data stored in this browser.
      </p>
      <div className="mt-8">
        <SettingsView />
      </div>
    </section>
  );
}
