"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/lib/PlayerContext";

export default function ProfileMenu() {
  const { selectedTag, player, loading, error, mainTag, pinned, selectPlayer, setMain, togglePin, isPinned, isMain } =
    usePlayer();
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

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    await selectPlayer(query);
    setQuery("");
  }

  const mainEntry = pinned.find((p) => p.tag === mainTag);
  const mainLabel = mainEntry?.name || (selectedTag === mainTag ? player?.name : null) || mainTag;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="shadow-soft flex max-w-[50vw] items-center gap-2 rounded-full border-2 border-panel-2 bg-panel px-3 py-1.5 text-sm text-ink transition hover:border-gold sm:max-w-none sm:px-3.5 sm:py-2"
      >
        {loading ? (
          <span className="truncate text-muted">Carico…</span>
        ) : player ? (
          <>
            <span className="truncate font-semibold">{player.name}</span>
            <span className="hidden shrink-0 font-num text-xs text-muted sm:inline">{player.tag}</span>
          </>
        ) : (
          <span className="truncate text-muted">Seleziona</span>
        )}
        <span className="shrink-0 text-muted">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border-2 border-panel-2 bg-panel p-4 shadow-2xl">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tag giocatore, es. #2PP"
              className="min-w-0 flex-1 rounded-lg border-2 border-panel-2 bg-royal px-3 py-2 font-num text-sm text-ink outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Cerca
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-crimson">{error}</p>}

          {player && (
            <div className="mt-4 border-t-2 border-panel-2 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Profilo selezionato</p>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{player.name}</p>
                  <p className="font-num text-xs text-muted">{player.tag}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => togglePin(player.tag, player.name)}
                    title={isPinned(player.tag) ? "Rimuovi dai pinnati" : "Pinna questo profilo"}
                    className={`rounded-full border-2 px-2 py-1 text-sm transition ${
                      isPinned(player.tag)
                        ? "border-gold text-gold"
                        : "border-panel-2 text-muted hover:border-gold hover:text-gold"
                    }`}
                  >
                    📌
                  </button>
                  <button
                    type="button"
                    onClick={() => setMain(player.tag)}
                    disabled={isMain(player.tag)}
                    title="Imposta come principale"
                    className="rounded-full border-2 border-panel-2 px-2 py-1 text-sm text-muted transition hover:border-gold hover:text-gold disabled:opacity-30"
                  >
                    {isMain(player.tag) ? "★" : "☆"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {mainTag && mainTag !== selectedTag && (
            <div className="mt-4 border-t-2 border-panel-2 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Principale</p>
              <button
                type="button"
                onClick={() => selectPlayer(mainTag)}
                className="mt-1.5 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm text-ink transition hover:bg-panel-2"
              >
                <span className="truncate">{mainLabel}</span>
                <span className="text-gold">★</span>
              </button>
            </div>
          )}

          <div className="mt-4 border-t-2 border-panel-2 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Pinnati</p>
            {pinned.length === 0 ? (
              <p className="mt-1.5 text-sm text-muted">Nessun profilo pinnato.</p>
            ) : (
              <ul className="mt-1.5 flex flex-col">
                {pinned.map((p) => (
                  <li key={p.tag} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => selectPlayer(p.tag)}
                      className={`flex min-w-0 flex-1 items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-panel-2 ${
                        p.tag === selectedTag ? "text-gold" : "text-ink"
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="font-num text-xs text-muted">{p.tag}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePin(p.tag, p.name)}
                      title="Rimuovi dai pinnati"
                      className="shrink-0 rounded-full px-1.5 py-1 text-sm text-muted transition hover:text-crimson"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
