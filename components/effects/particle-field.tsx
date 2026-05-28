"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { scrollStore } from "@/lib/scroll-store";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  toxic: boolean;
}

/**
 * Ambient drifting "pollen" particle field. Drift intensifies with scroll
 * velocity. Performance: no per-particle shadowBlur (the canvas as a whole is
 * softened with a cheap CSS blur), capped DPR, ~40fps cap, and paused when
 * off-screen.
 */
export function ParticleField({
  className,
  count = 50,
  intensity = 1,
}: {
  className?: string;
  count?: number;
  intensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let last = 0;
    const frameInterval = 1000 / 40; // cap ~40fps
    const isMobile = window.innerWidth < 768;
    const n = Math.round((isMobile ? count * 0.45 : count) * intensity);
    const particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(0.1 + Math.random() * 0.35),
      r: 0.8 + Math.random() * 2,
      a: 0.12 + Math.random() * 0.5,
      toxic: Math.random() > 0.85,
    });

    resize();
    for (let i = 0; i < n; i++) particles.push(spawn());

    const draw = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      if (now - last < frameInterval) return;
      last = now;

      ctx.clearRect(0, 0, w, h);
      const vel = Math.min(Math.abs(scrollStore.get().velocity) * 0.4, 6);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy - vel * 0.3;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.toxic
          ? `rgba(184,255,90,${p.a})`
          : `rgba(255,213,74,${p.a})`;
        ctx.fill();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting && !reduced;
        if (next && !running) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!next) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    window.addEventListener("resize", resize);

    if (reduced) running = false;
    else raf = requestAnimationFrame(draw);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [count, intensity, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full", className)}
      style={{ filter: "blur(0.6px)" }}
      aria-hidden
    />
  );
}
