"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type SoundType = "hover" | "click" | "bzz";

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  play: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

/**
 * Web-Audio based sound architecture. Synthesizes subtle hive cues on the fly
 * so no audio assets are required. Never autoplays — only fires after the user
 * has enabled sound (which also satisfies the browser gesture requirement).
 */
const MUSIC_SRC = "/audio/chibba-theme.mp3";
const MUSIC_VOLUME = 0.32;

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  const ensureContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    if (ctxRef.current?.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      if (!enabled) return;
      const ctx = ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";

      const cfg: Record<
        SoundType,
        { freq: number; type: OscillatorType; vol: number; dur: number }
      > = {
        hover: { freq: 420, type: "sine", vol: 0.04, dur: 0.08 },
        click: { freq: 180, type: "triangle", vol: 0.08, dur: 0.14 },
        bzz: { freq: 90, type: "sawtooth", vol: 0.05, dur: 0.22 },
      };
      const c = cfg[type];

      osc.type = c.type;
      osc.frequency.setValueAtTime(c.freq, now);
      if (type === "bzz") {
        osc.frequency.exponentialRampToValueAtTime(c.freq * 1.6, now + c.dur);
      }
      filter.frequency.setValueAtTime(c.freq * 6, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(c.vol, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + c.dur);

      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + c.dur + 0.02);
    },
    [enabled, ensureContext],
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (next) ensureContext();
      return next;
    });
  }, [ensureContext]);

  // Background music follows the global `enabled` flag: fades in when the user
  // unmutes (a gesture, so autoplay is allowed) and fades out when muted.
  useEffect(() => {
    const el = musicRef.current;
    if (!el) return;

    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);

    const target = enabled ? MUSIC_VOLUME : 0;
    const step = enabled ? 0.02 : 0.04;

    if (enabled) {
      el.volume = el.volume || 0;
      void el.play().catch(() => {});
    }

    const tick = () => {
      if (!el) return;
      const diff = target - el.volume;
      if (Math.abs(diff) <= step) {
        el.volume = target;
        if (!enabled) el.pause();
        fadeRef.current = null;
        return;
      }
      el.volume = Math.min(1, Math.max(0, el.volume + Math.sign(diff) * step));
      fadeRef.current = requestAnimationFrame(tick);
    };
    fadeRef.current = requestAnimationFrame(tick);

    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    };
  }, [enabled]);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
    };
  }, []);

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>
      <audio ref={musicRef} src={MUSIC_SRC} loop preload="auto" />
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    // Safe no-op fallback so components can call useSound() freely.
    return {
      enabled: false,
      toggle: () => {},
      play: () => {},
    } as SoundContextValue;
  }
  return ctx;
}
