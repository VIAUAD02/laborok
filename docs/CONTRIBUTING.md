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

<!--TODO ezt a könnyű beállítást dokumentálni for ease of use.-->

## Ajánlások

### Android

- Az androidos Kotlin és XML fileokat illetve kódrészleteket Android Studioban formázva érdemes hozzáadni az anyaghoz
- Ahhoz hogy biztosan formázva legyenek a fileok használd a `ctrl+alt+L` shortcutot <!-- TODO MacOS shortcut -->

### Markdown Fileok

- A markdown fileokat se az Android Studio se a Visual Studio Code nem rendereli alaphelyzetben.
  Erre a feladatra a következő extensionöket/pluginokat tudom ajánlani:
  - VSCode: [`yzhang.markdown-all-in-one`](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
  - Android Studio: [Markdown Editor](https://plugins.jetbrains.com/plugin/17254-markdown-editor)
