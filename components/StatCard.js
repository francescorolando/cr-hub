"use client";

// stessa struttura per tutte le card statistiche (icona+titolo, icona grande +
// numero grande + eventuale valore secondario, righe extra opzionali): prima
// ognuna aveva spaziature e proporzioni sue, ora condividono lo stesso schema.
export default function StatCard({
  iconUrl,
  iconSize = "h-14 w-14",
  iconClassName = "",
  FallbackIcon,
  title,
  big,
  bigLabel,
  bigClassName,
  side,
  sideLabel,
  sideClassName,
  children,
}) {
  return (
    <div className="surface flex flex-col gap-4 rounded-xl border border-panel-2 bg-panel p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</p>
      <div className="flex items-center gap-4">
        {iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconUrl} alt="" className={`${iconSize} shrink-0 object-contain ${iconClassName}`} />
        ) : (
          FallbackIcon && <FallbackIcon className={`${iconSize} shrink-0 text-legendary ${iconClassName}`} />
        )}
        <div className="min-w-0 flex-1">
          <p className={bigClassName || "font-num text-2xl font-bold text-ink sm:text-3xl"}>{big}</p>
          <p className="text-xs text-muted">{bigLabel}</p>
        </div>
        {side != null && (
          <div className="shrink-0 text-right">
            <p className={sideClassName || "font-num text-xl font-bold text-ink"}>{side}</p>
            <p className="text-xs text-muted">{sideLabel}</p>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
