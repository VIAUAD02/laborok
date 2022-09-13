# Kontribúciós guidelineok

## Hibák jelzése

Amennyiben hibát találsz az anyagban, vagy szeretnéd bővíteni, de nem áll módodban javítani, nyithatsz egy issue-t amiben leírod a hibát.

0. Nézd meg, hogy valaki nem jelezte-e, amit szeretnél.
   Gyakran már létező problémákat találnak, amire már van pull request,
   így mielőtt bármit tennél nézd meg valaki nem előzött-e meg
1. Az issues tabon a new issue gombbal hozz létre egy új issue-t.
2. Lásd el a megfelelő címkékkel <!-- TODO ezen tagek létrehozása -->
   1. A labor típusa (`android` az androidos laboroknál és `web` a webes laboroknál)
   2. A hiba típusa (`clarification`, `typo`, `illustration` vagy `notes`)
3. Írd le, hogy mit kéne tartalmaznia a javításnak

## Változtatások javaslása

Amennyiben a hozzájárulásod meg tudod valósítani indíts pull requestet

1. Forkold a repository-t
2. Végezd el a változtatásokat.
3. Ellenőrizd, hogy ne kerüljön bele a commitba olyan file, amit az editor generált (pl.: `.idea` mappa)
4. Indíts egy pull requestet, ami elmagyarázza, hogy milyen változtatásokat és miért végeztél
5. Lásd el a megfelelő címkékkel <!-- TODO ezen tagek létrehozása -->
   1. A labor típusa (`android` az androidos laboroknál és `web` a webes laboroknál)
   2. A hiba típusa (`clarification`, `typo`, `illustration` vagy `notes`)
6. Valaki, akinek hozzáférése van a repositoryhoz, ellenőrzi a változtatások szükségességét, és elbírálja, hogy valóban bekerülhet az anyagba.
7. Ha ez megtörtént a változtatások belekerülnek az anyagba.

## Code style

- Kotlin: a [hivatalos style guide](https://kotlinlang.org/docs/coding-conventions.html) alapján
- HTML & CSS & JavaScript: A [Prettier](https://prettier.io/docs/en/why-prettier.html) style guide alapján
- Markdown: Mivel az alap spec nem mindig a legtisztábban érthető, a [markdownlint szabályai](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md) alapján, az `MD033` kivételével.

Ezek a stílusok a tárgyban ajánlott editorokban könnyen beállíthatóak.

### VSCode

Ajánlott extensionök:

- [`yzhang.markdown-all-in-one`](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one): MD szinkronizált live preview
- [`DavidAnson.vscode-markdownlint`](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint): MD formázás, szabályok stb.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): HTML+CSS formázó
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens): Kiemeli a hibákat hogy gyorsabben megtaláljuk őket

Az editor beállításához nyisd meg a repo-t a gyökerében VSCode-al. A VSCode fel fogja ajánlani a két markdown extension-t.
<!--TODO Képeket készíteni-->
Ha ez megtörtént, nyiss meg egy markdown dokumentumot, lés használd a <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd> shortcutot, a command palette megnyitásához.
> A command palette a VSCode parancsaihoz nyújt hozzáférést, autocompleteeli a parancsokat és egy minimális GUI-t is biztosít.

A command palette-be keressük meg a `Format Document With...` menüpontot és válasszuk ki.
Ekkor egy almenübe dob az editor és kiválaszthatjuk hogy melyik formázóval formázzuk a MD dokumentumokat.
Legalul lesz egy `Configure Default Formatter`, válasszuk ezt.
Ezután válasszuk a `markdownlint` extensiont, és készen vagyunk.
> **FONTOS!**
> Ne válaszd ki a prettiert formatterként, mert eltöri a szövegbuborékokat.

Ezen felül érdemes lehet bekapcsolni a mentés előtti formázást.

A <kbd>CTRL</kbd>+<kbd>,</kbd> shortcuttal megnyitjuk a beállításokat, és rákeresünk arra, hogy format on save.
Itt kipipáljuk a checkboxot és készen vagyunk.

Ha ehhez nem lenne törelmed, itt a json amit a `settings.json`-ba illesztve beállítódik minden.

```json
{
  "[markdown]": {
    "editor.defaultFormatter": "DavidAnson.vscode-markdownlint",
    "editor.formatOnSave": true
  }
}
```

## Ajánlások

### Android

- Az androidos Kotlin és XML fileokat illetve kódrészleteket Android Studioban formázva érdemes hozzáadni az anyaghoz
- Ahhoz hogy biztosan formázva legyenek a fileok használd a `ctrl+alt+L` shortcutot

### Markdown Fileok

- A markdown fileokat se az Android Studio se a Visual Studio Code nem rendereli alaphelyzetben.
  Erre a feladatra a következő extensionöket/pluginokat tudom ajánlani:
  - VSCode: [`yzhang.markdown-all-in-one`](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
  - Android Studio: [Markdown Editor](https://plugins.jetbrains.com/plugin/17254-markdown-editor)
