"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";

// Sezione apribile a barra: la barra è l'intestazione di un riquadro e, da
// aperta, il contenuto compare dentro lo stesso riquadro, attaccato sotto —
// così è evidente che i contenuti "scendono" dalla barra e che la barra è un
// pulsante. Stessa forma su desktop e mobile. Lo stato aperto/chiuso resta
// salvato nel browser per ogni sezione (storageKey).
function useStoredOpen(storageKey, defaultOpen) {
    const [open, setOpen] = useState(defaultOpen);

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(storageKey);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (saved !== null) setOpen(saved === "true");
        } catch {
            // storage non disponibile: resta lo stato di default
        }
    }, [storageKey]);

    function toggle() {
        setOpen((prev) => {
            try {
                window.localStorage.setItem(storageKey, String(!prev));
            } catch {
                // storage non disponibile: vale solo per questa sessione
            }
            return !prev;
        });
    }

    return [open, toggle];
}

export default function CollapsibleSection({
    title,
    summary,
    storageKey,
    defaultOpen = false,
    children,
}) {
    const [open, toggle] = useStoredOpen(storageKey, defaultOpen);
    const contentId = useId();

    return (
        <section className="shadow-soft overflow-hidden rounded-lg border-2 border-panel-2 bg-panel">
            <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-controls={contentId}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-panel-2/40"
            >
                <span className="text-base font-bold text-ink">{title}</span>
                {summary && (
                    <span className="ml-auto truncate text-right text-xs text-muted sm:text-sm">
                        {summary}
                    </span>
                )}
                <span
                    className={`${summary ? "" : "ml-auto"} flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-panel-2 text-muted`}
                >
                    <ChevronDownIcon
                        className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                </span>
            </button>
            <div id={contentId} hidden={!open} className="border-t-2 border-panel-2 p-2.5 sm:p-4">
                {children}
            </div>
        </section>
    );
}
