"use client";

import { motion } from "framer-motion";
import { HoneycombGrid } from "@/components/effects/honeycomb-grid";
import { ParticleField } from "@/components/effects/particle-field";
import { CHIBBA_IMG } from "@/lib/images";
import { NFTS } from "@/lib/nfts";

// Hand-placed so the cards swarm the title without colliding with the copy.
const CARD_SWARM = [
  { left: "5%", top: "16%", w: 132, rot: -10, dur: 7 },
  { left: "82%", top: "12%", w: 116, rot: 9, dur: 8.5 },
  { left: "12%", top: "60%", w: 104, rot: 7, dur: 9 },
  { left: "84%", top: "56%", w: 138, rot: -8, dur: 7.6 },
  { left: "70%", top: "76%", w: 96, rot: 6, dur: 10 },
  { left: "22%", top: "82%", w: 92, rot: -6, dur: 8 },
];

function FloatingNftCard({
  index,
  cfg,
}: {
  index: number;
  cfg: (typeof CARD_SWARM)[number];
}) {
  const nft = NFTS[index % NFTS.length];
  return (
    <motion.div
      className="absolute"
      style={{ left: cfg.left, top: cfg.top, width: cfg.w }}
      initial={{ opacity: 0, scale: 0.8, rotate: cfg.rot }}
      animate={{
        opacity: 0.85,
        scale: 1,
        rotate: cfg.rot,
        y: [0, -16, 0],
      }}
      transition={{
        opacity: { delay: 0.6 + index * 0.12, duration: 0.8 },
        scale: { delay: 0.6 + index * 0.12, duration: 0.8 },
        y: { duration: cfg.dur, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <div
        className="overflow-hidden rounded-xl border bg-graphite/60 p-1 backdrop-blur-sm"
        style={{
          borderColor: `${nft.accent}55`,
          boxShadow: `0 18px 40px -12px ${nft.accent}40`,
        }}
      >
        <div className="overflow-hidden rounded-lg">
          <img
            src={nft.src}
            alt={nft.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <div className="flex items-center justify-between px-1.5 py-1">
          <span className="font-mono text-[8px] tracking-widest text-foreground/50">
            #{nft.rank}
          </span>
          <span
            className="font-display text-[9px] font-bold"
            style={{ color: nft.accent }}
          >
            {nft.price} ◎
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function TechHero() {
  return (
    <section className="relative flex min-h-[92svh] items-center justify-center overflow-hidden scanlines">
      {/* Holographic grid floor */}
      <div className="absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]">
        <HoneycombGrid size={36} opacity={0.6} />
      </div>

      {/* Horizon glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[50vh] w-[80vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_bottom,rgba(184,255,90,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[40vmin] w-[40vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,184,65,0.18),transparent_65%)] blur-3xl" />
      </div>

      {/* Swarming NFT cards */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {CARD_SWARM.map((cfg, i) => (
          <FloatingNftCard key={i} index={i} cfg={cfg} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0">
        <ParticleField count={40} />
      </div>

      <div className="container relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="inline-flex items-center gap-2 rounded-full glass-amber px-4 py-1.5 font-display text-xs tracking-[0.35em] text-toxic"
        >
          1,100 GOONERS
        </motion.span>

        <div className="relative mt-6">
          {/* The casino scene + scrim, centered on the title */}
          <motion.img
            src={CHIBBA_IMG.techHud}
            alt=""
            aria-hidden
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[min(88vw,680px)] -translate-x-1/2 -translate-y-1/2 object-contain [mask-image:radial-gradient(circle_at_50%_50%,#000_42%,transparent_70%)]"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[55vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(6,6,6,0.78),transparent_70%)] blur-2xl" />

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative font-display text-6xl font-bold leading-[0.9] tracking-tighter text-gradient-gold glow-text sm:text-7xl md:text-8xl lg:text-9xl"
          >
            PICK YOUR
            <br />
            POISON
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mx-auto mt-6 max-w-xl text-balance text-base text-foreground/70 md:text-lg"
        >
          Chibba NFTs are goon layers for the swarm — living credentials that
          mutate with your sweet warm honey.
        </motion.p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void to-transparent" />
    </section>
  );
}
