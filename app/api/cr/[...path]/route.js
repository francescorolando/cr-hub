import { NextResponse } from "next/server";

// tutte le richieste passano da qui: il token resta sul server e non
// viene mai spedito al browser. nessuna cache, cosi i dati sono sempre
// quelli live del gioco.
const PROXY_BASE = "https://proxy.royaleapi.dev/v1";

export async function GET(request, { params }) {
  const token = process.env.CR_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "CR_API_TOKEN non configurato sul server. Aggiungilo nelle variabili d'ambiente." },
      { status: 500 }
    );
  }

  const { path } = await params;
  const targetPath = (path || []).map((segment) => encodeURIComponent(segment)).join("/");

  const incomingUrl = new URL(request.url);
  const targetUrl = `${PROXY_BASE}/${targetPath}${incomingUrl.search}`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await upstreamRes.json();

    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err) {
    return NextResponse.json(
      { error: "Impossibile contattare l'API di Clash Royale.", detail: String(err) },
      { status: 502 }
    );
  }
}
