"use client";

import { motion } from "framer-motion";

function BeeGlyph() {
  return (
    <svg viewBox="0 0 40 30" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="fly-bee" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD54A" />
          <stop offset="100%" stopColor="#FF8A00" />
        </linearGradient>
      </defs>
      {/* wings */}
      <motion.g
        style={{ originX: "20px", originY: "12px" }}
        animate={{ scaleY: [1, 0.4, 1] }}
        transition={{ duration: 0.12, repeat: Infinity }}
      >
        <ellipse cx="16" cy="9" rx="6" ry="3" fill="#FFF7E0" opacity="0.5" />
        <ellipse cx="24" cy="9" rx="6" ry="3" fill="#FFF7E0" opacity="0.5" />
      </motion.g>
      {/* body */}
      <ellipse cx="20" cy="16" rx="9" ry="6" fill="url(#fly-bee)" />
      <rect x="14" y="11" width="2.5" height="10" rx="1" fill="#060606" opacity="0.7" />
      <rect x="19" y="10" width="2.5" height="12" rx="1" fill="#060606" opacity="0.7" />
      <rect x="24" y="11" width="2.5" height="10" rx="1" fill="#060606" opacity="0.7" />
    </svg>
  );
}

/** A bee that flies across the viewport on a gentle sine path. */
export function FlyingBee({
  top,
  size = 32,
  duration = 14,
  delay = 0,
  reverse = false,
}: {
  top: string;
  size?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute will-change-transform"
      style={{ top, width: size, height: size * 0.75 }}
      initial={{ x: reverse ? "105vw" : "-10vw" }}
      animate={{
        x: reverse ? "-10vw" : "105vw",
        y: [0, -26, 14, -18, 0],
      }}
      transition={{
        x: { duration, delay, repeat: Infinity, ease: "linear" },
        y: { duration: duration / 3, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <div
        style={{
          transform: reverse ? "scaleX(-1)" : undefined,
          filter: "drop-shadow(0 0 6px rgba(245,184,65,0.6))",
        }}
        className="h-full w-full"
      >
        <BeeGlyph />
      </div>
    </motion.div>
  );
}
