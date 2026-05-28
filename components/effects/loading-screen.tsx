"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CHIBBA_IMG } from "@/lib/images";

const PHRASES = [
  "WAKING THE BEE",
  "SYNCING THE HIVE",
  "HONEYMAXXING",
  "WE'RE SO BACK",
];

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [phrase, setPhrase] = useState(PHRASES[0]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    let raf = 0;
    const start = performance.now();
    const DURATION = 2400;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-out with a little organic jitter
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.min(100, Math.round(eased * 100));
      setProgress(value);
      setPhrase(PHRASES[Math.min(PHRASES.length - 1, Math.floor(t * 4))]);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          document.body.style.overflow = "";
        }, 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-void scanlines"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
        >
          {/* Ambient radial glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,184,65,0.14),transparent_60%)] blur-2xl" />

          {/* Floating particles */}
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-hive"
              style={{
                left: `${(i * 47) % 100}%`,
                top: `${(i * 89) % 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3 + (i % 5),
                repeat: Infinity,
                delay: i * 0.13,
                ease: "easeInOut",
              }}
            />
          ))}

          <motion.div
            className="relative h-44 w-44 md:h-56 md:w-56"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Rotating energy ring */}
            <motion.div
              className="absolute -inset-3 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, rgba(245,184,65,0.5), transparent 35%)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            {/* Pulsing Chibba */}
            <motion.img
              src={CHIBBA_IMG.loader}
              alt="Chibba"
              className="absolute inset-0 h-full w-full object-contain"
              style={{
                filter: "drop-shadow(0 0 30px rgba(245,184,65,0.6))",
              }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              draggable={false}
            />
          </motion.div>

          <motion.h2
            className="mt-10 font-display text-lg font-semibold tracking-[0.5em] text-hive glow-text md:text-2xl"
            key={phrase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {phrase}
          </motion.h2>

          {/* Progress bar */}
          <div className="mt-8 h-px w-64 overflow-hidden bg-white/10 md:w-80">
            <motion.div
              className="h-full bg-gradient-to-r from-amber via-hive to-neon"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 font-display text-xs tracking-[0.4em] text-amber/70">
            {String(progress).padStart(3, "0")}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
