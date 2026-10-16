// Script (non fa parte della build Next.js): genera
// lib/cardLegacyStatsSnapshot.mjs leggendo il wikitext grezzo di
// clashroyale.fandom.com per ogni carta del catalogo ufficiale. Primo passo
// di npm run update-stats; il file dell'app (lib/cardStats.js) lo genera poi
// scripts/fetch-card-stats.mjs, che usa questa istantanea come fallback. La pagina HTML renderizzata risponde 403 da script,
// ma l'endpoint MediaWiki action=parse risponde 200 e contiene, non ancora
// processate, le variabili che il sito usa per calcolare la tabella livelli
// (hp_11/dmg_11/atk_speed -> valore(livello) = valore_11 * 1.1^(livello-11)).
// Uso: node scripts/scrape-card-stats.mjs
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
  return data.items; // le support/tower troop cards (data.supportItems) restano fuori scope v1
}

// override manuali per carte il cui titolo pagina wiki non coincide col nome
// inglese dell'API (verificato a mano quando lo scraping fallisce per queste)
const PAGE_NAME_OVERRIDES = {};

// voci scritte a mano per carte che il wiki non ha ancora (o la cui pagina
// non ha una tabella leggibile): usate solo se lo scraping di quella carta
// fallisce, vedi in fondo a main().
const HAND_ADDED = {
  // Ronin: hp11/dmg11 presi da uno screenshot in-game del livello assoluto
  // 11 reale (2026-07-24, vedi git log). Le sue stat vere arrivano comunque
  // da statsroyale: questa voce serve solo da riserva.
  26000106: {
    name: "Ronin",
    type: "troop",
    hp11: 1779,
    dmg11: 337,
    atkSpeed: 1.4,
    speed: "Fast (90)",
    deployTime: 1,
    target: "Ground",
    count: 1,
  },
};

function wikiPageName(cardName) {
  return PAGE_NAME_OVERRIDES[cardName] || cardName;
}

async function fetchWikitextRaw(pageName) {
  const url = `https://clashroyale.fandom.com/api.php?action=parse&page=${encodeURIComponent(
    pageName
  )}&format=json&prop=wikitext`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const data = await res.json();
  if (data.error) return null;
  return data.parse?.wikitext?.["*"] || null;
}

// alcune carte (es. "P.E.K.K.A", "Mini P.E.K.K.A") sono pagine-redirect verso
// un titolo con un punto finale diverso: un solo salto di redirect basta.
async function fetchWikitext(pageName) {
  const wikitext = await fetchWikitextRaw(pageName);
  if (!wikitext) return null;
  const redirect = wikitext.match(/^#redirect\s*\[\[([^\]|]+)/i);
  if (redirect) return fetchWikitextRaw(redirect[1].trim());
  return wikitext;
}

function stripWikiMarkup(cell) {
  return cell
    .replace(/\[\[:?Category:[^|]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[([^|\]]+)\]\]/g, "$1")
    .replace(/\{\{Rarity\|([^}]+)\}\}/g, "$1")
    .replace(/<br\s*\/?>/g, " ")
    .trim();
}

// prima tabella "unit-attributes-table" della pagina: header + un'unica riga
// dati -> campi costanti (non scalano col livello). Generico rispetto al tipo
// di carta (Truppa/Edificio/Incantesimo hanno colonne diverse).
function extractConstants(wikitext) {
  const tableIdx = wikitext.indexOf('id="unit-attributes-table"');
  if (tableIdx === -1) return null;
  const tableEnd = wikitext.indexOf("|}", tableIdx);
  const block = wikitext.slice(tableIdx, tableEnd);

  const headers = [...block.matchAll(/!\s*(?:scope="col"\s*\|)?\s*([^<\n!|]+?)(?:<br\s*\/?>.*)?$/gm)].map((m) =>
    m[1].trim()
  );

  const rowMatch = block.match(/\|-\s*\n\|([^\n]+)/);
  if (!rowMatch) return null;
  const cells = rowMatch[1].split("||").map((c) => stripWikiMarkup(c));

  const out = {};
  headers.forEach((h, i) => {
    if (cells[i] !== undefined) out[h] = cells[i];
  });
  return out;
}

