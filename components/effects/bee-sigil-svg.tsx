import { cn } from "@/lib/utils";

/**
 * Geometric hive/bee sigil rendered as crisp SVG. Used in the loading screen,
 * nav mark, and as a fallback for the 3D centerpiece.
 */
export function BeeSigilSvg({
  className,
  glow = true,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="bee-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD54A" />
          <stop offset="55%" stopColor="#F5B841" />
          <stop offset="100%" stopColor="#FF8A00" />
        </linearGradient>
        {glow && (
          <filter id="bee-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g
        stroke="url(#bee-grad)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={glow ? "url(#bee-glow)" : undefined}
      >
        {/* Outer hexagon */}
        <polygon
          points="100,18 168,58 168,142 100,182 32,142 32,58"
          opacity="0.5"
        />
        {/* Inner hexagon */}
        <polygon
          points="100,52 138,74 138,126 100,148 62,126 62,74"
          opacity="0.85"
        />
        {/* Core honeycomb cell */}
        <polygon
          points="100,78 120,90 120,114 100,126 80,114 80,90"
          fill="url(#bee-grad)"
          fillOpacity="0.22"
        />
        {/* Wing arcs */}
        <path d="M70 100 C 40 70, 20 90, 36 120" opacity="0.7" />
        <path d="M130 100 C 160 70, 180 90, 164 120" opacity="0.7" />
        {/* Antennae */}
        <path d="M88 60 C 80 40, 70 36, 66 30" opacity="0.6" />
        <path d="M112 60 C 120 40, 130 36, 134 30" opacity="0.6" />
        <circle cx="64" cy="28" r="3.5" fill="url(#bee-grad)" />
        <circle cx="136" cy="28" r="3.5" fill="url(#bee-grad)" />
        {/* Center node */}
        <circle cx="100" cy="102" r="6" fill="url(#bee-grad)" />
      </g>
    </svg>
  );
}
