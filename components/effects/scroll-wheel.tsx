"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { scrollStore } from "@/lib/scroll-store";
import { useIsTouch, useMounted } from "@/lib/hooks";
import { useSound } from "@/components/providers/sound-provider";
import { CHIBBA_IMG } from "@/lib/images";

interface Spark {
  id: number;
  angle: number;
  dist: number;
}

export function ScrollWheel() {
  const isTouch = useIsTouch();
  const mounted = useMounted();
  const { play } = useSound();

  // Rotation integrates velocity; scaleX/Y give the squash & stretch.
  const rotation = useMotionValue(0);
  const velRaw = useMotionValue(0);
  const vel = useSpring(velRaw, { stiffness: 120, damping: 18, mass: 0.6 });

  const scaleY = useTransform(vel, [-40, 0, 40], [1.28, 1, 1.28]);
  const scaleX = useTransform(vel, [-40, 0, 40], [0.82, 1, 0.82]);
  const glow = useTransform(vel, [-40, 0, 40], [1, 0.35, 1]);
  const boxShadow = useTransform(
    glow,
    (g) => `0 0 ${18 + g * 40}px ${-6}px rgba(245,184,65,${0.4 + g * 0.5})`,
  );

  const [sparks, setSparks] = useState<Spark[]>([]);
  const sparkId = useRef(0);
  const progressRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isTouch) return;
    let raf = 0;
    let lastSpark = 0;

    const loop = (now: number) => {
      const { velocity, progress } = scrollStore.get();
      velRaw.set(velocity);
      // Integrate rotation from velocity (deg/frame).
      rotation.set(rotation.get() + velocity * 0.6);

      if (progressRef.current) {
        progressRef.current.textContent = `${Math.round(progress * 100)
          .toString()
          .padStart(2, "0")}`;
      }

      // Emit sparks when scrolling fast.
      if (Math.abs(velocity) > 8 && now - lastSpark > 60) {
        lastSpark = now;
        const id = sparkId.current++;
        const angle = Math.random() * Math.PI * 2;
        setSparks((s) => [...s.slice(-10), { id, angle, dist: 26 }]);
        setTimeout(
          () => setSparks((s) => s.filter((sp) => sp.id !== id)),
          600,
        );
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isTouch, rotation, velRaw]);

  if (isTouch || !mounted) return null;

  return (
    <motion.button
      aria-label="Scroll velocity indicator"
      onClick={() => {
        play("bzz");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="fixed bottom-6 right-6 z-[90] hidden h-20 w-20 place-items-center md:grid"
      style={{ scaleX, scaleY }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.6, duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.08 }}
    >
      {/* Glow halo */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ boxShadow }}
      />

      {/* Sparks */}
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-toxic"
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: Math.cos(s.angle) * 44,
            y: Math.sin(s.angle) * 44,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Rotating honeycomb ring */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        style={{ rotate: rotation }}
      >
        <defs>
          <linearGradient id="wheel-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD54A" />
            <stop offset="100%" stopColor="#FF8A00" />
          </linearGradient>
        </defs>
        <polygon
          points="50,6 88,28 88,72 50,94 12,72 12,28"
          fill="none"
          stroke="url(#wheel-grad)"
          strokeWidth="2"
          opacity="0.85"
        />
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (Math.PI / 3) * i + Math.PI / 6;
          return (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 38 * Math.cos(a)}
              y2={50 + 38 * Math.sin(a)}
              stroke="url(#wheel-grad)"
              strokeWidth="1"
              opacity="0.4"
            />
          );
        })}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (Math.PI / 3) * i;
          return (
            <circle
              key={i}
              cx={50 + 30 * Math.cos(a)}
              cy={50 + 30 * Math.sin(a)}
              r="2.4"
              fill="#FFD54A"
            />
          );
        })}
      </motion.svg>

      {/* Static glass core with the cowboy gooner */}
      <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full glass-amber">
        <img
          src={CHIBBA_IMG.spinner}
          alt="Chibba"
          className="h-[140%] w-[140%] object-contain object-top"
          style={{
            filter: "drop-shadow(0 0 8px rgba(245,184,65,0.5))",
          }}
          draggable={false}
        />
      </span>

      <p
        ref={progressRef}
        className="absolute -bottom-5 font-display text-[9px] tracking-[0.3em] text-amber/60"
      >
        00
      </p>
    </motion.button>
  );
}
