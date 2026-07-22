"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fetchCardCatalog, RARITIES, RARITY_LABELS } from "@/lib/api";
import { rarityKey, rarityStyle } from "@/lib/rarity";
import { toAbsoluteLevel, minAbsoluteLevel, formatNumber } from "@/lib/cardLeveling";
import { CARD_STATS, getCardStatsAtLevel } from "@/lib/cardStats";
import { STAT_ICON_URLS } from "@/lib/statIcons";
import { cardNameIt } from "@/lib/cardNamesIt";
import { usePlayer } from "@/lib/PlayerContext";
import CardImage from "@/components/CardImage";
import CardPickerDropdown from "@/components/CardPickerDropdown";

const TOURNAMENT_LEVEL = 11;
const MIN_SLOTS = 2;
const MAX_SLOTS = 6;

// righe raggruppate per sezione, invece di un'unica lista piatta: la stessa
// tabella con 13 righe senza struttura era difficile da scorrere. "Danno" e
// "Danno alla torre" restano due righe separate con due icone diverse (spada
// vs corona/torre) apposta — è così che si distinguono visivamente, non c'è
// altro modo dato che sono due numeri dello stesso tipo.
// totalable: per le carte che schierano più copie identiche (Scheletri x3,
// Barbari x5...) la tabella per-livello del wiki dà le stat di UNA sola
// unità — il totale in campo (quello che conta per un confronto reale) è
// quel valore moltiplicato per "count". Mostrato solo come annotazione sotto
// al valore singolo, e solo quando count > 1 (vedi renderCell): per le carte
// a unità singola, che sono la maggioranza, sarebbe un numero ridondante.
const STAT_GROUPS = [
  {
    title: "Combattimento",
    rows: [
      { key: "hp", label: "Punti vita", totalable: true },
      { key: "damage", label: "Danno", totalable: true },
      { key: "dps", label: "Danno al secondo", totalable: true },
      { key: "crownTowerDamage", label: "Danno alla torre", totalable: true },
    ],
  },
  {
    title: "Velocità",
    rows: [
      { key: "atkSpeed", label: "Velocità d'attacco", unit: " sec" },
      { key: "firstHitSpeed", label: "Velocità primo colpo", unit: " sec" },
      { key: "speed", label: "Velocità di movimento" },
    ],
  },
  {
    title: "Schieramento",
    rows: [
      { key: "range", label: "Raggio d'attacco" },
      { key: "radius", label: "Raggio d'area" },
      { key: "deployTime", label: "Tempo di schieramento", unit: " sec" },
      { key: "lifetime", label: "Durata", unit: " sec" },
      { key: "target", label: "Bersaglio" },
      { key: "count", label: "Numero di unità" },
    ],
  },
];

function withDps(stats) {
  if (!stats) return stats;
  const dps = stats.damage && stats.atkSpeed ? Math.round(stats.damage / stats.atkSpeed) : undefined;
  return { ...stats, dps };
}

function emptySlot() {
  return { cardId: null, level: TOURNAMENT_LEVEL };
}

