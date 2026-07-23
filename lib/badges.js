// helper per pescare i badge "generali" (non le centinaia di Mastery<Carta>)
// dall'array player.badges e usarne l'icona reale del gioco al posto di
// un'icona SVG generica, quando disponibile.
export function findBadge(player, name) {
  return (player?.badges || []).find((b) => b.name === name) || null;
}

export function badgeIconUrl(badge) {
  return badge?.iconUrls?.large || null;
}

// alcuni badge hanno maxLevel/progress-target, altri no (es. contatori senza
// tetto): ritorna null quando non è possibile calcolare una percentuale.
export function badgeProgressRatio(badge) {
  if (!badge) return null;
  if (badge.target) return Math.min(1, (badge.progress ?? 0) / badge.target);
  if (badge.maxLevel) return Math.min(1, (badge.level ?? 0) / badge.maxLevel);
  return null;
}

// tutti i badge "generali" del giocatore (eventi, modalità, traguardi),
// esclusi i Mastery<Carta> che sono centinaia e già coperti carta per carta
// nel tab Miglioramento.
export function generalBadges(player) {
  return (player?.badges || []).filter((b) => b.name && !b.name.startsWith("Mastery"));
}

// i nomi dei badge dall'API sono identificatori interni (es.
// "SeasonalBadge_202508", "Classic12Wins"), non pensati per essere mostrati:
// li spezziamo in parole leggibili e togliamo il suffisso numerico di
// stagione/anno, che non aggiunge nulla in un tooltip.
export function humanizeBadgeName(name) {
  return name
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])([0-9])/g, "$1 $2")
    .replace(/([0-9])([A-Za-z])/g, "$1 $2")
    .replace(/\s+\d{4,}$/, "")
    .replace(/\s+/g, " ")
    .trim();
}
