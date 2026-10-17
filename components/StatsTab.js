"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "@/lib/PlayerContext";
import { fetchCardCatalog } from "@/lib/api";
import { useBattlelog } from "@/lib/useBattlelog";
import {
    BATTLE_CATEGORIES,
    battleCategory,
    battleResult,
    parseBattleTime,
    summarizeBattles,
} from "@/lib/battleStats";
import { findBadge } from "@/lib/badges";
import { formatNumber } from "@/lib/cardLeveling";
import { cardNameIt } from "@/lib/cardNamesIt";
import {
    leagueName,
    mergeLeagueName,
    LEAGUE_NAMES_IT,
    CHAMPION_DEFINITIVE_LEAGUE,
} from "@/lib/leagues";
import { leagueIconUrl, TROPHY_ICON_URL } from "@/lib/royaleApiAssets";
import CardImage from "@/components/CardImage";
import Tooltip from "@/components/Tooltip";
import BattleList from "@/components/BattleList";

const ROLE_LABELS_IT = {
    member: "Membro",
    elder: "Anziano",
    coLeader: "Co-capo",
    leader: "Capo",
};

const RESULT_LABELS = { win: "Vittoria", loss: "Sconfitta", draw: "Pareggio" };
const RESULT_COLORS = { win: "bg-gem", loss: "bg-crimson", draw: "bg-muted" };

function percent(part, total) {
    return total > 0 ? Math.round((part / total) * 100) : null;
}

function decimal(n) {
    return n == null
        ? "–"
        : new Intl.NumberFormat("it-IT", {
              maximumFractionDigits: 1,
              minimumFractionDigits: 1,
          }).format(n);
}

