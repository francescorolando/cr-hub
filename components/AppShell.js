"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayerProvider } from "@/lib/PlayerContext";
import ProfileMenu from "@/components/ProfileMenu";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/profilo", label: "Profilo" },
  { href: "/statistiche", label: "Statistiche" },
  { href: "/miglioramento", label: "Miglioramento" },
  { href: "/confronto", label: "Confronto" },
];

export default function AppShell({ children }) {
  const pathname = usePathname();

  return (
    <PlayerProvider>
      <div className="min-h-screen">
        <header className="shadow-soft sticky top-0 z-30 border-b-2 border-panel-2 bg-panel px-4 py-3 sm:px-6 sm:py-5">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/crown-logo.png" alt="" className="h-10 w-10 shrink-0 object-contain sm:h-14 sm:w-14" />
              <div className="min-w-0">
                <p className="truncate font-display text-base font-bold text-brand sm:text-3xl sm:tracking-wide">
                  Royale Hub
                </p>
                <p className="hidden truncate font-num text-xs tracking-wide text-muted sm:mt-1.5 sm:block">
                  Dati live dall&apos;API ufficiale di Clash Royale
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <ThemeToggle />
              <ProfileMenu />
            </div>
          </div>

          <nav className="mx-auto mt-4 flex max-w-6xl gap-1 min-[360px]:gap-1.5 sm:mt-6 sm:justify-center sm:gap-2">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap flex-auto rounded-full border-2 px-1 py-1.5 text-center text-[11px] font-semibold transition min-[360px]:px-1.5 min-[400px]:text-xs sm:flex-none sm:px-4 sm:py-2 sm:text-sm ${
                    active
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-panel-2 text-muted hover:border-elixir hover:text-elixir"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </PlayerProvider>
  );
}
