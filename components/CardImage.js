"use client";

import { useState } from "react";
import { royaleApiCardUrl, officialCardUrl } from "@/lib/royaleApiAssets";

// carta con l'aspetto reale del gioco (cornice, diamante evoluzione, glow
// eroe/evoluto già disegnati dentro il PNG): se lo slug indovinato o la
// versione della CDN di RoyaleAPI smettessero di funzionare, ripiega da solo
// sull'icona ufficiale Supercell invece di mostrare un'immagine rotta.
export default function CardImage({ card, variant = "base", alt, className }) {
  const primary = royaleApiCardUrl(card, variant);
  const fallback = officialCardUrl(card, variant);

  // key=card.id+variant: se il ruolo della carta cambia (es. il default viene
  // assegnato un istante dopo il primo render), questo forza React a rimontare
  // l'immagine da zero invece di restare bloccato sulla src del primo render —
  // altrimenti una carta segnata "evo"/"hero" dopo il mount iniziale restava
  // per sempre con l'immagine base.
  return (
    <CardImageInner
      key={`${card.id}-${variant}`}
      primary={primary}
      fallback={fallback}
      alt={alt || card.name}
      className={className}
    />
  );
}

function CardImageInner({ primary, fallback, alt, className }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? fallback : primary || fallback;

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}
