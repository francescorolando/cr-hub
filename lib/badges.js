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
