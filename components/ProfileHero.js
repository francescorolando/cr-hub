"use client";

import { useEffect } from "react";
import { ShieldIcon, SwapIcon } from "@/components/icons";
import Tooltip from "@/components/Tooltip";
import CardImage from "@/components/CardImage";
import { leagueName, bestSeasonResult } from "@/lib/leagues";
import { leagueIconUrl, TROPHY_ICON_URL } from "@/lib/royaleApiAssets";
import { clanBadgeUrl } from "@/lib/clanBadges";
import { formatNumber } from "@/lib/cardLeveling";
import { cardNameIt } from "@/lib/cardNamesIt";
import { rarityKey } from "@/lib/rarity";
import {
    useDeckRoles,
    deckKeyFor,
    nextDeckRole,
    getSlotCaps,
    computeDefaultRoles,
} from "@/lib/useDeckRoles";

export default function ProfileHero({ player }) {
    const ranked = bestSeasonResult(player);
    const clanBadge = player.clan?.badgeId ? clanBadgeUrl(player.clan.badgeId) : null;

    return (
        <div className="surface overflow-hidden rounded-xl border border-panel-2 bg-panel">
            <div className="h-1.5 bg-linear-to-r from-gold via-elixir to-gold" />
            <div className="flex flex-col gap-5 p-4 sm:gap-6 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-2xl font-bold text-ink sm:text-3xl">{player.name}</p>
                            <p className="font-num text-sm text-muted">{player.tag}</p>
                        </div>
                        {player.clan?.name && (
                            <div className="flex items-center gap-2 rounded-full border border-panel-2 bg-panel-2 px-3 py-1.5 text-sm text-ink">
                                {clanBadge ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={clanBadge}
                                        alt=""
                                        className="h-4 w-4 object-contain"
                                    />
                                ) : (
                                    <ShieldIcon className="h-4 w-4 text-muted" />
                                )}
                                <span className="font-medium">{player.clan.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Chip
                            iconUrl={TROPHY_ICON_URL}
                            label="Trofei"
                            value={formatNumber(player.trophies)}
                        />
                        <Chip
                            iconUrl={TROPHY_ICON_URL}
                            iconClassName="grayscale brightness-125 contrast-75"
                            label="Record personale"
                            value={formatNumber(player.bestTrophies)}
                            className="border border-panel-2"
                        />
                        {ranked && (
                            <Chip
                                iconUrl={leagueIconUrl(ranked.leagueNumber)}
                                label={leagueName(ranked.leagueNumber)}
                                value={`${formatNumber(ranked.trophies)}${ranked.rank ? ` · #${formatNumber(ranked.rank)}` : ""}`}
                            />
                        )}
                    </div>
                </div>

                <DeckPanel player={player} />
            </div>
        </div>
    );
}

function Chip({ iconUrl, iconClassName = "", label, value, className = "" }) {
    return (
        <div className={`flex min-w-48 items-center gap-3 rounded-lg bg-panel-2 px-4 py-2.5 ${className}`}>
            {iconUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={iconUrl}
                    alt=""
                    className={`h-7 w-7 shrink-0 object-contain ${iconClassName}`}
                />
            )}
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {label}
                </p>
                <p className="font-num text-base font-bold text-ink">{value}</p>
            </div>
        </div>
    );
}

function DeckPanel({ player }) {
    const deck = player.currentDeck || [];
    const tower = (player.currentDeckSupportCards || [])[0] || null;
    const deckKey = deckKeyFor(player, deck);
    const { roles, setRole, seed, initialized } = useDeckRoles(deckKey);

    const championCount = deck.filter((c) => rarityKey(c.rarity) === "champion").length;
    const caps = getSlotCaps(championCount);

    useEffect(() => {
        if (deck.length === 0 || initialized) return;
        seed(computeDefaultRoles(deck));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deckKey, initialized]);

    if (deck.length === 0) return null;

    const avgElixir = (deck.reduce((sum, c) => sum + (c.elixirCost ?? 0), 0) / deck.length).toFixed(
        1,
    );
    const evoCount = Object.values(roles).filter((r) => r === "evo").length;
    const heroMarkedCount = Object.values(roles).filter((r) => r === "hero").length;

    // quante carte ancora senza ruolo possono davvero prendere un badge "+": al
    // più quanti slot evoluzione/eroe restano liberi, non "tutte quelle idonee"
    // — in tutto esistono solo 3 slot speciali per mazzo.
    let evoSlotsLeft = Math.max(0, caps.evo - evoCount);
    let heroSlotsLeft = Math.max(0, caps.hero - heroMarkedCount);
    const placeholderIds = new Set();
    for (const card of deck) {
        if (rarityKey(card.rarity) === "champion" || roles[card.id]) continue;
        if (card.evolutionLevel && evoSlotsLeft > 0) {
            placeholderIds.add(card.id);
            evoSlotsLeft--;
        } else if (card.iconUrls?.heroMedium && heroSlotsLeft > 0) {
            placeholderIds.add(card.id);
            heroSlotsLeft--;
        }
    }

    return (
        <div className="flex flex-col gap-3 lg:w-80 lg:shrink-0 lg:border-l lg:border-panel-2 lg:pl-6">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    {tower && <CardImage card={tower} className="h-9 w-auto shrink-0" />}
                    {tower && (
                        <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold text-ink">
                                {cardNameIt(tower.name)}
                            </p>
                            <p className="font-num text-[12px] text-muted">Liv. {tower.level}</p>
                        </div>
                    )}
                </div>
                <div className="shrink-0 text-right">
                    <p className="font-num text-xl font-bold text-elixir">{avgElixir}</p>
                    <p className="text-xs uppercase tracking-wide text-muted">Elisir medio</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {deck.map((card) => {
                    const isChampion = rarityKey(card.rarity) === "champion";
                    const role = isChampion ? "champion" : roles[card.id] || null;
                    const showPlaceholder = !isChampion && !role && placeholderIds.has(card.id);
                    return (
                        <DeckCard
                            key={card.id ?? card.name}
                            card={card}
                            role={role}
                            showPlaceholder={showPlaceholder}
                            onCycle={
                                isChampion
                                    ? undefined
                                    : () => {
                                          const current = roles[card.id] || null;
                                          const othersEvo = evoCount - (current === "evo" ? 1 : 0);
                                          const othersHero =
                                              heroMarkedCount - (current === "hero" ? 1 : 0);
                                          setRole(
                                              card.id,
                                              nextDeckRole(
                                                  card,
                                                  current,
                                                  caps,
                                                  othersEvo,
                                                  othersHero,
                                              ),
                                          );
                                      }
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
}

// un'unica icona (freccia di scambio) per tutti i ruoli invece di
// corona/stella diverse: il colore del bordo distingue già il tipo
// (oro=campione, verde=eroe, colore rarità=evoluto), l'icona resta sempre
// bianca e uguale per dire solo "tocca per cambiare".
const ROLE_TONE = {
    champion: "border-gold bg-gold/90",
    hero: "border-gem bg-gem/90",
    evo: "border-elixir bg-elixir/90",
};

function DeckCard({ card, role, showPlaceholder, onCycle }) {
    const name = cardNameIt(card.name);
    const variant = role === "evo" ? "evo" : role === "hero" ? "hero" : "base";

    let badge = null;
    if (role === "champion") {
        badge = (
            <RoleBadge
                tone={ROLE_TONE.champion}
                tooltip="Campione: occupa uno slot Eroe/Jolly (automatico)."
            />
        );
    } else if (role === "hero") {
        badge = (
            <RoleBadge
                tone={ROLE_TONE.hero}
                tooltip="Segnato come Eroe in questo mazzo. Tocca per cambiare."
                onClick={onCycle}
            />
        );
    } else if (role === "evo") {
        badge = (
            <RoleBadge
                tone={ROLE_TONE.evo}
                tooltip={`Segnato come Evoluto (liv. ${card.evolutionLevel}). Tocca per cambiare.`}
                onClick={onCycle}
            />
        );
    } else if (showPlaceholder) {
        badge = (
            <RoleBadge
                tone="border-dashed border-muted bg-royal-deep opacity-50 hover:opacity-100"
                tooltip="Non ancora confermata: tocca se in questo mazzo è Evoluta o Eroe."
                onClick={onCycle}
            />
        );
    }

    return (
        <div
            className="relative aspect-5/6 w-full"
            title={`${name} · Liv. ${card.level}/${card.maxLevel}`}
        >
            {/* aspect-5/6 fisso (il rapporto 150:180 delle carte RoyaleAPI): se
          per una carta specifica l'asset non si trova e si ricade
          sull'icona ufficiale Supercell (285:420, più stretta e alta),
          senza un contenitore a rapporto fisso quella carta risulterebbe
          visibilmente più grande delle altre nello stesso mazzo. */}
            {badge && <div className="absolute top-0.5 right-0.5 z-10">{badge}</div>}
            <CardImage card={card} variant={variant} alt={name} className="h-full w-full object-contain" />
        </div>
    );
}

function RoleBadge({ tone, tooltip, onClick }) {
    const interactive = !!onClick;
    return (
        <Tooltip content={<p className="max-w-45 text-xs text-white/80">{tooltip}</p>}>
            <span
                role={interactive ? "button" : undefined}
                tabIndex={interactive ? 0 : undefined}
                onClick={onClick}
                onKeyDown={
                    interactive
                        ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  onClick();
                              }
                          }
                        : undefined
                }
                className={`flex h-4 w-4 items-center justify-center rounded-full border text-white ${tone} ${
                    interactive ? "cursor-pointer" : ""
                }`}
            >
                <SwapIcon className="h-2.5 w-2.5" />
            </span>
        </Tooltip>
    );
}
