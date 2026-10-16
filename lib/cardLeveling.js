// Costo (in copie carta + oro) per salire di UN livello, indicizzato per rarità e
// per il livello "relativo" restituito dall'API ufficiale (player.cards[].level /
// maxLevel): l'API non parte da 1 per tutte le rarità in termini di livello "mostrato
// in gioco", ma il campo level/maxLevel che restituisce è già relativo alla singola
// carta (1 = livello minimo raggiungibile per quella carta, maxLevel = livello
// massimo attuale di quella carta) — per questo qui NON serve nessun offset per
// rarità: si usano level/maxLevel dell'API così come sono.
//
// L'API ufficiale non espone da nessuna parte il costo in oro/copie di un livello.
// Questa tabella, compilata a mano il 2026-07-12 da fonti pubbliche (wiki,
// royaleapi.com/blog/level-16-and-economy-changes-2025-q4), è stata riverificata
// il 2026-10-17 contro i dati di gioco decriptati (cache.statsroyale.com/
// gamedata-v5.json, items.rarities[].upgradeMaterialCount e upgradeCost, la stessa
// fonte di lib/cardStats.js): coincide su tutte le rarità e tutti i livelli. Il
// wiki invece sbaglia il primo passo dei Campioni (1 copia invece di 2).
//
// Se in futuro il gioco cambia ancora questi numeri, l'unica cosa da aggiornare è
// questa tabella: il resto del codice legge sempre level/maxLevel/count live
// dall'API e usa questi valori solo per calcolare quanto manca.
export const UPGRADE_COST_BY_RARITY = {
  common: {
    2: { cards: 2, gold: 5 },
    3: { cards: 4, gold: 20 },
    4: { cards: 10, gold: 50 },
    5: { cards: 20, gold: 150 },
    6: { cards: 50, gold: 400 },
    7: { cards: 100, gold: 1000 },
    8: { cards: 200, gold: 2000 },
    9: { cards: 400, gold: 4000 },
    10: { cards: 800, gold: 8000 },
    11: { cards: 1000, gold: 15000 },
    12: { cards: 1500, gold: 25000 },
    13: { cards: 2500, gold: 40000 },
    14: { cards: 3500, gold: 60000 },
    15: { cards: 5500, gold: 90000 },
    16: { cards: 7500, gold: 120000 },
  },
  rare: {
    2: { cards: 2, gold: 50 },
    3: { cards: 4, gold: 150 },
    4: { cards: 10, gold: 400 },
    5: { cards: 20, gold: 1000 },
    6: { cards: 50, gold: 2000 },
    7: { cards: 100, gold: 4000 },
    8: { cards: 200, gold: 8000 },
    9: { cards: 300, gold: 15000 },
    10: { cards: 400, gold: 25000 },
    11: { cards: 550, gold: 40000 },
    12: { cards: 750, gold: 60000 },
    13: { cards: 1000, gold: 90000 },
    14: { cards: 1400, gold: 120000 },
  },
  epic: {
    2: { cards: 2, gold: 400 },
    3: { cards: 4, gold: 2000 },
    4: { cards: 10, gold: 4000 },
    5: { cards: 20, gold: 8000 },
    6: { cards: 30, gold: 15000 },
    7: { cards: 50, gold: 25000 },
    8: { cards: 70, gold: 40000 },
    9: { cards: 100, gold: 60000 },
    10: { cards: 130, gold: 90000 },
    11: { cards: 180, gold: 120000 },
  },
  legendary: {
    2: { cards: 2, gold: 5000 },
    3: { cards: 4, gold: 15000 },
    4: { cards: 6, gold: 25000 },
    5: { cards: 9, gold: 40000 },
    6: { cards: 12, gold: 60000 },
    7: { cards: 14, gold: 90000 },
    8: { cards: 20, gold: 120000 },
  },
  champion: {
    2: { cards: 2, gold: 25000 },
    3: { cards: 5, gold: 40000 },
    4: { cards: 8, gold: 60000 },
    5: { cards: 11, gold: 90000 },
    6: { cards: 15, gold: 120000 },
  },
};

