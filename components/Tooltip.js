"use client";

// tooltip minimale, coerente col resto dell'interfaccia (stesso pattern del
// badge elisir: sfondo scuro fisso in entrambi i temi, cosi il testo dentro
// resta sempre chiaro senza dover gestire due varianti di colore).
export default function Tooltip({ children, content, className = "" }) {
  return (
    <span className={`group/tip relative inline-flex ${className}`} tabIndex={0}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[240px] -translate-x-1/2 scale-95 rounded-lg border border-white/10 bg-royal-deep px-3 py-2 opacity-0 shadow-soft transition-all duration-100 group-hover/tip:scale-100 group-hover/tip:opacity-100 group-focus-within/tip:scale-100 group-focus-within/tip:opacity-100"
      >
        {content}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-royal-deep" />
      </span>
    </span>
  );
}
