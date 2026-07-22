# Royale Companion

An unofficial Clash Royale companion app: player profile, current deck, and card-upgrade progression tracking, with live data from Supercell's official API.

> Fan-made, not affiliated with or endorsed by Supercell. Built in accordance with Supercell's [Fan Content Policy](https://supercell.com/en/fan-content-policy/).

## Features

- **Profile**: trophies, personal best, Ranked position (with the real league icon), clan (with the real clan badge) and role, collection level.
- **Current deck**: support tower, average elixir, and the 8 cards rendered with their real in-game look (frame, evolution/hero glow). The API never reveals which cards actually occupy the deck's Evolution/Hero/Wild slots, so the app pre-selects a plausible guess that you can correct by tapping a card.
- **Card upgrade tracker**: for every owned card, how many copies/gold/gems are still needed to reach level 16, with rarity filters and search.

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router) + React 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- Card/league/clan-badge art from [RoyaleAPI](https://royaleapi.com/) (proxy API + public assets), with automatic fallback to the official Supercell icons if an asset ever becomes unreachable

## Local setup

```bash
npm install
```

Create a `.env.local` file in the project root:

```
CR_API_TOKEN=your_token_here
```

### Getting a token

1. Sign up at [developer.clashroyale.com](https://developer.clashroyale.com/) and create an API key.
2. As the allowed IP, use **`45.79.218.79`** — that's RoyaleAPI's proxy IP, not your own. The app never calls the official API directly; every request goes through `https://proxy.royaleapi.dev/v1`, which exposes this fixed IP specifically to get around the official API's "one token = one IP" restriction (handy locally, and required in production, where a host's outbound IP isn't fixed).

```bash
npm run dev
```

Open http://localhost:3000.

## Deploying

Built for [Vercel](https://vercel.com/) (zero-config for Next.js):

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com/), "Import Project" and pick the repo — Vercel detects Next.js automatically.
3. Before deploying, add an environment variable: `CR_API_TOKEN` = your token.
4. Deploy. Every subsequent push to the repo triggers a new deployment automatically.

## Project structure

```
app/
  api/cr/[...path]/route.js  → server-side proxy to the API (token never reaches the browser)
  profilo/page.js            → profile page
  miglioramento/page.js      → card upgrade tracker page
  page.js                    → redirects "/" to /profilo
  layout.js, globals.css     → fonts and theme
components/
  AppShell.js                → header, nav, theme toggle, profile switcher
  ProfileHero.js              → profile summary + current deck panel
  ProfileDetails.js           → progression / battles / clan stat cards
  UpgradeTab.js, UpgradeCardRow.js → card upgrade tracker
  CardImage.js                → card art with automatic fallback
  Tooltip.js                  → shared tooltip used across the app
lib/
  cardLeveling.js              → upgrade cost tables (cards/gold/gems) per rarity
  cardNamesIt.js                → English → Italian card name mapping
  royaleApiAssets.js, clanBadges.js → external asset URL builders
  useDeckRoles.js                → local, per-deck Evolution/Hero/Champion role tracking
  leagues.js, rarity.js, badges.js, PlayerContext.js
```

## Things worth knowing before you push

- **`CardsTab.js` and `CompareTab.js` are currently unused** (no page imports them anymore) — leftover from an earlier navigation layout. Safe to delete, or keep if you plan to bring that functionality back.
- **The proxy route is effectively open**: `/api/cr/[...path]` forwards *any* path to the upstream API using your server-side token. Anyone who finds your deployed URL can use it to query the official API through your token. Fine for personal/demo use; if you expect real traffic, consider adding rate limiting or restricting which paths can be forwarded.
- **`.env.local` is already gitignored** — double-check `git status` before your first commit/push just in case.
- Card/league/clan-badge art is fetched from `cdns3.royaleapi.com` and `cdn.jsdelivr.net` (a third-party CDN, not Supercell's own), with a fallback to official Supercell assets baked in — if either service ever changes its URL scheme, images fall back automatically rather than breaking.
