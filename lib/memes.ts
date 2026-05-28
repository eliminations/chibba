/**
 * Meme/swarm asset manifest.
 *
 * Drop real assets into /public/{memes,transparent,animated,swarm} and add
 * their `src` below. Any entry without a resolvable `src` renders a procedural
 * holographic frame instead, so the swarm always looks intentional — memes are
 * blended into the atmosphere, never pasted on.
 */

export interface MemeEntry {
  id: string;
  label: string;
  /** Optional real asset path, e.g. "/swarm/goon-01.png". */
  src?: string;
  /** Depth layer 0 (far/blurred) -> 1 (near/sharp). Drives parallax + blur. */
  depth: number;
}

export const SWARM_MEMES: MemeEntry[] = [
  { id: "m1", label: "NO BRAKES", src: "/chibba/c18.png", depth: 0.2 },
  { id: "m2", label: "AGAIN?", src: "/chibba/c06.png", depth: 0.55 },
  { id: "m3", label: "BOSS BEE", src: "/chibba/c26.png", depth: 0.85 },
  { id: "m4", label: "MONEY", src: "/chibba/c08.png", depth: 0.35 },
  { id: "m5", label: "LOCKED IN", src: "/chibba/c24.png", depth: 0.7 },
  { id: "m6", label: "SCOPED", src: "/chibba/c28.png", depth: 0.15 },
  { id: "m7", label: "COOK", src: "/chibba/c34.png", depth: 0.9 },
  { id: "m8", label: "DISASTER", src: "/chibba/c10.png", depth: 0.45 },
];
