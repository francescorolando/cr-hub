"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "cr_theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // il tema reale è già stato applicato al <html> dallo script beforeInteractive
    // nel layout, prima dell'hydration: qui ci limitiamo a leggerlo per mostrare
    // l'icona giusta, quindi la lettura può avvenire solo dopo il mount.
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
    window.localStorage.setItem(THEME_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambia tema chiaro/scuro"
      title="Cambia tema chiaro/scuro"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-panel-2 text-sm text-muted transition hover:border-gold hover:text-gold"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
