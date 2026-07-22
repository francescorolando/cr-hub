#!/usr/bin/env python3
# One-off script (non fa parte della build): scarica le icone originali di
# Clash Royale da clashroyale.fandom.com (ospitate su
# static.wikia.nocookie.net, URL elencati qui sotto — non in lib/statIcons.js,
# che dopo la prima esecuzione punta già ai file locali ripuliti) e le salva
# in public/stat-icons/ dopo aver rimosso lo sfondo.
#
# Quello sfondo NON è un riempimento grigio opaco: è un rettangolo
# arrotondato nero a ~55% di opacità (alpha ~140/255) disegnato SOTTO al
# glifo colorato (che è invece a piena opacità, alpha 255). Sembra grigio
# solo perché il nero semi-trasparente si mescola con lo sfondo bianco della
# pagina — non è quindi rimovibile via CSS (mix-blend-mode/filter non isolano
# un solo layer), ma è rimovibile in modo pulito e sicuro azzerando l'alpha
# di ogni pixel con quella banda specifica (colore vicino al nero, alpha
# grossomodo 100-150): i pixel del glifo, disegnati a piena opacità con
# colori vivaci, non rientrano mai in quella banda e restano intatti
# (verificato a mano su Hitpoints/Damage/Target/Count prima di applicarlo a
# tutte le icone).
#
# Uso: python3 scripts/process-stat-icons.py
import os
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "stat-icons")

try:
    from PIL import Image
except ImportError:
    raise SystemExit("Serve Pillow: pip install pillow")


# stessi URL risolti a mano il 2026-07-22 via l'API MediaWiki
# (action=query&prop=imageinfo su ogni File:) descritta nella conversazione
# che ha introdotto queste icone — fissi qui invece che letti da
# lib/statIcons.js perché quel file, dopo la prima esecuzione, punta già ai
# file locali processati.
SOURCE_URLS = {
    "hp": "https://static.wikia.nocookie.net/clashroyale/images/2/2e/Hitpoints.png",
    "damage": "https://static.wikia.nocookie.net/clashroyale/images/6/6a/Damage.png",
    "dps": "https://static.wikia.nocookie.net/clashroyale/images/7/77/DPS.png",
    "crownTowerDamage": "https://static.wikia.nocookie.net/clashroyale/images/d/dd/Crown_Tower_Damage.png",
    "atkSpeed": "https://static.wikia.nocookie.net/clashroyale/images/c/c3/Hit_Speed.png",
    "speed": "https://static.wikia.nocookie.net/clashroyale/images/9/94/Speed.png",
    "range": "https://static.wikia.nocookie.net/clashroyale/images/c/c5/Range.png",
    "radius": "https://static.wikia.nocookie.net/clashroyale/images/a/a4/Radius.png",
    "deployTime": "https://static.wikia.nocookie.net/clashroyale/images/8/8e/Deploy.png",
    "lifetime": "https://static.wikia.nocookie.net/clashroyale/images/0/08/Time.png",
    "target": "https://static.wikia.nocookie.net/clashroyale/images/0/09/Target.png",
    "count": "https://static.wikia.nocookie.net/clashroyale/images/0/04/Count.png",
}


def strip_backdrop(im):
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            near_black = r < 40 and g < 40 and b < 40
            backdrop_alpha = 90 <= a <= 155
            if near_black and backdrop_alpha:
                px[x, y] = (0, 0, 0, 0)
    return im


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    seen = {}
    for key, url in SOURCE_URLS.items():
        if url in seen:
            continue
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as res:
            data = res.read()
        tmp_path = os.path.join(OUT_DIR, "_tmp.webp")
        with open(tmp_path, "wb") as f:
            f.write(data)
        im = strip_backdrop(Image.open(tmp_path))
        filename = f"{key}.png"
        im.save(os.path.join(OUT_DIR, filename))
        os.remove(tmp_path)
        seen[url] = filename
        print(f"{key}: scaricata e ripulita -> public/stat-icons/{filename}")
    print(f"\n{len(seen)} icone uniche processate in public/stat-icons/.")


if __name__ == "__main__":
    main()
