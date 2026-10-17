"use client";

import { useEffect, useState } from "react";
import { fetchBattlelog } from "@/lib/api";

// battlelog del giocatore, ricaricato a ogni cambio di tag (nessuna cache,
// come il resto dei dati live)
export function useBattlelog(tag) {
  const [state, setState] = useState({ tag: null, battles: null, error: "" });

  useEffect(() => {
    if (!tag) return;
    let cancelled = false;
    fetchBattlelog(tag)
      .then((battles) => !cancelled && setState({ tag, battles, error: "" }))
      .catch((err) => !cancelled && setState({ tag, battles: null, error: err.message || "Errore" }));
    return () => {
      cancelled = true;
    };
  }, [tag]);

  // finché non arriva la risposta per QUESTO tag si considera in caricamento,
  // così cambiando giocatore non si vedono per un istante i dati del precedente
  const loading = state.tag !== tag;
  return { battles: loading ? null : state.battles, error: loading ? "" : state.error, loading };
}
