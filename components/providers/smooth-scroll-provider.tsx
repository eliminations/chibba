"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollStore } from "@/lib/scroll-store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      lerp: 0.1,
    });
    lenisRef.current = lenis;

    lenis.on(
      "scroll",
      ({
        scroll,
        velocity,
        progress,
        direction,
      }: {
        scroll: number;
        velocity: number;
        progress: number;
        direction: 1 | -1 | 0;
      }) => {
        scrollStore.set({ scroll, velocity, progress, direction });
        ScrollTrigger.update();
      },
    );

    // Drive both Lenis and GSAP from a single RAF loop.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor links should be handled by Lenis for smooth jumps.
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a[href^='#'], a[href*='/#']");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;
      const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.4 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
