// Migrazione (parziale, vedi sotto) della fonte delle statistiche di
// combattimento da clashroyale.fandom.com (formula 1.1^livello, stimata) ai
// dati reali di Supercell decriptati dal client di gioco, distribuiti da
// cache.statsroyale.com/gamedata-v5.json e mantenuti aggiornati ad ogni
// patch (li usa anche https://github.com/ClashStrategic/stats).
//
// Perché il cambio: la formula del wiki (round(v11 * 1.1^(livello-11))) è
// una STIMA — il wiki stesso lo ammette in un commento sopra la tabella
// ("there will be rounding mistakes, but that's better than manually
// typing it in every time"). I moltiplicatori VERI per livello non sono
// 1.1^n: sono in rarities[].powerLevelMultiplier dentro gamedata-v5.json,
// una tabella fissa decisa da Supercell (es. livello 16 = 4.09x, non
// 1.1^5=1.61051x). Verificato su più carte: Knight, Hog Rider e Cannon
// combaciano esattamente con una seconda fonte indipendente
// (ClashStrategic/stats) usando questa tabella, mentre la vecchia formula
// del wiki sbaglia il danno del Cannon (212 invece di 202, reale) e le HP
// a livello 16 di diverse carte di ~0.8%.
//
// TRUPPE/EDIFICI: estratti direttamente da summonCharacterData, formato
// verificato a mano su più carte (vedi git log per i dettagli).
//
// INCANTESIMI: la struttura dati grezza è molto più eterogenea (danno
// singolo in projectileData, danno nel tempo in buffData.damagePerSecond,
// proiettili a catena come The Log in spawnProjectileData, incantesimi che
// evocano una truppa come Goblin Barrel/Royal Delivery dove il danno è
// quello dell'unità evocata, non della "carta" stessa). Per questo ogni
// incantesimo estratto viene VALIDATO prima di essere accettato: il valore
// previsto a livello 11 viene confrontato con quello della fonte wiki
// (fresca, ri-letta da lib/cardLegacyStatsSnapshot.mjs) entro una tolleranza
// del 5% (minimo 3 unità) — se combacia, si usa il dato reale; se no, o se
// l'estrazione non produce nulla (es. Vines, Graveyard, Void, Goblin Curse:
// il loro "danno" nel wikitext non corrisponde a nessun campo semplice nella
// fonte statsroyale, hanno meccaniche ad azioni condizionali troppo
// complesse per essere lette con sicurezza), resta la vecchia fonte wiki
// invariata. Questo ha scartato correttamente Freeze, Tornado ed Earthquake:
// il loro danno "istantaneo"/"al secondo" grezzo non combacia col valore
// mostrato dal wiki (es. Freeze: 148 prevdefinito vs 115 wiki) — la
// relazione fra quel campo e ciò che il gioco mostra non è quella ipotizzata
// qui, quindi meglio non toccarli piuttosto che indovinare.
//
// Il danno alla torre (crownTowerDamage) per gli incantesimi migrati usa
// SEMPRE la percentuale reale (crownTowerDamagePercent) sul danno già
// scalato, non il crownDmg11 del wiki: quel campo wiki è risultato
// sistematicamente impreciso ovunque verificato (Fireball 172 reale contro
// 207 wiki, Cannon 202 reale contro 212 wiki — confermato anche da una
// seconda fonte indipendente, ClashStrategic/stats).
//
// Restano sulla fonte wiki, fuori scope: le 5 carte troop la cui fonte
// statsroyale non ha summonCharacterData proprio (Ice Wizard, Electro
// Wizard, Three Musketeers, Heal Spirit, Spirit Empress — riusano
// un'unità condivisa per nome invece di incorporare le proprie stat).
//
// Uso: node scripts/fetch-card-stats.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const raw = readFileSync(path.join(ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

const { CR_API_TOKEN } = loadEnvLocal();
if (!CR_API_TOKEN) throw new Error("CR_API_TOKEN mancante in .env.local");

