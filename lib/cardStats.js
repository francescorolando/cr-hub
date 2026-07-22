// Statistiche di combattimento per carta, estratte da clashroyale.fandom.com
// tramite scripts/scrape-card-stats.mjs (endpoint MediaWiki action=parse,
// prop=wikitext) il 2026-07-22.
//
// L'API ufficiale di Clash Royale non espone NESSUNA statistica di
// combattimento (verificato su /players/{tag} e sul catalogo /cards): questi
// dati esistono solo qui, presi da un'unica fonte pubblica via script, non
// incrociati a mano voce per voce come lib/cardLeveling.js.
//
// Ogni carta ha solo il valore di riferimento a livello ASSOLUTO 11 (hp11,
// dmg11, crownDmg11 per gli incantesimi): è lo stesso valore che il gioco usa
// internamente, dato che ogni altro livello si ottiene con
//   round(valore11 * 1.1 ** (livelloAssoluto - 11))
// (formula presente nel wikitext della fonte stessa, non dedotta). I campi
// senza suffisso numerico (atkSpeed, range, ecc.) sono costanti: non scalano
// con il livello.
//
// Le statistiche dell'abilità attiva dei Champion e gli effetti delle
// evoluzioni NON sono incluse (fuori scope v1: non sono numeri che scalano,
// sono testo/comportamento per carta).
//
// Se una carta manca da questo oggetto, l'estrazione è fallita per quella
// pagina (vedi log dello script) ed è da correggere a mano.
export const CARD_STATS = {
  "26000000": {
    "name": "Knight",
    "type": "troop",
    "hp11": 1766,
    "dmg11": 202,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000001": {
    "name": "Archers",
    "type": "troop",
    "hp11": 304,
    "dmg11": 112,
    "atkSpeed": 0.9,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 2
  },
  "26000002": {
    "name": "Goblins",
    "type": "troop",
    "hp11": 202,
    "dmg11": 120,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.6,
    "speed": "Very Fast (120)",
    "deployTime": 1,
    "target": "Ground",
    "count": 4
  },
  "26000003": {
    "name": "Giant",
    "type": "troop",
    "hp11": 4090,
    "dmg11": 253,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.5,
    "speed": "Slow (45)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000004": {
    "name": "P.E.K.K.A",
    "type": "troop",
    "hp11": 3760,
    "dmg11": 842,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.5,
    "speed": "Slow (45)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000005": {
    "name": "Minions",
    "type": "troop",
    "hp11": 230,
    "dmg11": 107,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "range": 2.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 3
  },
  "26000006": {
    "name": "Balloon",
    "type": "troop",
    "hp11": 1679,
    "dmg11": 640,
    "atkSpeed": 2,
    "firstHitSpeed": 0.2,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000007": {
    "name": "Witch",
    "type": "troop",
    "hp11": 839,
    "dmg11": 135,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.7,
    "speed": "Medium (60)",
    "range": 5.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000008": {
    "name": "Barbarians",
    "type": "troop",
    "hp11": 670,
    "dmg11": 191,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 5
  },
  "26000009": {
    "name": "Golem",
    "type": "troop",
    "hp11": 5120,
    "dmg11": 312,
    "atkSpeed": 2.5,
    "firstHitSpeed": 1,
    "speed": "Slow (45)",
    "deployTime": 3,
    "target": "Buildings",
    "count": 1
  },
  "26000010": {
    "name": "Skeletons",
    "type": "troop",
    "hp11": 81,
    "dmg11": 81,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Ground",
    "count": 3
  },
  "26000011": {
    "name": "Valkyrie",
    "type": "troop",
    "hp11": 1907,
    "dmg11": 266,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.1,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000012": {
    "name": "Skeleton Army",
    "type": "troop",
    "hp11": 81,
    "dmg11": 81,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Ground",
    "count": 15
  },
  "26000013": {
    "name": "Bomber",
    "type": "troop",
    "hp11": 304,
    "dmg11": 225,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.2,
    "speed": "Medium (60)",
    "range": 4.5,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000014": {
    "name": "Musketeer",
    "type": "troop",
    "hp11": 721,
    "dmg11": 217,
    "atkSpeed": 1,
    "firstHitSpeed": 0.7,
    "speed": "Medium (60)",
    "range": 6,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000015": {
    "name": "Baby Dragon",
    "type": "troop",
    "hp11": 1152,
    "dmg11": 168,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.3,
    "speed": "Fast (90)",
    "range": 3.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000016": {
    "name": "Prince",
    "type": "troop",
    "hp11": 1920,
    "dmg11": 391,
    "atkSpeed": 1.4,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000017": {
    "name": "Wizard",
    "type": "troop",
    "hp11": 755,
    "dmg11": 281,
    "atkSpeed": 1.4,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "range": 5.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000018": {
    "name": "Mini P.E.K.K.A",
    "type": "troop",
    "hp11": 1433,
    "dmg11": 755,
    "atkSpeed": 1.6,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000019": {
    "name": "Spear Goblins",
    "type": "troop",
    "hp11": 133,
    "dmg11": 81,
    "atkSpeed": 1.7,
    "firstHitSpeed": 0.5,
    "speed": "Very Fast (120)",
    "range": 5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 3
  },
  "26000020": {
    "name": "Giant Skeleton",
    "type": "troop",
    "hp11": 3361,
    "dmg11": 276,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.3,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000021": {
    "name": "Hog Rider",
    "type": "troop",
    "hp11": 1697,
    "dmg11": 317,
    "atkSpeed": 1.6,
    "firstHitSpeed": 0.6,
    "speed": "Very Fast (120)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000022": {
    "name": "Minion Horde",
    "type": "troop",
    "hp11": 230,
    "dmg11": 107,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "range": 2.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 6
  },
  "26000023": {
    "name": "Ice Wizard",
    "type": "troop",
    "hp11": 688,
    "dmg11": 89,
    "atkSpeed": 1.7,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 5.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000024": {
    "name": "Royal Giant",
    "type": "troop",
    "hp11": 3164,
    "dmg11": 307,
    "atkSpeed": 1.7,
    "firstHitSpeed": 0.9,
    "speed": "Slow (45)",
    "range": 5,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000025": {
    "name": "Guards",
    "type": "troop",
    "hp11": 81,
    "dmg11": 117,
    "atkSpeed": 1,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Ground",
    "count": 3
  },
  "26000026": {
    "name": "Princess",
    "type": "troop",
    "hp11": 261,
    "dmg11": 168,
    "atkSpeed": 3,
    "firstHitSpeed": 0.3,
    "speed": "Medium (60)",
    "range": 9,
    "deployTime": 1.2,
    "target": "Air & Ground",
    "count": 1
  },
  "26000027": {
    "name": "Dark Prince",
    "type": "troop",
    "hp11": 1200,
    "dmg11": 266,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000028": {
    "name": "Three Musketeers",
    "type": "troop",
    "hp11": 883,
    "dmg11": 314,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.7,
    "speed": "Medium (60)",
    "deployTime": 1,
    "count": 3
  },
  "26000029": {
    "name": "Lava Hound",
    "type": "troop",
    "hp11": 3581,
    "dmg11": 53,
    "atkSpeed": 1.3,
    "firstHitSpeed": 1,
    "speed": "Slow (45)",
    "range": 3.5,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000030": {
    "name": "Ice Spirit",
    "type": "troop",
    "hp11": 230,
    "dmg11": 110,
    "speed": "Very Fast (120)",
    "range": 2.5,
    "deployTime": 1,
    "target": "Air & Ground"
  },
  "26000031": {
    "name": "Fire Spirit",
    "type": "troop",
    "hp11": 230,
    "dmg11": 207,
    "speed": "Very Fast (120)",
    "range": 2.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000032": {
    "name": "Miner",
    "type": "troop",
    "hp11": 1210,
    "dmg11": 194,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000033": {
    "name": "Sparky",
    "type": "troop",
    "hp11": 1451,
    "dmg11": 1331,
    "atkSpeed": 4,
    "firstHitSpeed": 1,
    "speed": "Slow (45)",
    "range": 5,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000034": {
    "name": "Bowler",
    "type": "troop",
    "hp11": 2081,
    "dmg11": 289,
    "atkSpeed": 2.5,
    "firstHitSpeed": 0.5,
    "speed": "Slow (45)",
    "range": 4,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000035": {
    "name": "Lumberjack",
    "type": "troop",
    "hp11": 1282,
    "dmg11": 256,
    "atkSpeed": 0.8,
    "firstHitSpeed": 0.4,
    "speed": "Very Fast (120)",
    "deployTime": 1,
    "target": "Ground"
  },
  "26000036": {
    "name": "Battle Ram",
    "type": "troop",
    "hp11": 967,
    "dmg11": 286,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000037": {
    "name": "Inferno Dragon",
    "type": "troop",
    "hp11": 1295,
    "dmg11": 35,
    "atkSpeed": 0.4,
    "speed": "Medium (60)",
    "range": 3.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000038": {
    "name": "Ice Golem",
    "type": "troop",
    "hp11": 1315,
    "dmg11": 84,
    "atkSpeed": 2.5,
    "firstHitSpeed": 1,
    "speed": "Slow (45)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000039": {
    "name": "Mega Minion",
    "type": "troop",
    "hp11": 837,
    "dmg11": 312,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000040": {
    "name": "Dart Goblin",
    "type": "troop",
    "hp11": 261,
    "dmg11": 156,
    "atkSpeed": 0.8,
    "firstHitSpeed": 0.35,
    "speed": "Very Fast (120)",
    "range": 6.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000041": {
    "name": "Goblin Gang",
    "type": "troop",
    "hp11": 202,
    "dmg11": 120,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.6,
    "speed": "Very Fast (120)",
    "target": "Ground",
    "count": 3
  },
  "26000042": {
    "name": "Electro Wizard",
    "type": "troop",
    "hp11": 714,
    "dmg11": 115,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.6,
    "speed": "Fast (90)",
    "range": 5,
    "deployTime": 1,
    "target": "Air & Ground"
  },
  "26000043": {
    "name": "Elite Barbarians",
    "type": "troop",
    "hp11": 1341,
    "dmg11": 384,
    "atkSpeed": 1.4,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Ground",
    "count": 2
  },
  "26000044": {
    "name": "Hunter",
    "type": "troop",
    "hp11": 885,
    "dmg11": 84,
    "atkSpeed": 2.2,
    "firstHitSpeed": 0.7,
    "speed": "Medium (60)",
    "range": 4,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000045": {
    "name": "Executioner",
    "type": "troop",
    "hp11": 1280,
    "dmg11": 168,
    "atkSpeed": 0.9,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 4.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000046": {
    "name": "Bandit",
    "type": "troop",
    "hp11": 906,
    "dmg11": 194,
    "atkSpeed": 1,
    "firstHitSpeed": 0.4,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000047": {
    "name": "Royal Recruits",
    "type": "troop",
    "hp11": 547,
    "dmg11": 133,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 6
  },
  "26000048": {
    "name": "Night Witch",
    "type": "troop",
    "hp11": 906,
    "dmg11": 314,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.75,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000049": {
    "name": "Bats",
    "type": "troop",
    "hp11": 81,
    "dmg11": 81,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.6,
    "speed": "Very Fast (120)",
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 5
  },
  "26000050": {
    "name": "Royal Ghost",
    "type": "troop",
    "hp11": 1210,
    "dmg11": 261,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.6,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000051": {
    "name": "Ram Rider",
    "type": "troop",
    "hp11": 1697,
    "dmg11": 250,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.6,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000052": {
    "name": "Zappies",
    "type": "troop",
    "hp11": 529,
    "dmg11": 117,
    "atkSpeed": 2.1,
    "firstHitSpeed": 0.8,
    "speed": "Medium (60)",
    "range": 4.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 3
  },
  "26000053": {
    "name": "Rascals",
    "type": "troop",
    "hp11": 1940,
    "dmg11": 204,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "target": "Ground",
    "count": 1
  },
  "26000054": {
    "name": "Cannon Cart",
    "type": "troop",
    "hp11": 1809,
    "dmg11": 212,
    "atkSpeed": 0.9,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 5.5,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000055": {
    "name": "Mega Knight",
    "type": "troop",
    "hp11": 3993,
    "dmg11": 268,
    "atkSpeed": 1.7,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000056": {
    "name": "Skeleton Barrel",
    "type": "troop",
    "hp11": 532,
    "dmg11": 81,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Buildings"
  },
  "26000057": {
    "name": "Flying Machine",
    "type": "troop",
    "hp11": 614,
    "dmg11": 171,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "range": 6,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000058": {
    "name": "Wall Breakers",
    "type": "troop",
    "hp11": 330,
    "dmg11": 391,
    "speed": "Very Fast (120)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 2
  },
  "26000059": {
    "name": "Royal Hogs",
    "type": "troop",
    "hp11": 837,
    "dmg11": 74,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.4,
    "speed": "Very Fast (120)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 4
  },
  "26000060": {
    "name": "Goblin Giant",
    "type": "troop",
    "hp11": 3022,
    "dmg11": 176,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.8,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000061": {
    "name": "Fisherman",
    "type": "troop",
    "hp11": 870,
    "dmg11": 194,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.1,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000062": {
    "name": "Magic Archer",
    "type": "troop",
    "hp11": 529,
    "dmg11": 133,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.7,
    "speed": "Medium (60)",
    "range": 7,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000063": {
    "name": "Electro Dragon",
    "type": "troop",
    "hp11": 949,
    "dmg11": 192,
    "atkSpeed": 2.1,
    "firstHitSpeed": 0.7,
    "speed": "Medium (60)",
    "range": 3.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000064": {
    "name": "Firecracker",
    "type": "troop",
    "hp11": 304,
    "dmg11": 64,
    "atkSpeed": 3,
    "firstHitSpeed": 0.65,
    "speed": "Fast (90)",
    "range": 6,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000065": {
    "name": "Mighty Miner",
    "type": "troop",
    "hp11": 2250,
    "dmg11": 40,
    "atkSpeed": 0.4,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000067": {
    "name": "Elixir Golem",
    "type": "troop",
    "hp11": 1569,
    "dmg11": 253,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.8,
    "speed": "Slow (45)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000068": {
    "name": "Battle Healer",
    "type": "troop",
    "hp11": 1717,
    "dmg11": 148,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.3,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000069": {
    "name": "Skeleton King",
    "type": "troop",
    "hp11": 2298,
    "dmg11": 204,
    "atkSpeed": 1.6,
    "firstHitSpeed": 0.3,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000072": {
    "name": "Archer Queen",
    "type": "troop",
    "hp11": 1000,
    "dmg11": 225,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.3,
    "speed": "Medium (60)",
    "range": 5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000074": {
    "name": "Golden Knight",
    "type": "troop",
    "hp11": 1799,
    "dmg11": 161,
    "atkSpeed": 0.9,
    "firstHitSpeed": 0.2,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000077": {
    "name": "Monk",
    "type": "troop",
    "hp11": 2214,
    "dmg11": 140,
    "atkSpeed": 0.8,
    "firstHitSpeed": 0.2,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000080": {
    "name": "Skeleton Dragons",
    "type": "troop",
    "hp11": 560,
    "dmg11": 161,
    "atkSpeed": 2,
    "firstHitSpeed": 0.4,
    "speed": "Fast (90)",
    "range": 3.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 2
  },
  "26000083": {
    "name": "Mother Witch",
    "type": "troop",
    "hp11": 529,
    "dmg11": 133,
    "atkSpeed": 1,
    "firstHitSpeed": 0.3,
    "speed": "Medium (60)",
    "range": 5.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000084": {
    "name": "Electro Spirit",
    "type": "troop",
    "hp11": 230,
    "dmg11": 99,
    "speed": "Very Fast (120)",
    "range": 2.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000085": {
    "name": "Electro Giant",
    "type": "troop",
    "hp11": 3952,
    "dmg11": 163,
    "atkSpeed": 1.8,
    "firstHitSpeed": 1,
    "speed": "Slow (45)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000087": {
    "name": "Phoenix",
    "type": "troop",
    "hp11": 1052,
    "dmg11": 217,
    "atkSpeed": 1,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000093": {
    "name": "Little Prince",
    "type": "troop",
    "hp11": 698,
    "dmg11": 104,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "range": 5.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000095": {
    "name": "Goblin Demolisher",
    "type": "troop",
    "hp11": 1300,
    "dmg11": 186,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 5,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000096": {
    "name": "Goblin Machine",
    "type": "troop",
    "hp11": 2150,
    "dmg11": 212,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000097": {
    "name": "Suspicious Bush",
    "type": "troop",
    "hp11": 81,
    "dmg11": 256,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000099": {
    "name": "Goblinstein",
    "type": "troop",
    "hp11": 721,
    "dmg11": 92,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 5.5,
    "target": "Air & Ground",
    "count": 1
  },
  "26000101": {
    "name": "Rune Giant",
    "type": "troop",
    "hp11": 2662,
    "dmg11": 120,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Building",
    "count": 1
  },
  "26000102": {
    "name": "Berserker",
    "type": "troop",
    "hp11": 896,
    "dmg11": 102,
    "atkSpeed": 0.6,
    "firstHitSpeed": 0.2,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000103": {
    "name": "Boss Bandit",
    "type": "troop",
    "hp11": 2624,
    "dmg11": 268,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.4,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "27000000": {
    "name": "Cannon",
    "type": "building",
    "hp11": 824,
    "dmg11": 212,
    "atkSpeed": 1,
    "firstHitSpeed": 1,
    "range": 5.5,
    "deployTime": 1,
    "lifetime": 30,
    "target": "Ground"
  },
  "27000001": {
    "name": "Goblin Hut",
    "type": "building",
    "hp11": 1228,
    "dmg11": 81,
    "deployTime": 1,
    "lifetime": 30
  },
  "27000002": {
    "name": "Mortar",
    "type": "building",
    "hp11": 1369,
    "dmg11": 266,
    "atkSpeed": 5,
    "firstHitSpeed": 1,
    "range": 3.5,
    "deployTime": 3.5,
    "lifetime": 30,
    "target": "Ground"
  },
  "27000003": {
    "name": "Inferno Tower",
    "type": "building",
    "hp11": 1748,
    "dmg11": 43
  },
  "27000004": {
    "name": "Bomb Tower",
    "type": "building",
    "hp11": 1356,
    "dmg11": 222,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.5,
    "range": 6,
    "deployTime": 1,
    "lifetime": 30,
    "target": "Ground"
  },
  "27000005": {
    "name": "Barbarian Hut",
    "type": "building",
    "hp11": 1164,
    "dmg11": 192,
    "deployTime": 1,
    "lifetime": 30
  },
  "27000006": {
    "name": "Tesla",
    "type": "building",
    "hp11": 1152,
    "dmg11": 220,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.5,
    "range": 5.5,
    "deployTime": 1,
    "lifetime": 25,
    "target": "Air & Ground"
  },
  "27000007": {
    "name": "Elixir Collector",
    "type": "building",
    "hp11": 1070,
    "deployTime": 1,
    "lifetime": 1
  },
  "27000008": {
    "name": "X-Bow",
    "type": "building",
    "hp11": 1600,
    "dmg11": 43,
    "atkSpeed": 0.3,
    "firstHitSpeed": 0.3,
    "range": 11.5,
    "deployTime": 3.5,
    "lifetime": 30,
    "target": "Ground"
  },
  "27000009": {
    "name": "Tombstone",
    "type": "building",
    "hp11": 529,
    "dmg11": 81,
    "deployTime": 1,
    "lifetime": 30
  },
  "27000010": {
    "name": "Furnace",
    "type": "troop",
    "hp11": 727,
    "dmg11": 179,
    "atkSpeed": 1.8,
    "speed": "Medium (60)",
    "range": 6,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "27000012": {
    "name": "Goblin Cage",
    "type": "building",
    "hp11": 780,
    "dmg11": 337,
    "deployTime": 1,
    "lifetime": 20
  },
  "27000013": {
    "name": "Goblin Drill",
    "type": "building",
    "hp11": 1313,
    "dmg11": 120,
    "deployTime": 1,
    "lifetime": 10
  },
  "28000000": {
    "name": "Fireball",
    "type": "spell",
    "dmg11": 688,
    "crownDmg11": 207,
    "radius": 2.5,
    "target": "Air & Ground"
  },
  "28000001": {
    "name": "Arrows",
    "type": "spell",
    "dmg11": 122,
    "crownDmg11": 31,
    "radius": 3.5,
    "target": "Air & Ground"
  },
  "28000002": {
    "name": "Rage",
    "type": "spell",
    "dmg11": 179,
    "crownDmg11": 54,
    "radius": 3,
    "deployTime": 0.5,
    "target": "Friendly Troops & Buildings"
  },
  "28000003": {
    "name": "Rocket",
    "type": "spell",
    "dmg11": 1484,
    "crownDmg11": 371,
    "radius": 2,
    "target": "Air & Ground"
  },
  "28000004": {
    "name": "Goblin Barrel",
    "type": "spell",
    "hp11": 202,
    "dmg11": 120,
    "radius": 1.5
  },
  "28000005": {
    "name": "Freeze",
    "type": "spell",
    "dmg11": 115,
    "crownDmg11": 35,
    "radius": 3,
    "target": "Air & Ground"
  },
  "28000007": {
    "name": "Lightning",
    "type": "spell",
    "dmg11": 1057,
    "crownDmg11": 286
  },
  "28000008": {
    "name": "Zap",
    "type": "spell",
    "dmg11": 192,
    "crownDmg11": 58,
    "radius": 2.5,
    "target": "Air & Ground"
  },
  "28000009": {
    "name": "Poison",
    "type": "spell",
    "dmg11": 92,
    "crownDmg11": 23
  },
  "28000010": {
    "name": "Graveyard",
    "type": "spell",
    "hp11": 81,
    "dmg11": 81,
    "radius": 4
  },
  "28000011": {
    "name": "The Log",
    "type": "spell",
    "dmg11": 266,
    "crownDmg11": 40,
    "range": 10.1,
    "target": "Ground"
  },
  "28000012": {
    "name": "Tornado",
    "type": "spell",
    "dmg11": 84,
    "crownDmg11": 29,
    "radius": 5.5,
    "target": "Air & Ground"
  },
  "28000014": {
    "name": "Earthquake",
    "type": "spell",
    "dmg11": 84,
    "crownDmg11": 53,
    "radius": 3.5,
    "target": "Ground"
  },
  "28000015": {
    "name": "Barbarian Barrel",
    "type": "spell",
    "hp11": 670,
    "dmg11": 191,
    "range": 4.5,
    "target": "Ground"
  },
  "28000016": {
    "name": "Heal Spirit",
    "type": "troop",
    "hp11": 230,
    "dmg11": 110,
    "speed": "Very Fast (120)",
    "range": 2.5,
    "deployTime": 1,
    "target": "Air & Ground"
  },
  "28000017": {
    "name": "Giant Snowball",
    "type": "spell",
    "dmg11": 179,
    "crownDmg11": 54,
    "radius": 2.5,
    "target": "Air & Ground"
  },
  "28000018": {
    "name": "Royal Delivery",
    "type": "spell",
    "hp11": 547,
    "dmg11": 133,
    "radius": 3,
    "deployTime": 3,
    "target": "Air & Ground"
  },
  "28000023": {
    "name": "Void",
    "type": "spell",
    "dmg11": 76,
    "crownDmg11": 17,
    "radius": 2.5,
    "target": "Air & Ground"
  },
  "28000024": {
    "name": "Goblin Curse",
    "type": "spell",
    "hp11": 202,
    "dmg11": 35,
    "crownDmg11": 10,
    "radius": 3,
    "target": "Air & Ground"
  },
  "28000025": {
    "name": "Spirit Empress",
    "type": "troop",
    "hp11": 1121,
    "dmg11": 309,
    "deployTime": 1,
    "count": 1
  },
  "28000026": {
    "name": "Vines",
    "type": "spell",
    "dmg11": 153,
    "crownDmg11": 39,
    "radius": 2.5,
    "target": "Air & Ground",
    "count": 3
  }
};

// valore di una stat che scala col livello, al livello assoluto richiesto —
// stessa formula usata dalla fonte (vedi commento di testa).
export function statAtLevel(value11, absoluteLevel) {
  if (value11 === undefined) return undefined;
  return Math.round(value11 * 1.1 ** (absoluteLevel - 11));
}

// tutte le stat di una carta risolte a un livello assoluto: quelle che
// scalano vengono calcolate con statAtLevel, quelle costanti passano
// invariate. cardMeta è l'entry del catalogo /cards (serve solo per l'id).
export function getCardStatsAtLevel(cardMeta, absoluteLevel) {
  const { hp11, dmg11, crownDmg11, ...constants } = CARD_STATS[cardMeta.id] || {};
  if (!CARD_STATS[cardMeta.id]) return null;
  return {
    ...constants,
    hp: statAtLevel(hp11, absoluteLevel),
    damage: statAtLevel(dmg11, absoluteLevel),
    crownTowerDamage: statAtLevel(crownDmg11, absoluteLevel),
  };
}
