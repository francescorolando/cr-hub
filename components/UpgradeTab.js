"use client";

import { useMemo, useState } from "react";
import UpgradeCardRow from "./UpgradeCardRow";
import { RARITIES, RARITY_LABELS } from "@/lib/api";
import { rarityKey, rarityStyle } from "@/lib/rarity";
import { remainingToMax, levelWindowBlocks, formatNumber } from "@/lib/cardLeveling";
import { cardNameIt } from "@/lib/cardNamesIt";
import { usePlayer } from "@/lib/PlayerContext";

const SORTS = {
  carte_desc: (a, b) => b.cardsNeeded - a.cardsNeeded,
  carte_asc: (a, b) => a.cardsNeeded - b.cardsNeeded,
  oro_desc: (a, b) => b.goldNeeded - a.goldNeeded,
  oro_asc: (a, b) => a.goldNeeded - b.goldNeeded,
  livello_desc: (a, b) => b.level - a.level,
  livello_asc: (a, b) => a.level - b.level,
  copie_desc: (a, b) => (b.count ?? 0) - (a.count ?? 0),
  copie_asc: (a, b) => (a.count ?? 0) - (b.count ?? 0),
  nome: (a, b) => a.displayName.localeCompare(b.displayName, "it"),
};

export default function UpgradeTab() {
  const { player, loading } = usePlayer();
  const [query, setQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState("tutte");
  const [onlyNotMaxed, setOnlyNotMaxed] = useState(false);
  const [sortKey, setSortKey] = useState("nome");

  const rows = useMemo(() => {
    return (player?.cards || []).map((c) => {
      const key = rarityKey(c.rarity);
      const { cardsNeeded, goldNeeded, gemsNeeded, maxed } = remainingToMax({
        rarity: key,
        level: c.level,
        maxLevel: c.maxLevel,
        count: c.count,
      });
      const blocks = levelWindowBlocks({ rarity: key, level: c.level, maxLevel: c.maxLevel, count: c.count });
      return {
        ...c,
        rarityKey: key,
        cardsNeeded,
        goldNeeded,
        gemsNeeded,
        maxed,
        blocks,
        displayName: cardNameIt(c.name),
      };
    });
  }, [player]);

  const totals = useMemo(() => {
    const perRarity = Object.fromEntries(
      RARITIES.map((r) => [r, { cards: 0, gold: 0, gems: 0, maxed: 0, total: 0 }])
    );
    let cards = 0;
    let gold = 0;
    let gems = 0;
    let maxed = 0;
    for (const row of rows) {
      cards += row.cardsNeeded;
      gold += row.goldNeeded;
      gems += row.gemsNeeded;
      if (row.maxed) maxed += 1;
      const bucket = perRarity[row.rarityKey];
      if (bucket) {
        bucket.cards += row.cardsNeeded;
        bucket.gold += row.goldNeeded;
        bucket.gems += row.gemsNeeded;
        bucket.total += 1;
        if (row.maxed) bucket.maxed += 1;
      }
    }
    return { cards, gold, gems, maxed, total: rows.length, perRarity };
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => c.displayName.toLowerCase().includes(q));
    }
    if (onlyNotMaxed) list = list.filter((c) => !c.maxed);
    if (rarityFilter !== "tutte") list = list.filter((c) => c.rarityKey === rarityFilter);
    return list;
  }, [rows, query, onlyNotMaxed, rarityFilter]);

  const groups = useMemo(() => {
    const byRarity = Object.fromEntries(RARITIES.map((r) => [r, []]));
    for (const row of filtered) {
      byRarity[row.rarityKey]?.push(row);
    }
    for (const r of RARITIES) {
      byRarity[r].sort(SORTS[sortKey]);
    }
    return byRarity;
  }, [filtered, sortKey]);

  const visibleRarities = rarityFilter === "tutte" ? RARITIES : [rarityFilter];

  if (!player) {
    return (
      <p className="text-base text-muted">
        {loading
          ? "Carico dati live dall'API…"
          : "Nessun profilo selezionato: usa il menu in alto a destra per cercarne uno. Qui vedrai le sue carte, divise per rarità, con quanto manca in copie e oro per portarle al massimo."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile label="Carte al massimo" value={`${totals.maxed}/${totals.total}`} />
        <StatTile label="Carte rimanenti (totale)" value={formatNumber(totals.cards)} />
        <StatTile label="Oro rimanente (totale)" value={formatNumber(totals.gold)} accent />
        <StatTile label="Gemme rimanenti (~totale)" value={formatNumber(totals.gems)} gem />
        <StatTile label="Dati" value="Live dal profilo" small className="col-span-2 sm:col-span-1" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca tra le tue carte…"
          className="w-full rounded-lg border-2 border-panel-2 bg-panel px-4 py-2.5 text-sm text-ink outline-none focus:border-gold sm:min-w-50 sm:flex-1"
        />
        <select
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value)}
          className="w-full rounded-lg border-2 border-panel-2 bg-panel px-3 py-2.5 text-sm text-ink outline-none focus:border-gold sm:w-auto"
        >
          <option value="tutte">Tutte le rarità</option>
          {RARITIES.map((r) => (
            <option key={r} value={r}>
              {RARITY_LABELS[r]}
            </option>
          ))}
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="w-full rounded-lg border-2 border-panel-2 bg-panel px-3 py-2.5 text-sm text-ink outline-none focus:border-gold sm:w-auto"
        >
          <option value="carte_desc">Ordina: più carte rimanenti</option>
          <option value="carte_asc">Ordina: meno carte rimanenti</option>
          <option value="oro_desc">Ordina: più oro rimanente</option>
          <option value="oro_asc">Ordina: meno oro rimanente</option>
          <option value="livello_desc">Ordina: livello più alto</option>
          <option value="livello_asc">Ordina: livello più basso</option>
          <option value="copie_desc">Ordina: più copie possedute</option>
          <option value="copie_asc">Ordina: meno copie possedute</option>
          <option value="nome">Ordina: nome</option>
        </select>
        <label className="flex w-full items-center gap-2 rounded-lg border-2 border-panel-2 bg-panel px-3 py-2.5 text-sm text-muted sm:w-auto">
          <input
            type="checkbox"
            checked={onlyNotMaxed}
            onChange={(e) => setOnlyNotMaxed(e.target.checked)}
            className="accent-gold"
          />
          Solo non al massimo
        </label>
      </div>

      {visibleRarities.map((r) => {
        const list = groups[r];
        if (!list || list.length === 0) return null;
        const style = rarityStyle(r);
        const subtotal = totals.perRarity[r];
        return (
          <section key={r} className="flex flex-col gap-2">
            <div
              className={`flex flex-wrap items-baseline justify-between gap-2 border-l-4 ${style.border} pl-3`}
            >
              <h2 className={`text-base font-bold sm:text-lg ${style.text}`}>{RARITY_LABELS[r]}</h2>
              <p className="font-num text-xs text-muted sm:text-sm">
                {subtotal.maxed}/{subtotal.total} al massimo · {formatNumber(subtotal.cards)} carte ·{" "}
                {formatNumber(subtotal.gold)} oro · ≈{formatNumber(subtotal.gems)} gemme rimanenti
              </p>
            </div>
            <div className="shadow-soft rounded-lg border-2 border-panel-2 bg-panel px-4 [&>*:first-child]:border-t-0">
              {list.map((card) => (
                <UpgradeCardRow key={card.id ?? card.name} card={card} blocks={card.blocks} />
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && <p className="text-sm text-muted">Nessuna carta corrisponde ai filtri.</p>}
    </div>
  );
}

function StatTile({ label, value, accent, gem, small, className = "" }) {
  const color = accent ? "text-gold" : gem ? "text-gem" : "text-ink";
  return (
    <div className={`rounded-lg bg-panel-2 px-3 py-2 sm:px-3.5 sm:py-2.5 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs">{label}</p>
      <p className={`font-num ${small ? "text-sm sm:text-base" : "text-lg sm:text-xl"} font-bold ${color}`}>{value}</p>
    </div>
  );
}
