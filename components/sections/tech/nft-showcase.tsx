"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Hexagon, ExternalLink } from "lucide-react";
import { NFTS, COLLECTION, type NftItem } from "@/lib/nfts";
import { Reveal } from "@/components/motion/reveal";
import { useSound } from "@/components/providers/sound-provider";
import { cn } from "@/lib/utils";

function NftArt({ item }: { item: NftItem }) {
  if (item.src) {
    return (
      <img
        src={item.src}
        alt={item.name}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <defs>
        <radialGradient id={`nft-${item.id}`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={item.accent} stopOpacity="0.7" />
          <stop offset="100%" stopColor="#060606" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="#0A0A0A" />
      <rect width="200" height="200" fill={`url(#nft-${item.id})`} />
      {/* concentric hexes */}
      {[70, 52, 34].map((r, i) => {
        const pts = Array.from({ length: 6 })
          .map((_, k) => {
            const a = (Math.PI / 3) * k + Math.PI / 6;
            return `${100 + r * Math.cos(a)},${100 + r * Math.sin(a)}`;
          })
          .join(" ");
        return (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke={item.accent}
            strokeWidth={1.5}
            opacity={0.4 + i * 0.2}
          />
        );
      })}
      <circle cx="100" cy="100" r="10" fill={item.accent} />
    </svg>
  );
}

export function NftShowcase() {
  const [active, setActive] = useState(2);
  const { play } = useSound();
  const n = NFTS.length;

  const go = useCallback(
    (dir: number) => {
      play("hover");
      setActive((a) => (a + dir + n) % n);
    },
    [n, play],
  );

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % n), 4200);
    return () => clearInterval(id);
  }, [n]);

  return (
    <section className="relative overflow-hidden py-28">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-display text-xs tracking-[0.5em] text-amber/70">
            THE GALLERY · {COLLECTION.name}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-gradient-gold md:text-5xl">
            Drones of the swarm
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm text-foreground/55">
            {COLLECTION.size.toLocaleString()} hand-crafted bees living on Solana
            — trade them live below.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href={COLLECTION.magicEden}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full glass-amber px-4 py-2 font-display text-xs tracking-wide text-hive transition-all hover:scale-105 hover:shadow-glow"
            >
              Magic Eden <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={COLLECTION.tensor}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-toxic/30 bg-toxic/5 px-4 py-2 font-display text-xs tracking-wide text-toxic transition-all hover:scale-105 hover:bg-toxic/10"
            >
              Tensor <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Coverflow stage */}
      <div className="perspective relative mt-16 flex h-[460px] items-center justify-center">
        {NFTS.map((item, i) => {
          let offset = i - active;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const abs = Math.abs(offset);
          const isActive = offset === 0;

          if (abs > 2) return null;

          return (
            <motion.button
              key={item.id}
              onClick={() => {
                play("click");
                setActive(i);
              }}
              className="absolute h-[400px] w-[300px] will-change-transform"
              animate={{
                x: offset * 230,
                scale: isActive ? 1 : 0.78 - (abs - 1) * 0.08,
                rotateY: offset * -22,
                opacity: abs > 2 ? 0 : 1 - abs * 0.25,
                zIndex: 10 - abs,
                filter: isActive ? "blur(0px)" : `blur(${abs * 1.5}px)`,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 26 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className={cn(
                  "relative h-full w-full overflow-hidden rounded-2xl border bg-deep transition-colors",
                  isActive ? "border-amber/50" : "border-white/10",
                )}
                style={{
                  boxShadow: isActive
                    ? `0 30px 80px -20px ${item.accent}80, 0 0 50px -20px ${item.accent}`
                    : "0 20px 50px -25px #000",
                }}
              >
                <div className="relative aspect-square w-full overflow-hidden scanlines">
                  <NftArt item={item} />
                  {isActive && (
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-toxic/30" />
                  )}
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="text-left">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] tracking-widest text-foreground/40">
                      CHIBBA #{item.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
                    <Hexagon
                      className="h-3 w-3"
                      style={{ color: item.accent }}
                      fill={item.accent}
                    />
                    <span
                      className="font-display text-[10px] font-semibold"
                      style={{ color: item.accent }}
                    >
                      {item.rarity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 px-4 py-2.5">
                  <div className="flex flex-col text-left">
                    <span className="font-mono text-[9px] tracking-widest text-foreground/40">
                      RANK #{item.rank}
                    </span>
                    <span className="font-display text-[11px] text-foreground/70">
                      {item.trait}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[9px] tracking-widest text-foreground/40">
                      PRICE
                    </span>
                    <span className="font-display text-sm font-bold text-hive">
                      {item.price} SOL
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          className="grid h-12 w-12 place-items-center rounded-full glass-amber text-hive transition-all hover:scale-110 hover:shadow-glow"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {NFTS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-8 bg-amber" : "w-1.5 bg-white/20",
              )}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Next"
          className="grid h-12 w-12 place-items-center rounded-full glass-amber text-hive transition-all hover:scale-110 hover:shadow-glow"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Live buy CTA for the focused bee */}
      <div className="mt-8 flex justify-center">
        <a
          href={COLLECTION.item(NFTS[active].mint)}
          target="_blank"
          rel="noreferrer"
          onClick={() => play("click")}
          className="group inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3 font-display text-sm font-semibold text-void shadow-glow transition-all hover:scale-105 hover:shadow-glow-lg"
        >
          Cop {NFTS[active].name} · {NFTS[active].price} SOL
          <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}
