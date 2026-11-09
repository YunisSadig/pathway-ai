import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = { title: "Build your profile" };

export default function OnboardingPage() {
  return (
    <section className="page-container section-y">
      <div className="mx-auto max-w-2xl">
        <h1 className="title-page">Build your profile</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          A few questions give you a first outline. You can browse universities
          without a profile at any time.
        </p>
        <div className="mt-8">
          <OnboardingFlow />
        </div>
      </div>
    </section>
  );
}
