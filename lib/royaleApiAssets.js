// Le immagini ufficiali di Supercell (api-assets.clashroyale.com) non hanno
// l'aspetto delle carte mostrate nel gioco/RoyaleAPI: quelle "vere" (con la
// cornice a scudo, il diamante dell'evoluzione e il glow) vivono sulla CDN
// statica di RoyaleAPI, con un file per carta identificato dal suo "slug"
// inglese (es. 26000017 → "wizard.png", evoluta → "wizard-ev1.png", eroe →
// "wizard-hero.png"). Verificato a mano scaricando gli asset il 2026-07-21.
//
// La mappa id→slug qui sotto viene dal dataset pubblico
// RoyaleAPI/cr-api-data (docs/json/cards.json, campi id/key) e copre le
// carte esistenti a quella data. Per qualunque id non in mappa (carte
// nuovissime o torri di supporto, che quel dataset non include) si
// ripiega su uno slug generato dal nome inglese: nei test fatti a mano
// ha sempre funzionato (es. "Tower Princess" → "tower-princess",
// "Goblinstein" → "goblinstein"), ma non è garantito al 100% per sempre —
// per questo ogni utilizzo va sempre affiancato da un fallback all'icona
// ufficiale (vedi components/CardImage.js), nel caso lo slug indovinato o
// la cartella di versione sotto cambino.
const SLUG_BY_ID = {
  26000000: "knight",
  26000001: "archers",
  26000002: "goblins",
  26000003: "giant",
  26000004: "pekka",
  26000005: "minions",
  26000006: "balloon",
  26000007: "witch",
  26000008: "barbarians",
  26000009: "golem",
  26000010: "skeletons",
  26000011: "valkyrie",
  26000012: "skeleton-army",
  26000013: "bomber",
  26000014: "musketeer",
  26000015: "baby-dragon",
  26000016: "prince",
  26000017: "wizard",
  26000018: "mini-pekka",
  26000019: "spear-goblins",
  26000020: "giant-skeleton",
  26000021: "hog-rider",
  26000022: "minion-horde",
  26000023: "ice-wizard",
  26000024: "royal-giant",
  26000025: "guards",
  26000026: "princess",
  26000027: "dark-prince",
  26000028: "three-musketeers",
  26000029: "lava-hound",
  26000030: "ice-spirit",
  26000031: "fire-spirit",
  26000032: "miner",
  26000033: "sparky",
  26000034: "bowler",
  26000035: "lumberjack",
  26000036: "battle-ram",
  26000037: "inferno-dragon",
  26000038: "ice-golem",
  26000039: "mega-minion",
  26000040: "dart-goblin",
  26000041: "goblin-gang",
  26000042: "electro-wizard",
  26000043: "elite-barbarians",
  26000044: "hunter",
  26000045: "executioner",
  26000046: "bandit",
  26000047: "royal-recruits",
  26000048: "night-witch",
  26000049: "bats",
  26000050: "royal-ghost",
  26000051: "ram-rider",
  26000052: "zappies",
  26000053: "rascals",
  26000054: "cannon-cart",
  26000055: "mega-knight",
  26000056: "skeleton-barrel",
  26000057: "flying-machine",
  26000058: "wall-breakers",
  26000059: "royal-hogs",
  26000060: "goblin-giant",
  26000061: "fisherman",
  26000062: "magic-archer",
  26000063: "electro-dragon",
  26000064: "firecracker",
  26000065: "mighty-miner",
  26000066: "super-witch",
  26000067: "elixir-golem",
  26000068: "battle-healer",
  26000069: "skeleton-king",
  26000070: "super-lava-hound",
  26000071: "super-magic-archer",
  26000072: "archer-queen",
  26000073: "santa-hog-rider",
  26000074: "golden-knight",
  26000075: "super-ice-golem",
  26000077: "monk",
  26000078: "super-archers",
  26000080: "skeleton-dragons",
  26000081: "terry",
  26000082: "super-mini-pekka",
  26000083: "mother-witch",
  26000084: "electro-spirit",
  26000085: "electro-giant",
  26000086: "raging-prince",
  26000087: "phoenix",
  27000000: "cannon",
  27000001: "goblin-hut",
  27000002: "mortar",
  27000003: "inferno-tower",
  27000004: "bomb-tower",
  27000005: "barbarian-hut",
  27000006: "tesla",
  27000007: "elixir-collector",
  27000008: "x-bow",
  27000009: "tombstone",
  27000010: "furnace",
  27000012: "goblin-cage",
  27000013: "goblin-drill",
  27000014: "party-hut",
  28000000: "fireball",
  28000001: "arrows",
  28000002: "rage",
  28000003: "rocket",
  28000004: "goblin-barrel",
  28000005: "freeze",
  28000006: "mirror",
  28000007: "lightning",
  28000008: "zap",
  28000009: "poison",
  28000010: "graveyard",
  28000011: "the-log",
  28000012: "tornado",
  28000013: "clone",
  28000014: "earthquake",
  28000015: "barbarian-barrel",
  28000016: "heal-spirit",
  28000017: "giant-snowball",
  28000018: "royal-delivery",
  28000020: "party-rocket",
};

const CDN_BASE = "https://cdns3.royaleapi.com/cdn-cgi/image/w=150,h=180,format=auto/static/img/cards/v10-9f6caa5e";

function slugify(name) {
  if (!name) return null;
  return name
    .replace(/\./g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function cardSlug(card) {
  return SLUG_BY_ID[card.id] || slugify(card.name);
}

// variant: "base" | "evo" | "hero"
export function royaleApiCardUrl(card, variant = "base") {
  const slug = cardSlug(card);
  if (!slug) return null;
  const suffix = variant === "evo" ? `-ev${card.evolutionLevel || 1}` : variant === "hero" ? "-hero" : "";
  return `${CDN_BASE}/${slug}${suffix}.png`;
}

// URL ufficiale Supercell corrispondente, da usare come fallback se l'asset
// RoyaleAPI dovesse rispondere 404 (slug indovinato male o versione cambiata).
export function officialCardUrl(card, variant = "base") {
  if (variant === "evo") return card.iconUrls?.evolutionMedium || card.iconUrls?.medium || null;
  if (variant === "hero") return card.iconUrls?.heroMedium || card.iconUrls?.medium || null;
  return card.iconUrls?.medium || null;
}

const UI_BASE = "https://cdns3.royaleapi.com/cdn-cgi/image/w=100,h=100,format=auto/static/img";

// icona reale dell'insegna di lega per la Classificata (vedi lib/leagues.js
// per il perché leagueNumber non parte da 1 in modo pulito).
export function leagueIconUrl(leagueNumber) {
  return leagueNumber ? `${UI_BASE}/leagues/league${leagueNumber}.png` : null;
}

// icone generiche dell'interfaccia di gioco, verificate a mano (coppa dei
// trofei e spade incrociate delle battaglie): niente SVG generiche quando
// esiste l'asset vero.
export const TROPHY_ICON_URL = `${UI_BASE}/ui/trophy.png`;
export const BATTLE_ICON_URL = `${UI_BASE}/ui/battle.png`;
