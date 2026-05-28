"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HoneycombGrid } from "@/components/effects/honeycomb-grid";
import { ParticleField } from "@/components/effects/particle-field";
import { FlyingBee } from "@/components/effects/flying-bee";

export function ParallaxHive() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Honeycomb depth layers separating
  const layerFar = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const layerNear = useTransform(scrollYProgress, [0, 1], ["30%", "-35%"]);
  const scaleFar = useTransform(scrollYProgress, [0, 1], [1.1, 1.4]);

  // Typography fading through fog
  const textY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.6, 0.9],
    [0, 1, 1, 0],
  );
  const textBlur = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.6, 0.9],
    [14, 0, 0, 14],
  );
  const filter = useTransform(textBlur, (b) => `blur(${b}px)`);

  return (
    <section
      ref={ref}
      className="relative h-[150vh] overflow-hidden bg-deep"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Honeycomb depth layers */}
        <motion.div
          style={{ y: layerFar, scale: scaleFar }}
          className="absolute inset-0 opacity-30"
        >
          <HoneycombGrid size={78} opacity={0.4} />
        </motion.div>
        <motion.div
          style={{ y: layerNear }}
          className="absolute inset-0 opacity-60 honeycomb-mask"
        >
          <HoneycombGrid size={48} opacity={0.45} />
        </motion.div>

        {/* Fog */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(6,6,6,0.85)_75%)]" />

        {/* Bees flying across */}
        <FlyingBee top="18%" size={30} duration={13} />
        <FlyingBee top="34%" size={22} duration={18} delay={3} reverse />
        <FlyingBee top="62%" size={38} duration={11} delay={1.5} />
        <FlyingBee top="78%" size={26} duration={16} delay={4} reverse />
        <FlyingBee top="50%" size={20} duration={20} delay={6} />

        {/* Particles intensify */}
        <div className="pointer-events-none absolute inset-0">
          <ParticleField count={45} />
        </div>

        {/* Typography through fog */}
        <motion.div
          style={{ y: textY, opacity: textOpacity, filter }}
          className="relative z-10 px-6 text-center"
        >
          <p className="font-display text-sm tracking-[0.6em] text-toxic/80">
            RETURN TO
          </p>
          <h2 className="mt-4 font-display text-[18vw] font-bold leading-[0.85] tracking-tighter text-gradient-gold glow-text md:text-[14vw]">
            THE HIVE
          </h2>
          <p className="mx-auto mt-6 max-w-md text-foreground/60">
            Layer by layer the swarm pulls you under. Goon now, build later —
            the honey runs deep and the buzz never stops.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
