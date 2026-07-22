// helper unico per parlare col nostro proxy interno (mai con l'api esterna
// direttamente): niente cache lato client, cosi ogni ricerca e' aggiornata.
export async function crFetch(path) {
  const res = await fetch(`/api/cr${path}`, { cache: "no-store" });
  const data = await res.json();

  if (!res.ok) {
    const message = data?.error?.message || data?.error || `errore ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export function normalizeTag(raw) {
  if (!raw) return "";
  let tag = raw.trim().toUpperCase().replace(/O/g, "0");
  if (!tag.startsWith("#")) tag = `#${tag}`;
  return tag;
}

export function fetchPlayer(tag) {
  const clean = normalizeTag(tag);
  return crFetch(`/players/${encodeURIComponent(clean)}`);
}

// catalogo di tutte le carte del gioco (id/nome/rarità/maxLevel/icone): serve
// al confronto statistiche per popolare i selettori indipendentemente da un
// profilo selezionato. Le supportItems (torri di supporto) restano fuori.
export async function fetchCardCatalog() {
  const data = await crFetch("/cards");
  return data.items;
}

export const RARITIES = ["common", "rare", "epic", "legendary", "champion"];

export const RARITY_LABELS = {
  common: "Comune",
  rare: "Rara",
  epic: "Epica",
  legendary: "Leggendaria",
  champion: "Campione",
};
