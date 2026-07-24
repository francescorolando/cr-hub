"use client";

import { useEffect, useState } from "react";
import { ShieldIcon, SwapIcon } from "@/components/icons";
import Tooltip from "@/components/Tooltip";
import CardImage from "@/components/CardImage";
import { leagueName, CHAMPION_DEFINITIVE_LEAGUE } from "@/lib/leagues";
import { leagueIconUrl, TROPHY_ICON_URL } from "@/lib/royaleApiAssets";
import { generalBadges, badgeIconUrl, humanizeBadgeName } from "@/lib/badges";
import { clanBadgeUrl } from "@/lib/clanBadges";
import { formatNumber } from "@/lib/cardLeveling";
import { cardNameIt } from "@/lib/cardNamesIt";
import { rarityKey } from "@/lib/rarity";
import {
    useDeckRoles,
    deckKeyFor,
    nextDeckRole,
    availableRoleOptions,
    computeDefaultRoles,
} from "@/lib/useDeckRoles";

export default function ProfileHero({ player }) {
    // la lega ATTUALE (non l'ultima stagione completata, né il record
    // migliore): è quella che il giocatore vede in gioco in questo momento.
    // Sotto Campione Definitivo si sale a "step" per vittoria, non con
    // medaglie che contano per una classifica mondiale — infatti l'API dà
    // "rank" solo lì — quindi il numero si mostra solo a quel livello, per
    // non far sembrare un progresso-a-step un punteggio di classifica.
    const currentLeague = player?.currentPathOfLegendSeasonResult;
    const clanBadge = player.clan?.badgeId ? clanBadgeUrl(player.clan.badgeId) : null;

    return (
        <div className="surface overflow-hidden rounded-xl border border-panel-2 bg-panel">
            <div className="h-1.5 bg-linear-to-r from-gold via-elixir to-gold" />
            {/* xl, non lg: fra 1024 e ~1250px il pannello mazzo (w-80 fisso) a
          fianco della riga badge lasciava troppo poco spazio a quest'ultima,
          che faceva l'orfano — un badge sballato in seconda riga, poi due —
          proprio a ridosso del breakpoint. Rimandando lo split a xl il mazzo
          resta sotto (piena larghezza, niente strozzatura) fino a quando non
          c'è davvero spazio per stare affiancato senza spingere la riga badge
          a capo. */}
            <div className="flex flex-col gap-8 p-4 sm:gap-10 sm:p-6 xl:flex-row xl:items-start xl:justify-between xl:gap-6">
                <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-2xl font-bold text-ink sm:text-3xl">{player.name}</p>
                            <p className="font-num text-sm text-muted">{player.tag}</p>
                        </div>
                        {player.clan?.name && (
                            <div className="flex items-center gap-2 rounded-full border border-panel-2 bg-panel-2 px-3.5 py-2 text-base text-ink">
                                {clanBadge ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={clanBadge}
                                        alt=""
                                        className="h-5 w-5 object-contain"
                                    />
                                ) : (
                                    <ShieldIcon className="h-5 w-5 text-muted" />
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
                        {currentLeague?.leagueNumber && (
                            <Chip
                                iconUrl={leagueIconUrl(currentLeague.leagueNumber)}
                                iconSize="h-9 w-9"
                                label="Classificata"
                                value={
                                    currentLeague.leagueNumber === CHAMPION_DEFINITIVE_LEAGUE
                                        ? `${leagueName(currentLeague.leagueNumber)} · ${formatNumber(currentLeague.trophies)}${currentLeague.rank ? ` #${formatNumber(currentLeague.rank)}` : ""}`
                                        : leagueName(currentLeague.leagueNumber)
                                }
                            />
                        )}
                    </div>

                    <BadgeRow player={player} className="mt-1 sm:mt-2" />
                </div>

                <DeckPanel player={player} />
            </div>
        </div>
    );
}

// da 2 a 3 chip (Trofei e Record personale sempre, lega attuale solo se il
// giocatore ha una stagione Classificata in corso — vedi currentLeague più
// sopra). Sotto sm ne sta comunque una sola per riga (il pannello non è mai
// abbastanza largo per due), quindi lì è piena larghezza (w-full); da sm in
// su diventa a larghezza FISSA — non un min/max che le lascia libere di
// allargarsi quando ne condividono la riga solo in 2 (sembravano vuote) — e
// abbastanza larga da non far andare a capo "Record personale".
// lo slot dell'icona è a larghezza FISSA (indipendente da iconSize): senza
// questo, un'icona più grande su una sola card spingeva la sua scritta più a
// destra delle altre due, disallineando le etichette fra loro. items-center
// dentro lo slot la tiene centrata (sia in verticale che in orizzontale)
// qualunque sia la sua dimensione reale.
function Chip({ iconUrl, iconSize = "h-7 w-7", iconClassName = "", label, value, className = "" }) {
    return (
        <div
            className={`flex w-full min-w-48 items-center gap-3 rounded-lg bg-panel-2 px-4 py-2.5 sm:w-56 sm:flex-none ${className}`}
        >
            {iconUrl && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={iconUrl}
                        alt=""
                        className={`${iconSize} object-contain ${iconClassName}`}
                    />
                </div>
            )}
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {label}
                </p>
                {value != null && <p className="font-num text-base font-bold text-ink">{value}</p>}
            </div>
        </div>
    );
}

// l'icona ufficiale del badge "anni di gioco" è rotta lato Supercell per
// certi livelli (hash 404 su ogni risoluzione, uguale per tutti i
// giocatori: non è un problema del nostro fetch, non è recuperabile da
// nessuna API). Niente tentativi di imitare l'illustrazione 3D del gioco
// (esagono/ali/nastro): un semplice medaglione coerente con lo stile
// dell'app, con il vero livello del giocatore al centro.
function YearsPlayedGlyph({ badge, className }) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="yp-fill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#b565f0" />
                    <stop offset="100%" stopColor="#4c1d95" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#yp-fill)" stroke="#e8b23d" strokeWidth="6" />
            <text
                x="50"
                y="65"
                textAnchor="middle"
                fontSize="42"
                fontWeight="800"
                fill="#fff"
                fontFamily="var(--font-body)"
            >
                {badge.level ?? "?"}
            </text>
        </svg>
    );
}