export default function CompareTab() {
  const { player } = usePlayer();
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");
  const [slots, setSlots] = useState([emptySlot(), emptySlot()]);
  const [tournamentActive, setTournamentActive] = useState(false);
  const savedLevelsRef = useRef([]);

  useEffect(() => {
    fetchCardCatalog()
      .then((items) => setCatalog(items.filter((c) => CARD_STATS[c.id])))
      .catch((err) => setError(err.message || "Impossibile caricare il catalogo carte."));
  }, []);

  const catalogById = useMemo(() => {
    const map = new Map();
    for (const c of catalog || []) map.set(c.id, c);
    return map;
  }, [catalog]);

  const groupedCatalog = useMemo(() => {
    const byRarity = Object.fromEntries(RARITIES.map((r) => [r, []]));
    for (const c of catalog || []) {
      byRarity[rarityKey(c.rarity)]?.push(c);
    }
    for (const r of RARITIES) {
      byRarity[r].sort((a, b) => cardNameIt(a.name).localeCompare(cardNameIt(b.name), "it"));
    }
    return byRarity;
  }, [catalog]);

  // null se il player attivo non possiede quella carta — usato sia per il
  // livello di default alla selezione, sia per segnalare nel <select> quale
  // livello corrisponde a quello reale del giocatore.
  function ownedAbsoluteLevel(cardMeta) {
    const owned = player?.cards?.find((c) => c.id === cardMeta.id);
    if (!owned) return null;
    return toAbsoluteLevel({ level: owned.level, maxLevel: owned.maxLevel });
  }

  function defaultLevelFor(cardMeta) {
    return ownedAbsoluteLevel(cardMeta) ?? TOURNAMENT_LEVEL;
  }

  function selectCard(index, cardId) {
    setSlots((prev) => {
      const next = [...prev];
      const cardMeta = catalogById.get(Number(cardId));
      next[index] = { cardId: Number(cardId), level: defaultLevelFor(cardMeta) };
      return next;
    });
    setTournamentActive(false);
  }

  function selectLevel(index, level) {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], level: Number(level) };
      return next;
    });
    // una modifica manuale mentre il toggle torneo è attivo lo disattiva:
    // il valore appena scelto vince, non viene più forzato a 11.
    setTournamentActive(false);
  }

  function addSlot() {
    setSlots((prev) => (prev.length >= MAX_SLOTS ? prev : [...prev, emptySlot()]));
    setTournamentActive(false);
  }

  function removeSlot(index) {
    setSlots((prev) => (prev.length <= MIN_SLOTS ? prev : prev.filter((_, i) => i !== index)));
    setTournamentActive(false);
  }

  function toggleTournament() {
    if (tournamentActive) {
      setSlots((prev) => prev.map((s, i) => ({ ...s, level: savedLevelsRef.current[i] ?? TOURNAMENT_LEVEL })));
      setTournamentActive(false);
    } else {
      savedLevelsRef.current = slots.map((s) => s.level);
      setSlots((prev) => prev.map((s) => ({ ...s, level: TOURNAMENT_LEVEL })));
      setTournamentActive(true);
    }
  }

  const resolved = slots.map((slot) => {
    if (!slot.cardId) return null;
    const cardMeta = catalogById.get(slot.cardId);
    if (!cardMeta) return null;
    return { cardMeta, level: slot.level, stats: withDps(getCardStatsAtLevel(cardMeta, slot.level)) };
  });

  const filledCount = resolved.filter(Boolean).length;

  if (error) return <p className="text-sm text-crimson">{error}</p>;
  if (!catalog) return <p className="text-base text-muted">Carico il catalogo carte…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {slots.map((slot, i) => (
          <CardSlot
            key={i}
            slot={slot}
            groupedCatalog={groupedCatalog}
            cardMeta={resolved[i]?.cardMeta}
            ownedLevel={resolved[i]?.cardMeta ? ownedAbsoluteLevel(resolved[i].cardMeta) : null}
            onSelectCard={(cardId) => selectCard(i, cardId)}
            onSelectLevel={(level) => selectLevel(i, level)}
            onRemove={slots.length > MIN_SLOTS ? () => removeSlot(i) : null}
          />
        ))}
        {slots.length < MAX_SLOTS && (
          <button
            type="button"
            onClick={addSlot}
            className="flex min-h-24 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-panel-2 text-sm font-semibold text-muted transition hover:border-gold hover:text-gold"
          >
            + Aggiungi carta
          </button>
        )}
      </div>

      <TournamentSwitch active={tournamentActive} onToggle={toggleTournament} />

      {filledCount >= 2 && <ComparisonTable resolved={resolved.filter(Boolean)} />}
    </div>
  );
}

