"use client";

import { useEffect, useState } from "react";
import { rarityKey } from "@/lib/rarity";

// l'API non dice mai quale carta occupa davvero lo slot Evoluzione/Eroe in UN
// mazzo specifico (evolutionLevel riflette solo lo sblocco del giocatore, non
// lo slot attivo): quindi lasciamo che sia il giocatore a confermarlo a mano.
// Il mazzo ha esattamente 3 slot speciali con regole fisse:
//   slot 1: normale / Evoluzione
//   slot 2: normale / Eroe / Campione
//   slot 3 (jolly): normale / Eroe / Evoluzione / Campione
// Il Campione è sempre rilevabile con certezza dalla rarità della carta
// (dato live dall'API), quindi non va mai marcato a mano: occupa comunque
// uno slot 2/3, quindi conta nel totale disponibile per Eroe/Evoluzione.
const STORAGE_KEY = "cr_deck_roles";

export function deckKeyFor(player, deck) {
  return `${player?.tag || ""}:${deck.map((c) => c.id).sort().join(",")}`;
}

export function useDeckRoles(deckKey) {
  const [allRoles, setAllRoles] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let saved = {};
    try {
      saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      saved = {};
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllRoles(saved);
    setHydrated(true);
  }, []);

  function persist(next) {
    setAllRoles(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const roles = allRoles[deckKey] || {};
  const initialized = hydrated && Object.prototype.hasOwnProperty.call(allRoles, deckKey);

  // il valore va scritto anche quando è null (mai cancellato con delete):
  // serve a ricordare "questa carta l'ha già toccata l'utente", cosa
  // diversa da "non l'ha mai toccata" — vedi il commento su showPlaceholder
  // in ProfileHero.js per il motivo.
  function setRole(cardId, role) {
    const deckRoles = { ...(allRoles[deckKey] || {}), [cardId]: role };
    persist({ ...allRoles, [deckKey]: deckRoles });
  }

  function seed(defaults) {
    persist({ ...allRoles, [deckKey]: defaults });
  }

  return { roles, setRole, seed, initialized };
}

// quante evoluzioni/eroi manuali sono ancora ammessi, dato quanti campioni
// sono già nel mazzo. L'evoluzione può stare nello slot 1 o nel 3 (max 2),
// l'eroe nello slot 2 o nel 3 (max 2, meno i campioni che occupano già uno
// di quei due slot), ma in totale gli slot speciali restano sempre 3 — da
// qui il tetto combinato "total", che impedisce ad es. 2 evoluzioni + 2 eroi
// insieme anche se i singoli tetti lo permetterebbero.
export function getSlotCaps(championCount) {
  return {
    evo: 2,
    hero: Math.max(0, 2 - championCount),
    total: Math.max(0, 3 - championCount),
  };
}

// default alla prima apertura di un mazzo mai visto: slot 1 = prima
// evoluzione trovata, slot 2 = un eroe (se resta capienza), slot 3 (jolly) =
// una seconda evoluzione se possibile. È solo un punto di partenza plausibile
// da correggere a mano: l'API non dice quale carta è davvero nel jolly.
export function computeDefaultRoles(deck) {
  const isChampion = (c) => rarityKey(c.rarity) === "champion";
  const championCount = deck.filter(isChampion).length;
  const caps = getSlotCaps(championCount);
  const evoEligible = deck.filter((c) => !isChampion(c) && !!c.evolutionLevel);
  const heroEligible = deck.filter((c) => !isChampion(c) && !!c.iconUrls?.heroMedium);

  const roles = {};
  const used = new Set();
  let evoCount = 0;
  let heroCount = 0;
  const fits = (extra) => evoCount + heroCount + extra <= caps.total;

  const slot1 = evoEligible.find((c) => !used.has(c.id));
  if (slot1 && evoCount < caps.evo && fits(1)) {
    roles[slot1.id] = "evo";
    used.add(slot1.id);
    evoCount++;
  }

  const slot2 = heroEligible.find((c) => !used.has(c.id));
  if (slot2 && heroCount < caps.hero && fits(1)) {
    roles[slot2.id] = "hero";
    used.add(slot2.id);
    heroCount++;
  }

  const slot3 = evoEligible.find((c) => !used.has(c.id));
  if (slot3 && evoCount < caps.evo && fits(1)) {
    roles[slot3.id] = "evo";
    used.add(slot3.id);
    evoCount++;
  }

  return roles;
}

export function nextDeckRole(card, current, caps, othersEvoCount, othersHeroCount) {
  const canEvo = !!card.evolutionLevel;
  const canHero = !!card.iconUrls?.heroMedium;
  const order = ["evo", "hero", null];
  const startIdx = order.indexOf(current);
  const othersTotal = othersEvoCount + othersHeroCount;

  for (let i = 1; i <= order.length; i++) {
    const candidate = order[(startIdx + i) % order.length];
    if (candidate === null) return null;
    if (candidate === "evo" && canEvo && othersEvoCount < caps.evo && othersTotal < caps.total) return "evo";
    if (candidate === "hero" && canHero && othersHeroCount < caps.hero && othersTotal < caps.total) return "hero";
  }
  return null;
}
