import { toAbsoluteLevel } from "@/lib/cardLeveling";

// Analisi del battlelog (GET /players/{tag}/battlelog). L'API restituisce
// solo le partite recenti (di solito 30), senza paginazione né storico:
// tutto quello che segue è quindi "forma recente", mai una statistica di
// carriera.
//
// Le categorie sono ricavate da type + gameMode, verificate campionando i
// battlelog reali di 25 giocatori (ottobre 2026): "trail" è usato sia per la
// strada dei trofei stagionale (gameMode "Ladder") sia per gli eventi, e i
// 2v2 si riconoscono dal team con due giocatori, qualunque sia il type.
export const BATTLE_CATEGORIES = {
  ladder: "Trofei",
  ranked: "Classificata",
  war: "Guerra tra clan",
  duo: "2v2",
  challenge: "Sfide e tornei",
  friendly: "Amichevoli",
  event: "Eventi",
};

const WAR_TYPES = ["riverRacePvP", "riverRaceDuel", "riverRaceDuelColosseum", "boatBattle"];
const CHALLENGE_TYPES = ["challenge", "grandChallenge", "tournament", "ladderTournament"];
const FRIENDLY_TYPES = ["friendly", "clanMate", "clanMate2v2"];

export function battleCategory(battle) {
  const { type } = battle;
  const mode = battle.gameMode?.name || "";
  if (FRIENDLY_TYPES.includes(type)) return "friendly";
  if ((battle.team || []).length > 1) return "duo";
  if (type === "pathOfLegend") return "ranked";
  if (type === "PvP" || (type === "trail" && mode === "Ladder")) return "ladder";
  if (WAR_TYPES.includes(type)) return "war";
  if (CHALLENGE_TYPES.includes(type)) return "challenge";
  return "event";
}

// nelle battaglie navali l'avversario è una difesa statica e le corone non
// dicono chi ha vinto: lì l'API dà direttamente boatBattleWon.
export function battleResult(battle) {
  if (battle.type === "boatBattle") return battle.boatBattleWon ? "win" : "loss";
  const mine = battle.team?.[0]?.crowns ?? 0;
  const theirs = battle.opponent?.[0]?.crowns ?? 0;
  if (mine > theirs) return "win";
  if (mine < theirs) return "loss";
  return "draw";
}