async function fetchCatalog() {
  const res = await fetch("https://proxy.royaleapi.dev/v1/cards", {
    headers: { Authorization: `Bearer ${CR_API_TOKEN}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`catalogo: HTTP ${res.status}`);
  const data = await res.json();
  return data.items; // le support/tower troop cards (data.supportItems) restano fuori scope
}

async function fetchGameData() {
  const res = await fetch("https://cache.statsroyale.com/gamedata-v5.json");
  if (!res.ok) throw new Error(`gamedata: HTTP ${res.status}`);
  return res.json();
}

async function loadLegacyStats() {
  const mod = await import(path.join(ROOT, "lib/cardLegacyStatsSnapshot.mjs"));
  return mod.LEGACY_CARD_STATS;
}

// carte/livello: la stessa tabella per tutte le rarità (relativeLevel è solo
// un offset — vedi commento di testa) e la più lunga è quella Common, che
// copre livello assoluto 2 (indice 0) fino al livello massimo teorico del
// gioco (indice 18). index = livelloAssoluto - 2.
function buildMultiplierTable(gameData) {
  const common = gameData.items.rarities.find((r) => r.name === "Common");
  if (!common?.powerLevelMultiplier) throw new Error("powerLevelMultiplier non trovato per Common");
  return common.powerLevelMultiplier;
}

const TARGET_LABELS = {
  TID_TARGETS_GROUND: "Ground",
  TID_TARGETS_AIR_AND_GROUND: "Air & Ground",
  TID_TARGETS_BUILDINGS: "Buildings",
};

const SPEED_LABELS = {
  TID_SPEED_0: "Slow",
  TID_SPEED_1: "Slow",
  TID_SPEED_2: "Slow",
  TID_SPEED_3: "Medium",
  TID_SPEED_4: "Fast",
  TID_SPEED_5: "Very Fast",
};

function speedLabel(tidSpeed, rawSpeed) {
  const base = SPEED_LABELS[tidSpeed];
  return base && rawSpeed !== undefined ? `${base} (${rawSpeed})` : undefined;
}

// evita artefatti float (1.2000000000000002) sui campi in secondi ottenuti
// dividendo i millisecondi grezzi per 1000.
function round3(n) {
  return n === undefined ? undefined : Math.round(n * 1000) / 1000;
}

const TROOP_OR_BUILDING_TYPE = {
  TID_CARD_TYPE_CHARACTER: "troop",
  TID_CARD_TYPE_BUILDING: "building",
};

// estrae le stat di una carta truppa/edificio dal blob grezzo statsroyale.
// Ritorna null se la carta non ha summonCharacterData utilizzabile (es. Three
// Musketeers, che riusa la unità "Musketeer" per nome invece di incorporare
// le proprie stat — fuori scope qui, resta sulla fonte wiki come le spell).
function extractTroopOrBuilding(spell) {
  const type = TROOP_OR_BUILDING_TYPE[spell.tidType];
  if (!type) return null;
  const scd = spell.summonCharacterData;
  if (!scd) return null;

  const hp1 = scd.hitpoints;
  // le truppe corpo a corpo hanno "damage" diretto; le truppe a distanza e
  // gli edifici lo hanno dentro projectileData (il proiettile che sparano).
  const dmg1 = scd.damage ?? scd.projectileData?.damage;
  if (hp1 === undefined && dmg1 === undefined) return null;

  const atkSpeed = scd.hitSpeed !== undefined ? round3(scd.hitSpeed / 1000) : undefined;
  const loadTime = scd.loadTime !== undefined ? round3(scd.loadTime / 1000) : undefined;
  // "primo colpo" mostrato dal wiki = tempo dal dispiegamento al primo hit,
  // cioè hitSpeed - loadTime (verificato su Knight 1.2-0.7=0.5, Hog Rider
  // 1.6-1.0=0.6, Wizard 1.4-1.0=0.4: combacia esattamente col valore wiki).
  const firstHitSpeed = atkSpeed !== undefined && loadTime !== undefined ? round3(atkSpeed - loadTime) : undefined;

  return {
    name: spell.englishName || spell.name,
    type,
    hp1,
    dmg1,
    atkSpeed,
    firstHitSpeed,
    speed: speedLabel(scd.tidSpeed, scd.speed),
    range: scd.range !== undefined ? round3(scd.range / 1000) : undefined,
    radius: scd.projectileData?.radius !== undefined ? round3(scd.projectileData.radius / 1000) : undefined,
    deployTime: scd.deployTime !== undefined ? round3(scd.deployTime / 1000) : undefined,
    lifetime: scd.lifeTime !== undefined ? round3(scd.lifeTime / 1000) : undefined,
    target: TARGET_LABELS[scd.tidTarget],
    count: spell.summonNumber ?? 1,
  };
}

function stripUndefined(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[k] = v;
  return out;
}

// tenta di estrarre {dmg1, hp1, crownPercent} da un incantesimo, provando le
// forme note in ordine (vedi commento di testa per esempi reali di ognuna).
// Ritorna null se nessuna forma nota si applica — il chiamante tiene la
// vecchia fonte wiki in quel caso, non prova a indovinare oltre.
function extractSpellCandidate(spell) {
  const pd = spell.projectileData;
  const aeo = spell.areaEffectObjectData;
  const deathAeo = spell.summonCharacterData?.deathAreaEffectData?.spawnAreaEffectObjectData;

  // incantesimo che evoca una o più truppe (Goblin Barrel, Royal Delivery):
  // il "danno"/"vita" mostrati sono quelli dell'unità evocata, non della
  // carta — la torre prende danno normale, nessuna percentuale dedicata.
  const spawnChar = pd?.spawnCharacterData || aeo?.projectileData?.spawnCharacterData;
  if (spawnChar) {
    return {
      dmg1: spawnChar.damage,
      hp1: spawnChar.hitpoints,
      count: pd?.spawnCharacterCount ?? aeo?.projectileData?.spawnCharacterCount,
    };
  }

  // proiettile "a catena" con un secondo proiettile annidato che porta il
  // vero danno (The Log, Barbarian Barrel) — se quel secondo proiettile
  // evoca a sua volta una truppa (Barbarian Barrel), è lei ad avere le stat
  // mostrate; altrimenti (The Log) è il proiettile stesso.
  if (pd?.spawnProjectileData) {
    const inner = pd.spawnProjectileData;
    if (inner.spawnCharacterData) {
      return { dmg1: inner.spawnCharacterData.damage, hp1: inner.spawnCharacterData.hitpoints };
    }
    return { dmg1: inner.damage, crownPercent: inner.crownTowerDamagePercent };
  }

  // proiettile semplice, danno singolo diretto (Fireball, Rocket, Snowball,
  // Arrows — Arrows ha più "onde" ma il valore mostrato è quello di una
  // singola onda, non il totale cumulato: verificato, combacia col wiki).
  if (pd?.damage !== undefined) {
    return { dmg1: pd.damage, crownPercent: pd.crownTowerDamagePercent };
  }

  // area effect con danno diretto (Zap) o annidato un livello più sotto
  // dentro un proprio projectileData (Lightning).
  const aeoDamage = normalizeDamage(aeo?.damage, aeo?.crownTowerDamagePercent);
  if (aeoDamage) return aeoDamage;
  if (aeo?.projectileData?.damage !== undefined) {
    return { dmg1: aeo.projectileData.damage, crownPercent: aeo.projectileData.crownTowerDamagePercent };
  }

  // danno nel tempo (Poison, Tornado, Earthquake): il valore mostrato dal
  // wiki risulta essere il danno AL SECONDO grezzo, non il totale sulla
  // durata — ma questo vale solo per alcuni di questi incantesimi (Poison
  // sì, Tornado/Earthquake no: la validazione a valle scarta i secondi).
  if (aeo?.buffData?.damagePerSecond !== undefined) {
    return { dmg1: aeo.buffData.damagePerSecond, crownPercent: aeo.buffData.crownTowerDamagePercent };
  }

  // incantesimo che evoca un'area di danno alla morte di un oggetto
  // "invisibile" (Rage: la bottiglia genera l'area che fa danno). Da
  // ottobre 2026 la fonte ha qui solo il riferimento per nome "RageDamage",
  // senza numero: normalizeDamage lo scarta e Rage resta sul wiki.
  const deathDamage = normalizeDamage(deathAeo?.damage, deathAeo?.crownTowerDamagePercent);
  if (deathDamage) return deathDamage;

  return null;
}

// il campo damage degli area effect esiste in due forme: numero semplice
// (formato fino ad agosto 2026) oppure, da ottobre 2026, oggetto
// {baseDamage, towerDamage} dove towerDamage è il valore base contro le
// torri (es. Zap {75, 19}) — convertito qui nella stessa percentuale usata
// altrove (19/75 ≈ 25% → -75). Qualunque altra forma (es. una stringa che
// rimanda a un'altra entità per nome, come "RageDamage") non è un numero
// leggibile: ritorna null e la carta resta sul wiki.
function normalizeDamage(damage, crownPercent) {
  if (typeof damage === "number") return { dmg1: damage, crownPercent };
  if (typeof damage?.baseDamage !== "number") return null;
  const { baseDamage, towerDamage } = damage;
  return {
    dmg1: baseDamage,
    crownPercent:
      typeof towerDamage === "number" && baseDamage > 0
        ? Math.round((towerDamage * 100) / baseDamage) - 100
        : crownPercent,
  };
}

// il valore previsto con la tabella reale deve combaciare (entro il 5%,
// minimo 3 unità) col valore della fonte wiki fresca prima di essere
// accettato — vedi commento di testa per perché questa rete di sicurezza
// serve davvero (Freeze/Tornado/Earthquake vengono scartati proprio qui).
function withinTolerance(predicted, reference) {
  if (predicted === undefined || reference === undefined) return true; // niente da confrontare
  return Math.abs(predicted - reference) <= Math.max(3, reference * 0.05);
}

// incantesimi per cui un fallimento della tolleranza è dovuto al wiki
// rimasto indietro, non a un'estrazione sbagliata — verificato con un
// riscontro incrociato, non a occhio. L'estrazione resta automatica (segue
// le patch future), si salta solo il confronto col wiki.
const SKIP_WIKI_TOLERANCE = {
  // Barbarian Barrel (2026-10-16): il barile evoca un Barbaro e la fonte
  // reale gli dà hp1=280/dmg1=75, identici al Barbaro della carta Barbarians
  // — che sul wiki è aggiornata (716 hp a liv. 11 = floor(280*2.56), dopo un
  // buff). La pagina wiki del Barile invece è ferma a 670 hp: è lei a essere
  // indietro, non la fonte reale.
  28000015: "wiki del Barile non aggiornato al buff dei Barbari",
};

function extractSpell(spell, legacyEntry) {
  const candidate = extractSpellCandidate(spell);
  if (!candidate) return null;

  const predictedDmg11 = candidate.dmg1 !== undefined ? Math.floor((candidate.dmg1 * 256) / 100) : undefined;
  const predictedHp11 = candidate.hp1 !== undefined ? Math.floor((candidate.hp1 * 256) / 100) : undefined;
  if (!SKIP_WIKI_TOLERANCE[spell.id]) {
    if (!withinTolerance(predictedDmg11, legacyEntry?.dmg11)) return null;
    if (!withinTolerance(predictedHp11, legacyEntry?.hp11)) return null;
  }

  // radius/target/deployTime/count/range restano quelli del wiki (fatti
  // semplici, non la fonte del problema) — si sostituiscono solo i campi
  // che scalano col livello con l'ancora reale.
  const { hp11, dmg11, crownDmg11, ...constants } = legacyEntry;
  return stripUndefined({
    ...constants,
    hp1: candidate.hp1,
    dmg1: candidate.dmg1,
    crownDmgPercent: candidate.crownPercent,
    count: candidate.count ?? constants.count,
  });
}

// Correzioni confermate con un test reale in gioco (2026-08-03, vedi
// conversazione): casi dove l'automazione sbagliava strada — o scartava per
// sicurezza un'estrazione che in realtà era quella giusta, o non aveva
// nessuna estrazione automatica possibile. Applicate DOPO tutta la logica
// sopra, quindi hanno sempre l'ultima parola.
const CONFIRMED_MANUAL_OVERRIDES = {
  // Freeze: la validazione scartava dmg1=58/crownPercent=-75 perché non
  // combaciava col wiki (115/35 — vedi extractSpellCandidate). Un test
  // reale conferma 148 danno / 37 danno torre a livello assoluto 11, che è
  // ESATTAMENTE ciò che statsroyale prevedeva (floor(58*2.56)=148,
  // floor(148*0.25)=37): il wiki era sbagliato, non la nuova fonte. Si
  // forza l'accettazione nonostante il fallimento della tolleranza.
  28000005: { dmg1: 58, crownDmgPercent: -75 },
  // Electro Wizard: fuori scope automatico (nessun summonCharacterData
  // nella fonte statsroyale, riusa un'unità condivisa per nome). Un test
  // reale conferma HP 1141 a livello assoluto 16, non i 1150 proiettati
  // dalla vecchia formula 1.1^n a partire da hp11=714 (che invece è
  // corretto, combacia) — lo scarto è la stessa deriva della formula stimata
  // vista ovunque in questa migrazione. hp1 qui è ricavato a ritroso da
  // quel singolo punto reale con la tabella ufficiale (1141*100/409≈279,
  // verificato: floor(279*409/100)=1141) — un'ancora reale su un solo punto
  // misurato, non su tutta la scala, ma comunque meglio della formula stimata.
  26000042: { hp1: 279 },
};

// Bilanciamento ufficiale del 2026-10-06 (post Supercell "October Balance
// Changes"), uscito quando statsroyale era fermo al 2026-10-05. I valori
// "prima" del post combaciano tutti esattamente coi nostri, quindi i "dopo"
// sono affidabili. Ogni voce si applica SOLO se il campo vale ancora
// "from" (fonte non ancora aggiornata); se vale già "to" la fonte ha
// recepito la patch e la voce non serve più; qualunque altro valore viene
// segnalato nel log e non toccato (fonte cambiata in un modo non previsto).
// hp1/dmg1 sono valori base: il valore al livello 11 del post diviso 2.56
// (moltiplicatore liv. 11), cioè l'unico intero x con floor(x*256/100) =
// valore ufficiale. Una volta che statsroyale si aggiorna, si può
// cancellare l'intero blocco.
//
// Non rappresentabili nel nostro modello, quindi non applicati: abilità di
// Hero Ice Wizard e Monk, evoluzioni (Cannone, Elite Barbarians), dispersione
// degli Skeletons, scatto del Golden Knight, produzione dell'Elixir
// Collector, danno alla torre di Goblin Drill, primo colpo di Goblin Barrel
// (la nostra voce non ha firstHitSpeed) e il danno del rotolamento di
// Barbarian Barrel (232 → 215: noi mostriamo le stat del Barbaro evocato).
const PATCH_2026_10_06 = {
  26000107: { atkSpeed: { from: 1.5, to: 1.7 } }, // Minion Giant
  26000050: { hp1: { from: 473, to: 450 }, dmg1: { from: 102, to: 103 } }, // Royal Ghost 1152 / 263
  26000029: { dmg1: { from: 21, to: 28 }, atkSpeed: { from: 1.3, to: 1.5 } }, // Lava Hound 71
  26000051: { dmg1: { from: 98, to: 106 } }, // Ram Rider 271
  26000058: { dmg1: { from: 110, to: 118 } }, // Wall Breakers 302
  27000008: { dmg1: { from: 23, to: 24 } }, // X-Bow 61
  26000074: { dmg1: { from: 63, to: 66 } }, // Golden Knight 168
  27000007: { lifetime: { from: 93, to: 110 } }, // Elixir Collector 1m 50s
  26000028: { hp11: { from: 883, to: 906 } }, // Three Musketeers (fonte wiki)
};

// Bilanciamento di metà stagione del 2026-10-19 (post RoyaleAPI "Mid-Season
// Final Balance Changes for October 2026"), stesso meccanismo del blocco
// sopra: i "prima" del post combaciano coi nostri valori al livello 11
// (Cannon Cart 212, Dart Goblin 151, Minion Giant 168, Flying Machine 171,
// Electro Dragon 0.7s), i "dopo" sono convertiti a hp1/dmg1 allo stesso modo.
// Cancellabile insieme al blocco sopra quando statsroyale si aggiorna.
//
// Non applicati: Void (il post dà solo il danno a 2-4 bersagli, 296 → 307,
// noi mostriamo un altro scaglione dal wiki, 153), danno alla morte di
// Skeleton Barrel ed evoluzione (campo che non abbiamo), massa di Cannon
// Cart, durata degli incantamenti di Rune Giant, ritardo dell'abilità di
// Hero Electro Wizard e dispersione degli Skeletons.
const PATCH_2026_10_19 = {
  26000054: { dmg1: { from: 83, to: 79 } }, // Cannon Cart 202
  26000040: { dmg1: { from: 59, to: 56 } }, // Dart Goblin 143
  26000107: { dmg1: { from: 66, to: 60 } }, // Minion Giant 153
  26000057: { dmg1: { from: 67, to: 70 } }, // Flying Machine 179
  26000063: { firstHitSpeed: { from: 0.7, to: 0.5 } }, // Electro Dragon
};

function applyPendingPatch(results, patch) {
  const applied = [];
  const alreadyLive = [];
  const unexpected = [];
  for (const [id, fields] of Object.entries(patch)) {
    const entry = results[id];
    if (!entry) continue;
    for (const [field, { from, to }] of Object.entries(fields)) {
      if (entry[field] === from) {
        entry[field] = to;
        applied.push(`${entry.name}.${field}`);
      } else if (entry[field] === to) {
        alreadyLive.push(`${entry.name}.${field}`);
      } else {
        unexpected.push(`${entry.name}.${field}=${entry[field]} (attesi ${from} o ${to})`);
      }
    }
  }
  return { applied, alreadyLive, unexpected };
}

async function main() {
  const catalog = await fetchCatalog();
  const gameData = await fetchGameData();
  const legacyStats = await loadLegacyStats();
  const multiplierTable = buildMultiplierTable(gameData);
  const spellsById = new Map(gameData.items.spells.map((s) => [s.id, s]));

  const results = {};
  const migrated = [];
  const migratedSpells = [];
  const keptLegacy = [];
  const missing = [];
  const overridden = [];

  for (const card of catalog) {
    const raw = spellsById.get(card.id);
    const fresh = raw ? extractTroopOrBuilding(raw) : null;
    if (fresh) {
      results[card.id] = stripUndefined(fresh);
      migrated.push(card.name);
      continue;
    }

    const legacy = legacyStats[card.id];
    if (raw && legacy?.type === "spell") {
      const spell = extractSpell(raw, legacy);
      if (spell) {
        results[card.id] = spell;
        migratedSpells.push(card.name);
        continue;
      }
    }

    if (legacy) {
      results[card.id] = legacy;
      keptLegacy.push(card.name);
      continue;
    }
    missing.push(card.name);
  }

  for (const [id, override] of Object.entries(CONFIRMED_MANUAL_OVERRIDES)) {
    if (!results[id]) continue;
    results[id] = stripUndefined({ ...results[id], ...override });
    overridden.push(results[id].name);
  }

  const patch = applyPendingPatch(results, PATCH_2026_10_06);
  const midSeasonPatch = applyPendingPatch(results, PATCH_2026_10_19);

  const header = `// Statistiche di combattimento per carta — fonte MISTA (vedi
// scripts/fetch-card-stats.mjs, eseguito il ${new Date().toISOString().slice(0, 10)}):
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
export const CARD_STATS = `;

  const body = JSON.stringify(results, null, 2);
  const footer = `;

// Tabella ufficiale di scalatura per livello di Supercell (rarities[].powerLevelMultiplier
// in gamedata-v5.json, valori Common: la stessa tabella si applica a ogni
// rarità, solo con un offset diverso — vedi relativeLevel per rarità nella
// fonte). index = livelloAssoluto - 2 (il livello assoluto 1 è il valore
// base, non scalato). Non è una formula: sono i moltiplicatori reali che
// il gioco usa, verificati contro una seconda fonte indipendente
// (ClashStrategic/stats) su più carte.
export const POWER_LEVEL_MULTIPLIER = ${JSON.stringify(multiplierTable)};

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
`;
  writeFileSync(path.join(ROOT, "lib/cardStats.js"), `${header}${body}${footer}`);

  console.log(`Truppe/edifici migrati a dati reali: ${migrated.length}/${catalog.length}`);
  console.log(`Incantesimi migrati a dati reali: ${migratedSpells.length}`);
  if (migratedSpells.length) console.log(`  ${migratedSpells.join(", ")}`);
  console.log(`Rimaste su fonte wiki (legacy): ${keptLegacy.length}`);
  if (keptLegacy.length) console.log(`  ${keptLegacy.join(", ")}`);
  if (overridden.length) console.log(`Correzioni manuali applicate (verificate in gioco): ${overridden.join(", ")}`);
  if (patch.applied.length) console.log(`Patch 2026-10-06 applicata a mano (fonte non ancora aggiornata): ${patch.applied.join(", ")}`);
  if (patch.alreadyLive.length) console.log(`Patch 2026-10-06 già presente nella fonte: ${patch.alreadyLive.join(", ")}`);
  if (patch.unexpected.length) {
    console.log(`ATTENZIONE, patch 2026-10-06 non applicata, valore inatteso:`);
    for (const line of patch.unexpected) console.log(`  - ${line}`);
  }
  if (midSeasonPatch.applied.length) console.log(`Patch 2026-10-19 applicata a mano (fonte non ancora aggiornata): ${midSeasonPatch.applied.join(", ")}`);
  if (midSeasonPatch.alreadyLive.length) console.log(`Patch 2026-10-19 già presente nella fonte: ${midSeasonPatch.alreadyLive.join(", ")}`);
  if (midSeasonPatch.unexpected.length) {
    console.log(`ATTENZIONE, patch 2026-10-19 non applicata, valore inatteso:`);
    for (const line of midSeasonPatch.unexpected) console.log(`  - ${line}`);
  }
  if (missing.length) {
    console.log(`Mancanti del tutto (${missing.length}):`);
    for (const name of missing) console.log(`  - ${name}`);
  }
}

main();