function shortDate(date, withTime = false) {
    return new Intl.DateTimeFormat("it-IT", {
        day: "numeric",
        month: "short",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(date);
}

export default function StatsTab() {
    const { player, loading, error } = usePlayer();

    if (loading && !player) {
        return <p className="text-base text-muted">Carico dati live dall&apos;API…</p>;
    }

    if (!player) {
        return (
            <div className="flex flex-col gap-2">
                {error && <p className="text-sm text-crimson">{error}</p>}
                <p className="text-base text-muted">
                    Nessun profilo selezionato: usa il menu in alto a destra per cercarne uno.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <CareerSection player={player} />
            <SeasonSection player={player} />
            <RecentSection key={player.tag} tag={player.tag} />
        </div>
    );
}

function Section({ title, summary, children }) {
    return (
        <section className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h2 className="text-lg font-bold text-ink sm:text-xl">{title}</h2>
                {summary && <p className="text-xs text-muted sm:text-sm">{summary}</p>}
            </div>
            {children}
        </section>
    );
}

// riquadro compatto: etichetta, numero grande, riga secondaria. Più piccolo
// della StatCard del profilo perché qui ne stanno due per riga anche su
// mobile.
function Tile({ label, value, sub, iconUrl, children }) {
    return (
        <div className="surface relative flex flex-col gap-2 rounded-xl border border-panel-2 bg-panel p-4 sm:p-5">
            {/* icona fuori dal flusso: non deve spostare il numero più in
                basso rispetto alle tile vicine che non ce l'hanno */}
            {iconUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={iconUrl}
                    alt=""
                    className="absolute right-3 top-3 h-8 w-8 object-contain sm:right-4 sm:top-4"
                />
            )}
            <p
                className={`text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs ${iconUrl ? "pr-9" : ""}`}
            >
                {label}
            </p>
            <p className="font-num text-2xl font-bold text-ink sm:text-3xl">{value}</p>
            {sub && <p className="text-xs text-muted sm:text-sm">{sub}</p>}
            {children}
        </div>
    );
}

// anello della percentuale di vittorie: arco verde per le vinte su fondo
// rosso per le perse, stesso codice colore della barra delle ultime partite
function WinRing({ wins, losses }) {
    const total = wins + losses;
    const ratio = total > 0 ? wins / total : 0;
    const r = 15.5;
    const length = 2 * Math.PI * r;

    return (
        <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle
                    cx="18"
                    cy="18"
                    r={r}
                    fill="none"
                    strokeWidth="3"
                    className="stroke-crimson/70"
                />
                <circle
                    cx="18"
                    cy="18"
                    r={r}
                    fill="none"
                    strokeWidth="3"
                    className="stroke-gem"
                    strokeDasharray={`${ratio * length} ${length}`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-num text-2xl font-bold text-ink sm:text-3xl">
                    {total > 0 ? `${Math.round(ratio * 100)}%` : "–"}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-muted">vittorie</span>
            </div>
        </div>
    );
}

function SplitBar({ left, right }) {
    const total = left + right;
    if (total <= 0) return null;
    return (
        <div className="mt-1 flex h-1.5 w-full overflow-hidden rounded-full bg-crimson/70">
            <div className="h-full bg-gem" style={{ width: `${(left / total) * 100}%` }} />
        </div>
    );
}

// catalogo carte del gioco: serve solo per i totali della collezione (carte,
// evoluzioni, eroi esistenti). Se non arriva, i gruppi mostrano i soli
// conteggi del giocatore senza "su N".
function useCardCatalog() {
    const [catalog, setCatalog] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetchCardCatalog()
            .then((items) => !cancelled && setCatalog(items))
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    return catalog;
}

function outOf(count, total) {
    return total ? `${formatNumber(count)} / ${formatNumber(total)}` : formatNumber(count);
}

// evolutionLevel/maxEvolutionLevel del profilo e del catalogo sono maschere
// di bit (1 = evoluzione, 2 = eroe), vedi lib/useDeckRoles.js
function countBit(cards, field, bit) {
    return (cards || []).filter((c) => (c[field] || 0) & bit).length;
}

function collectionStats(player, catalog) {
    const cards = player.cards || [];
    const mastery = (player.badges || []).filter((b) => b.name?.startsWith("Mastery"));
    return {
        cards: cards.length,
        cardsTotal: catalog?.length,
        maxed: cards.filter((c) => c.level === c.maxLevel).length,
        evo: countBit(cards, "evolutionLevel", 1),
        evoTotal: catalog && countBit(catalog, "maxEvolutionLevel", 1),
        hero: countBit(cards, "evolutionLevel", 2),
        heroTotal: catalog && countBit(catalog, "maxEvolutionLevel", 2),
        masteryStarted: mastery.length,
        masteryDone: mastery.filter((b) => b.maxLevel && b.level >= b.maxLevel).length,
    };
}

// gruppo di statistiche affini: titolo e righe etichetta/valore, per dare
// una gerarchia (bilancio in evidenza sopra, dettagli raggruppati sotto)
// invece di una griglia di numeri tutti uguali
function StatGroup({ title, rows }) {
    return (
        <div className="surface flex flex-col rounded-xl border border-panel-2 bg-panel p-4 sm:p-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
                {title}
            </p>
            <dl className="flex flex-col">
                {rows.filter(Boolean).map((row) => (
                    <div
                        key={row.label}
                        className="flex items-baseline justify-between gap-3 border-t border-panel-2 py-2 first:border-t-0"
                    >
                        <dt className="text-sm text-muted">{row.label}</dt>
                        <dd className="text-right font-num text-sm font-semibold text-ink">
                            {row.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

function BigStat({ label, value, sub, valueClassName = "text-ink" }) {
    return (
        <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
                {label}
            </p>
            <p className={`font-num text-2xl font-bold sm:text-3xl ${valueClassName}`}>{value}</p>
            {sub && <p className="text-xs text-muted">{sub}</p>}
        </div>
    );
}

function CareerSection({ player }) {
    const catalog = useCardCatalog();
    const wins = player.wins ?? 0;
    const losses = player.losses ?? 0;
    const threeCrowns = player.threeCrownWins ?? 0;
    const years = findBadge(player, "YearsPlayed");
    const days = years?.progress ?? null;
    const collectionLevel = findBadge(player, "CollectionLevel")?.progress ?? null;
    const c = collectionStats(player, catalog);
    const roleLabel = player.role ? ROLE_LABELS_IT[player.role] || player.role : null;

    return (
        <Section title="Carriera">
            <div className="surface flex flex-col items-center gap-5 rounded-xl border border-panel-2 bg-panel p-5 sm:flex-row sm:gap-8 sm:p-6">
                <WinRing wins={wins} losses={losses} />
                <div className="grid w-full grid-cols-2 gap-x-4 gap-y-5 sm:flex-1 lg:grid-cols-4">
                    <BigStat label="Battaglie" value={formatNumber(player.battleCount ?? 0)} />
                    <BigStat label="Vinte" value={formatNumber(wins)} valueClassName="text-gem" />
                    <BigStat
                        label="Perse"
                        value={formatNumber(losses)}
                        valueClassName="text-crimson"
                    />
                    <BigStat
                        label="A 3 corone"
                        value={formatNumber(threeCrowns)}
                        sub={`${percent(threeCrowns, wins) ?? "–"}% delle vittorie`}
                    />
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                <StatGroup
                    title="Esperienza"
                    rows={[
                        { label: "Livello", value: player.expLevel ?? "–" },
                        days != null && {
                            label: "In gioco da",
                            value: `${Math.floor(days / 365)} anni`,
                        },
                        days != null && { label: "Giorni di gioco", value: formatNumber(days) },
                        player.totalExpPoints != null && {
                            label: "Esperienza totale",
                            value: formatNumber(player.totalExpPoints),
                        },
                        player.starPoints != null && {
                            label: "Punti stella",
                            value: formatNumber(player.starPoints),
                        },
                    ]}
                />
                <StatGroup
                    title="Collezione"
                    rows={[
                        collectionLevel != null && {
                            label: "Livello collezione",
                            value: formatNumber(collectionLevel),
                        },
                        { label: "Carte", value: outOf(c.cards, c.cardsTotal) },
                        { label: "Al livello massimo", value: outOf(c.maxed, c.cards) },
                        { label: "Evoluzioni", value: outOf(c.evo, c.evoTotal) },
                        { label: "Eroi", value: outOf(c.hero, c.heroTotal) },
                        {
                            label: "Maestrie completate",
                            value: outOf(c.masteryDone, c.masteryStarted),
                        },
                    ]}
                />
                <StatGroup
                    title="Sfide e tornei"
                    rows={[
                        {
                            label: "Record sfide",
                            value: `${player.challengeMaxWins ?? 0} vittorie`,
                        },
                        {
                            label: "Carte vinte nelle sfide",
                            value: formatNumber(player.challengeCardsWon ?? 0),
                        },
                        {
                            label: "Partite nei tornei",
                            value: formatNumber(player.tournamentBattleCount ?? 0),
                        },
                        {
                            label: "Carte vinte nei tornei",
                            value: formatNumber(player.tournamentCardsWon ?? 0),
                        },
                    ]}
                />
                <StatGroup
                    title="Clan"
                    rows={[
                        { label: "Clan", value: player.clan?.name || "Nessuno" },
                        roleLabel && { label: "Ruolo", value: roleLabel },
                        {
                            label: "Donazioni totali",
                            value: formatNumber(player.totalDonations ?? 0),
                        },
                        {
                            label: "Donate questa settimana",
                            value: formatNumber(player.donations ?? 0),
                        },
                        {
                            label: "Ricevute questa settimana",
                            value: formatNumber(player.donationsReceived ?? 0),
                        },
                    ]}
                />
            </div>
        </Section>
    );
}

// progress raggruppa i trofei per modalità con chiavi che cambiano a ogni
// stagione (es. "AutoChess_2026_Season_11", "seasonal-trophy-road-202610"):
// prendiamo la più recente per prefisso. Non ordinando le chiavi (in ordine
// alfabetico "Season_9" verrebbe dopo "Season_11") ma per id dell'arena,
// che cresce a ogni nuova stagione.
function latestProgress(player, prefix) {
    const entries = Object.entries(player.progress || {})
        .filter(([k]) => k.startsWith(prefix))
        .map(([, v]) => v);
    if (!entries.length) return null;
    return entries.reduce((a, b) => ((b.arena?.id ?? 0) > (a.arena?.id ?? 0) ? b : a));
}

// last/best possono contenere numerazioni legacy (8-10, vedi lib/leagues.js):
// mostriamo solo le leghe che sappiamo nominare.
function knownLeague(result) {
    return result?.leagueNumber && LEAGUE_NAMES_IT[result.leagueNumber] ? result : null;
}

function leagueLabel(result) {
    if (result.leagueNumber !== CHAMPION_DEFINITIVE_LEAGUE) return leagueName(result.leagueNumber);
    const rank = result.rank ? ` #${formatNumber(result.rank)}` : "";
    return `${leagueName(result.leagueNumber)} · ${formatNumber(result.trophies)}${rank}`;
}

function SeasonSection({ player }) {
    const road = latestProgress(player, "seasonal-trophy-road");
    const merge = latestProgress(player, "AutoChess");
    const current = knownLeague(player.currentPathOfLegendSeasonResult);
    const last = knownLeague(player.lastPathOfLegendSeasonResult);
    const best = knownLeague(player.bestPathOfLegendSeasonResult);

    return (
        <Section title="Stagione">
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <Tile
                    label="Cammino dei trofei"
                    iconUrl={TROPHY_ICON_URL}
                    value={formatNumber(road?.trophies ?? player.trophies ?? 0)}
                    sub={`Record ${formatNumber(road?.bestTrophies ?? player.bestTrophies ?? 0)}`}
                />
                <Tile
                    label="Classificata"
                    iconUrl={current ? leagueIconUrl(current.leagueNumber) : null}
                    value={
                        <span className="font-body text-xl sm:text-2xl">
                            {current ? leagueLabel(current) : "–"}
                        </span>
                    }
                    sub={
                        [
                            last && `Scorsa: ${leagueLabel(last)}`,
                            best && `Migliore: ${leagueLabel(best)}`,
                        ]
                            .filter(Boolean)
                            .join(" · ") || null
                    }
                />
                {/* progress tiene solo la stagione in corso (Tattiche Royale
                    azzera i trofei a ogni stagione): il record è quello della
                    stagione, non di sempre */}
                <Tile
                    label="Tattiche Royale"
                    value={
                        merge?.trophies ? (
                            <span className="flex flex-wrap items-baseline gap-x-2">
                                <span className="font-body text-xl sm:text-2xl">
                                    {mergeLeagueName(merge.arena?.name)}
                                </span>
                                <span className="text-base font-semibold text-muted sm:text-lg">
                                    {formatNumber(merge.trophies)} trofei
                                </span>
                            </span>
                        ) : (
                            <span className="font-body text-xl sm:text-2xl">–</span>
                        )
                    }
                    sub={
                        merge?.trophies
                            ? `Record stagione ${formatNumber(merge.bestTrophies)}`
                            : "Nessuna partita questa stagione"
                    }
                />
            </div>
        </Section>
    );
}

function RecentSection({ tag }) {
    const { battles, loading, error } = useBattlelog(tag);

    if (loading) {
        return (
            <Section title="Ultime partite">
                <p className="text-sm text-muted">Carico le ultime partite…</p>
            </Section>
        );
    }

    if (error || !battles?.length) {
        return (
            <Section title="Ultime partite">
                <p className={`text-sm ${error ? "text-crimson" : "text-muted"}`}>
                    {error || "Nessuna partita recente."}
                </p>
            </Section>
        );
    }

    const s = summarizeBattles(battles);
    const range =
        s.from && s.to
            ? shortDate(s.from) === shortDate(s.to)
                ? shortDate(s.to)
                : `${shortDate(s.from)} – ${shortDate(s.to)}`
            : "";

    return (
        <Section title="Ultime partite" summary={`${s.total} partite${range ? ` · ${range}` : ""}`}>
            <ResultsStrip battles={battles} />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <Tile
                    label="Vittorie"
                    value={`${percent(s.wins, s.total) ?? "–"}%`}
                    sub={`${s.wins} vinte · ${s.losses} perse${s.draws ? ` · ${s.draws} pari` : ""}`}
                >
                    <SplitBar left={s.wins} right={s.losses} />
                </Tile>
                <Tile
                    label="Serie attuale"
                    value={s.streak}
                    sub={
                        s.streak
                            ? s.streakType === "win"
                                ? s.streak === 1
                                    ? "vittoria"
                                    : "vittorie di fila"
                                : s.streak === 1
                                  ? "sconfitta"
                                  : "sconfitte di fila"
                            : "ultima partita pari"
                    }
                />
                <Tile
                    label="Corone medie"
                    value={decimal(s.crowns.avgFor)}
                    sub={`subite ${decimal(s.crowns.avgAgainst)}${
                        s.crowns.oneCrownShare != null
                            ? ` · ${Math.round(s.crowns.oneCrownShare * 100)}% decise di 1 corona`
                            : ""
                    }`}
                />
                {s.ladder.battles > 0 ? (
                    <Tile
                        label="Trofei"
                        iconUrl={TROPHY_ICON_URL}
                        value={`${s.ladder.net > 0 ? "+" : ""}${formatNumber(s.ladder.net)}`}
                        sub={`in ${s.ladder.battles} partite`}
                    />
                ) : (
                    <Tile
                        label="A 3 corone"
                        value={s.crowns.threeCrownWins}
                        sub={`${percent(s.crowns.threeCrownWins, s.wins) ?? "–"}% delle vittorie`}
                    />
                )}
            </div>

            {s.comparable.battles > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <Tile
                        label="Elisir sprecato"
                        value={decimal(s.comparable.leakedMine)}
                        sub={`avversari ${decimal(s.comparable.leakedTheirs)} · media su ${s.comparable.battles}`}
                    />
                    <Tile
                        label="Livello carte"
                        value={decimal(s.comparable.levelMine)}
                        sub={`avversari ${decimal(s.comparable.levelTheirs)}`}
                    />
                </div>
            )}

            <div className="grid items-start gap-3 sm:gap-4 lg:grid-cols-2">
                <ModesTable categories={s.byCategory} />
                {s.facedCards.length > 0 && <FacedCards cards={s.facedCards.slice(0, 8)} />}
            </div>

            <BattleList battles={battles} />
        </Section>
    );
}

// una tacca per partita, dalla più vecchia (a sinistra) alla più recente
function ResultsStrip({ battles }) {
    const chronological = [...battles].reverse();

    return (
        <div className="surface flex gap-0.5 rounded-xl border border-panel-2 bg-panel p-3 sm:gap-1 sm:p-4">
            {chronological.map((b, i) => {
                const result = battleResult(b);
                const when = parseBattleTime(b.battleTime);
                const opponent = b.opponent?.map((o) => o.name).join(" & ");
                const score =
                    b.type === "boatBattle" ? null : `${b.team[0].crowns}–${b.opponent[0].crowns}`;
                return (
                    <Tooltip
                        key={`${b.battleTime}-${i}`}
                        className="min-w-0 flex-1"
                        content={
                            <span className="flex flex-col gap-0.5 text-xs text-white">
                                <span className="font-semibold">
                                    {RESULT_LABELS[result]}
                                    {score ? ` ${score}` : ""}
                                </span>
                                <span>{BATTLE_CATEGORIES[battleCategory(b)]}</span>
                                {opponent && (
                                    <span>
                                        contro <bdi>{opponent}</bdi>
                                    </span>
                                )}
                                {when && (
                                    <span className="text-white/70">{shortDate(when, true)}</span>
                                )}
                            </span>
                        }
                    >
                        <span
                            className={`block h-8 w-full rounded-sm ${RESULT_COLORS[result]}`}
                            aria-label={RESULT_LABELS[result]}
                        />
                    </Tooltip>
                );
            })}
        </div>
    );
}

function ModesTable({ categories }) {
    return (
        <div className="surface overflow-hidden rounded-xl border border-panel-2 bg-panel">
            <p className="px-4 pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted sm:px-5 sm:text-xs">
                Per modalità
            </p>
            <table className="mt-2 w-full text-sm">
                <thead>
                    <tr className="text-xs text-muted">
                        <th className="px-4 py-2 text-left font-medium sm:px-5">Modalità</th>
                        <th className="px-2 py-2 text-right font-medium">Partite</th>
                        <th className="px-2 py-2 text-right font-medium">V–S</th>
                        <th className="px-4 py-2 text-right font-medium sm:px-5">% vittorie</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((c) => (
                        <tr key={c.key} className="border-t border-panel-2">
                            <td className="px-4 py-2.5 font-medium text-ink sm:px-5">{c.label}</td>
                            <td className="px-2 py-2.5 text-right font-num text-ink">{c.total}</td>
                            <td className="px-2 py-2.5 text-right font-num text-muted">
                                {c.wins}–{c.losses}
                            </td>
                            <td className="px-4 py-2.5 text-right font-num font-semibold text-ink sm:px-5">
                                {percent(c.wins, c.total)}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// carte più viste nei mazzi avversari (solo scala, classificata e guerra
// 1v1) con la percentuale di vittorie del giocatore contro di esse
function FacedCards({ cards }) {
    return (
        <div className="surface flex flex-col gap-3 rounded-xl border border-panel-2 bg-panel p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
                Carte più affrontate
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {cards.map(({ card, count, wins }) => {
                    const rate = percent(wins, count);
                    return (
                        <Tooltip
                            key={card.id}
                            className="flex-col"
                            content={
                                <span className="text-xs text-white">
                                    {cardNameIt(card.name)}: affrontata {count}{" "}
                                    {count === 1 ? "volta" : "volte"}, vinte {wins}
                                </span>
                            }
                        >
                            <div className="flex w-full flex-col items-center gap-1">
                                <CardImage
                                    card={card}
                                    alt={cardNameIt(card.name)}
                                    className="w-full max-w-20 object-contain"
                                />
                                <p className="font-num text-xs text-ink">×{count}</p>
                                <p
                                    className={`font-num text-xs font-semibold ${
                                        rate >= 50 ? "text-gem" : "text-crimson"
                                    }`}
                                >
                                    {rate}%
                                </p>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
}
