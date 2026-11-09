import { Capabilities } from "@/components/home/capabilities";
import { Hero } from "@/components/home/hero";
import { TrustStart } from "@/components/home/trust-start";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <TrustStart />
    </>
  );
}
