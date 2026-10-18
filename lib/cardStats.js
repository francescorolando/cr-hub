// Statistiche di combattimento per carta — fonte MISTA (vedi
// scripts/fetch-card-stats.mjs, eseguito il 2026-10-18):
//
// - Truppe/edifici (campi hp1/dmg1) e incantesimi migrati (campi hp1/dmg1/
//   crownDmgPercent): dati REALI decriptati dal client di gioco, via
//   cache.statsroyale.com/gamedata-v5.json, scalati con la tabella ufficiale
//   POWER_LEVEL_MULTIPLIER (in fondo al file) — non una formula stimata.
//   Gli incantesimi migrati sono stati validati contro la fonte wiki prima
//   di essere accettati (vedi extractSpell nello script): solo quelli il
//   cui valore combacia entro tolleranza sono passati alla fonte reale.
//   Aggiornabile rilanciando lo script ad ogni patch.
// - Incantesimi non migrati (campi hp11/dmg11/crownDmg11) e le 5 carte troop
//   la cui fonte statsroyale non ha stat proprie da estrarre (riusano
//   un'unità condivisa per nome — Ice Wizard, Electro Wizard, Three
//   Musketeers, Heal Spirit, Spirit Empress): ANCORA sulla vecchia fonte
//   clashroyale.fandom.com, formula round(v11 * 1.1^(livello-11)) stimata dal
//   wikitext. Vedi il commento di testa dello script per il perché caso per
//   caso (Freeze/Tornado/Earthquake/Void/Goblin Curse/Vines/Graveyard: il
//   danno mostrato dal wiki non corrisponde a un campo semplice e affidabile
//   nella fonte reale, quindi non sono stati toccati).
//
// Le statistiche dell'abilità attiva dei Champion e gli effetti delle
// evoluzioni NON sono incluse (fuori scope: non sono numeri che scalano,
// sono testo/comportamento per carta).
//
// Se una carta manca da questo oggetto, non è stata trovata né nella nuova
// fonte né nella vecchia: è da investigare a mano (vedi log dello script).
export const CARD_STATS = {
  "26000000": {
    "name": "Knight",
    "type": "troop",
    "hp1": 690,
    "dmg1": 79,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000001": {
    "name": "Archers",
    "type": "troop",
    "hp1": 119,
    "dmg1": 44,
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
    "hp1": 79,
    "dmg1": 49,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.6,
    "speed": "Very Fast (120)",
    "range": 0.5,
    "deployTime": 1,
    "target": "Ground",
    "count": 4
  },
  "26000003": {
    "name": "Giant",
    "type": "troop",
    "hp1": 1550,
    "dmg1": 99,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.5,
    "speed": "Slow (45)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000004": {
    "name": "P.E.K.K.A",
    "type": "troop",
    "hp1": 1469,
    "dmg1": 329,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.5,
    "speed": "Slow (45)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000005": {
    "name": "Minions",
    "type": "troop",
    "hp1": 90,
    "dmg1": 42,
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
    "hp1": 655,
    "dmg1": 250,
    "atkSpeed": 2,
    "firstHitSpeed": 0.2,
    "speed": "Medium (60)",
    "range": 0.1,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000007": {
    "name": "Witch",
    "type": "troop",
    "hp1": 328,
    "dmg1": 53,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.7,
    "speed": "Medium (60)",
    "range": 5.5,
    "radius": 1.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000008": {
    "name": "Barbarians",
    "type": "troop",
    "hp1": 280,
    "dmg1": 75,
    "atkSpeed": 1.4,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "range": 0.7,
    "deployTime": 1,
    "target": "Ground",
    "count": 5
  },
  "26000009": {
    "name": "Golem",
    "type": "troop",
    "hp1": 2000,
    "dmg1": 122,
    "atkSpeed": 2.5,
    "firstHitSpeed": 1,
    "speed": "Slow (45)",
    "range": 0.75,
    "deployTime": 3,
    "target": "Buildings",
    "count": 1
  },
  "26000010": {
    "name": "Skeletons",
    "type": "troop",
    "hp1": 32,
    "dmg1": 32,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "range": 0.5,
    "deployTime": 1,
    "target": "Ground",
    "count": 3
  },
  "26000011": {
    "name": "Valkyrie",
    "type": "troop",
    "hp1": 745,
    "dmg1": 104,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.1,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000012": {
    "name": "Skeleton Army",
    "type": "troop",
    "hp1": 32,
    "dmg1": 32,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "range": 0.5,
    "deployTime": 1,
    "target": "Ground",
    "count": 15
  },
  "26000013": {
    "name": "Bomber",
    "type": "troop",
    "hp1": 119,
    "dmg1": 83,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.2,
    "speed": "Medium (60)",
    "range": 4.5,
    "radius": 1.5,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000014": {
    "name": "Musketeer",
    "type": "troop",
    "hp1": 282,
    "dmg1": 85,
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
    "hp1": 450,
    "dmg1": 66,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.3,
    "speed": "Fast (90)",
    "range": 3.5,
    "radius": 1.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000016": {
    "name": "Prince",
    "type": "troop",
    "hp1": 750,
    "dmg1": 153,
    "atkSpeed": 1.4,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 1.6,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000017": {
    "name": "Wizard",
    "type": "troop",
    "hp1": 295,
    "dmg1": 119,
    "atkSpeed": 1.4,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 5.5,
    "radius": 1.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000018": {
    "name": "Mini P.E.K.K.A",
    "type": "troop",
    "hp1": 543,
    "dmg1": 295,
    "atkSpeed": 1.6,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "range": 0.8,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000019": {
    "name": "Spear Goblins",
    "type": "troop",
    "hp1": 52,
    "dmg1": 32,
    "atkSpeed": 1.6,
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
    "hp1": 1313,
    "dmg1": 108,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.3,
    "speed": "Medium (60)",
    "range": 0.8,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000021": {
    "name": "Hog Rider",
    "type": "troop",
    "hp1": 663,
    "dmg1": 124,
    "atkSpeed": 1.6,
    "firstHitSpeed": 0.6,
    "speed": "Very Fast (120)",
    "range": 0.8,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000022": {
    "name": "Minion Horde",
    "type": "troop",
    "hp1": 90,
    "dmg1": 42,
    "atkSpeed": 1.2,
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
    "hp1": 1236,
    "dmg1": 120,
    "atkSpeed": 1.8,
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
    "hp1": 32,
    "dmg1": 46,
    "atkSpeed": 1,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "range": 1.6,
    "deployTime": 1,
    "target": "Ground",
    "count": 3
  },
  "26000026": {
    "name": "Princess",
    "type": "troop",
    "hp1": 102,
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
    "hp1": 469,
    "dmg1": 104,
    "atkSpeed": 1.4,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000028": {
    "name": "Three Musketeers",
    "type": "troop",
    "hp11": 906,
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
    "hp1": 1399,
    "dmg1": 28,
    "atkSpeed": 1.5,
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
    "hp1": 84,
    "dmg1": 43,
    "atkSpeed": 0.3,
    "firstHitSpeed": 0.2,
    "speed": "Very Fast (120)",
    "range": 2.5,
    "radius": 1.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000031": {
    "name": "Fire Spirit",
    "type": "troop",
    "hp1": 84,
    "dmg1": 84,
    "atkSpeed": 0.3,
    "firstHitSpeed": 0.2,
    "speed": "Very Fast (120)",
    "range": 2.5,
    "radius": 2.3,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000032": {
    "name": "Miner",
    "type": "troop",
    "hp1": 473,
    "dmg1": 76,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000033": {
    "name": "Sparky",
    "type": "troop",
    "hp1": 567,
    "dmg1": 520,
    "atkSpeed": 4,
    "firstHitSpeed": 1,
    "speed": "Slow (45)",
    "range": 5,
    "radius": 1.8,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000034": {
    "name": "Bowler",
    "type": "troop",
    "hp1": 813,
    "dmg1": 113,
    "atkSpeed": 2.5,
    "firstHitSpeed": 0.5,
    "speed": "Slow (45)",
    "range": 4,
    "radius": 1.8,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000035": {
    "name": "Lumberjack",
    "type": "troop",
    "hp1": 501,
    "dmg1": 100,
    "atkSpeed": 0.8,
    "firstHitSpeed": 0.4,
    "speed": "Very Fast (120)",
    "range": 0.7,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000036": {
    "name": "Battle Ram",
    "type": "troop",
    "hp1": 378,
    "dmg1": 112,
    "atkSpeed": 0.4,
    "firstHitSpeed": 0.05,
    "speed": "Medium (60)",
    "range": 0.5,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000037": {
    "name": "Inferno Dragon",
    "type": "troop",
    "hp1": 506,
    "dmg1": 14,
    "atkSpeed": 0.4,
    "firstHitSpeed": -0.8,
    "speed": "Medium (60)",
    "range": 3.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000038": {
    "name": "Ice Golem",
    "type": "troop",
    "hp1": 480,
    "dmg1": 33,
    "atkSpeed": 2.5,
    "firstHitSpeed": 1,
    "speed": "Slow (45)",
    "range": 0.75,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000039": {
    "name": "Mega Minion",
    "type": "troop",
    "hp1": 327,
    "dmg1": 122,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "range": 1.6,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000040": {
    "name": "Dart Goblin",
    "type": "troop",
    "hp1": 102,
    "dmg1": 56,
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
    "hp1": 79,
    "dmg1": 49,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.6,
    "speed": "Very Fast (120)",
    "range": 0.5,
    "deployTime": 1,
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
    "target": "Air & Ground",
    "hp1": 279
  },
  "26000043": {
    "name": "Elite Barbarians",
    "type": "troop",
    "hp1": 524,
    "dmg1": 150,
    "atkSpeed": 1.4,
    "firstHitSpeed": 0.5,
    "speed": "Fast (90)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 2
  },
  "26000044": {
    "name": "Hunter",
    "type": "troop",
    "hp1": 346,
    "dmg1": 33,
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
    "hp1": 500,
    "dmg1": 70,
    "atkSpeed": 0.9,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 4.5,
    "radius": 1,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000046": {
    "name": "Bandit",
    "type": "troop",
    "hp1": 354,
    "dmg1": 76,
    "atkSpeed": 1,
    "firstHitSpeed": 0.4,
    "speed": "Fast (90)",
    "range": 0.75,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000047": {
    "name": "Royal Recruits",
    "type": "troop",
    "hp1": 214,
    "dmg1": 52,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 1.6,
    "deployTime": 1,
    "target": "Ground",
    "count": 6
  },
  "26000048": {
    "name": "Night Witch",
    "type": "troop",
    "hp1": 354,
    "dmg1": 123,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.75,
    "speed": "Medium (60)",
    "range": 1.6,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000049": {
    "name": "Bats",
    "type": "troop",
    "hp1": 32,
    "dmg1": 32,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.6,
    "speed": "Very Fast (120)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 5
  },
  "26000050": {
    "name": "Royal Ghost",
    "type": "troop",
    "hp1": 450,
    "dmg1": 103,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.6,
    "speed": "Fast (90)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000051": {
    "name": "Ram Rider",
    "type": "troop",
    "hp1": 690,
    "dmg1": 106,
    "atkSpeed": 1.7,
    "firstHitSpeed": 0.6,
    "speed": "Medium (60)",
    "range": 0.8,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000052": {
    "name": "Zappies",
    "type": "troop",
    "hp1": 207,
    "dmg1": 46,
    "atkSpeed": 2.3,
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
    "hp1": 716,
    "dmg1": 85,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "range": 0.8,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000054": {
    "name": "Cannon Cart",
    "type": "troop",
    "hp1": 707,
    "dmg1": 79,
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
    "hp1": 1560,
    "dmg1": 105,
    "atkSpeed": 1.7,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000056": {
    "name": "Skeleton Barrel",
    "type": "troop",
    "hp1": 208,
    "atkSpeed": 0.3,
    "firstHitSpeed": 0.1,
    "speed": "Fast (90)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000057": {
    "name": "Flying Machine",
    "type": "troop",
    "hp1": 240,
    "dmg1": 70,
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
    "hp1": 129,
    "dmg1": 118,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.2,
    "speed": "Very Fast (120)",
    "range": 0.5,
    "radius": 1.5,
    "deployTime": 1,
    "target": "Buildings",
    "count": 2
  },
  "26000059": {
    "name": "Royal Hogs",
    "type": "troop",
    "hp1": 327,
    "dmg1": 29,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.4,
    "speed": "Very Fast (120)",
    "range": 0.75,
    "deployTime": 1,
    "target": "Buildings",
    "count": 4
  },
  "26000060": {
    "name": "Goblin Giant",
    "type": "troop",
    "hp1": 1215,
    "dmg1": 69,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.8,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000061": {
    "name": "Fisherman",
    "type": "troop",
    "hp1": 340,
    "dmg1": 76,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.1,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000062": {
    "name": "Magic Archer",
    "type": "troop",
    "hp1": 207,
    "dmg1": 53,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.7,
    "speed": "Medium (60)",
    "range": 7,
    "radius": 0.25,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000063": {
    "name": "Electro Dragon",
    "type": "troop",
    "hp1": 410,
    "dmg1": 75,
    "atkSpeed": 2.1,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 3.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000064": {
    "name": "Firecracker",
    "type": "troop",
    "hp1": 119,
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
    "hp1": 879,
    "dmg1": 17,
    "atkSpeed": 0.4,
    "firstHitSpeed": -0.3,
    "speed": "Medium (60)",
    "range": 1.6,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000067": {
    "name": "Elixir Golem",
    "type": "troop",
    "hp1": 613,
    "dmg1": 99,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.8,
    "speed": "Slow (45)",
    "range": 0.8,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000068": {
    "name": "Battle Healer",
    "type": "troop",
    "hp1": 750,
    "dmg1": 105,
    "atkSpeed": 2,
    "firstHitSpeed": 0.4,
    "speed": "Medium (60)",
    "range": 1.6,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000069": {
    "name": "Skeleton King",
    "type": "troop",
    "hp1": 898,
    "dmg1": 80,
    "atkSpeed": 1.6,
    "firstHitSpeed": 0.3,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000072": {
    "name": "Archer Queen",
    "type": "troop",
    "hp1": 391,
    "dmg1": 91,
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
    "hp1": 703,
    "dmg1": 66,
    "atkSpeed": 0.9,
    "firstHitSpeed": 0.2,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000077": {
    "name": "Monk",
    "type": "troop",
    "hp1": 865,
    "dmg1": 55,
    "atkSpeed": 0.8,
    "firstHitSpeed": 0.2,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000080": {
    "name": "Skeleton Dragons",
    "type": "troop",
    "hp1": 219,
    "dmg1": 59,
    "atkSpeed": 2,
    "firstHitSpeed": 0.4,
    "speed": "Fast (90)",
    "range": 3.5,
    "radius": 1.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 2
  },
  "26000083": {
    "name": "Mother Witch",
    "type": "troop",
    "hp1": 207,
    "dmg1": 52,
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
    "hp1": 84,
    "dmg1": 39,
    "atkSpeed": 0.3,
    "firstHitSpeed": 0.2,
    "speed": "Very Fast (120)",
    "range": 2.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000085": {
    "name": "Electro Giant",
    "type": "troop",
    "hp1": 1544,
    "dmg1": 72,
    "atkSpeed": 1.8,
    "firstHitSpeed": 1,
    "speed": "Slow (45)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000087": {
    "name": "Phoenix",
    "type": "troop",
    "hp1": 411,
    "dmg1": 85,
    "atkSpeed": 1,
    "firstHitSpeed": 0.6,
    "speed": "Medium (60)",
    "range": 1.6,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "26000093": {
    "name": "Little Prince",
    "type": "troop",
    "hp1": 273,
    "dmg1": 41,
    "atkSpeed": 1.2,
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
    "hp1": 508,
    "dmg1": 73,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 5,
    "radius": 1.5,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000096": {
    "name": "Goblin Machine",
    "type": "troop",
    "hp1": 885,
    "dmg1": 91,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000097": {
    "name": "Suspicious Bush",
    "type": "troop",
    "hp1": 32,
    "dmg1": 0,
    "atkSpeed": 0.3,
    "firstHitSpeed": 0,
    "speed": "Medium (60)",
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000099": {
    "name": "Goblinstein",
    "type": "troop",
    "hp1": 875,
    "dmg1": 50,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.8,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000101": {
    "name": "Rune Giant",
    "type": "troop",
    "hp1": 1100,
    "dmg1": 60,
    "atkSpeed": 1.5,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "26000102": {
    "name": "Berserker",
    "type": "troop",
    "hp1": 350,
    "atkSpeed": 0.6,
    "firstHitSpeed": 0.2,
    "speed": "Fast (90)",
    "deployTime": 1,
    "count": 1
  },
  "26000103": {
    "name": "Boss Bandit",
    "type": "troop",
    "hp1": 1025,
    "dmg1": 96,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.4,
    "speed": "Fast (90)",
    "range": 0.8,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000106": {
    "name": "Ronin",
    "type": "troop",
    "hp1": 695,
    "dmg1": 145,
    "atkSpeed": 1.3,
    "firstHitSpeed": 0.4,
    "speed": "Fast (90)",
    "range": 1.2,
    "deployTime": 1,
    "target": "Ground",
    "count": 1
  },
  "26000107": {
    "name": "Minion Giant",
    "type": "troop",
    "hp1": 710,
    "dmg1": 60,
    "atkSpeed": 1.7,
    "firstHitSpeed": 0.8,
    "speed": "Medium (60)",
    "range": 4,
    "deployTime": 1,
    "target": "Buildings",
    "count": 1
  },
  "27000000": {
    "name": "Cannon",
    "type": "building",
    "hp1": 322,
    "dmg1": 79,
    "atkSpeed": 1,
    "firstHitSpeed": 0.9,
    "range": 5.5,
    "deployTime": 1,
    "lifetime": 30,
    "target": "Ground",
    "count": 1
  },
  "27000001": {
    "name": "Goblin Hut",
    "type": "building",
    "hp1": 461,
    "atkSpeed": 10,
    "deployTime": 1,
    "lifetime": 30,
    "count": 1
  },
  "27000002": {
    "name": "Mortar",
    "type": "building",
    "hp1": 535,
    "dmg1": 104,
    "atkSpeed": 4.7,
    "firstHitSpeed": 1,
    "range": 11.5,
    "radius": 2,
    "deployTime": 3.5,
    "lifetime": 30,
    "target": "Ground",
    "count": 1
  },
  "27000003": {
    "name": "Inferno Tower",
    "type": "building",
    "hp1": 683,
    "dmg1": 17,
    "atkSpeed": 0.4,
    "firstHitSpeed": -0.8,
    "range": 6,
    "deployTime": 1,
    "lifetime": 30,
    "target": "Air & Ground",
    "count": 1
  },
  "27000004": {
    "name": "Bomb Tower",
    "type": "building",
    "hp1": 530,
    "dmg1": 87,
    "atkSpeed": 1.8,
    "firstHitSpeed": 0.5,
    "range": 6,
    "radius": 1.5,
    "deployTime": 1,
    "lifetime": 30,
    "target": "Ground",
    "count": 1
  },
  "27000005": {
    "name": "Barbarian Hut",
    "type": "building",
    "hp1": 455,
    "atkSpeed": 10,
    "deployTime": 1,
    "lifetime": 30,
    "count": 1
  },
  "27000006": {
    "name": "Tesla",
    "type": "building",
    "hp1": 462,
    "dmg1": 86,
    "atkSpeed": 1.1,
    "firstHitSpeed": 0.4,
    "range": 5.5,
    "deployTime": 1,
    "lifetime": 25,
    "target": "Air & Ground",
    "count": 1
  },
  "27000007": {
    "name": "Elixir Collector",
    "type": "building",
    "hp1": 418,
    "deployTime": 1,
    "lifetime": 110,
    "count": 1
  },
  "27000008": {
    "name": "X-Bow",
    "type": "building",
    "hp1": 625,
    "dmg1": 24,
    "atkSpeed": 0.4,
    "range": 11.5,
    "deployTime": 3.5,
    "lifetime": 30,
    "target": "Ground",
    "count": 1
  },
  "27000009": {
    "name": "Tombstone",
    "type": "building",
    "hp1": 207,
    "atkSpeed": 10,
    "deployTime": 1,
    "lifetime": 30,
    "count": 1
  },
  "27000010": {
    "name": "Furnace",
    "type": "building",
    "hp1": 284,
    "dmg1": 70,
    "atkSpeed": 1.7,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "range": 5.5,
    "deployTime": 1,
    "target": "Air & Ground",
    "count": 1
  },
  "27000012": {
    "name": "Goblin Cage",
    "type": "building",
    "hp1": 305,
    "atkSpeed": 10,
    "deployTime": 1,
    "lifetime": 20,
    "count": 1
  },
  "27000013": {
    "name": "Goblin Drill",
    "type": "building",
    "hp1": 1000,
    "atkSpeed": 1.2,
    "firstHitSpeed": 0.5,
    "speed": "Medium (60)",
    "deployTime": 1,
    "count": 1
  },
  "28000000": {
    "name": "Fireball",
    "type": "spell",
    "radius": 2.5,
    "dmg1": 269,
    "crownDmgPercent": -77
  },
  "28000001": {
    "name": "Arrows",
    "type": "spell",
    "radius": 3.5,
    "dmg1": 48,
    "crownDmgPercent": -80
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
    "radius": 2,
    "dmg1": 580,
    "crownDmgPercent": -77
  },
  "28000004": {
    "name": "Goblin Barrel",
    "type": "spell",
    "radius": 1.5,
    "hp1": 79,
    "dmg1": 49,
    "count": 3
  },
  "28000005": {
    "name": "Freeze",
    "type": "spell",
    "dmg11": 115,
    "crownDmg11": 35,
    "radius": 3,
    "target": "Air & Ground",
    "dmg1": 58,
    "crownDmgPercent": -75
  },
  "28000007": {
    "name": "Lightning",
    "type": "spell",
    "dmg1": 413,
    "crownDmgPercent": -75
  },
  "28000008": {
    "name": "Zap",
    "type": "spell",
    "radius": 2.5,
    "target": "Air & Ground",
    "dmg1": 75,
    "crownDmgPercent": -75
  },
  "28000009": {
    "name": "Poison",
    "type": "spell",
    "dmg1": 36,
    "crownDmgPercent": -78
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
    "range": 10.1,
    "target": "Ground",
    "dmg1": 105,
    "crownDmgPercent": -87
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
    "radius": 3.5,
    "target": "Ground",
    "dmg1": 32,
    "crownDmgPercent": -40
  },
  "28000015": {
    "name": "Barbarian Barrel",
    "type": "spell",
    "range": 4.5,
    "target": "Ground",
    "hp1": 280,
    "dmg1": 75
  },
  "28000016": {
    "name": "Heal Spirit",
    "type": "troop",
    "hp11": 215,
    "dmg11": 110,
    "speed": "Very Fast (120)",
    "range": 2.5,
    "deployTime": 1,
    "target": "Air & Ground"
  },
  "28000017": {
    "name": "Giant Snowball",
    "type": "spell",
    "radius": 2.5,
    "target": "Air & Ground",
    "dmg1": 70,
    "crownDmgPercent": -75
  },
  "28000018": {
    "name": "Royal Delivery",
    "type": "spell",
    "radius": 3,
    "deployTime": 3,
    "target": "Air & Ground",
    "hp1": 214,
    "dmg1": 52,
    "count": 1
  },
  "28000023": {
    "name": "Void",
    "type": "spell",
    "dmg11": 153,
    "crownDmg11": 35,
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
    "hp11": 1798,
    "dmg11": 309,
    "deployTime": 1,
    "count": 1
  },
  "28000026": {
    "name": "Vines",
    "type": "spell",
    "dmg11": 153,
    "crownDmg11": 39,
    "radius": 2.5
  }
};

// Tabella ufficiale di scalatura per livello di Supercell (rarities[].powerLevelMultiplier
// in gamedata-v5.json, valori Common: la stessa tabella si applica a ogni
// rarità, solo con un offset diverso — vedi relativeLevel per rarità nella
// fonte). index = livelloAssoluto - 2 (il livello assoluto 1 è il valore
// base, non scalato). Non è una formula: sono i moltiplicatori reali che
// il gioco usa, verificati contro una seconda fonte indipendente
// (ClashStrategic/stats) su più carte.
export const POWER_LEVEL_MULTIPLIER = [110,121,133,146,160,176,193,212,233,256,281,309,339,372,409,450,495,545,600];

// valore reale di una stat al livello assoluto richiesto, usando la tabella
// ufficiale (truppe/edifici migrati: campi hp1/dmg1).
export function statAtLevelReal(value1, absoluteLevel) {
  if (value1 === undefined) return undefined;
  if (absoluteLevel <= 1) return value1;
  const mult = POWER_LEVEL_MULTIPLIER[absoluteLevel - 2];
  if (mult === undefined) return undefined;
  return Math.floor((value1 * mult) / 100);
}

// legacy: formula stimata del wiki, SOLO per le carte non ancora migrate
// (vedi commento di testa) — campi hp11/dmg11/crownDmg11.
export function statAtLevelLegacy(value11, absoluteLevel) {
  if (value11 === undefined) return undefined;
  return Math.round(value11 * 1.1 ** (absoluteLevel - 11));
}

// tutte le stat di una carta risolte a un livello assoluto. Riconosce da
// solo quale delle due fonti usare in base ai campi presenti nell'entry
// (hp1/dmg1 = dati reali, hp11/dmg11 = fallback wiki). cardMeta è l'entry
// del catalogo /cards (serve solo per l'id).
export function getCardStatsAtLevel(cardMeta, absoluteLevel) {
  const entry = CARD_STATS[cardMeta.id];
  if (!entry) return null;
  const { hp1, dmg1, hp11, dmg11, crownDmg11, crownDmgPercent, ...constants } = entry;

  const hp = hp1 !== undefined ? statAtLevelReal(hp1, absoluteLevel) : statAtLevelLegacy(hp11, absoluteLevel);
  const damage =
    dmg1 !== undefined ? statAtLevelReal(dmg1, absoluteLevel) : statAtLevelLegacy(dmg11, absoluteLevel);

  let crownTowerDamage;
  if (crownDmgPercent !== undefined) {
    // incantesimi migrati con percentuale reale: applicata al danno già
    // scalato (verificato contro una fonte indipendente, vedi commento di
    // testa — più affidabile del crownDmg11 del wiki).
    crownTowerDamage = damage !== undefined ? Math.floor((damage * (100 + crownDmgPercent)) / 100) : undefined;
  } else if (crownDmg11 !== undefined) {
    crownTowerDamage = statAtLevelLegacy(crownDmg11, absoluteLevel);
  } else {
    // truppe/edifici e incantesimi-evocatori (Goblin Barrel, Royal Delivery,
    // Barbarian Barrel): la torre subisce lo stesso danno del bersaglio.
    crownTowerDamage = damage;
  }

  return { ...constants, hp, damage, crownTowerDamage };
}
