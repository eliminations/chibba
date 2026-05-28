"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HoloMeme } from "@/components/effects/holo-meme";
import { SWARM_MEMES } from "@/lib/memes";
import { Reveal } from "@/components/motion/reveal";
import { CHIBBA } from "@/lib/constants";

// Hand-placed positions so the swarm feels composed, not random.
const LAYOUT = [
  { left: "6%", top: "8%", w: "clamp(90px,11vw,150px)", rot: -8 },
  { left: "78%", top: "4%", w: "clamp(80px,9vw,130px)", rot: 6 },
  { left: "20%", top: "55%", w: "clamp(100px,12vw,170px)", rot: 4 },
  { left: "62%", top: "48%", w: "clamp(90px,11vw,150px)", rot: -5 },
  { left: "44%", top: "18%", w: "clamp(70px,8vw,110px)", rot: 10 },
  { left: "86%", top: "62%", w: "clamp(80px,9vw,120px)", rot: -10 },
  { left: "2%", top: "68%", w: "clamp(70px,8vw,110px)", rot: 7 },
  { left: "52%", top: "72%", w: "clamp(80px,9vw,130px)", rot: -3 },
];

function DriftingMeme({
  index,
}: {
  index: number;
}) {
  const entry = SWARM_MEMES[index];
  const layout = LAYOUT[index];
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Deeper layers (low depth) move more for parallax; near layers move less.
  const range = 160 * (1 - entry.depth) + 40;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 0.6 + entry.depth * 0.4, 0.6 + entry.depth * 0.4, 0],
  );

  const blur = (1 - entry.depth) * 4;

  return (
    <motion.div
      ref={ref}
      className="absolute will-change-transform"
      style={{
        left: layout.left,
        top: layout.top,
        width: layout.w,
        y,
        opacity,
        filter: `blur(${blur}px)`,
        zIndex: Math.round(entry.depth * 10),
      }}
    >
      <motion.div
        animate={{
          y: [0, -14 - entry.depth * 10, 0],
          rotate: [layout.rot, layout.rot + 3, layout.rot],
        }}
        transition={{
          duration: 6 + index,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.08, filter: "blur(0px)" }}
      >
        <HoloMeme entry={entry} />
      </motion.div>
    </motion.div>
  );
}

/**
 * The real Chibba chart — live PumpSwap candles piped in from DexScreener and
 * dropped faintly behind the swarm, so the actual timeline pumps behind the
 * memes. pointer-events are killed on the wrapper so it stays pure atmosphere.
 */
function ChibbaChart() {
  return (
    <iframe
      title="CHIBBA live chart"
      src={CHIBBA.links.chartEmbed}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="absolute inset-0 h-full w-full border-0"
    />
  );
}

export function MemeSwarm() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Faint live chart, behind everything */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_top,#000,transparent_88%)]">
        <ChibbaChart />
      </div>

      {/* Drifting swarm layer */}
      <div className="pointer-events-none absolute inset-0">
        {SWARM_MEMES.map((_, i) => (
          <div key={i} className="pointer-events-auto">
            <DriftingMeme index={i} />
          </div>
        ))}
      </div>

      {/* Center statement emerging from darkness */}
      <div className="container relative z-20 flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,6,6,0.9),transparent_70%)] blur-2xl" />
        <Reveal className="relative">
          <p className="font-display text-xs tracking-[0.5em] text-toxic/70">
            THE HIVE REMEMBERS
          </p>
          <h2 className="mt-4 max-w-3xl text-balance font-display text-4xl font-bold leading-tight tracking-tight text-gradient-gold md:text-6xl">
            We speak fluent buzzpost.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-foreground/60">
            Every meme is a drone. Every drone feeds the hive. Chibba turns the
            chaos of the timeline into one terminally-online swarm — and the
            hive never folds.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
