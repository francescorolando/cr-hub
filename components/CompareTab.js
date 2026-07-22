"use client";

import { useMemo, useState } from "react";
import CardTile from "./CardTile";
import { RARITY_LABELS } from "@/lib/api";
import { rarityKey, rarityStyle } from "@/lib/rarity";

const MAX_SELECTION = 4;

export default function CompareTab({ cards, loading, error }) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const filtered = useMemo(() => {
    if (!query.trim()) return cards || [];
    const q = query.trim().toLowerCase();
    return (cards || []).filter((c) => c.name.toLowerCase().includes(q));
  }, [cards, query]);

  const selected = useMemo(
    () => (cards || []).filter((c) => selectedIds.includes(c.id ?? c.name)),
    [cards, selectedIds]
  );

  function toggle(card) {
    const id = card.id ?? card.name;
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, id];
    });
  }

  if (loading) return <p className="text-sm text-muted">carico l&apos;elenco carte…</p>;
  if (error) return <p className="text-sm text-crimson">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted">
        scegli fino a {MAX_SELECTION} carte da confrontare ({selected.length} selezionate).
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="cerca carta da aggiungere al confronto…"
        className="rounded-lg border border-panel-2 bg-panel px-4 py-2.5 text-sm text-ink outline-none focus:border-gold"
      />

      <div className="scrollbar-thin grid max-h-72 grid-cols-3 gap-3 overflow-y-auto rounded-lg bg-panel-2/40 p-3 sm:grid-cols-5 md:grid-cols-8">
        {filtered.map((card) => (
          <CardTile
            key={card.id ?? card.name}
            card={card}
            compact
            selected={selectedIds.includes(card.id ?? card.name)}
            onClick={() => toggle(card)}
          />
        ))}
      </div>

      {selected.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-panel-2">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="bg-panel-2 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">carta</th>
                <th className="px-4 py-3">rarità</th>
                <th className="px-4 py-3">costo elisir</th>
                <th className="px-4 py-3">livello massimo</th>
              </tr>
            </thead>
            <tbody>
              {selected.map((card) => {
                const style = rarityStyle(card.rarity);
                return (
                  <tr key={card.id ?? card.name} className="border-t border-panel-2">
                    <td className="flex items-center gap-3 px-4 py-3 font-semibold">
                      {card.iconUrls?.medium && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.iconUrls.medium} alt="" className="h-8 w-8 object-contain" />
                      )}
                      {card.name}
                    </td>
                    <td className={`px-4 py-3 ${style.text}`}>{RARITY_LABELS[rarityKey(card.rarity)]}</td>
                    <td className="px-4 py-3 font-num text-elixir">{card.elixirCost ?? "–"}</td>
                    <td className="px-4 py-3 font-num">{card.maxLevel ?? "–"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
