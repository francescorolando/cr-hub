// leagueNumber come restituito da player.currentPathOfLegendSeasonResult.
// leagueNumber va da 1 a 7 — verificato non per inferenza ma per confronto
// diretto fra i dati di un account reale e il suo stato in gioco nello
// stesso momento: current=4 mentre in gioco risultava in lega Campione,
// last=3 mentre la stagione precedente era stata Maestro III (luglio 2026).
// I valori più alti (8, 9, 10) che si vedono nei campi last/best DI ALTRI
// PROFILI sono quasi certamente numerazione legacy di una versione
// precedente della Classificata con più leghe — non ce ne curiamo perché
// mostriamo solo la stagione corrente, mai quei due campi.
export const LEAGUE_NAMES_IT = {
    1: "Maestro I",
    2: "Maestro II",
    3: "Maestro III",
    4: "Campione",
    5: "Campione Grandioso",
    6: "Campione Royale",
    7: "Campione Definitivo",
};

export function leagueName(leagueNumber) {
    return LEAGUE_NAMES_IT[leagueNumber] || `Lega ${leagueNumber}`;
}

// solo da qui in su le medaglie contano per la classifica mondiale (l'API
// valorizza "rank" esclusivamente a questo livello): sotto, si sale a step
// per vittoria, non con un punteggio comparabile fra giocatori.
export const CHAMPION_DEFINITIVE_LEAGUE = 7;

// leghe di Tattiche Royale (player.progress["AutoChess_..."].arena.name):
// l'API le dà solo in inglese ("Bronze I"…"Gold V", "Diamond"). Nomi
// italiani presi dalla nota ufficiale Supercell della stagione 11 di
// Tattiche Royale (Bronzo I-III, Argento I-IV, Oro I-V, Diamante); leghe
// future non ancora note restano in inglese.
const MERGE_TIERS_IT = { Bronze: "Bronzo", Silver: "Argento", Gold: "Oro", Diamond: "Diamante" };

export function mergeLeagueName(englishName) {
    if (!englishName) return null;
    const [tier, ...rest] = englishName.split(" ");
    return MERGE_TIERS_IT[tier] ? [MERGE_TIERS_IT[tier], ...rest].join(" ") : englishName;
}