// blocco {{#vardefine}} immediatamente prima di "unit-statistics-table": per
// i Champion questo scarta il blocco abilità (che ha un'altra tabella subito
// dopo, non unit-statistics-table) e prende solo quello delle stat che scalano.
// Tra il blocco e la tabella alcune pagine inseriscono anche un
// {{StatisticsSubheader|...}}, e l'apertura della tabella è scritta a volte
// "{|class=" a volte "{| class=" (spazio in più) — entrambe le varianti sono
// ammesse qui.
function extractScalingBase(wikitext) {
  // nome variabile: di solito "hp_11", ma su carte a più unità distinte
  // (es. Three Musketeers) compare anche con uno spazio ("melee dmg_11").
  const re =
    /((?:\{\{#vardefine:\s*([\w ]+?)\s*\|\s*([^}]+?)\s*\}\}\s*)+)(?:\{\{StatisticsSubheader\|[^}]*\}\}\s*)?\{\|\s*class="wikitable"\s*id="unit-statistics-table"/;
  const m = wikitext.match(re);
  if (!m) return null;
  const vars = {};
  for (const vm of m[1].matchAll(/\{\{#vardefine:\s*([\w ]+?)\s*\|\s*([^}]+?)\s*\}\}/g)) {
    const num = parseFloat(vm[2]);
    vars[vm[1]] = Number.isNaN(num) ? vm[2].trim() : num;
  }
  return vars;
}

// carte multi-unità (es. Golem/Golemite, Elixir Golem/Golemite/Blob) nominano
// le variabili con un prefisso ("golem_hp_11", "mite_dmg_11", ...) invece del
// semplice "hp_11", e alcune carte (es. Archers, Minions, spawner di più
// copie identiche) usano "hp_base"/"dmg_base" al posto di "hp_11"/"dmg_11"
// (stesso significato: valore a livello assoluto 11). Si prova ogni alias in
// ordine e si prende la prima corrispondenza nell'ordine in cui compaiono nel
// wikitext, che è sempre l'unità "principale" della carta.
const VAR_ALIASES = {
  hp_11: ["hp_11", "hp_base"],
  dmg_11: ["dmg_11", "dmg_base"],
  crown_dmg_11: ["crown_dmg_11", "crown_dmg_base"],
};

function pickVar(vars, kind) {
  for (const suffix of VAR_ALIASES[kind]) {
    const re = new RegExp(`(^|_| )${suffix}$`);
    for (const [key, value] of Object.entries(vars)) {
      if (re.test(key)) return value;
    }
  }
  return undefined;
}

// il tipo (Troop/Building/Spell) si legge dal template Card Infobox in testa
// alla pagina, presente su ogni carta indipendentemente dal fatto che la
// tabella "unit-attributes-table" più sotto esista o meno (alcuni incantesimi,
// es. Lightning/Poison, non ce l'hanno affatto).
function extractType(wikitext) {
  const m = wikitext.match(/\{\{Card Infobox\|[^}]*?Type=([A-Za-z]+)/);
  return (m?.[1] || "").toLowerCase();
}

function parseNumeric(str) {
  if (str === undefined) return undefined;
  // la colonna "Count" è scritta come "x1"/"x3": la "x" va tolta prima di
  // interpretare il numero, altrimenti parseFloat fallisce e il conteggio
  // sparisce anche per le carte dove il dato c'è.
  const num = parseFloat(String(str).replace(/^x/i, ""));
  return Number.isNaN(num) ? undefined : num;
}

async function main() {
  const catalog = await fetchCatalog();
  const results = {};
  const failed = [];

  for (const card of catalog) {
    const pageName = wikiPageName(card.name);
    const wikitext = await fetchWikitext(pageName);
    if (!wikitext) {
      failed.push({ id: card.id, name: card.name, reason: "pagina non trovata" });
      continue;
    }

    const constants = extractConstants(wikitext) || {};
    const scaling = extractScalingBase(wikitext);
    const hp11 = scaling && pickVar(scaling, "hp_11");
    const dmg11 = scaling && pickVar(scaling, "dmg_11");
    if (!scaling || (hp11 === undefined && dmg11 === undefined)) {
      failed.push({ id: card.id, name: card.name, reason: "tabella statistiche non riconosciuta" });
      continue;
    }

    const type = extractType(wikitext);
    results[card.id] = {
      name: card.name,
      type: type.includes("spell") ? "spell" : type.includes("building") ? "building" : "troop",
      hp11,
      dmg11,
      crownDmg11: pickVar(scaling, "crown_dmg_11"),
      atkSpeed: parseNumeric(constants["Hit Speed"]),
      firstHitSpeed: parseNumeric(constants["First Hit Speed"]),
      speed: constants["Speed"],
      range: parseNumeric(constants["Range"]),
      radius: parseNumeric(constants["Radius"]),
      deployTime: parseNumeric(constants["Deploy Time"]),
      lifetime: parseNumeric(constants["Lifetime"]),
      target: constants["Target"],
      count: parseNumeric(constants["Count"]),
    };

    // gentile con l'API pubblica del wiki: una richiesta ogni ~150ms
    await new Promise((r) => setTimeout(r, 150));
  }

  // carte che il wiki non copre ancora: si usa la voce scritta a mano, ma
  // solo finché lo scraping fallisce — appena il wiki ha una tabella
  // leggibile, vince il wiki e la voce manuale si può togliere.
  const handAddedUsed = [];
  for (const [id, entry] of Object.entries(HAND_ADDED)) {
    if (results[id]) continue;
    results[id] = entry;
    handAddedUsed.push(entry.name);
  }

  const header = `// Istantanea di sola lettura delle statistiche 'fonte wiki'
// (clashroyale.fandom.com, endpoint MediaWiki action=parse, prop=wikitext),
// generata da scripts/scrape-card-stats.mjs il ${new Date().toISOString().slice(0, 10)} — non modificare a
// mano, rilanciare lo script (o npm run update-stats).
//
// Usata da scripts/fetch-card-stats.mjs come fallback per le carte che la
// fonte statsroyale non copre e come riferimento per validare gli
// incantesimi (vedi il commento di testa di lib/cardStats.js). NON
// importare altrove: è solo input per lo script, non fa parte dell'app.
//
// Ogni carta ha il valore di riferimento a livello ASSOLUTO 11 (hp11,
// dmg11, crownDmg11 per gli incantesimi); i campi senza suffisso numerico
// (atkSpeed, range, ecc.) sono costanti.
export const LEGACY_CARD_STATS = `;

  const body = JSON.stringify(results, null, 2);
  writeFileSync(path.join(ROOT, "lib/cardLegacyStatsSnapshot.mjs"), `${header}${body};\n`);

  console.log(`OK: ${Object.keys(results).length - handAddedUsed.length}/${catalog.length} carte estratte dal wiki.`);
  if (handAddedUsed.length) console.log(`Voci aggiunte a mano (non ancora sul wiki): ${handAddedUsed.join(", ")}`);
  const stillMissing = failed.filter((f) => !results[f.id]);
  if (stillMissing.length) {
    console.log(`Fallite (${stillMissing.length}):`);
    for (const f of stillMissing) console.log(`  - ${f.id} ${f.name}: ${f.reason}`);
  }
}

main();
