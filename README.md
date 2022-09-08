# Mobil- és Webes szoftverek - Laborok

![Build docs](https://github.com/bmeviauac01/laborok/workflows/Build%20docs/badge.svg?branch=master)

[BMEVIAUAC00 - Mobil- és Webes Szoftverek](https://www.aut.bme.hu/Course/mobilesweb) tárgy laborfeladatai.

A jegyzetek MkDocs segítségével készülnek és GitHub Pages-en kerülnek publikálásra: <https://viauac00.github.io/laborok/>

#### Helyi gépen történő renderelés (Docker-rel)

1. Powershell konzol nyitása a repository gyökerébe

2. `docker run -it --rm -p 8000:8000 -v "%cd%":/docs squidfunk/mkdocs-material:7.3.6`

3. <http://localhost:8000> megnyitása böngészőből.

4. Markdown szerkesztése és mentése után automatikusan frissül a weboldal
