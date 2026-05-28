"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HoneycombGrid } from "@/components/effects/honeycomb-grid";
import { ParticleField } from "@/components/effects/particle-field";
import { CtaButton } from "@/components/motion/cta-button";
import { useIsTouch } from "@/lib/hooks";
import { CHIBBA } from "@/lib/constants";
import { CHIBBA_IMG } from "@/lib/images";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 2.6 } },
};
const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

/** The Chibba bee centerpiece — floats, tilts toward the cursor, and glows. */
function ParallaxBee() {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), {
    stiffness: 120,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), {
    stiffness: 120,
    damping: 18,
  });
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), {
    stiffness: 80,
    damping: 20,
  });

  const onMove = (e: React.MouseEvent) => {
    if (isTouch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      variants={item}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ perspective: 1000 }}
      className="relative mx-auto aspect-square w-[min(78vw,520px)]"
    >
      {/* Glow bloom behind the bee */}
      <div className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full bg-[radial-gradient(circle,rgba(245,184,65,0.45),rgba(255,138,0,0.12)_45%,transparent_70%)] blur-2xl" />

      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, x: tx, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -22, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full will-change-transform"
      >
        <img
          src={CHIBBA_IMG.hero}
          alt="Chibba — the gooner bee"
          className="h-full w-full object-contain"
          style={{
            filter:
              "drop-shadow(0 30px 60px rgba(245,184,65,0.45)) drop-shadow(0 0 30px rgba(245,184,65,0.25))",
          }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section
      id="hive"
      className="relative flex min-h-[100svh] items-center overflow-hidden scanlines"
    >
      {/* Layer 0 — honeycomb grid */}
      <div className="absolute inset-0 honeycomb-mask opacity-60">
        <HoneycombGrid size={42} opacity={0.5} />
      </div>

      {/* Layer 1 — atmospheric fog / glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,184,65,0.12),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[40vh] w-full bg-gradient-to-t from-void via-void/60 to-transparent" />
      </div>

      {/* Layer 2 — particles */}
      <div className="pointer-events-none absolute inset-0">
        <ParticleField count={45} />
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container relative z-10 grid grid-cols-1 items-center gap-6 py-28 lg:grid-cols-2 lg:gap-4"
      >
        {/* Bee first on mobile, right on desktop */}
        <div className="order-1 lg:order-2">
          <ParallaxBee />
        </div>

        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.h1
            variants={item}
            className="font-display text-6xl font-bold leading-[0.85] tracking-tighter text-gradient-gold glow-text sm:text-7xl md:text-8xl xl:text-9xl"
          >
            ENTER
            <br />
            THE HIVE
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-md text-balance text-base text-foreground/70 md:text-lg lg:mx-0"
          >
            Half meme. Half movement. Half emotional support insect. One smug
            little gooner leading the swarm through the chaos. They faded the
            bee — the bee never left. We&apos;re so back.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start"
          >
            <CtaButton href="#join" variant="default">
              Enter Hive
            </CtaButton>
            <CtaButton
              href="/technology"
              variant="outline"
              icon={
                <img
                  src={CHIBBA_IMG.tensorLogo}
                  alt=""
                  className="h-4 w-4 object-contain"
                  draggable={false}
                />
              }
            >
              View NFTs
            </CtaButton>
            <CtaButton
              href={CHIBBA.links.twitter}
              variant="outline"
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              }
            >
              Join Swarm
            </CtaButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-amber/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4 }}
      >
        <span className="font-display text-[10px] tracking-[0.4em]">SCROLL</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.div>
    </section>
  );
}
