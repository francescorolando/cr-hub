// Icone originali di Clash Royale per ogni statistica (le stesse mostrate in
// gioco per Punti vita, Danno, ecc.), scaricate da clashroyale.fandom.com e
// ripulite con scripts/process-stat-icons.py il 2026-07-22: l'asset
// originale non ha uno sfondo grigio opaco, ma un rettangolo arrotondato
// nero semi-trasparente disegnato sotto al glifo (appare grigio solo perché
// si mescola con lo sfondo bianco della pagina) — non rimovibile via CSS,
// quindi le versioni servite qui sono processate una volta e ospitate in
// locale (public/stat-icons/), non più in hotlink verso il wiki. Vedi lo
// script per i dettagli della rimozione e gli URL originali di partenza.
export const STAT_ICON_URLS = {
  hp: "/stat-icons/hp.png",
  damage: "/stat-icons/damage.png",
  dps: "/stat-icons/dps.png",
  crownTowerDamage: "/stat-icons/crownTowerDamage.png",
  atkSpeed: "/stat-icons/atkSpeed.png",
  firstHitSpeed: "/stat-icons/atkSpeed.png",
  speed: "/stat-icons/speed.png",
  range: "/stat-icons/range.png",
  radius: "/stat-icons/radius.png",
  deployTime: "/stat-icons/deployTime.png",
  lifetime: "/stat-icons/lifetime.png",
  target: "/stat-icons/target.png",
  count: "/stat-icons/count.png",
};