// icona di riserva per quando l'URL dell'icona (dato dall'API ufficiale)
// non carica: capita spesso, non solo per eventi passati. Per i badge
// importanti/riconoscibili usiamo una grafica a tema invece di un simbolo
// generico "sconosciuto".
const BADGE_FALLBACK = {
    YearsPlayed: YearsPlayedGlyph,
};

// "?" viola (in tema con l'app) invece di un'icona a caso: per un badge
// senza fallback dedicato è più onesto dire chiaramente "icona non
// disponibile" che inventarsi un simbolo (es. una medaglia) che sembra
// intenzionale ma non lo è. SVG invece di testo HTML: si scala da solo con
// qualunque dimensione del box.
function UnknownBadgeGlyph({ className }) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
            <text
                x="50"
                y="72"
                textAnchor="middle"
                fontSize="58"
                fontWeight="800"
                fill="#b565f0"
                fontFamily="var(--font-body)"
            >
                ?
            </text>
        </svg>
    );
}

function BadgeFallbackGlyph({ badge, className }) {
    const Fallback = BADGE_FALLBACK[badge.name];
    if (Fallback) return <Fallback badge={badge} className={className} />;
    return <UnknownBadgeGlyph className={className} />;
}

function BadgeGlyph({ badge, boxSize, imgSize, fallbackSize, rounded = "rounded-lg" }) {
    const [broken, setBroken] = useState(false);
    const url = badgeIconUrl(badge);

    return (
        <div
            className={`flex ${boxSize} shrink-0 items-center justify-center overflow-hidden ${rounded} bg-panel-2`}
        >
            {url && !broken ? (
                // l'icona ufficiale ha un bordo trasparente notevole incorporato
                // nel PNG (il disegno vero è molto più piccolo del canvas):
                // la renderizziamo più grande del riquadro e lasciamo che
                // overflow-hidden ritagli quel bordo, cosi il badge riempie lo
                // spazio invece di galleggiarci dentro piccolo.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={url}
                    alt=""
                    onError={() => setBroken(true)}
                    className={`${imgSize} max-w-none shrink-0 object-contain`}
                />
            ) : (
                <BadgeFallbackGlyph badge={badge} className={fallbackSize} />
            )}
        </div>
    );
}

function BadgeTooltipContent({ badge }) {
    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-white">{humanizeBadgeName(badge.name)}</p>
            {badge.level != null && (
                <p className="font-num text-xs text-white/60">
                    Livello {badge.level}
                    {badge.maxLevel ? `/${badge.maxLevel}` : ""}
                </p>
            )}
        </div>
    );
}

// solo i primi N sul profilo, a numero fisso (niente scorrimento): il resto
// si vede nel modale "Tutti gli emblemi".
const BADGE_PREVIEW_COUNT = 10;

