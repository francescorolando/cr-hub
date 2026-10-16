"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";

// Menu dell'ordinamento fatto a mano invece di un <select>: su mobile il menu
// di un select nativo lo disegna il sistema (rotella iOS, finestra Android) e
// non si può allineare a destra. Qui voce scelta, freccia e voci del menu
// stanno tutte a destra. Stesso schema apri/chiudi (clic fuori, Esc) di
// components/CardPickerDropdown.js.
export default function SortDropdown({ label, options, value, onChange, className = "" }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const current = options.find((o) => o.value === value);

    useEffect(() => {
        if (!open) return;
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
        }
        function handleKey(e) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    function pick(next) {
        onChange(next);
        setOpen(false);
    }

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`flex w-full items-center gap-2 rounded-lg border-2 bg-panel px-3 py-2.5 text-sm text-ink outline-none transition-colors ${open ? "border-gold" : "border-panel-2 focus-visible:border-gold"}`}
            >
                <span className="shrink-0 text-muted">{label}</span>
                <span className="ml-auto truncate text-right">{current?.label}</span>
                <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <ul
                    role="listbox"
                    aria-label={label}
                    className="shadow-soft absolute right-0 z-30 mt-1.5 min-w-full overflow-hidden rounded-lg border-2 border-panel-2 bg-panel py-1"
                >
                    {options.map((o) => {
                        const selected = o.value === value;
                        return (
                            <li key={o.value} role="option" aria-selected={selected}>
                                <button
                                    type="button"
                                    onClick={() => pick(o.value)}
                                    className={`block w-full px-3 py-2 text-right text-sm whitespace-nowrap transition-colors ${selected ? "bg-gold/15 font-semibold text-gold" : "text-ink hover:bg-panel-2"}`}
                                >
                                    {o.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
