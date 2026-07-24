"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// tooltip minimale, coerente col resto dell'interfaccia (stesso pattern del
// badge elisir: sfondo scuro fisso in entrambi i temi, cosi il testo dentro
// resta sempre chiaro senza dover gestire due varianti di colore).
//
// La bolla va in un portal su document.body, non come figlio in-flow del
// trigger: dentro un contenitore con overflow-y-auto (es. la griglia badge
// nel modale), il CSS forza automaticamente anche overflow-x a "clip" (regola
// dello spec: se un asse non è visible, l'altro smette di esserlo), quindi
// un tooltip vicino al bordo veniva tagliato dal contenitore stesso, non
// dalla viewport. Fuori da quell'albero il problema non si pone.
export default function Tooltip({ children, content, className = "" }) {
  const wrapRef = useRef(null);
  const bubbleRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, bottom: 0 });
  const [shift, setShift] = useState(0);
  const [mounted, setMounted] = useState(false);

  // il portal richiede document.body, che non esiste nel primo render
  // server: va montato solo dopo l'hydration sul client (stesso pattern già
  // usato in ThemeToggle/useDeckRoles per lo stesso motivo).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function show() {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    setPos({ left: rect.left + rect.width / 2, bottom: window.innerHeight - rect.top + 8 });
    setOpen(true);
  }

  // dopo che la bolla è posizionata, se sporgerebbe fuori dalla viewport a
  // sinistra/destra la spostiamo quel tanto che basta per restare dentro.
  useLayoutEffect(() => {
    if (!open) return;
    const bubble = bubbleRef.current;
    if (!bubble) return;
    const half = bubble.offsetWidth / 2;
    const margin = 8;
    if (pos.left - half < margin) {
      setShift(margin - (pos.left - half));
    } else if (pos.left + half > window.innerWidth - margin) {
      setShift(window.innerWidth - margin - (pos.left + half));
    } else {
      setShift(0);
    }
  }, [open, pos]);

  return (
    <span
      ref={wrapRef}
      className={`relative inline-flex ${className}`}
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
      onFocus={show}
      onBlur={() => setOpen(false)}
    >
      {children}
      {mounted &&
        createPortal(
          <span
            ref={bubbleRef}
            role="tooltip"
            style={{
              position: "fixed",
              left: pos.left,
              bottom: pos.bottom,
              translate: `calc(-50% + ${shift}px) 0`,
            }}
            className={`pointer-events-none z-50 block w-max max-w-[240px] scale-95 rounded-lg border border-white/10 bg-royal-deep px-3 py-2 opacity-0 shadow-soft transition-[opacity,transform] duration-100 ${
              open ? "scale-100 opacity-100" : ""
            }`}
          >
            {content}
            <span
              className="absolute top-full -translate-x-1/2 border-4 border-transparent border-t-royal-deep"
              style={{ left: `calc(50% - ${shift}px)` }}
            />
          </span>,
          document.body,
        )}
    </span>
  );
}
