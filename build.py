"""Składa stronę Centrum Lekkości: index.html + podstrony + wersja podglądowa (jeden plik).
Uruchom z katalogu głównego repozytorium:  python3 src/build.py
"""
import re, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOGO_SRC = ROOT / "assets/img/logo-horizontal.svg"


def themed_logo():
    svg = LOGO_SRC.read_text(encoding="utf-8")
    svg = re.sub(r'\s(width|height)="\d+"', "", svg, count=2)
    svg = svg.replace('role="img" aria-label="Centrum Lekkości"', 'aria-hidden="true" focusable="false"')
    svg = re.sub(r"<title>.*?</title>", "", svg)
    svg = svg.replace('fill="#2F6E5E"', 'style="fill:var(--sage)"').replace('stroke="#2F6E5E"', 'style="stroke:var(--sage)"')
    svg = svg.replace('fill="#16302B"', 'style="fill:var(--ink)"')
    return svg


def build():
    tpl = (ROOT / "src/index.template.html").read_text(encoding="utf-8")
    logo = themed_logo()
    page = tpl.replace("{{LOGO}}", logo)

    site = page.replace("<!-- CSS -->", '<link rel="stylesheet" href="assets/css/style.css">')
    site = site.replace("<!-- JS -->", '<script src="assets/js/main.js" defer></script>')
    (ROOT / "index.html").write_text(site, encoding="utf-8")

    # Podstrony prawne (szkielety do uzupełnienia treścią z pakietu dokumentów)
    head = site.split("<!-- HEAD START -->")[0]
    header = re.search(r'<header class="site-header".*?</header>', site, re.S).group(0)
    header = header.replace('href="#', 'href="index.html#')
    footer = re.search(r'<footer class="site-footer">.*?</footer>', site, re.S).group(0)
    footer = footer.replace('href="#', 'href="index.html#')
    sprite = re.search(r'<svg width="0" height="0".*?</svg>\n', site, re.S).group(0)
    for slug, title in [("regulamin", "Regulamin świadczenia usług"), ("polityka-prywatnosci", "Polityka prywatności")]:
        doc = f"""{head}<title>{title} · Centrum Lekkości</title>
<meta name="robots" content="noindex">
<link rel="icon" type="image/svg+xml" href="assets/img/app-icon.svg">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..700,0..100&family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
{sprite}{header}
<main class="wrap doc-page" id="main">
  <article>
    <p class="eyebrow">Dokumenty</p>
    <h1>{title}</h1>
    <p class="note">Dokument w przygotowaniu. Ostateczną treść opublikujemy po weryfikacji przez kancelarię, przed startem sprzedaży.</p>
    <p>Pytania prosimy kierować na adres <b>kontakt@centrumlekkosci.pl</b>.</p>
  </article>
</main>
{footer}
<script src="assets/js/main.js" defer></script>
</body>
</html>
"""
        (ROOT / f"{slug}.html").write_text(doc, encoding="utf-8")

    # Wersja podglądowa: jeden samowystarczalny plik (bez <html>/<head>/<body>)
    css = (ROOT / "assets/css/style.css").read_text(encoding="utf-8")
    js = (ROOT / "assets/js/main.js").read_text(encoding="utf-8")
    head_part = page.split("<!-- HEAD START -->")[1].split("<!-- HEAD END -->")[0]
    head_part = re.sub(r'<link rel="(icon|canonical|preconnect)"[^>]*>\n', "", head_part)
    head_part = head_part.replace("<!-- CSS -->", f"<style>\n{css}\n</style>")
    body = page.split("<!-- BODY START -->")[1].split("<!-- BODY END -->")[0]
    preview = head_part + body + f"<script>\n{js}\n</script>\n"
    out = ROOT / "preview" / "centrum-lekkosci-landing.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(preview, encoding="utf-8")
    print("OK:", ROOT / "index.html", out, f"{len(preview)//1024} KB")


if __name__ == "__main__":
    sys.exit(build())