function BadgeRow({ player, className = "" }) {
    const [showAll, setShowAll] = useState(false);
    const badges = generalBadges(player);
    if (badges.length === 0) return null;

    const preview = badges.slice(0, BADGE_PREVIEW_COUNT);
    const remaining = badges.length - preview.length;

    return (
        <>
            <div className={`flex flex-wrap items-center gap-2 ${className}`}>
                {preview.map((badge) => (
                    <Tooltip key={badge.name} content={<BadgeTooltipContent badge={badge} />}>
                        <BadgeGlyph badge={badge} boxSize="h-14 w-14" imgSize="h-[67px] w-[67px]" fallbackSize="h-11 w-11" />
                    </Tooltip>
                ))}
                <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-panel-2 text-xs font-semibold text-muted transition hover:text-ink"
                >
                    {remaining > 0 ? `+${remaining}` : "Tutti"}
                </button>
            </div>
            {showAll && <BadgeModal badges={badges} onClose={() => setShowAll(false)} />}
        </>
    );
}

// niente più stato "selezionato" né pannello dettagli con un elemento
// pre-evidenziato che l'utente non ha scelto: sotto sm (dove il nome non ci
// stava comunque) i dettagli si vedono nel tooltip, stesso usato sul
// profilo. Da sm in su c'è spazio vero, quindi nome e livello restano
// visibili sotto l'icona invece che affiancati (a fianco avevano solo una
// colonna stretta e si tagliavano).
function BadgeModal({ badges, onClose }) {
    useEffect(() => {
        function handleKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="surface flex max-h-[85vh] w-full max-w-3xl flex-col gap-4 rounded-xl border border-panel-2 bg-panel p-4 sm:p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-bold text-ink">Tutti gli emblemi ({badges.length})</p>
                    <button
                        type="button"
                        onClick={onClose}
                        title="Chiudi"
                        className="rounded-full border-2 border-panel-2 px-2.5 py-1 text-sm text-muted transition hover:border-crimson hover:text-crimson"
                    >
                        ×
                    </button>
                </div>

                {/* sotto sm: solo icone (per il tocco), i dettagli si vedono nel
                    tooltip — niente pannello dettagli fisso né elemento
                    pre-selezionato all'apertura. Grid auto-fill/minmax invece di
                    flex-wrap: le colonne si stirano (1fr) a riempire tutta la
                    riga invece di lasciare margine vuoto a destra. */}
                <div className="scrollbar-thin grid min-h-0 flex-1 grid-cols-[repeat(auto-fill,minmax(56px,1fr))] content-start gap-2 overflow-y-auto pt-12 sm:hidden">
                    {badges.map((badge) => (
                        <Tooltip key={badge.name} content={<BadgeTooltipContent badge={badge} />}>
                            <BadgeGlyph badge={badge} boxSize="h-14 w-14" imgSize="h-[67px] w-[67px]" fallbackSize="h-11 w-11" />
                        </Tooltip>
                    ))}
                </div>

                {/* da sm in su: c'è spazio per il nome, ma impilato SOTTO
                    l'icona (non a fianco) — a fianco il testo aveva solo una
                    colonna stretta e si tagliava. Grid auto-fill/minmax, stesso
                    motivo di sopra: le card si stirano a riempire tutta la
                    larghezza del modale invece di lasciare spazio vuoto sulla
                    destra di ogni riga. */}
                <div className="scrollbar-thin hidden min-h-0 flex-1 grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2 overflow-y-auto sm:grid">
                    {badges.map((badge) => (
                        <div
                            key={badge.name}
                            className="flex flex-col items-center gap-1 rounded-lg bg-panel-2 p-1.5 text-center"
                        >
                            <BadgeGlyph badge={badge} boxSize="h-14 w-14" imgSize="h-[67px] w-[67px]" fallbackSize="h-11 w-11" />
                            <div className="min-w-0">
                                <p className="line-clamp-2 text-xs font-semibold text-ink">
                                    {humanizeBadgeName(badge.name)}
                                </p>
                                {badge.level != null && (
                                    <p className="font-num text-[11px] text-muted">
                                        Liv. {badge.level}
                                        {badge.maxLevel ? `/${badge.maxLevel}` : ""}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DeckPanel({ player }) {
    const deck = player.currentDeck || [];
    const tower = (player.currentDeckSupportCards || [])[0] || null;
    const deckKey = deckKeyFor(player, deck);
    const { roles, setRole, seed, initialized } = useDeckRoles(deckKey);

    useEffect(() => {
        if (deck.length === 0 || initialized) return;
        seed(computeDefaultRoles(deck));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deckKey, initialized]);

    if (deck.length === 0) return null;

    const avgElixir = (deck.reduce((sum, c) => sum + (c.elixirCost ?? 0), 0) / deck.length).toFixed(
        1,
    );

    return (
        // sotto xl il mazzo va a piena larghezza (vedi il commento sopra sullo
        // split xl), ma su schermi medi quella larghezza intera con 4 colonne
        // fisse rendeva le carte gigantesche (e i pulsanti cambio-versione,
        // dimensione fissa, sembravano persi sopra carte enormi). Un tetto di
        // larghezza, centrato, le tiene alla dimensione pensata per la sidebar
        // anche quando il mazzo non è più dentro una sidebar.
        <div className="mx-auto flex w-full max-w-sm flex-col gap-5 xl:mx-0 xl:w-80 xl:max-w-none xl:shrink-0 xl:border-l xl:border-panel-2 xl:pl-6">
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

            {/* regole fisse per POSIZIONE (indice 0-based), non conteggi
          aggregati sul mazzo: 1ª carta solo normale/evoluzione, 2ª solo
          normale/eroe, 3ª normale/eroe/evoluzione, dalla 4ª in poi mai
          nessun pulsante — a prescindere da cosa sblocca il giocatore. */}
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                {deck.map((card, index) => {
                    const isChampion = rarityKey(card.rarity) === "champion";
                    const role = isChampion ? "champion" : roles[card.id] || null;
                    const showPlaceholder =
                        !isChampion && !role && availableRoleOptions(card, index).length > 0;
                    return (
                        <DeckCard
                            key={card.id ?? card.name}
                            card={card}
                            role={role}
                            showPlaceholder={showPlaceholder}
                            nextRole={isChampion ? null : nextDeckRole(card, role, index)}
                            onCycle={
                                isChampion
                                    ? undefined
                                    : () => {
                                          const current = roles[card.id] || null;
                                          setRole(card.id, nextDeckRole(card, current, index));
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
    champion: "border-gold bg-gold",
    hero: "border-yellow-400 bg-yellow-400",
    evo: "border-elixir bg-elixir",
};

// etichetta del PROSSIMO stato (quello che il tocco produrrà), non di quello
// attuale — così il tooltip dice sempre "Cambia versione: X" con X = cosa
// otterrai toccando, non una descrizione di dove sei già.
const NEXT_ROLE_LABEL = { evo: "EVOLUZIONE", hero: "EROE", null: "NORMALE" };

function DeckCard({ card, role, showPlaceholder, nextRole, onCycle }) {
    const name = cardNameIt(card.name);
    const variant = role === "evo" ? "evo" : role === "hero" ? "hero" : "base";
    const changeTooltip = `Passa a: ${NEXT_ROLE_LABEL[nextRole]}`;

    let badge = null;
    if (role === "champion") {
        badge = (
            <RoleBadge
                tone={ROLE_TONE.champion}
                tooltip="Campione: occupa uno slot Eroe/Jolly (automatico)."
            />
        );
    } else if (role === "hero") {
        badge = <RoleBadge tone={ROLE_TONE.hero} tooltip={changeTooltip} onClick={onCycle} />;
    } else if (role === "evo") {
        badge = <RoleBadge tone={ROLE_TONE.evo} tooltip={changeTooltip} onClick={onCycle} />;
    } else if (showPlaceholder) {
        badge = (
            <RoleBadge
                tone="border-dashed border-muted bg-royal-deep opacity-50 hover:opacity-100"
                tooltip={changeTooltip}
                onClick={onCycle}
            />
        );
    }

    // le immagini evoluzione/eroe sono sullo stesso canvas 150x180 di quelle
    // normali, ma il pezzo con il diamante in alto occupa una fetta fissa di
    // quel canvas (misurato: ~38px di crest su 180 totali, sia per evoluzioni
    // che per eroi) — quindi la "carta vera" dentro risulta più piccola a
    // parità di riquadro. Ingrandendo del ~12% (157/141, corpo-normale
    // diviso corpo-evoluto misurati a mano) e ancorando in basso, il corpo
    // torna alla stessa dimensione delle carte normali e il pezzo in più
    // sporge sopra il riquadro invece di rimpicciolire tutto.
    const oversized = variant === "evo" || variant === "hero";

    return (
        <div
            className="relative aspect-5/6 w-full"
            title={`${name} · Liv. ${card.level}/${card.maxLevel}`}
        >
            {/* in basso a destra, non in alto: l'ingrandimento di evoluzione/eroe
          cresce verso l'alto (origin-bottom), quindi il bordo basso è
          l'unico che resta fermo esattamente sull'angolo del contenitore. */}
            {badge && <div className="absolute -right-1.5 -bottom-1.5 z-10">{badge}</div>}
            <CardImage
                card={card}
                variant={variant}
                alt={name}
                className={`h-full w-full object-contain ${oversized ? "origin-bottom scale-[1.12]" : ""}`}
            />
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
                <SwapIcon className="h-3 w-3 text-white" strokeWidth={2.6} />
            </span>
        </Tooltip>
    );
}
