"use client";

import { useEffect, useState } from "react";

// I jolly (Wild Card) del giocatore NON sono esposti dall'API ufficiale:
// verificato il 2026-10-16 su /players/{tag} (nessun campo di inventario,
// né jolly né oro né gemme) e sugli endpoint per giocatore (inventory,
// items, magicitems, wallet, resources, chests rispondono tutti 404). Per
// questo li inserisce il giocatore a mano, e si salvano nel browser per tag.
const STORAGE_KEY = "cr_wild_cards";

// Limite di inventario per rarità in base al livello del Re (expLevel
// dell'API, quello sì è live). Fonte: clashroyale.fandom.com/wiki/Magic_Items,
// tabella "Inventory Limits" (ultima modifica 2026-07-20). Riscontro
// incrociato: dal livello 42 i limiti di comuni/rari/leggendari coincidono
// con le copie richieste dal livello 15 al 16 in lib/cardLeveling.js
// (7500/1400/20), come dice la pagina stessa.
//
// Il limite NON è un tetto rigido: i jolly da offerte del negozio o da
// Lucky Drop lo possono superare. Per questo l'input non lo blocca, lo
// mostra solo come riferimento.
const WILD_CARD_LIMITS = [
  // [livello del Re minimo, { limiti per rarità }]
  [1, { common: 50, rare: 20, epic: 2, legendary: 1, champion: 1 }],
  [7, { common: 50, rare: 20, epic: 4, legendary: 1, champion: 1 }],
  [14, { common: 100, rare: 20, epic: 10, legendary: 1, champion: 1 }],
  [18, { common: 200, rare: 50, epic: 10, legendary: 1, champion: 1 }],
  [22, { common: 400, rare: 100, epic: 10, legendary: 1, champion: 1 }],
  [26, { common: 800, rare: 200, epic: 20, legendary: 2, champion: 1 }],
  [30, { common: 1000, rare: 400, epic: 50, legendary: 4, champion: 1 }],
  [34, { common: 2000, rare: 800, epic: 100, legendary: 10, champion: 2 }],
  [38, { common: 7500, rare: 1000, epic: 200, legendary: 20, champion: 8 }],
  [42, { common: 7500, rare: 1400, epic: 200, legendary: 20, champion: 20 }],
];

export function wildCardLimits(kingLevel) {
  let limits = WILD_CARD_LIMITS[0][1];
  for (const [minLevel, row] of WILD_CARD_LIMITS) {
    if ((kingLevel ?? 1) >= minLevel) limits = row;
  }
  return limits;
}

function readAll() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

// { counts: { common: 120, ... }, updatedAt: "2026-10-16T..." } per il tag
// richiesto. Una rarità assente da counts = mai inserita (diverso da 0).
export function useWildCards(tag) {
  const [all, setAll] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAll(readAll());
    setHydrated(true);
  }, []);

  const entry = all[tag] || { counts: {}, updatedAt: null };

  function setCount(rarity, value) {
    const counts = { ...entry.counts };
    if (value === null) delete counts[rarity];
    else counts[rarity] = value;
    const next = { ...all, [tag]: { counts, updatedAt: new Date().toISOString() } };
    setAll(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage pieno o bloccato: il valore resta valido per questa sessione
    }
  }

  return { counts: entry.counts, updatedAt: entry.updatedAt, setCount, hydrated };
}
