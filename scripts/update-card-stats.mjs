// Aggiornamento completo delle statistiche delle carte dopo un bilanciamento,
// in un solo comando (npm run update-stats):
//
//   1. scripts/scrape-card-stats.mjs  → lib/cardLegacyStatsSnapshot.mjs (wiki)
//   2. scripts/fetch-card-stats.mjs   → lib/cardStats.js (dati reali + fallback)
//   3. riepilogo di cosa è cambiato in lib/cardStats.js rispetto a prima,
//      carta per carta, ai livelli 11 e 16 — più le carte nuove senza nome
//      italiano in lib/cardNamesIt.js.
//
// Non fa commit né push: i file cambiati restano da controllare a mano (git
// diff) prima di pubblicarli, perché la fonte statsroyale non è ufficiale e
// può cambiare formato o restare indietro di una patch (successo entrambe le
// volte a ottobre 2026, vedi git log).
//
// Uso: npm run update-stats
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CARD_STATS_PATH = path.join(ROOT, "lib/cardStats.js");
const LEVELS = [11, 16];
const SCALING_FIELDS = ["hp", "damage", "crownTowerDamage"];
const CONSTANT_FIELDS = [
  "atkSpeed",
  "firstHitSpeed",
  "speed",
  "range",
  "radius",
  "deployTime",
  "lifetime",
  "target",
  "count",
];

// importa un modulo dal suo testo, non dal percorso: così la versione di
// prima e quella di dopo dello stesso file sono due moduli distinti (un
// import per percorso verrebbe servito dalla cache). Funziona perché questi
// file non hanno import propri.
function importFromSource(source) {
  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
}

function runStep(label, script) {
  console.log(`\n=== ${label} ===`);
  const { status } = spawnSync(process.execPath, [path.join(__dirname, script)], { stdio: "inherit" });
  if (status !== 0) {
    console.error(`\n${script} è fallito (exit ${status}): mi fermo, lib/cardStats.js non è stato rigenerato.`);
    process.exit(status || 1);
  }
}

function sourceOf(entry) {
  if (!entry) return "-";
  return entry.hp1 !== undefined || entry.dmg1 !== undefined ? "reale" : "wiki";
}

function describeChanges(before, after) {
  const lines = [];
  const ids = new Set([...Object.keys(before.CARD_STATS), ...Object.keys(after.CARD_STATS)]);
  for (const id of ids) {
    const old = before.CARD_STATS[id];
    const fresh = after.CARD_STATS[id];
    const name = (fresh || old).name;
    if (!old) {
      lines.push(`+ ${name} (nuova, fonte ${sourceOf(fresh)})`);
      continue;
    }
    if (!fresh) {
      lines.push(`- ${name} (sparita: estrazione fallita, vedi log sopra)`);
      continue;
    }

    const diffs = [];
    if (sourceOf(old) !== sourceOf(fresh)) diffs.push(`fonte ${sourceOf(old)}→${sourceOf(fresh)}`);
    for (const level of LEVELS) {
      const a = before.getCardStatsAtLevel({ id }, level);
      const b = after.getCardStatsAtLevel({ id }, level);
      for (const field of SCALING_FIELDS) {
        if (a[field] !== b[field]) diffs.push(`L${level} ${field} ${a[field]}→${b[field]}`);
      }
    }
    for (const field of CONSTANT_FIELDS) {
      if (JSON.stringify(old[field]) !== JSON.stringify(fresh[field])) diffs.push(`${field} ${old[field]}→${fresh[field]}`);
    }
    if (diffs.length) lines.push(`~ ${name}: ${diffs.join(" | ")}`);
  }
  return lines;
}

async function main() {
  const before = await importFromSource(readFileSync(CARD_STATS_PATH, "utf8"));

  runStep("1/2 wiki → lib/cardLegacyStatsSnapshot.mjs", "scrape-card-stats.mjs");
  runStep("2/2 statsroyale + fallback → lib/cardStats.js", "fetch-card-stats.mjs");

  const after = await importFromSource(readFileSync(CARD_STATS_PATH, "utf8"));
  const changes = describeChanges(before, after);

  console.log("\n=== Riepilogo modifiche a lib/cardStats.js ===");
  if (changes.length) for (const line of changes) console.log(line);
  else console.log("Nessuna statistica cambiata.");

  const { CARD_NAMES_IT } = await importFromSource(readFileSync(path.join(ROOT, "lib/cardNamesIt.js"), "utf8"));
  const untranslated = Object.values(after.CARD_STATS)
    .map((entry) => entry.name)
    .filter((name) => !CARD_NAMES_IT[name]);
  if (untranslated.length) {
    console.log(`\nSenza nome italiano in lib/cardNamesIt.js: ${untranslated.join(", ")}`);
  }

  console.log("\nNiente commit né push: controlla con git diff prima di pubblicare.");
}

main();
