"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchPlayer, normalizeTag } from "@/lib/api";

const SELECTED_KEY = "cr_selected_tag";
const MAIN_KEY = "cr_main_tag";
const PINNED_KEY = "cr_pinned";

const PlayerContext = createContext(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer va usato dentro <AppShell>");
  return ctx;
}

export function PlayerProvider({ children }) {
  const pathname = usePathname();
  const [selectedTag, setSelectedTag] = useState("");
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mainTag, setMainTagState] = useState("");
  const [pinned, setPinned] = useState([]);
  const pinnedRef = useRef(pinned);
  pinnedRef.current = pinned;

  useEffect(() => {
    // idratazione da localStorage: deve girare solo lato client dopo il mount,
    // altrimenti l'HTML del server (senza accesso a localStorage) non
    // combacerebbe con il primo render client (hydration mismatch).
    const savedMain = window.localStorage.getItem(MAIN_KEY) || "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMainTagState(savedMain);

    try {
      const savedPinned = JSON.parse(window.localStorage.getItem(PINNED_KEY) || "[]");
      if (Array.isArray(savedPinned)) setPinned(savedPinned);
    } catch {
      // localStorage corrotto: ripartiamo da una lista vuota
    }

    const savedSelected = window.localStorage.getItem(SELECTED_KEY) || savedMain;
    if (savedSelected) selectPlayer(savedSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // titolo della scheda: qui, non nei singoli page.js, perché il profilo
    // selezionato è uno stato client (localStorage) condiviso da tutte le
    // pagine — un solo punto che tiene la scheda allineata ovunque. Dipende
    // anche da pathname perché ad ogni cambio pagina Next reimposta il title
    // al valore statico di app/layout.js DOPO questo effetto se non lo
    // rieseguiamo: senza pathname nei deps, il nome del giocatore spariva
    // dalla scheda cambiando pagina.
    document.title = player ? `${player.name} · Royale Hub` : "Royale Hub";
  }, [player, pathname]);

  async function selectPlayer(rawTag) {
    const clean = normalizeTag(rawTag);
    if (!clean || clean === "#") return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchPlayer(clean);
      setPlayer(data);
      setSelectedTag(clean);
      window.localStorage.setItem(SELECTED_KEY, clean);

      const pinnedMatch = pinnedRef.current.find((p) => p.tag === clean);
      if (pinnedMatch && pinnedMatch.name !== data.name) {
        updatePinned(pinnedRef.current.map((p) => (p.tag === clean ? { ...p, name: data.name } : p)));
      }
    } catch (err) {
      setError(err.message || "Giocatore non trovato.");
    } finally {
      setLoading(false);
    }
  }

  function setMain(tag) {
    const clean = normalizeTag(tag);
    setMainTagState(clean);
    window.localStorage.setItem(MAIN_KEY, clean);
  }

  function updatePinned(next) {
    setPinned(next);
    window.localStorage.setItem(PINNED_KEY, JSON.stringify(next));
  }

  function togglePin(tag, name) {
    const clean = normalizeTag(tag);
    const exists = pinnedRef.current.some((p) => p.tag === clean);
    if (exists) {
      updatePinned(pinnedRef.current.filter((p) => p.tag !== clean));
    } else {
      updatePinned([...pinnedRef.current, { tag: clean, name: name || clean }]);
    }
  }

  function isPinned(tag) {
    const clean = normalizeTag(tag);
    return pinned.some((p) => p.tag === clean);
  }

  const value = {
    selectedTag,
    player,
    loading,
    error,
    mainTag,
    pinned,
    selectPlayer,
    setMain,
    togglePin,
    isPinned,
    isMain: (tag) => !!mainTag && normalizeTag(tag) === mainTag,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
