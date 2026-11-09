"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { profileCompletion } from "@/lib/domain/evaluate";
import { update, useHydrated, useStore } from "@/lib/store";
import { Review } from "./onboarding-flow";

export function ProfileView() {
  const router = useRouter();
  const store = useStore();
  const hydrated = useHydrated();
  if (!hydrated) return <p className="text-muted-foreground">Loading…</p>;

  const started = store.profile.stage !== null;
  if (!started) {
    return (
      <div className="card p-6">
        <p className="font-semibold">You have not built a profile yet.</p>
        <p className="mt-1 text-muted-foreground">
          Answer a few questions to get started. You can still browse without
          one.
        </p>
        <Button asChild className="mt-4">
          <Link href="/onboarding">Build my profile</Link>
        </Button>
      </div>
    );
  }
  const comp = profileCompletion(store.profile);
  return (
    <div className="grid gap-5">
      <p className="text-sm text-muted-foreground">
        {comp.done} of {comp.total} essentials answered.
      </p>
      <Review
        p={store.profile}
        onEdit={(n) => {
          update((s) => ({ ...s, onboarding: { ...s.onboarding, step: n } }));
          router.push("/onboarding");
        }}
      />
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/onboarding">Edit all answers</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
