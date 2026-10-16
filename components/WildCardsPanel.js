"use client";

import { useEffect, useState } from "react";
import { RARITIES, RARITY_LABELS } from "@/lib/api";
import { rarityStyle } from "@/lib/rarity";
import { formatNumber } from "@/lib/cardLeveling";
import { useWildCards, wildCardLimits } from "@/lib/wildCards";
import { AlertIcon, ChevronDownIcon } from "@/components/icons";
import Tooltip from "@/components/Tooltip";

// "3 giorni fa", "ieri", "adesso": quanto sono vecchi i numeri inseriti, così
// è evidente quando vanno riaggiornati (l'API non li fornisce, vedi
// lib/wildCards.js).
function updatedLabel(iso) {
    if (!iso) return "Non ancora inseriti";
    const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat("it", { numeric: "auto" });
    const units = [
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
    ];
    for (const [unit, size] of units) {
        if (Math.abs(seconds) >= size)
            return `Aggiornati ${rtf.format(Math.round(seconds / size), unit)}`;
    }
    return "Aggiornati adesso";
}

function parseCount(raw) {
    const digits = raw.replace(/\D/g, "");
    return digits === "" ? null : Number(digits);
}

function OverLimitAlert() {
    return (
        <Tooltip
            className="shrink-0"
            content={
                <p className="text-xs text-white">
                    Oltre il massimo per il tuo livello del Re: possibile con offerte del negozio o
                    Lucky Drop.
                </p>
            }
        >
            <AlertIcon
                className="h-4 w-4 text-gold lg:h-4.5 lg:w-4.5"
                aria-label="Oltre il massimo"
            />
        </Tooltip>
    );
}

// su mobile la sezione si può chiudere (occupa spazio prima della lista
// carte); la scelta resta salvata. Da lg in su è sempre aperta.
const OPEN_KEY = "cr_wild_cards_open";

function useSectionOpen() {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        try {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (window.localStorage.getItem(OPEN_KEY) === "false") setOpen(false);
        } catch {
            // storage non disponibile: resta aperta
        }
    }, []);

    function toggle() {
        setOpen((prev) => {
            try {
                window.localStorage.setItem(OPEN_KEY, String(!prev));
            } catch {
                // storage non disponibile: vale solo per questa sessione
            }
            return !prev;
        });
    }

    return [open, toggle];
}

export default function WildCardsPanel({ player }) {
    const { counts, updatedAt, setCount, hydrated } = useWildCards(player.tag);
    const [open, toggle] = useSectionOpen();
    const limits = wildCardLimits(player.expLevel);

    return (
        <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
                {/* il pulsante apre/chiude solo sotto lg: da lg in su la
                sezione è sempre visibile e la freccia sparisce */}
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={open}
                    className="-my-1 flex items-center gap-1.5 py-1 text-base font-bold text-ink lg:pointer-events-none"
                >
                    I tuoi jolly
                    <ChevronDownIcon
                        className={`h-4 w-4 text-muted transition-transform lg:hidden ${open ? "rotate-180" : ""}`}
                    />
                </button>
                <p className="text-xs text-muted">
                    {hydrated ? updatedLabel(updatedAt) : "\u00a0"}
                </p>
            </div>
            <div
                // 5 per riga solo da xl: fra 1024 e 1280 una casella su 5 è troppo
                // stretta per numero + massimo + avviso
                className={`${open ? "grid" : "hidden"} grid-cols-2 gap-2 sm:grid-cols-3 lg:grid lg:gap-3 xl:grid-cols-5`}
            >
                {RARITIES.map((r) => {
                    const style = rarityStyle(r);
                    const value = counts[r];
                    const limit = limits[r];
                    const shown = value === undefined ? "" : formatNumber(value);
                    return (
                        <label
                            key={r}
                            className="flex min-w-0 cursor-text items-center gap-3 rounded-lg border-2 border-panel-2 bg-panel px-3 py-3.5 focus-within:border-gold lg:gap-3.5 lg:px-4 lg:py-3.5"
                        >
                            {/* icona alta almeno quanto il blocco numero + barra accanto:
                            mobile 28px vs 16+6+6, desktop 32px vs 16+8+6 */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`/wild-cards/${r}.png`}
                                alt=""
                                className="h-7 w-auto shrink-0 lg:h-8"
                            />
                            <span className="flex min-w-0 flex-1 flex-col gap-1.5 lg:gap-2">
                                {/* avviso in fondo alla riga del numero: finisce dove
                                finisce la barra sotto */}
                                <span className="flex items-center justify-between gap-1 lg:gap-1.5">
                                    <span className="flex items-baseline gap-0.5 sm:gap-1">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={shown}
                                            onChange={(e) =>
                                                setCount(r, parseCount(e.target.value))
                                            }
                                            placeholder="—"
                                            aria-label={`Jolly ${RARITY_LABELS[r].toLowerCase()}, massimo ${limit}`}
                                            // larghezza = cifre inserite (font monospazio): così
                                            // "/massimo" resta attaccato al numero invece di
                                            // finire in fondo alla casella
                                            style={{ width: `${Math.max(1, shown.length)}ch` }}
                                            // shrink-0: il numero non viene mai tagliato
                                            // da 5 cifre in su ("12.345") sotto sm il numero scende
                                            // a 14px, altrimenti non ci sta accanto all'avviso
                                            className={`font-num block h-4 shrink-0 bg-transparent p-0 text-base leading-none font-bold text-ink outline-none placeholder:text-muted ${shown.length > 4 ? "max-sm:text-sm" : ""}`}
                                        />
                                        <span className="font-num text-[10px] leading-none text-muted sm:text-[11px]">
                                            /{formatNumber(limit)}
                                        </span>
                                    </span>
                                    {value > limit && <OverLimitAlert />}
                                </span>
                                <span className="h-1 w-full overflow-hidden rounded-full bg-panel-2 lg:h-1.5">
                                    <span
                                        className={`block h-full rounded-full ${style.dot}`}
                                        style={{
                                            width: `${value ? Math.min(1, value / limit) * 100 : 0}%`,
                                        }}
                                    />
                                </span>
                            </span>
                        </label>
                    );
                })}
            </div>
        </section>
    );
}
