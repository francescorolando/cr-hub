"use client";

import { RARITY_LABELS } from "@/lib/api";
import { rarityKey, rarityStyle } from "@/lib/rarity";
import { formatNumber, nextLevelCost } from "@/lib/cardLeveling";
import { cardNameIt } from "@/lib/cardNamesIt";
import Tooltip from "@/components/Tooltip";

// struttura fissa a 4 blocchi impilati in verticale (mai affiancati):
// 1) immagine + titolo + rarità, 2) barre di progressione livelli,
// 3) info livelli, 4) carte mancanti. Da sm: in su i blocchi 2-4 si
// affiancano in riga, ma il blocco 1 resta sempre per conto suo in cima.
export default function UpgradeCardRow({ card, blocks }) {
    const key = rarityKey(card.rarity);
    const style = rarityStyle(card.rarity);
    const iconUrl = card.iconUrls?.medium || card.iconUrls?.evolutionMedium;
    const name = cardNameIt(card.name);
    const next = card.maxed
        ? null
        : nextLevelCost({ rarity: card.rarity, level: card.level, maxLevel: card.maxLevel });
    const showNextStep = next && next.gold !== card.goldNeeded;

    return (
        <div className="flex flex-col gap-3 border-t-2 border-panel-2 py-4 sm:flex-row sm:items-center sm:gap-5">
            {/* blocco 1: immagine + titolo + rarità */}
            <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
                {iconUrl ? (
                    // le immagini delle carte sono 285x420 (verticali), non quadrate:
                    // un riquadro forzato a 56x56 con object-contain lascia ~9px di
                    // vuoto trasparente ai lati, spostando il personaggio visibile a
                    // destra rispetto al bordo reale del riquadro (e quindi rispetto
                    // alle barre sotto). Larghezza libera (w-auto): il browser calcola
                    // da solo la proporzione nativa dell'immagine, niente più vuoto.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={iconUrl}
                        alt={name}
                        className="h-14 w-auto shrink-0 object-contain sm:h-16"
                    />
                ) : (
                    <div className="h-14 w-10 shrink-0 rounded bg-panel-2 sm:h-16 sm:w-11" />
                )}
                <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-ink">{name}</p>
                    <span
                        className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${style.text} ${style.bg}`}
                    >
                        {RARITY_LABELS[key] || key}
                    </span>
                </div>
            </div>

            {card.maxed ? (
                <span className="w-fit rounded-full bg-gold/15 px-2.5 py-1 text-sm font-semibold text-gold">
                    Al massimo
                </span>
            ) : (
                <>
                    {/* blocco 2 + 3: barre di progressione livelli, poi info livelli */}
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex gap-1">
                            {blocks.map((b) => (
                                <LevelBlock key={b.level} block={b} rarityDot={style.dot} />
                            ))}
                        </div>
                        <p className="font-num text-xs text-muted">
                            {showNextStep && (
                                <>
                                    Livello {next.absoluteLevel - 1}→{next.absoluteLevel}:{" "}
                                    <span className="font-semibold text-gold">
                                        {formatNumber(next.gold)}
                                    </span>
                                    {" · "}
                                </>
                            )}
                            Fino al 16:{" "}
                            <span className="font-semibold text-gold">
                                {formatNumber(card.goldNeeded)}
                            </span>
                        </p>
                    </div>

                    {/* blocco 4: carte mancanti — a piena larghezza da mobile. Struttura
              a 2 righe nette: etichetta sopra (da sola), numero+gemme sotto
              sulla stessa linea di base — invece di 3 elementi di taglie
              diverse ammucchiati senza un ordine chiaro. */}
                    <div className="flex shrink-0 flex-col gap-1 rounded-lg bg-panel-2 px-4 py-3 sm:items-end">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                            Carte mancanti
                        </p>
                        <div className="flex w-full items-baseline justify-between gap-3 sm:w-auto sm:justify-end sm:gap-2">
                            <p className="font-num text-md font-bold text-ink">
                                {formatNumber(card.cardsNeeded)}
                            </p>
                            <p className="font-num text-md font-semibold text-gem">
                                ≈ {formatNumber(card.gemsNeeded)} gemme
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function LevelBlock({ block, rarityDot }) {
    if (block.state === "reached") {
        return (
            <Tooltip
                className="min-w-0 flex-1"
                content={
                    <p className="text-sm font-semibold text-white">
                        Livello {block.level} raggiunto
                    </p>
                }
            >
                <div className={`h-6 w-full rounded-md ${rarityDot}`} />
            </Tooltip>
        );
    }

    const ratio = block.needed > 0 ? Math.min(1, block.owned / block.needed) : 0;
    const missing = block.needed - block.owned;

    return (
        <Tooltip
            className="min-w-0 flex-1"
            content={
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-white">Livello {block.level}</p>
                    <p className="font-num text-xs text-white/60">
                        {block.owned}/{block.needed} copie possedute
                    </p>
                    {missing > 0 && (
                        <p className="font-num text-xs font-semibold text-gem">
                            Mancano {missing} · ≈ {formatNumber(block.gems)} gemme
                        </p>
                    )}
                </div>
            }
        >
            {/* min-w-0 sul contenitore (sopra) + testo piccolissimo: a 6
          barre equidistribuite su una card da mobile (~50px l'una) è
          l'unica combinazione per cui "XXXX/XXXX" (9 caratteri) ci sta
          per intero senza tagli né scorrimento — verificato: a 50px di
          contenitore il testo misura esattamente 50px a questa taglia. */}
            <div className="relative h-6 w-full overflow-hidden rounded-md bg-panel-2">
                <div
                    className={`absolute inset-y-0 left-0 ${rarityDot} opacity-40`}
                    style={{ width: `${ratio * 100}%` }}
                />
                <span className="relative flex h-full items-center justify-center font-num text-[9px] font-semibold text-muted">
                    {block.owned}/{block.needed}
                </span>
            </div>
        </Tooltip>
    );
}
