export const RARITY_STYLES = {
  common: { text: "text-common", border: "border-common", ring: "ring-common", dot: "bg-common", bg: "bg-common/12" },
  rare: { text: "text-rare", border: "border-rare", ring: "ring-rare", dot: "bg-rare", bg: "bg-rare/12" },
  epic: { text: "text-epic", border: "border-epic", ring: "ring-epic", dot: "bg-epic", bg: "bg-epic/12" },
  legendary: {
    text: "text-legendary",
    border: "border-legendary",
    ring: "ring-legendary",
    dot: "bg-legendary",
    bg: "bg-legendary/12",
  },
  champion: {
    text: "text-champion",
    border: "border-champion",
    ring: "ring-champion",
    dot: "bg-champion",
    bg: "bg-champion/12",
  },
};

export function rarityKey(rarity) {
  return (rarity || "common").toLowerCase();
}

export function rarityStyle(rarity) {
  return RARITY_STYLES[rarityKey(rarity)] || RARITY_STYLES.common;
}
