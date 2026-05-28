"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParticleField } from "@/components/effects/particle-field";
import { Reveal } from "@/components/motion/reveal";
import { CHIBBA_IMG } from "@/lib/images";

const WORDS = ["THE", "INTERNET", "BECAME", "THE", "HIVE"];

function GlitchWord({ word, index }: { word: string; index: number }) {
  return (
    <motion.span
      className="relative inline-block"
      initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        delay: index * 0.12,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className="relative z-10 text-gradient-gold">{word}</span>
      {/* chromatic ghosts */}
      <span
        aria-hidden
        className="absolute inset-0 z-0 animate-flicker text-toxic/40"
        style={{ transform: "translate(2px,-1px)" }}
      >
        {word}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-0 text-neon/30"
        style={{ transform: "translate(-2px,1px)" }}
      >
        {word}
      </span>
    </motion.span>
  );
}

export function Lore() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.1, 0.4, 0.1],
  );
  const beeY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const beeOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.05, 0.4, 0.12],
  );
  const beeScale = useTransform(scrollYProgress, [0, 1], [1.12, 0.92]);

  return (
    <section
      id="lore"
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-32"
    >
      {/* Dramatic lighting */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(245,184,65,0.35),transparent_65%)] blur-3xl"
      />

      {/* Giant dreaming Chibba behind the words (Mamba mentality) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <motion.img
          src={CHIBBA_IMG.lore}
          alt=""
          aria-hidden
          style={{ y: beeY, opacity: beeOpacity, scale: beeScale }}
          className="w-[min(94vw,860px)] object-contain saturate-[1.1] [filter:contrast(1.05)]"
        />
      </div>

      {/* Ambient particles */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <ParticleField count={50} />
      </div>

      <div className="container relative z-10 text-center">
        <Reveal>
          <p className="font-display text-xs tracking-[0.6em] text-amber/60">
            ORIGIN TRANSMISSION
          </p>
        </Reveal>

        <h2 className="mt-8 flex flex-wrap items-center justify-center gap-x-[0.25em] gap-y-2 font-display text-5xl font-bold leading-[0.95] tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl">
          {WORDS.map((w, i) => (
            <GlitchWord key={`${w}-${i}`} word={w} index={i} />
          ))}
        </h2>

        <Reveal delay={0.6} className="mx-auto mt-12 max-w-2xl">
          <p className="text-balance text-lg leading-relaxed text-foreground/60 md:text-xl">
            Memes were never random — they were pheromones in a planetary
            nervous system. They faded the bee. They FUD&apos;d the bee. They
            buried him in the timeline. The bee never left. We&apos;re so back.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
