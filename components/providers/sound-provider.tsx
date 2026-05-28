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
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

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

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
    };
  }, []);

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>
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
