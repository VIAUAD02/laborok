# Mobil- és Webes szoftverek - Laborok

![Build docs](https://github.com/bmeviauac01/laborok/workflows/Build%20docs/badge.svg?branch=master)

[BMEVIAUAC00 - Mobil- és Webes Szoftverek](https://www.aut.bme.hu/Course/mobilesweb) tárgy laborfeladatai.

A jegyzetek MkDocs segítségével készülnek és GitHub Pages-en kerülnek publikálásra: <https://viauac00.github.io/laborok/>

## Helyi gépen történő renderelés (Docker-rel)

1. Powershell konzol vagy Windows Terminal nyitása a repository gyökerébe.
2. Adjuk ki ezt a commandot
   - Powershell esetén `docker run -it --rm -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material:7.3.6`
   - Windows Terminal esetén `docker run -it --rm -p 8000:8000 -v "%cd%":/docs squidfunk/mkdocs-material:7.3.6`
3. <http://localhost:8000> megnyitása böngészőből.
4. Markdown szerkesztése és mentése után automatikusan frissül a weboldal.

Ha bármi probléma van, akkor [ez az oldal][Material for MkDocs] segítségedre lehet.

[Material for MkDocs]: https://squidfunk.github.io/mkdocs-material/creating-your-site/