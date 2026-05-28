"use client";

import { useEffect, useRef } from "react";
import { useIsTouch, useMounted } from "@/lib/hooks";
import { lerp } from "@/lib/utils";

export function CustomCursor() {
  const isTouch = useIsTouch();
  const mounted = useMounted();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch) return;
    document.documentElement.classList.add("custom-cursor-active");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let hovering = false;
    let down = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);

    const isInteractive = (el: Element | null) =>
      !!el?.closest(
        "a, button, [role='button'], input, textarea, [data-cursor='hover']",
      );

    const onOver = (e: PointerEvent) => {
      hovering = isInteractive(e.target as Element);
    };

    const render = () => {
      ring.x = lerp(ring.x, mouse.x, 0.18);
      ring.y = lerp(ring.y, mouse.y, 0.18);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        const scale = (hovering ? 1.9 : 1) * (down ? 0.8 : 1);
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.opacity = hovering ? "1" : "0.6";
        ringRef.current.style.borderColor = hovering
          ? "rgba(184,255,90,0.9)"
          : "rgba(245,184,65,0.7)";
      }
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  if (isTouch || !mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] hidden md:block">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-8 w-8 rounded-full border transition-[opacity,border-color] duration-200"
        style={{
          boxShadow: "0 0 18px -2px rgba(245,184,65,0.6)",
          backdropFilter: "invert(2%)",
        }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-hive"
        style={{ boxShadow: "0 0 12px 2px rgba(255,213,74,0.9)" }}
      />
    </div>
  );
}
