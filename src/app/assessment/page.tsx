import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Start assessment" };

export default function AssessmentPage() {
  return (
    <ComingSoon
      title="Build my pathway"
      description="A short, friendly assessment about your qualifications, goals and budget. Your answers will stay in your browser."
    />
  );
}
