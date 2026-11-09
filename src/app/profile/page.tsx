import type { Metadata } from "next";
import { ProfileView } from "@/components/onboarding/profile-view";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <section className="page-container section-y">
      <div className="mx-auto max-w-2xl">
        <h1 className="title-page">Profile</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          What Pathway AI knows about you. It stays in this browser.
        </p>
        <div className="mt-8">
          <ProfileView />
        </div>
      </div>
    </section>
  );
}
