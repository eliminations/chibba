import { Hero } from "@/components/sections/hero";
import { MemeSwarm } from "@/components/sections/meme-swarm";
import { ParallaxHive } from "@/components/sections/parallax-hive";
import { Lore } from "@/components/sections/lore";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <MemeSwarm />
      <ParallaxHive />
      <Lore />
      <Footer />
    </main>
  );
}
