"use client";

import { usePlayer } from "@/lib/PlayerContext";
import ProfileHero from "@/components/ProfileHero";
import { ShieldIcon } from "@/components/icons";
import { formatNumber } from "@/lib/cardLeveling";
import { findBadge, badgeIconUrl, badgeProgressRatio } from "@/lib/badges";
import { BATTLE_ICON_URL } from "@/lib/royaleApiAssets";
import { clanBadgeUrl } from "@/lib/clanBadges";

const ROLE_LABELS_IT = {
  member: "Membro",
  elder: "Anziano",
  coLeader: "Co-capo",
  leader: "Capo",
};

export default function ProfileDetails() {
  const { player, loading, error } = usePlayer();

  if (loading && !player) {
    return <p className="text-base text-muted">Carico dati live dall&apos;API…</p>;
  }

  if (!player) {
    return (
      <div className="flex flex-col gap-2">
        {error && <p className="text-sm text-crimson">{error}</p>}
        <p className="text-base text-muted">
          Nessun profilo selezionato: usa il menu in alto a destra per cercarne uno.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileHero player={player} />

      <div className="grid gap-4 sm:grid-cols-3">
        <ProgressionCard player={player} />
        <BattlesCard player={player} />
        <ClanCard player={player} />
      </div>
    </div>
  );
}

// stessa struttura per tutte le card statistiche (icona+titolo, icona grande +
// numero grande + eventuale valore secondario, righe extra opzionali): prima
// ognuna aveva spaziature e proporzioni sue, ora condividono lo stesso schema.
function StatCard({ iconUrl, FallbackIcon, title, big, bigLabel, bigClassName, side, sideLabel, sideClassName, children }) {
  return (
    <div className="surface flex flex-col gap-4 rounded-xl border border-panel-2 bg-panel p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</p>
      <div className="flex items-center gap-4">
        {iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconUrl} alt="" className="h-14 w-14 shrink-0 object-contain" />
        ) : (
          FallbackIcon && <FallbackIcon className="h-14 w-14 shrink-0 text-legendary" />
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

function ProgressionCard({ player }) {
  const collection = findBadge(player, "CollectionLevel");
  const icon = badgeIconUrl(collection);
  const collectionLevel = collection?.progress ?? null;

  return (
    <StatCard
      iconUrl={icon}
      title="Progressione"
      big={collectionLevel != null ? formatNumber(collectionLevel) : "–"}
      bigLabel="Livello collezione"
    />
  );
}

function BattlesCard({ player }) {
  const total = (player.wins ?? 0) + (player.losses ?? 0);
  const winRate = total > 0 ? Math.round((player.wins / total) * 100) : null;

  return (
    <StatCard
      iconUrl={BATTLE_ICON_URL}
      title="Battaglie"
      big={formatNumber(player.battleCount)}
      bigLabel="Battaglie totali"
      side={winRate != null ? `${winRate}%` : null}
      sideLabel="Vittorie"
      sideClassName="font-num text-xl font-bold text-gold"
    >
      <div className="flex gap-4 text-sm">
        <p className="text-muted">
          <span className="font-num font-semibold text-ink">{formatNumber(player.wins)}</span> vinte
        </p>
        <p className="text-muted">
          <span className="font-num font-semibold text-ink">{formatNumber(player.losses)}</span> perse
        </p>
        <p className="text-muted">
          <span className="font-num font-semibold text-ink">{formatNumber(player.threeCrownWins)}</span> a 3 corone
        </p>
      </div>
    </StatCard>
  );
}

function ClanCard({ player }) {
  const clanWars = findBadge(player, "ClanWarWins");
  const icon = player.clan?.badgeId ? clanBadgeUrl(player.clan.badgeId) : null;
  const ratio = badgeProgressRatio(clanWars);
  const roleLabel = player.role ? ROLE_LABELS_IT[player.role] || player.role : null;

  return (
    <StatCard
      iconUrl={icon}
      FallbackIcon={ShieldIcon}
      title="Clan"
      big={player.clan?.name || "Nessun clan"}
      bigLabel={roleLabel || " "}
      bigClassName="truncate text-2xl font-bold text-ink"
    >
      {ratio != null && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-muted">
            <span>Vittorie di guerra</span>
            <span className="font-num">{formatNumber(clanWars.progress)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-2">
            <div className="h-full rounded-full bg-legendary" style={{ width: `${ratio * 100}%` }} />
          </div>
        </div>
      )}
    </StatCard>
  );
}
