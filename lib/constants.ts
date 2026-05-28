export const CHIBBA = {
  name: "CHIBBA",
  aliases: ["Goon Bee", "BZZ", "The Hive"],
  tagline: "The hive-mind protocol of internet culture on Solana.",
  contract: "7E4sijx3xTEuEnWw7qGhpsfvHfjtsCZjDvwzKTaapump",
  /** Live PumpSwap pair (pump.fun coin) on Solana. */
  pair: "6CxP3Y1K7YNZUcVUi7A6i8ThsgN5JVwk1TimLXG3Hb3S",
  links: {
    twitter: "https://x.com/chibba_sol",
    magicEden: "https://magiceden.us/marketplace/chibba_86",
    tensor: "https://www.tensor.trade/trade/chibba",
    dexscreener:
      "https://dexscreener.com/solana/6CxP3Y1K7YNZUcVUi7A6i8ThsgN5JVwk1TimLXG3Hb3S",
    pumpfun:
      "https://pump.fun/coin/7E4sijx3xTEuEnWw7qGhpsfvHfjtsCZjDvwzKTaapump",
    /** Embeddable live candlestick chart (dark, chrome-stripped). */
    chartEmbed:
      "https://dexscreener.com/solana/6CxP3Y1K7YNZUcVUi7A6i8ThsgN5JVwk1TimLXG3Hb3S?embed=1&theme=dark&trades=0&info=0&tabs=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartType=usd&interval=15",
  },
} as const;

export const COLORS = {
  amber: "#F5B841",
  hive: "#FFD54A",
  toxic: "#B8FF5A",
  neon: "#FF8A00",
  void: "#060606",
  graphite: "#111111",
  deep: "#0A0A0A",
} as const;

export const NAV_LINKS = [
  { label: "Hive", href: "/#hive" },
  { label: "Lore", href: "/#lore" },
  { label: "NFTs", href: "/technology" },
] as const;
