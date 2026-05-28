import type { Metadata } from "next";
import { TechHero } from "@/components/sections/tech/tech-hero";
import { NftShowcase } from "@/components/sections/tech/nft-showcase";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "CHIBBA — The Hive Evolves",
  description: "Chibba NFTs are identity layers for the swarm.",
};

export default function TechnologyPage() {
  return (
    <main className="relative">
      <TechHero />
      <NftShowcase />
      <Footer />
    </main>
  );
}