// prezzo in gemme di UNA copia mancante, per rarità e per livello relativo da
// raggiungere (stessa chiave di UPGRADE_COST_BY_RARITY), in centomillesimi di
// gemma come nel gioco. Dai dati di gioco decriptati (items.rarities[].
// gemCostPerCard100000Th in gamedata-v5.json, letti il 2026-10-17): è il prezzo a
// cui il gioco vende le copie mancanti quando si potenzia una carta. NON è fisso
// per rarità: ai livelli bassi una copia costa molto di più (una comune dal
// livello 2 al 3: 50 gemme l'una), ai livelli alti si assesta (comune 0,36,
// leggendaria ~210, campione 400). Prima usavamo il solo prezzo del livello 16
// per tutti i livelli: giusto in alto, molto sottostimato in basso.
const GEM_COST_PER_CARD_100000TH = {
  common: [5000000, 2500000, 1000000, 500000, 200000, 100000, 50000, 32500, 36250, 36000, 36000, 36000, 35715, 36364, 36000],
  rare: [5000000, 2500000, 1000000, 500000, 260000, 210000, 210000, 210000, 210000, 218182, 213334, 210000, 214286],
  epic: [5000000, 3250000, 2100000, 2100000, 2100000, 2200000, 2142858, 2100000, 1923077, 2166667],
  legendary: [21000000, 21000000, 21666667, 21111112, 20833334, 20714286, 21000000],
  champion: [40000000, 40000000, 40000000, 40000000, 40000000],
};

// gemme per comprare `missing` copie del livello relativo `rel`. Arrotondamento
// normale (così un livello intero dà i prezzi tondi del gioco, es. 3500 comuni =
// 1250 gemme, non 1251) e almeno 1 gemma se manca qualcosa. L'arrotondamento
// esatto del gioco per quantità parziali non è nei dati: al più 1 gemma di scarto.
export function gemsForLevel(rarity, rel, missing) {
  const cost = GEM_COST_PER_CARD_100000TH[rarity]?.[rel - 2];
  if (!cost || !missing) return 0;
  return Math.max(1, Math.round((missing * cost) / 100000));
}

// prezzo di una copia ai livelli alti (quello per arrivare al massimo), per
// mostrarlo come riferimento per rarità: dal livello 11 in su varia poco.
export function gemsPerCardAtMax(rarity) {
  const costs = GEM_COST_PER_CARD_100000TH[rarity];
  return costs ? costs[costs.length - 1] / 100000 : null;
}

// quante copie/oro/gemme mancano per portare una carta dal suo livello attuale
// al suo maxLevel attuale — level, maxLevel e count arrivano live dal profilo
// giocatore.
export function remainingToMax({ rarity, level, maxLevel, count }) {
  const table = UPGRADE_COST_BY_RARITY[rarity] || {};
  let stock = count ?? 0;
  let cardsNeeded = 0;
  let goldNeeded = 0;
  let gemsNeeded = 0;
  let known = true;

  for (let lvl = level + 1; lvl <= maxLevel; lvl++) {
    const step = table[lvl];
    if (!step) {
      known = false;
      continue;
    }
    const missing = Math.max(0, step.cards - stock);
    stock = Math.max(0, stock - step.cards);
    cardsNeeded += missing;
    goldNeeded += step.gold;
    gemsNeeded += gemsForLevel(rarity, lvl, missing);
  }

  return {
    cardsNeeded,
    goldNeeded,
    gemsNeeded,
    levelsRemaining: Math.max(0, maxLevel - level),
    maxed: level >= maxLevel,
    known,
  };
}

// costo del solo prossimo passaggio di livello (non del totale a max) — null
// se la carta è già al massimo.
export function nextLevelCost({ rarity, level, maxLevel }) {
  if (level >= maxLevel) return null;
  const table = UPGRADE_COST_BY_RARITY[rarity] || {};
  const step = table[level + 1];
  if (!step) return null;
  const offset = ABSOLUTE_MAX_LEVEL - maxLevel;
  return { absoluteLevel: level + 1 + offset, cards: step.cards, gold: step.gold };
}

// il "vero" livello massimo di ogni carta, indipendentemente dalla rarità, è
// sempre 16 in termini assoluti (livello mostrato in gioco): l'API restituisce
// però livelli relativi alla singola carta (es. una leggendaria arriva solo a
// maxLevel 8). la differenza (16 - card.maxLevel) è quindi l'offset che separa
// il livello relativo di QUESTA carta dal livello assoluto — si ricava dal
// maxLevel live della carta stessa, senza bisogno di una tabella per rarità.
const ABSOLUTE_MAX_LEVEL = 16;

// converte level/maxLevel "relativi" (così come li restituisce l'API) nel
// livello assoluto mostrato in gioco (1-16), usando lo stesso offset per
// rarità spiegato sopra. Usato anche fuori da questo file (es. confronto
// statistiche) per non duplicare la formula dell'offset.
export function toAbsoluteLevel({ level, maxLevel }) {
  return level + (ABSOLUTE_MAX_LEVEL - maxLevel);
}

