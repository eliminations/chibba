/**
 * Central registry for Chibba brand imagery.
 *
 * Swap a path here and it updates everywhere that image is used — no need to
 * hunt through components. When you drop in background-removed / new art, just
 * change the value (keep the key). Meme-swarm assets live in `lib/memes.ts`,
 * and NFT PFPs come from the collection manifest in `lib/nfts.ts`.
 */
export const CHIBBA_IMG = {
  /** Homepage hero centerpiece (transparent flying gooner bee). */
  hero: "/chibba/hero-bee.png",
  /** Loading screen bee. */
  loader: "/chibba/hero-bee.png",
  /** Round navbar avatar. */
  navbarLogo: "/chibba/c19.png",
  /** Footer "transmission complete" avatar. */
  footerAvatar: "/chibba/c26.png",
  /** Giant dreaming bee behind the lore words (Mamba x Chibba). */
  lore: "/chibba/lore-bee.png",
  /** Scene behind the technology hero ("pick your poison" casino bee). */
  techHud: "/chibba/tech-hero.png",
  /** Bottom-right scroll-velocity wheel core (cowboy gooner). */
  spinner: "/chibba/spinner-bee.png",
  /** Tensor marketplace mark (white). */
  tensorLogo: "/chibba/logo-tensor.png",
} as const;
