"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Canvas honeycomb grid with per-cell energy pulses that ripple from the
 * pointer. Performance: precomputed hex geometry, capped DPR, ~30fps throttle,
 * pointer math skipped when the cursor is away, and paused when off-screen.
 */
export function HoneycombGrid({
  className,
  size = 46,
  opacity = 0.5,
}: {
  className?: string;
  size?: number;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let last = 0;
    const frameInterval = 1000 / 30; // cap ~30fps
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const mouse = { x: -9999, y: -9999, active: false };
    const r = size;

    // Precompute unit hex vertices (pointy-top), scaled at draw time.
    const verts: { x: number; y: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      verts.push({ x: Math.cos(a), y: Math.sin(a) });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const hexPath = (cx: number, cy: number, rad: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const x = cx + rad * verts[i].x;
        const y = cy + rad * verts[i].y;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const draw = (time: number) => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      if (time - last < frameInterval) return;
      last = time;

      ctx.clearRect(0, 0, w, h);
      const hStep = r * 1.5;
      const vStep = r * Math.sqrt(3);
      const t = time * 0.0011;
      const outerR = r * 0.92;
      ctx.lineWidth = 1;

      for (let col = 0; col * hStep < w + r; col++) {
        const cx = col * hStep;
        const colOdd = col % 2;
        for (let row = 0; row * vStep < h + r; row++) {
          const cy = row * vStep + (colOdd ? vStep / 2 : 0);

          const wave = 0.5 + 0.5 * Math.sin(t + col * 0.5 + row * 0.4);
          let near = 0;
          if (mouse.active) {
            const dx = cx - mouse.x;
            const dy = cy - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 57600) near = 1 - Math.sqrt(d2) / 240; // 240^2
          }

          const alpha = (0.05 + wave * 0.06 + near * 0.5) * opacity;
          hexPath(cx, cy, outerR);
          ctx.strokeStyle = `rgba(245,184,65,${alpha})`;
          ctx.stroke();

          if (near > 0.15) {
            hexPath(cx, cy, r * 0.5);
            ctx.fillStyle = `rgba(255,213,74,${near * 0.18})`;
            ctx.fill();
          }
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active =
        mouse.x >= 0 && mouse.x <= w && mouse.y >= 0 && mouse.y <= h;
    };
    const onLeave = () => {
      mouse.active = false;
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

    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    if (reduced) {
      draw(0);
      running = false;
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [size, opacity, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full", className)}
      aria-hidden
    />
  );
}
