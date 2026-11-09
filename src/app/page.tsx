import { Hero } from "@/components/home/hero";
import { ImprovementPreview } from "@/components/home/improvement-preview";
import { LifeAbroadPreview } from "@/components/home/life-abroad-preview";
import {
  ExplorerPreview,
  FinalCta,
  HowItWorks,
  Matching,
  Pathways,
  Problem,
  ScholarshipPreview,
  Trust,
} from "@/components/home/static-sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <ExplorerPreview />
      <Matching />
      <ScholarshipPreview />
      <ImprovementPreview />
      <Pathways />
      <LifeAbroadPreview />
      <Trust />
      <FinalCta />
    </>
  );
}
