// leagueNumber come restituito da player.*PathOfLegendSeasonResult.leagueNumber
// NON va da 1 a 7: confrontando i dati live di un giocatore reale (best =
// leagueNumber 10, icona a diamante) con gli asset delle 10 icone di lega su
// RoyaleAPI (league1.png…league10.png, dalla spada di bronzo al diamante),
// risulta che il valore arriva fino a 10. Le 7 leghe della Classificata
// (Maestro I-III, Campione, Campione grandioso, Campione reale, Campione
// definitivo — confermate su fonti incrociate a luglio 2026) occupano quindi
// la parte alta 4-10; cosa siano esattamente 1-3 nei dati grezzi non è
// confermato (probabile residuo di Trophy Road pre-Classificata), quindi per
// quei valori mostriamo solo "Lega N" invece di indovinare un nome.
export const LEAGUE_NAMES_IT = {
  4: "Maestro I",
  5: "Maestro II",
  6: "Maestro III",
  7: "Campione",
  8: "Campione grandioso",
  9: "Campione reale",
  10: "Campione definitivo",
};

export function leagueName(leagueNumber) {
  return LEAGUE_NAMES_IT[leagueNumber] || `Lega ${leagueNumber}`;
}

// il risultato "corrente" può essere 0/vuoto se il giocatore non ha ancora
// giocato la Classificata in questa stagione: in quel caso mostrare "0" è
// fuorviante, meglio ripiegare sull'ultima stagione giocata o, in mancanza,
// sul suo record migliore.
export function bestSeasonResult(player) {
  const candidates = [
    player?.currentPathOfLegendSeasonResult,
    player?.lastPathOfLegendSeasonResult,
    player?.bestPathOfLegendSeasonResult,
  ];
  return candidates.find((r) => r && r.trophies > 0) || null;
}
