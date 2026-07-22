"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RARITIES, RARITY_LABELS } from "@/lib/api";
import { rarityStyle } from "@/lib/rarity";
import { cardNameIt } from "@/lib/cardNamesIt";

// select nativo a scelta unica su un elenco di ~120 carte: i browser non
// permettono di colorare in modo affidabile i titoli <optgroup> (Chrome in
// pratica li ignora), quindi per rispettare i colori di rarità già usati nel
// resto del sito serve un dropdown fatto a mano — stesso pattern
// toggle/click-fuori già usato in components/ProfileMenu.js.
export default function CardPickerDropdown({ groupedCatalog, value, cardMeta, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groupedCatalog;
    const out = {};
    for (const r of RARITIES) {
      out[r] = groupedCatalog[r].filter((c) => cardNameIt(c.name).toLowerCase().includes(q));
    }
    return out;
  }, [groupedCatalog, query]);

  function pick(cardId) {
    onChange(cardId);
    setOpen(false);
    setQuery("");
  }

  const style = cardMeta ? rarityStyle(cardMeta.rarity) : null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border-2 border-panel-2 bg-royal px-3 py-2 text-left text-sm text-ink outline-none transition hover:border-gold focus:border-gold"
      >
        {cardMeta ? (
          <span className="flex min-w-0 items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
            <span className="truncate">{cardNameIt(cardMeta.name)}</span>
          </span>
        ) : (
          <span className="truncate text-muted">{placeholder}</span>
        )}
        <span className="shrink-0 text-muted">▾</span>
      </button>

      {open && (
        <div className="shadow-2xl absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-lg border-2 border-panel-2 bg-panel p-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca carta…"
            className="mb-2 w-full rounded-lg border-2 border-panel-2 bg-royal px-3 py-1.5 text-sm text-ink outline-none focus:border-gold"
          />
          {RARITIES.map((r) => {
            const cards = filtered[r];
            if (!cards || cards.length === 0) return null;
            const rStyle = rarityStyle(r);
            return (
              <div key={r} className="mb-1">
                <p className={`px-2 py-1 text-xs font-bold uppercase tracking-wide ${rStyle.text}`}>
                  {RARITY_LABELS[r]}
                </p>
                {cards.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pick(c.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-panel-2 ${
                      c.id === value ? "text-gold" : "text-ink"
                    }`}
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${rStyle.dot}`} />
                    <span className="truncate">{cardNameIt(c.name)}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
