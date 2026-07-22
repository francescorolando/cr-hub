"use client";

import { useEffect, useState } from "react";
import { rarityKey } from "@/lib/rarity";

// l'API non dice mai quale carta occupa davvero lo slot Evoluzione/Eroe in UN
// mazzo specifico (evolutionLevel riflette solo lo sblocco del giocatore, non
// lo slot attivo): quindi lasciamo che sia il giocatore a confermarlo a mano.
//
// Regole fisse, per POSIZIONE nel mazzo (indice 0-based in currentDeck) — non
// per conteggio aggregato su tutto il mazzo:
//   posizione 1 (indice 0): normale o Evoluzione, mai Eroe
//   posizione 2 (indice 1): normale o Eroe, mai Evoluzione
//   posizione 3 (indice 2): normale, Eroe o Evoluzione
//   posizione 4 in poi: sempre e solo normale, nessun pulsante possibile
// Il Campione è sempre rilevabile con certezza dalla rarità della carta
// (dato live dall'API): non va mai marcato a mano e può comparire in
// posizione 2 o 3 indipendentemente da questa logica.
//
// Dentro la posizione, contano anche i limiti della carta stessa: se una
// carta ha solo l'eroe (non l'evoluzione) e si trova in posizione 3, il
// pulsante deve offrire solo normale/eroe, mai evoluzione — e viceversa.
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
    const deckRoles = { ...(allRoles[deckKey] || {}), [cardId]: role };
    persist({ ...allRoles, [deckKey]: deckRoles });
  }

  function seed(defaults) {
    persist({ ...allRoles, [deckKey]: defaults });
  }

  return { roles, setRole, seed, initialized };
}

// tipi ammessi dalla sola POSIZIONE (indice 0-based nel mazzo), a
// prescindere da cosa può fare la carta che ci sta sopra.
function typesAllowedByPosition(index) {
  if (index === 0) return ["evo"];
  if (index === 1) return ["hero"];
  if (index === 2) return ["evo", "hero"];
  return [];
}

// intersezione fra quello che la posizione permette e quello che QUESTA
// carta può davvero fare: es. un Golem di ghiaccio (solo eroe, niente
// evoluzione) in posizione 3 ottiene qui solo ["hero"], mai "evo".
export function availableRoleOptions(card, index) {
  return typesAllowedByPosition(index).filter((type) =>
    type === "evo" ? !!card.evolutionLevel : !!card.iconUrls?.heroMedium,
  );
}

// null = "normale". Cicla solo fra le opzioni che questa carta+posizione
// ammettono davvero — se sono zero, non c'è nulla su cui ciclare (nessun
// pulsante verrà mostrato, vedi ProfileHero.js).
export function nextDeckRole(card, current, index) {
  const options = availableRoleOptions(card, index);
  if (options.length === 0) return null;
  const cycle = [null, ...options];
  const currentIdx = cycle.indexOf(current);
  return cycle[(currentIdx + 1) % cycle.length];
}

// default alla prima apertura di un mazzo mai visto: per ogni posizione
// speciale, se la carta lì sopra supporta almeno un tipo ammesso da quella
// posizione, parte già marcata (preferendo l'evoluzione quando la posizione
// 3 permette entrambi) — altrimenti resta "normale". Solo un punto di
// partenza plausibile, correggibile a mano.
export function computeDefaultRoles(deck) {
  const roles = {};
  deck.forEach((card, index) => {
    if (rarityKey(card.rarity) === "champion") return;
    const options = availableRoleOptions(card, index);
    if (options.length > 0) roles[card.id] = options[0];
  });
  return roles;
}