function TournamentSwitch({ active, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      className="flex w-fit items-center gap-3"
    >
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          active ? "bg-gold" : "bg-panel-2"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-soft transition-transform ${
            active ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className={`text-sm font-semibold ${active ? "text-gold" : "text-muted"}`}>
        Livelli torneo (11)
      </span>
    </button>
  );
}

function ComparisonTable({ resolved }) {
  const groups = STAT_GROUPS.map((group) => ({
    ...group,
    rows: group.rows.filter((row) =>
      resolved.some((r) => r?.stats?.[row.key] !== undefined && r.stats[row.key] !== "")
    ),
  })).filter((group) => group.rows.length > 0);

  const scrollRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function check() {
      setCanScroll(el.scrollWidth > el.clientWidth + 1 && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
    check();
    el.addEventListener("scroll", check);
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, [resolved.length]);

  return (
    <div className="relative">
      <div className="shadow-soft rounded-lg border-2 border-panel-2 bg-panel">
        <div ref={scrollRef} className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-120 text-sm">
            <thead>
              <tr className="border-b-2 border-panel-2 bg-panel-2/40">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Statistica
                </th>
                {resolved.map((r, i) => {
                  const style = rarityStyle(r.cardMeta.rarity);
                  return (
                    <th key={i} className="px-4 py-3 text-right">
                      <p className={`truncate text-sm font-bold ${style.text}`}>{cardNameIt(r.cardMeta.name)}</p>
                      <p className="font-num text-xs font-normal text-muted">Livello {r.level}</p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group.title}>
                <tr>
                  <td colSpan={resolved.length + 1} className="bg-panel-2/60 px-4 py-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{group.title}</p>
                  </td>
                </tr>
                {group.rows.map((row, i) => (
                  <tr key={row.key} className={i % 2 === 1 ? "bg-panel-2/20" : ""}>
                    <td className="px-4 py-2.5 text-xs font-semibold text-muted">
                      <span className="flex items-center gap-2">
                        <StatIcon statKey={row.key} />
                        {row.label}
                      </span>
                    </td>
                    {resolved.map((r, i2) => {
                      const value = r?.stats?.[row.key];
                      const count = r?.stats?.count;
                      const showTotal = row.totalable && typeof value === "number" && count > 1;
                      return (
                        <td key={i2} className="font-num px-4 py-2.5 text-right font-semibold text-ink">
                          {formatStat(value, row.unit)}
                          {showTotal && (
                            <span className="block text-[11px] font-normal text-muted">
                              totale ×{count} = {formatNumber(Math.round(value * count))}
                              {row.unit}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
      {canScroll && (
        <span className="shadow-soft pointer-events-none absolute -top-7 right-0 flex items-center gap-1 rounded-full bg-panel-2 px-2.5 py-1 text-xs font-semibold text-muted">
          Scorri <span aria-hidden>→</span>
        </span>
      )}
    </div>
  );
}

function StatIcon({ statKey }) {
  const [failed, setFailed] = useState(false);
  const src = STAT_ICON_URLS[statKey];
  if (!src || failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-5 w-5 shrink-0 object-contain" onError={() => setFailed(true)} />
  );
}

function formatStat(value, unit = "") {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "number") return `${formatNumber(value)}${unit}`;
  return value;
}

function CardSlot({ slot, groupedCatalog, cardMeta, ownedLevel, onSelectCard, onSelectLevel, onRemove }) {
  const style = cardMeta ? rarityStyle(cardMeta.rarity) : null;
  const min = cardMeta ? minAbsoluteLevel(cardMeta.maxLevel) : 1;
  const levels = [];
  for (let lvl = min; lvl <= 16; lvl++) levels.push(lvl);

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-lg border-2 bg-panel p-4 ${style?.border || "border-panel-2"}`}
    >
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          title="Rimuovi questa carta dal confronto"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-panel-2 bg-panel text-xs text-muted transition hover:border-crimson hover:text-crimson"
        >
          ×
        </button>
      )}
      <CardPickerDropdown
        groupedCatalog={groupedCatalog}
        value={slot.cardId}
        cardMeta={cardMeta}
        onChange={onSelectCard}
        placeholder="Scegli una carta…"
      />

      {cardMeta && (
        <>
          <div className="flex items-center gap-3">
            <CardImage
              card={cardMeta}
              className="h-14 w-auto shrink-0 object-contain"
              alt={cardNameIt(cardMeta.name)}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-ink">{cardNameIt(cardMeta.name)}</p>
              <span
                className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${style.text} ${style.bg}`}
              >
                {RARITY_LABELS[rarityKey(cardMeta.rarity)]}
              </span>
            </div>
          </div>
          {/* riga a parte anziché affiancato al nome: con più di due carte
              selezionate lo slot si restringe (grid auto-fill) e un
              <select> inline comprimeva troppo il nome della carta */}
          <select
            value={slot.level}
            onChange={(e) => onSelectLevel(e.target.value)}
            className="w-full rounded-lg border-2 border-panel-2 bg-royal px-2.5 py-1.5 text-center text-sm text-ink outline-none focus:border-gold"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                Livello {lvl}
                {lvl === ownedLevel ? " (tuo)" : ""}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}
