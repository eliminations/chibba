export type Rarity = "Common" | "Rare" | "Epic" | "Mythic" | "Hive";

export interface NftItem {
  id: string;
  name: string;
  rank: number;
  rarity: Rarity;
  accent: string;
  /** Listed price in SOL. */
  price: number;
  /** Solana mint address (for Magic Eden item link). */
  mint: string;
  /** Headline trait shown on the card. */
  trait: string;
  /** Local image path. */
  src: string;
}

const ACCENT_BY_BODY: Record<string, string> = {
  Yellow: "#FFD54A",
  Tanned: "#F5B841",
  Purp: "#B388FF",
  Sick: "#B8FF5A",
  Shrek: "#9BE564",
};

function rarityFromRank(rank: number): Rarity {
  if (rank <= 80) return "Hive";
  if (rank <= 200) return "Mythic";
  if (rank <= 350) return "Epic";
  if (rank <= 480) return "Rare";
  return "Common";
}

/**
 * Real Chibba 86 PFPs, pulled from the Magic Eden listings API and mirrored
 * into /public/chibba/nft. Sorted by rarity rank (lower = rarer).
 */
const RAW: Array<{
  num: string;
  rank: number;
  price: number;
  mint: string;
  head: string;
  misc: string;
  body: string;
}> = [
  { num: "12", rank: 58, price: 0.089, mint: "5sc7ucFfKqdWD1o34zvoifmeFkmnFy7iYVGRZRLhYoeB", head: "Crown", misc: "Rain", body: "Purp" },
  { num: "1083", rank: 67, price: 0.3, mint: "", head: "Arcteryx", misc: "Axe", body: "Sick" },
  { num: "463", rank: 117, price: 1, mint: "", head: "Halo", misc: "Rain", body: "Tanned" },
  { num: "494", rank: 228, price: 0.26, mint: "B6M2WtBRWqmncwqmVPqfzVPb4TFwJcGDaDAYUmr2tiVf", head: "General", misc: "TAKE THIS", body: "Purp" },
  { num: "804", rank: 244, price: 0.128, mint: "", head: "Arcteryx", misc: "None", body: "Purp" },
  { num: "6", rank: 258, price: 0.1, mint: "5x5QnQugFqFrq7MNE8S9S7P4p4dXKCtFwGugCMybeWWr", head: "Green Beeret", misc: "Weed", body: "Tanned" },
  { num: "545", rank: 275, price: 0.128, mint: "", head: "Beesknees Teal", misc: "Red Flower", body: "Yellow" },
  { num: "913", rank: 284, price: 1.1, mint: "", head: "Red Niqab", misc: "Pookie", body: "Sick" },
  { num: "82", rank: 296, price: 0.89, mint: "", head: "Beesknees Green", misc: "Cute", body: "Tanned" },
  { num: "211", rank: 344, price: 0.6, mint: "", head: "Fedora", misc: "Rain", body: "Tanned" },
  { num: "48", rank: 382, price: 0.123, mint: "EToLMyJNUgMczBfsVrc8ECScRYpiFW2Jt4cm2rSH58Be", head: "Crown", misc: "Scoped", body: "Shrek" },
  { num: "851", rank: 413, price: 0.75, mint: "", head: "Crimson Niqab", misc: "Axe", body: "Shrek" },
  { num: "210", rank: 421, price: 0.611, mint: "", head: "General", misc: "TAKE THIS", body: "Purp" },
  { num: "1020", rank: 438, price: 0.228, mint: "BEpgMGhrFevbrgJ3WGEdYwjEou1JoeiCqEaCyGFKY2JE", head: "Beesknees Red", misc: "Bear Plushie", body: "Tanned" },
  { num: "431", rank: 469, price: 1.15, mint: "", head: "Red Niqab", misc: "AK", body: "Tanned" },
  { num: "806", rank: 478, price: 0.395, mint: "", head: "Red Niqab", misc: "Instagram", body: "Purp" },
  { num: "338", rank: 484, price: 0.2, mint: "795PyDdv4rMs2UhEJxWsYMqFRmMqq5mQxZ958NFjG51n", head: "Green Beeret", misc: "Scoped", body: "Yellow" },
  { num: "161", rank: 521, price: 0.351, mint: "", head: "Green Beeret", misc: "None", body: "Sick" },
];

export const NFTS: NftItem[] = RAW.map((r) => ({
  id: r.num,
  name: `Chibba #${r.num}`,
  rank: r.rank,
  rarity: rarityFromRank(r.rank),
  accent: ACCENT_BY_BODY[r.body] ?? "#F5B841",
  price: r.price,
  mint: r.mint,
  trait: r.misc && r.misc !== "None" ? r.misc : r.head,
  src: `/chibba/nft/${r.num}.png`,
}));

export const COLLECTION = {
  name: "Chibba",
  size: 1100,
  magicEden: "https://magiceden.us/marketplace/chibba_86",
  tensor: "https://www.tensor.trade/trade/chibba",
  item: (mint: string) =>
    mint
      ? `https://magiceden.us/item-details/${mint}`
      : "https://magiceden.us/marketplace/chibba_86",
} as const;
