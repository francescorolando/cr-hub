"use client";

import { usePlayer } from "@/lib/PlayerContext";
import ProfileHero from "@/components/ProfileHero";
import StatCard from "@/components/StatCard";
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

function ProgressionCard({ player }) {
  const collection = findBadge(player, "CollectionLevel");
  const icon = badgeIconUrl(collection);
  const collectionLevel = collection?.progress ?? null;

  return (
    <StatCard
      iconUrl={icon}
      iconSize="h-[88px] w-[88px]"
      iconClassName="-mt-1.5"
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
      sideClassName="font-num text-2xl font-bold text-gold sm:text-3xl"
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
