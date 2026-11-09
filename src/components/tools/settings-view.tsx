"use client";

import { Download } from "lucide-react";
import { AlertDialog } from "radix-ui";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { clearAll, STORE_KEY, useHydrated, useStore } from "@/lib/store";

export function SettingsView() {
  const store = useStore();
  const hydrated = useHydrated();
  const [cleared, setCleared] = useState(false);
  if (!hydrated) return <p className="text-muted-foreground">Loading…</p>;

  const download = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pathway-ai-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-5">
      <section className="card p-5">
        <h2 className="text-lg font-bold">Your data</h2>
        <p className="mt-2 measure text-muted-foreground">
          Your profile, saved items and plans are stored in this browser only (
          {STORE_KEY}). They are not synced to other devices and not encrypted,
          so avoid using a shared computer. Pathway AI has no account or server
          yet.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={download}>
            <Download aria-hidden /> Download my data
          </Button>
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <Button variant="destructive">Delete my data</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-elevated p-6 shadow-lg">
                <AlertDialog.Title className="text-lg font-bold">
                  Delete all your data?
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-2 text-muted-foreground">
                  This removes your profile, saved universities and
                  scholarships, comparison, routes and budgets from this
                  browser. It cannot be undone.
                </AlertDialog.Description>
                <div className="mt-5 flex justify-end gap-2">
                  <AlertDialog.Cancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        clearAll();
                        setCleared(true);
                      }}
                    >
                      Delete everything
                    </Button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
        {cleared ? (
          <p role="status" className="mt-3 text-sm font-semibold">
            All data deleted.
          </p>
        ) : null}
      </section>
      <section className="card p-5">
        <h2 className="text-lg font-bold">Appearance</h2>
        <p className="mt-2 text-muted-foreground">
          Use the theme button in the header to choose Light or Dark. Your
          choice is remembered.
        </p>
      </section>
    </div>
  );
}