// livello assoluto minimo raggiungibile da una carta con questo maxLevel
// relativo (es. un Champion, maxLevel relativo 6, non esiste sotto il
// livello assoluto 11) — serve a vincolare i selettori di livello nel range
// realmente valido per quella carta.
export function minAbsoluteLevel(maxLevel) {
  return 1 + (ABSOLUTE_MAX_LEVEL - maxLevel);
}

export { ABSOLUTE_MAX_LEVEL };

// per la finestra fissa di livelli assoluti [windowStart, windowEnd] (per ora
// sempre 11-16), calcola lo stato di ogni blocco:
// - "reached": livello già raggiunto davvero in gioco (colore pieno)
// - "pending": livello non ancora raggiunto, con quante copie sono già
//   accumulate rispetto a quante ne servono per quel livello (colore non
//   pieno, sia se completo 6/6 che se parziale 6/9 — la differenza fra i due
//   casi la mostra solo il riempimento interno del blocco, non il colore)
export function levelWindowBlocks({ rarity, level, maxLevel, count }, windowStart = 11, windowEnd = 16) {
  const table = UPGRADE_COST_BY_RARITY[rarity] || {};
  const offset = ABSOLUTE_MAX_LEVEL - maxLevel;
  const absoluteCurrent = level + offset;

  // le copie in scorta vengono consumate in ordine dai livelli precedenti la
  // finestra (anche se non li mostriamo), altrimenti il riempimento dentro la
  // finestra partirebbe da uno stock che in realtà è già stato "speso" prima.
  let stock = count ?? 0;
  const windowStartRelative = windowStart - offset;
  for (let rel = level + 1; rel < windowStartRelative; rel++) {
    const step = table[rel];
    if (step) stock = Math.max(0, stock - step.cards);
  }

  const blocks = [];
  for (let absLevel = windowStart; absLevel <= windowEnd; absLevel++) {
    if (absLevel <= absoluteCurrent) {
      blocks.push({ level: absLevel, state: "reached" });
      continue;
    }
    const step = table[absLevel - offset];
    if (!step) {
      blocks.push({ level: absLevel, state: "reached" });
      continue;
    }
    const owned = Math.min(stock, step.cards);
    stock = Math.max(0, stock - step.cards);
    const missing = step.cards - owned;
    blocks.push({
      level: absLevel,
      state: "pending",
      owned,
      needed: step.cards,
      gold: step.gold,
      gems: gemsForLevel(rarity, absLevel - offset, missing),
    });
  }
  return blocks;
}

// quanto manca a una carta se si usano su di lei i jolly della sua rarità
// (wild = quanti il giocatore ne ha, inseriti a mano: vedi lib/wildCards.js).
// Come in gioco, i jolly riempiono un livello alla volta in ordine: prima il
// prossimo livello, poi quello dopo, finché non finiscono. Le copie già
// possedute vengono consumate allo stesso modo (stesso ordine di
// levelWindowBlocks). Ritorna, per livello assoluto ancora da raggiungere,
// le copie che mancano dopo i jolly, più il totale fino al massimo.
export function wildCardCoverage({ rarity, level, maxLevel, count }, wild) {
  const table = UPGRADE_COST_BY_RARITY[rarity] || {};
  const offset = ABSOLUTE_MAX_LEVEL - maxLevel;
  let stock = count ?? 0;
  let wildLeft = wild ?? 0;
  let totalAfter = 0;
  let gemsAfterTotal = 0;
  const byLevel = {};

  for (let rel = level + 1; rel <= maxLevel; rel++) {
    const step = table[rel];
    if (!step) continue;
    const owned = Math.min(stock, step.cards);
    stock = Math.max(0, stock - step.cards);
    const missing = step.cards - owned;
    const covered = Math.min(wildLeft, missing);
    wildLeft -= covered;
    const after = missing - covered;
    totalAfter += after;
    const gemsAfter = gemsForLevel(rarity, rel, after);
    gemsAfterTotal += gemsAfter;
    byLevel[rel + offset] = { missingAfter: after, gemsAfter };
  }

  return {
    byLevel,
    cardsAfter: totalAfter,
    gemsAfter: gemsAfterTotal,
    wildUsed: (wild ?? 0) - wildLeft,
  };
}

export function formatNumber(n) {
  return new Intl.NumberFormat("it-IT").format(n);
}
