"use client";

import { useEffect, useState, useSyncExternalStore, useRef } from "react";
import { scrollStore, type ScrollState } from "@/lib/scroll-store";

/** Subscribe to global Lenis scroll state. */
export function useScrollState(): ScrollState {
  return useSyncExternalStore(
    scrollStore.subscribe,
    scrollStore.get,
    scrollStore.get,
  );
}

/** True only after the component has mounted on the client. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Media query hook (SSR-safe). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsTouch(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

/**
 * Smoothed, normalized pointer position (-1..1) relative to viewport center.
 * Returns a ref to avoid re-renders; read it inside RAF/animation loops.
 */
export function useMouseRef() {
  const ref = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return ref;
}
