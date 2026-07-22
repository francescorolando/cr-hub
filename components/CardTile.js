"use client";

import { RARITY_LABELS } from "@/lib/api";
import { rarityKey, rarityStyle } from "@/lib/rarity";
import { cardNameIt } from "@/lib/cardNamesIt";

export default function CardTile({ card, owned, selected, onClick, compact }) {
  const style = rarityStyle(card.rarity);
  const key = rarityKey(card.rarity);
  const iconUrl = card.iconUrls?.medium || card.iconUrls?.evolutionMedium;
  const name = cardNameIt(card.name);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`card-shape relative flex flex-col items-center gap-1 border-2 bg-panel px-2 pt-3 pb-2 text-center transition
        ${style.border} ${selected ? `ring-2 ${style.ring} ring-offset-2 ring-offset-royal` : "opacity-90 hover:opacity-100"}
        ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <span
        className={`absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full border border-elixir bg-royal-deep font-num text-xs font-bold text-elixir`}
        title="Costo elisir"
      >
        {card.elixirCost ?? "–"}
      </span>

      {iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconUrl} alt={name} className={compact ? "h-12 w-12 object-contain" : "h-16 w-16 object-contain"} />
      ) : (
        <div className="h-16 w-16 rounded bg-panel-2" />
      )}

      <span className="line-clamp-2 text-xs font-semibold leading-tight text-ink">{name}</span>
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.text} ${style.bg}`}
      >
        {RARITY_LABELS[key] || key}
      </span>

      {owned && (
        <span className="mt-1 flex items-center gap-1 rounded-full bg-panel-2 px-2 py-0.5 font-num text-[10px] text-muted">
          Liv. {owned.level}/{owned.maxLevel} · x{owned.count}
        </span>
      )}
    </button>
  );
}
