# Centrum Lekkości — strona internetowa

Landing page platformy prowadzonego leczenia otyłości online (centrumlekkosci.pl).
Czysty HTML, CSS i JavaScript, bez frameworka i bez kroku budowania na serwerze.

## Struktura

```
index.html                  strona główna (wygenerowana z src/index.template.html)
regulamin.html              szkielet, treść po weryfikacji kancelarii
polityka-prywatnosci.html   szkielet, treść po weryfikacji kancelarii
assets/css/style.css        style i tokeny identyfikacji (jasny i ciemny motyw)
assets/js/main.js           menu, motyw, kalkulator BMI, cennik, formularze
assets/img/                 logo i sygnet z design systemu
src/index.template.html     źródło strony głównej (tu edytuj treść)
src/build.py                skleja szablon z logo i generuje index.html oraz podstrony
CNAME                       domena dla GitHub Pages
```

## Publikacja na GitHub Pages

1. Utwórz repozytorium na koncie spółki, np. `centrum-lekkosci/www`, i wgraj zawartość tego folderu.
2. W repozytorium: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. U rejestratora domeny ustaw rekordy DNS dla `centrumlekkosci.pl`:
   - A: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - CNAME `www` → `<nazwa-konta>.github.io`
4. W **Settings → Pages** wpisz domenę i zaznacz **Enforce HTTPS**.

Bez własnej domeny strona będzie pod adresem `https://<nazwa-konta>.github.io/<repozytorium>/`. Wtedy usuń plik `CNAME`.

## Edycja

- Treść zmieniaj w `src/index.template.html`, potem uruchom `python3 src/build.py`.
- Kolory i fonty są w zmiennych na początku `assets/css/style.css`. Zgodne z design systemem Centrum Lekkości.
- Ceny są w szablonie oraz w `assets/js/main.js` (funkcja `setPlan`). Każdą zmianę ceny wprowadź też w modelu finansowym, biznesplanie i regulaminie.

## Do zrobienia przed startem

- [ ] Podłączyć formularze: wpisać adres w atrybucie `data-endpoint` formularzy `#lead-form` i `#newsletter-form` (np. Formspree, Make lub własne API). Bez niego formularz działa w trybie demonstracyjnym.
- [ ] Uzupełnić dane podmiotu w stopce: nazwa, RPWDL, NIP, KRS.
- [ ] Wgrać regulamin i politykę prywatności po weryfikacji kancelarii.
- [ ] Dodać zdjęcia i biogramy zespołu.
- [ ] Ustalić cenę fazy utrzymania i daty webinarów.
- [ ] Po dodaniu analityki lub pikseli reklamowych: baner zgód na cookies.
- [ ] Sprawdzić treści pod kątem zakazu reklamy leków na receptę (strona nie wymienia nazw leków i tak ma zostać).