// battleTime arriva in formato compatto "20261017T095822.000Z", che
// Date.parse non riconosce: lo riportiamo all'ISO esteso.
export function parseBattleTime(raw) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/.exec(raw || "");
  if (!m) return null;
  return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`);
}

// partite 1v1 giocate col proprio mazzo dove elisir sprecato, livelli e
// carte avversarie sono confrontabili: scala, classificata e guerra PvP.
// Fuori i duelli (16 carte, più round), le navali (difesa statica), i draft
// e gli eventi a mazzo imposto.
function isComparable(battle) {
  const category = battleCategory(battle);
  if (!["ladder", "ranked", "war"].includes(category)) return false;
  if (battle.type !== "riverRacePvP" && category === "war") return false;
  return battle.deckSelection === "collection" && battle.team?.[0]?.cards?.length === 8;
}

function average(values) {
  const nums = values.filter((v) => typeof v === "number");
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
}

function deckLevel(cards) {
  return average((cards || []).map((c) => toAbsoluteLevel(c)));
}

function tally(list) {
  const counts = { total: list.length, wins: 0, losses: 0, draws: 0 };
  for (const b of list) {
    const r = battleResult(b);
    if (r === "win") counts.wins += 1;
    else if (r === "loss") counts.losses += 1;
    else counts.draws += 1;
  }
  return counts;
}

export function summarizeBattles(battles) {
  const list = battles || [];
  const results = list.map(battleResult);

  // serie attuale: il battlelog è ordinato dalla più recente
  let streak = 0;
  const streakType = results[0];
  for (const r of results) {
    if (r !== streakType || r === "draw") break;
    streak += 1;
  }

  const byCategory = Object.keys(BATTLE_CATEGORIES)
    .map((key) => ({
      key,
      label: BATTLE_CATEGORIES[key],
      ...tally(list.filter((b) => battleCategory(b) === key)),
    }))
    .filter((c) => c.total > 0);

  // corone solo dove contano (niente navali)
  const crownBattles = list.filter((b) => b.type !== "boatBattle");
  const decided = crownBattles.filter((b) => battleResult(b) !== "draw");
  const oneCrown = decided.filter(
    (b) => Math.abs((b.team[0].crowns ?? 0) - (b.opponent[0].crowns ?? 0)) === 1
  );

  const comparable = list.filter(isComparable);

  const faced = new Map();
  for (const b of comparable) {
    const won = battleResult(b) === "win";
    for (const card of b.opponent[0].cards || []) {
      const entry = faced.get(card.id) || { card, count: 0, wins: 0 };
      entry.count += 1;
      if (won) entry.wins += 1;
      faced.set(card.id, entry);
    }
  }

  const ladder = list.filter(
    (b) => battleCategory(b) === "ladder" && typeof b.team[0].trophyChange === "number"
  );

  const times = list.map((b) => parseBattleTime(b.battleTime)).filter(Boolean);

  return {
    ...tally(list),
    from: times.length ? times[times.length - 1] : null,
    to: times.length ? times[0] : null,
    streak: streakType === "draw" ? 0 : streak,
    streakType,
    byCategory,
    crowns: {
      battles: crownBattles.length,
      avgFor: average(crownBattles.map((b) => b.team[0].crowns)),
      avgAgainst: average(crownBattles.map((b) => b.opponent[0].crowns)),
      threeCrownWins: crownBattles.filter(
        (b) => battleResult(b) === "win" && b.team[0].crowns === 3
      ).length,
      oneCrownShare: decided.length ? oneCrown.length / decided.length : null,
    },
    comparable: {
      battles: comparable.length,
      leakedMine: average(comparable.map((b) => b.team[0].elixirLeaked)),
      leakedTheirs: average(comparable.map((b) => b.opponent[0].elixirLeaked)),
      levelMine: average(comparable.map((b) => deckLevel(b.team[0].cards))),
      levelTheirs: average(comparable.map((b) => deckLevel(b.opponent[0].cards))),
    },
    facedCards: [...faced.values()].sort((a, b) => b.count - a.count || b.wins - a.wins),
    ladder: {
      battles: ladder.length,
      net: ladder.reduce((sum, b) => sum + b.team[0].trophyChange, 0),
    },
  };
}

// mazzo di riferimento del profilo: quello dell'ultima partita di
// Classificata o del Cammino dei trofei giocata col proprio mazzo.
// player.currentDeck non basta: è il mazzo del solo Cammino dei trofei (su
// ~1.100 giocatori coincide al 97% con l'ultima partita lì e solo al 27% con
// l'ultima in Classificata) e quando contiene un campione l'API lo omette,
// restituendo 7 carte. Nel mazzo di una partita invece ci sono sempre tutte e
// 8, campione compreso, con evoluzione/eroe attivi (vedi BattleList.js).
export function referenceDeck(battles) {
  const battle = (battles || []).find(
    (b) =>
      ["ranked", "ladder"].includes(battleCategory(b)) &&
      b.deckSelection === "collection" &&
      b.team?.length === 1 &&
      b.team[0].cards?.length === 8
  );
  if (!battle) return null;
  return {
    battle,
    cards: battle.team[0].cards,
    tower: battle.team[0].supportCards?.[0] || null,
  };
}

// nel battlelog evolutionLevel è il ruolo attivo in quella partita (1 =
// evoluzione, 2 = eroe), non la maschera di sblocco del profilo
export function battleCardRole(card) {
  if (card.evolutionLevel === 1) return "evo";
  if (card.evolutionLevel === 2) return "hero";
  return null;
}
