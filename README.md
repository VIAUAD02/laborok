# Mobil- és Webes szoftverek - Laborok

![Build docs](https://github.com/bmeviauac01/laborok/workflows/Build%20docs/badge.svg?branch=master)

[BMEVIAUAC00 - Mobil- és Webes Szoftverek](https://www.aut.bme.hu/Course/mobilesweb) tárgy laborfeladatai.

A jegyzetek MkDocs segítségével készülnek és GitHub Pages-en kerülnek publikálásra: <https://viauac00.github.io/laborok/>

Az MKDocs használatához [a hovatalos dokumentáció](https://squidfunk.github.io/mkdocs-material/creating-your-site/) segítségedre lehet.

## MKDocs tesztelése (Docker-rel)

### Helyi gépen

A futtatáshoz Dockerre van szükség, amihez Windows-on a [Docker Desktop](https://www.docker.com/products/docker-desktop/) egy kényelmes választás.

Windows-on a kellemesebb élmény érdekében ajánlott telepíteni a Windows Terminalt, ami egy modern terminál emulátor a Microsofttól. Használatával egy alkalmazáson belül nyithatunk PowerShell, CMD, WSL, Azure Shell stb. ablakokat. Letölthető a [Microsoft Store](https://www.microsoft.com/store/apps/9n0dx20hk701)-ból vagy winget használatával a konzolból:

```powershell
# Újabb Windows-okon elérhető a "winget" parancs, amivel konzolból tudunk telepíteni alkalmazásokat
# Az alábbi parancsot adjuk ki PowerShellből vagy CMD-ből a Windows Terminal telepítéséhez:
winget install --id Microsoft.WindowsTerminal
```

### GitHub Codespaces fejlesztőkörnyezetben

A GitHub Codespaces funkciója jelentős mennyiségű időt ad a felhasználók számára virtuális gép használat formájában, ahol GitHub repositoryk tartalmát tudjuk egy virtuális gépben fordítani és futtatni.

Ehhez elegendő a repository (akár a forkon) Code gombját lenyitni majd létrehozni egy új codespace-t. Ez lényegében egy böngészős VSCode, ami egy konténerben fut, és az alkalmazás által nyitott portokat egy port forwardinggal el is érhetjük a böngészőnkből.

### Dockerfile elindítása

A repository tartalmaz egy Dockerfile-t, ami at MKDocs keretrendszer és függőségeinek konfigurációját tartalmazza. Ezt a konténert le kell buildelni, majd futtatni, ami lebuildeli az MKDocs doksinkat, és egyben egy fejlesztési idejű webservert is elindít.

1. Terminál nyitása a repository gyökerébe.
2. Adjuk ki ezt a parancsot Windows (PowerShell), Linux és MacOS esetén:

   ```cmd
   docker build -t mkdocs .
   docker run -it --rm -p 8000:8000 -v $PWD:/docs mkdocs
   ```

3. <http://localhost:8000> vagy a codespace átirányított címének megnyitása böngészőből.
4. Markdown szerkesztése és mentése után automatikusan frissül a weboldal.
