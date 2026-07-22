"use client";

import { useEffect, useState } from "react";
import { rarityKey } from "@/lib/rarity";

// l'API non dice mai quale carta occupa davvero lo slot Evoluzione/Eroe in UN
// mazzo specifico (evolutionLevel riflette solo lo sblocco del giocatore, non
// lo slot attivo): quindi lasciamo che sia il giocatore a confermarlo a mano.
// Il mazzo ha esattamente 3 slot speciali con regole fisse:
//   slot 1: Evoluzione
//   slot 2: Eroe / Campione
//   slot 3: Evoluzione / Campione (mai Eroe)
// Il Campione è sempre rilevabile con certezza dalla rarità della carta
// (dato live dall'API), quindi non va mai marcato a mano: conta solo per
// capire quanti degli slot 2/3 restano liberi per Eroe/Evoluzione.
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

  function setRole(cardId, role) {
    const deckRoles = { ...(allRoles[deckKey] || {}) };
    if (role) deckRoles[cardId] = role;
    else delete deckRoles[cardId];
    persist({ ...allRoles, [deckKey]: deckRoles });
  }

  function seed(defaults) {
    persist({ ...allRoles, [deckKey]: defaults });
  }

  return { roles, setRole, seed, initialized };
}

// quante evoluzioni/eroi manuali sono ancora ammessi, dato quanti campioni
// sono già nel mazzo (i campioni occupano prima lo slot 2, poi il 3).
export function getSlotCaps(championCount) {
  return {
    evo: championCount >= 2 ? 1 : 2,
    hero: championCount >= 1 ? 0 : 1,
  };
}

export function computeDefaultRoles(deck) {
  const isChampion = (c) => rarityKey(c.rarity) === "champion";
  const championCount = deck.filter(isChampion).length;
  const evoEligible = deck.filter((c) => !isChampion(c) && !!c.evolutionLevel);
  const heroEligible = deck.filter((c) => !isChampion(c) && !!c.iconUrls?.heroMedium);

  const roles = {};
  const used = new Set();

  const slot1 = evoEligible.find((c) => !used.has(c.id));
  if (slot1) {
    roles[slot1.id] = "evo";
    used.add(slot1.id);
  }

  if (championCount === 0) {
    const slot2 = heroEligible.find((c) => !used.has(c.id));
    if (slot2) {
      roles[slot2.id] = "hero";
      used.add(slot2.id);
    }
  }

  if (championCount < 2) {
    const slot3 = evoEligible.find((c) => !used.has(c.id));
    if (slot3) {
      roles[slot3.id] = "evo";
      used.add(slot3.id);
    }
  }

  return roles;
}

export function nextDeckRole(card, current, caps, othersEvoCount, othersHeroCount) {
  const canEvo = !!card.evolutionLevel;
  const canHero = !!card.iconUrls?.heroMedium;
  const order = ["evo", "hero", null];
  const startIdx = order.indexOf(current);

  for (let i = 1; i <= order.length; i++) {
    const candidate = order[(startIdx + i) % order.length];
    if (candidate === null) return null;
    if (candidate === "evo" && canEvo && othersEvoCount < caps.evo) return "evo";
    if (candidate === "hero" && canHero && othersHeroCount < caps.hero) return "hero";
  }
  return null;
}
