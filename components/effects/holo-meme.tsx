"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MemeEntry } from "@/lib/memes";

/**
 * Atmospheric holographic frame for a meme/swarm asset. If `src` resolves it's
 * shown with cinematic treatment (glow, scanlines, chromatic edge); otherwise a
 * procedural hive glyph stands in so the swarm always feels designed.
 */
export function HoloMeme({
  entry,
  className,
}: {
  entry: MemeEntry;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const showImage = entry.src && !broken;

  return (
    <div
      className={cn(
        "group relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-amber/15 bg-black/50",
        className,
      )}
      style={{ boxShadow: "0 0 30px -12px rgba(245,184,65,0.5)" }}
    >
      {/* Holographic gradient base */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,184,65,0.12),transparent_45%,rgba(184,255,90,0.08))]" />

      {showImage ? (
        <img
          src={entry.src}
          alt={entry.label}
          loading="lazy"
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-95 saturate-[1.1] transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
          draggable={false}
        />
      ) : (
        <ProceduralGlyph label={entry.label} />
      )}

      {/* Scanlines */}
      <div className="scanlines absolute inset-0" />

      {/* Chromatic edge glow on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-xl ring-1 ring-toxic/40" />
      </div>
    </div>
  );
}

function ProceduralGlyph({ label }: { label: string }) {
  const seed = label.length;
  return (
    <svg
      viewBox="0 0 100 130"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`g-${seed}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFD54A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#060606" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="130" fill={`url(#g-${seed})`} />
      {/* Hex glyph */}
      <polygon
        points="50,40 68,52 68,74 50,86 32,74 32,52"
        fill="none"
        stroke="#F5B841"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <polygon
        points="50,52 60,58 60,68 50,74 40,68 40,58"
        fill="#FFD54A"
        opacity="0.25"
      />
      {/* Glitch bars */}
      {Array.from({ length: 4 }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={20 + ((seed * 13 + i * 27) % 90)}
          width="100"
          height={i % 2 ? 1 : 0.5}
          fill="#B8FF5A"
          opacity="0.18"
        />
      ))}
    </svg>
  );
}
