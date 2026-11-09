import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Universities" };

export default function UniversitiesPage() {
  return (
    <ComingSoon
      title="Universities"
      description="A directory of real universities across the EU, United States, Canada, China, South Korea and Japan, with every fact marked verified or unknown."
    />
  );
}
