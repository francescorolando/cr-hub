"use client";

import { useState } from "react";
import {
    BATTLE_CATEGORIES,
    battleCardRole,
    battleCategory,
    battleResult,
    parseBattleTime,
} from "@/lib/battleStats";
import { formatNumber, toAbsoluteLevel } from "@/lib/cardLeveling";
import { cardNameIt } from "@/lib/cardNamesIt";
import { ChevronDownIcon } from "@/components/icons";
import CardImage from "@/components/CardImage";

const PAGE_SIZE = 10;

const RESULT = {
    win: { label: "Vittoria", text: "text-gem", bar: "bg-gem" },
    loss: { label: "Sconfitta", text: "text-crimson", bar: "bg-crimson" },
    draw: { label: "Pareggio", text: "text-muted", bar: "bg-muted" },
};

function battleDate(battle) {
    const when = parseBattleTime(battle.battleTime);
    if (!when) return "";
    return new Intl.DateTimeFormat("it-IT", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(when);
}

function cardVariant(card) {
    return battleCardRole(card) || "base";
}

function averageElixir(cards) {
    const costs = (cards || []).map((c) => c.elixirCost).filter((c) => typeof c === "number");
    if (!costs.length) return null;
    return new Intl.NumberFormat("it-IT", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(costs.reduce((a, b) => a + b, 0) / costs.length);
}

export default function BattleList({ battles }) {
    const [filter, setFilter] = useState("all");
    const [expanded, setExpanded] = useState(false);
    const [openKey, setOpenKey] = useState(null);

    const keyed = battles.map((b, i) => ({ battle: b, key: `${b.battleTime}-${i}` }));
    const categories = Object.keys(BATTLE_CATEGORIES).filter((c) =>
        battles.some((b) => battleCategory(b) === c),
    );
    const filtered =
        filter === "all" ? keyed : keyed.filter(({ battle }) => battleCategory(battle) === filter);
    const visible = expanded ? filtered : filtered.slice(0, PAGE_SIZE);

    return (
        <div className="surface overflow-hidden rounded-xl border border-panel-2 bg-panel">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
                    Partite
                </p>
                {categories.length > 1 && (
                    <div className="flex flex-wrap gap-1.5">
                        {["all", ...categories].map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setFilter(c)}
                                className={`rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold transition ${
                                    filter === c
                                        ? "border-gold bg-gold/10 text-gold"
                                        : "border-panel-2 text-muted hover:border-elixir hover:text-elixir"
                                }`}
                            >
                                {c === "all" ? "Tutte" : BATTLE_CATEGORIES[c]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ul className="mt-3">
                {visible.map(({ battle, key }) => (
                    <BattleRow
                        key={key}
                        battle={battle}
                        open={openKey === key}
                        onToggle={() => setOpenKey(openKey === key ? null : key)}
                    />
                ))}
            </ul>

            {filtered.length > PAGE_SIZE && (
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="w-full border-t border-panel-2 px-4 py-3 text-sm font-semibold text-elixir transition-colors hover:bg-panel-2/40"
                >
                    {expanded ? "Mostra meno" : `Mostra tutte (${filtered.length})`}
                </button>
            )}
        </div>
    );
}

function BattleRow({ battle, open, onToggle }) {
    const result = RESULT[battleResult(battle)];
    const me = battle.team?.[0];
    const isBoat = battle.type === "boatBattle";
    const opponents = (battle.opponent || []).map((o) => o.name).filter(Boolean);
    const trophyChange = me?.trophyChange;

    return (
        <li className="border-t border-panel-2">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-panel-2/40 sm:px-5"
            >
                <span className={`h-9 w-1 shrink-0 rounded-full ${result.bar}`} />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                        <span className={`font-semibold ${result.text}`}>{result.label}</span>
                        {!isBoat && (
                            <span className="font-num font-semibold text-ink">
                                {" "}
                                {me?.crowns ?? 0}–{battle.opponent?.[0]?.crowns ?? 0}
                            </span>
                        )}
                        <span className="text-muted">
                            {" "}
                            · {BATTLE_CATEGORIES[battleCategory(battle)]}
                        </span>
                    </p>
                    <p className="truncate text-xs text-muted">
                        {/* bdi: i nomi scritti da destra a sinistra (es. arabo)
                            altrimenti si mescolano alla data che segue */}
                        {opponents.length > 0 && (
                            <>
                                contro{" "}
                                {opponents.map((name, i) => (
                                    <span key={i}>
                                        {i > 0 && " & "}
                                        <bdi>{name}</bdi>
                                    </span>
                                ))}
                                {" · "}
                            </>
                        )}
                        {battleDate(battle)}
                    </p>
                </div>
                {typeof trophyChange === "number" && trophyChange !== 0 && (
                    <span
                        className={`shrink-0 font-num text-sm font-semibold ${
                            trophyChange > 0 ? "text-gem" : "text-crimson"
                        }`}
                    >
                        {trophyChange > 0 ? "+" : ""}
                        {trophyChange}
                    </span>
                )}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-panel-2 text-muted">
                    <ChevronDownIcon
                        className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                </span>
            </button>

            {open && <BattleDetail battle={battle} />}
        </li>
    );
}

function BattleDetail({ battle }) {
    const isBoat = battle.type === "boatBattle";

    return (
        <div className="grid gap-5 border-t border-panel-2 bg-panel-2/25 px-4 py-4 sm:px-5 lg:grid-cols-2 lg:gap-8">
            <Side
                title={battle.team.length > 1 ? "La tua squadra" : "Tu"}
                players={battle.team}
                crownsAgainst={battle.opponent?.[0]?.crowns}
                hideTowers={isBoat}
            />
            <Side
                title={
                    isBoat
                        ? "Difesa avversaria"
                        : battle.team.length > 1
                          ? "Avversari"
                          : "Avversario"
                }
                players={battle.opponent || []}
                crownsAgainst={battle.team?.[0]?.crowns}
                hideTowers={isBoat}
            />
        </div>
    );
}

// torri: nei 2v2 sono condivise dalla squadra, quindi le mostriamo una volta
// sola (dal primo giocatore del lato)
function Side({ title, players, crownsAgainst, hideTowers = false }) {
    return (
        <div className="flex min-w-0 flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
                {title}
            </p>
            {players.map((p, i) => (
                <PlayerBlock
                    key={p.tag || i}
                    player={p}
                    showTowers={!hideTowers && i === 0 && towersConsistent(p, crownsAgainst)}
                />
            ))}
        </div>
    );
}

function PlayerBlock({ player, showTowers }) {
    const tower = player.supportCards?.[0];
    const avg = averageElixir(player.cards);
    const facts = [
        avg && { label: "Elisir medio", value: avg },
        typeof player.elixirLeaked === "number" && {
            label: "Elisir sprecato",
            value: new Intl.NumberFormat("it-IT", { maximumFractionDigits: 1 }).format(
                player.elixirLeaked,
            ),
        },
        typeof player.startingTrophies === "number" && {
            label: "Trofei",
            value: formatNumber(player.startingTrophies),
        },
        player.globalRank && { label: "Classifica", value: `#${formatNumber(player.globalRank)}` },
    ].filter(Boolean);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">
                        <bdi>{player.name || "—"}</bdi>
                    </p>
                    <p className="truncate font-num text-xs text-muted">
                        {player.tag}
                        {player.clan?.name ? ` · ${player.clan.name}` : ""}
                    </p>
                </div>
                {tower && (
                    <div className="flex shrink-0 items-center gap-2">
                        <CardImage
                            card={tower}
                            alt={cardNameIt(tower.name)}
                            className="h-8 w-auto"
                        />
                        {/* nome della torre solo da sm in su: su mobile toglieva
                            spazio a nome, tag e clan del giocatore */}
                        <div className="text-right">
                            <p className="hidden max-w-28 truncate text-xs font-semibold text-ink sm:block">
                                {cardNameIt(tower.name)}
                            </p>
                            <p className="font-num text-xs text-muted">
                                Liv. {toAbsoluteLevel(tower)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {player.cards?.length > 0 && (
                <div className="grid max-w-sm grid-cols-4 gap-x-2 gap-y-3">
                    {player.cards.map((card, i) => (
                        <div key={`${card.id}-${i}`} className="flex flex-col items-center gap-1">
                            <CardImage
                                card={card}
                                variant={cardVariant(card)}
                                alt={cardNameIt(card.name)}
                                className="w-full object-contain"
                            />
                            <p className="font-num text-[11px] text-muted">
                                Liv. {toAbsoluteLevel(card)}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {facts.length > 0 && (
                <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
                    {facts.map((f) => (
                        <div key={f.label} className="flex gap-1.5">
                            <dt className="text-muted">{f.label}</dt>
                            <dd className="font-num font-semibold text-ink">{f.value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {showTowers && <Towers player={player} />}
        </div>
    );
}

// punti vita rimasti a fine partita: le principesse distrutte spariscono da
// princessTowersHitPoints, il re distrutto resta con 0. In certe modalità
// evento (torri diverse o assenti) i dati non tornano con le corone: lì le
// torri non le mostriamo invece di segnare "distrutta" a caso.
function towersConsistent(player, crownsAgainst) {
    if (typeof player.kingTowerHitPoints !== "number" || typeof crownsAgainst !== "number") {
        return false;
    }
    // re abbattuto = 3 corone, anche con principesse ancora in piedi
    if (player.kingTowerHitPoints === 0) return crownsAgainst === 3;
    return 2 - (player.princessTowersHitPoints || []).length === crownsAgainst;
}

function Towers({ player }) {
    const princesses = player.princessTowersHitPoints || [];
    const towers = [
        { label: "Re", hp: player.kingTowerHitPoints },
        { label: "Principessa", hp: princesses[0] },
        { label: "Principessa", hp: princesses[1] },
    ];

    return (
        <div className="flex flex-wrap gap-1.5">
            {towers.map((t, i) => (
                <span
                    key={i}
                    className={`rounded-md px-2 py-1 text-xs ${
                        t.hp ? "bg-panel-2 text-ink" : "bg-crimson/12 text-crimson"
                    }`}
                >
                    {t.label}{" "}
                    <span className="font-num font-semibold">
                        {t.hp ? formatNumber(t.hp) : "distrutta"}
                    </span>
                </span>
            ))}
        </div>
    );
}
