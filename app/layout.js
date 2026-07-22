import Script from "next/script";
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata = {
    title: "Royale Companion",
    description: "Profilo, progressione e miglioramento delle carte in tempo reale.",
};

// applica il tema salvato PRIMA che React idrati la pagina: altrimenti si
// vedrebbe un flash del tema sbagliato, oppure un hydration mismatch (il
// server non ha accesso a localStorage e renderizza sempre il tema chiaro
// di default).
const THEME_INIT_SCRIPT = `
(function () {
  try {
    if (localStorage.getItem("cr_theme") === "dark") {
      document.documentElement.dataset.theme = "dark";
    }
  } catch (e) {}
})();
`;

// suppressHydrationWarning su <html>: data-theme viene impostato dallo script
// beforeInteractive prima che React idrati, quindi differisce
// intenzionalmente da quello che React si aspetterebbe di renderizzare.
export default function RootLayout({ children }) {
    return (
        <html lang="it" suppressHydrationWarning>
            <head>
                <Script id="theme-init" strategy="beforeInteractive">
                    {THEME_INIT_SCRIPT}
                </Script>
            </head>
            {/* suppressHydrationWarning: alcune estensioni browser (es. ColorZilla,
          che aggiunge cz-shortcut-listen) iniettano attributi su <body> prima
          che React idrati la pagina — non è un problema del codice */}
            <body className="antialiased" suppressHydrationWarning>
                <AppShell>{children}</AppShell>
            </body>
        </html>
    );
}
