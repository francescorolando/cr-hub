"use client";

import { useMemo, useState } from "react";
import CardTile from "./CardTile";
import { RARITIES, RARITY_LABELS } from "@/lib/api";
import { rarityKey } from "@/lib/rarity";

const SORTS = {
  nome: (a, b) => a.name.localeCompare(b.name),
  elisir_asc: (a, b) => (a.elixirCost ?? 99) - (b.elixirCost ?? 99),
  elisir_desc: (a, b) => (b.elixirCost ?? -1) - (a.elixirCost ?? -1),
  rarita: (a, b) => RARITIES.indexOf(rarityKey(a.rarity)) - RARITIES.indexOf(rarityKey(b.rarity)),
};

export default function CardsTab({ cards, loading, error }) {
  const [query, setQuery] = useState("");
  const [rarity, setRarity] = useState("tutte");
  const [sortKey, setSortKey] = useState("nome");

  const filtered = useMemo(() => {
    let list = cards || [];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (rarity !== "tutte") {
      list = list.filter((c) => rarityKey(c.rarity) === rarity);
    }
    return [...list].sort(SORTS[sortKey]);
  }, [cards, query, rarity, sortKey]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="cerca carta per nome…"
          className="min-w-[200px] flex-1 rounded-lg border border-panel-2 bg-panel px-4 py-2.5 text-sm text-ink outline-none focus:border-gold"
        />
        <select
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
          className="rounded-lg border border-panel-2 bg-panel px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
        >
          <option value="tutte">tutte le rarità</option>
          {RARITIES.map((r) => (
            <option key={r} value={r}>
              {RARITY_LABELS[r]}
            </option>
          ))}
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="rounded-lg border border-panel-2 bg-panel px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
        >
          <option value="nome">ordina: nome</option>
          <option value="elisir_asc">ordina: elisir crescente</option>
          <option value="elisir_desc">ordina: elisir decrescente</option>
          <option value="rarita">ordina: rarità</option>
        </select>
      </div>

      {loading && <p className="text-sm text-muted">carico l&apos;elenco carte…</p>}
      {error && <p className="text-sm text-crimson">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-xs text-muted">{filtered.length} carte</p>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {filtered.map((card) => (
              <CardTile key={card.id ?? card.name} card={card} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
