import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Universities" };

export default function UniversitiesPage() {
  return (
    <ComingSoon
      title="Universities"
      description="A directory of real universities across the EU, United States, Canada, China, South Korea and Japan."
      planned={[
        "Search by name, city, country and subject",
        "A profile page for every university, with source links",
        "Every fact marked verified or not verified",
        "Save and compare universities",
      ]}
    />
  );
}
