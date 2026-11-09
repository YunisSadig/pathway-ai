import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Start assessment" };

export default function AssessmentPage() {
  return (
    <ComingSoon
      title="Build my pathway"
      description="A short assessment of your qualifications, goals and budget. Your answers will stay in your browser."
      planned={[
        "Optional questions, so you can skip what you do not know",
        "Resume where you left off after a refresh",
        "A dashboard that updates when you change an answer",
      ]}
    />
  );
}
