# Hozzájárulás az anyaghoz

Az anyag terjedelméből adandóan apróbb hibák esetenként hiányosságok jelentkezhetnek a laborokban.
Ha egy ilyennel találkozol és úgy döntesz szeretnél segíteni hallgatótársaidnak, azt a következőkben leírtak alapján tudod megtenni.

!!! quote "Plusz pont jegyzet javításért"

    Más tantárgyak mintájára itt is szeretnénk plusz pontot adni a jegyzet open-source hozzájárulásaiért.
    Akik a tárgyat jelenleg hallgatják, pontokat kaphatnak hozzájárulásaikérrt.

    A félév során max 3 db plusz pontot lehet szerezni fejenként olyan javításokért, amik a triviális 1-2 betű elgépelésen túl érdemben javítanak a githubon található labor jegyzetek minőségén.
    Pl.: jelentős mennyiségű elgépelés javítása, egyértelműsítések, illusztrációk kiegészítések készítése vagy akár egy teljes kiegészítő jegyzet írása  (természetesen nem azonos pontértékkel).

    Persze a pont nélkül az 1-1 betűs elgépeléseket is szívesen fogadjuk, ami bemelegítésnek is tökéletes.

## Hibák jelzése

Amennyiben hibát találsz az anyagban, vagy szeretnéd bővíteni, de nem áll módodban javítani, nyithatsz egy issue-t amiben leírod a hibát.

0. Nézd meg, hogy valaki nem jelezte-e, amit szeretnél.
    Gyakran már létező problémákat találnak, amire már van pull request,
    így mielőtt bármit tennél nézd meg valaki nem előzött-e meg
1. Az issues tabon a new issue gombbal hozz létre egy új issue-t.
    ![How to create new issue](assets/github-new-issue.png)
2. Lásd el a megfelelő címkékkel
    1. A labor típusa (`android` az androidos laboroknál és `web` a webes laboroknál)
    2. A hiba típusa (`clarification`, `typo`, `illustration` vagy `notes`)
3. Írd le, hogy mit kéne tartalmaznia a javításnak

!!! tip

    Az címe legyen rövid és lényegretörő, pl.: `Megfogalmazás pontosítása a 4. laborban` vagy `A 6. laborban a leírt kód hibásan működik Android 12-n`

    A issue descriptionjében pedig fejtsd ki, hol található a hiányosság, illetve ha van rá ötleted, hogy lehetne orvosolni ezt.
    Ha ezeken túl még screenshotot is tudsz mellékelni, az nagyban megsegíti a probléma mihamarabbi javítását.

!!! warning

    A github issues nem a laborfeladatok megoldásával kapcsolatos problémák helye, így a "Nem tudom megoldani hogy az értesítés megérkezzen" jellegű problémákat ne itt jelezzétek, erre vannak a laboralkalmak.

## Változtatások javaslása

Amennyiben a hozzájárulásod meg tudod valósítani indíts pull requestet

1. Forkold a repository-t a Githubon jobb felső sarokban található gombbal
    ![fork button](assets/github-fork.png)

2. Végezd el a változtatásokat.

    !!! tip
        Ez nagyon hasonlóan működik [a laborok beadaásához](GitHub.md)

    1. Hozz létre egy branchet a saját forkodon, amin a változtatásokat el fogod végezni.

    2. Ezen a branchen készítsd el a javításokat

    3. Ellenőrizd, hogy ne kerüljön bele a commitba olyan file, amit az editor generált (pl.: `.idea` mappa)
    illetve olyan file aminek nem kéne kikerülnie, pl.: Github Private Access Token

    4. Ha kész vagy a laborok beadásához hasonlóan indíts egy pull requestet a `VIAUAC00/laborok` `master` branchére.

    5. Lásd el a megfelelő címkékkel
        1. A labor típusa (`android` az androidos laboroknál és `web` a webes laboroknál)
        2. A hiba típusa (`clarification`, `typo`, `illustration` vagy `notes`)
    6. A leírásban részletezd változtatások okát.
        Ne felejtsd el beleírni a NEPTUN kódod a leírásba, mert így fogjuk tudni megadni a pontokat.

3. Valaki, akinek hozzáférése van a repositoryhoz, ellenőrzi a változtatások szükségességét, és elbírálja, hogy valóban bekerülhet az anyagba.
4. A változtatásokra review-t indítunk és ha kell módosításokat fogunk kérni.
5. Ha minden kért változtatás megtörtént, a hozzájárulásod belekerül az anyagba.

## Code style

- Kotlin: a [hivatalos style guide](https://kotlinlang.org/docs/coding-conventions.html) alapján
- HTML & CSS & JavaScript: A [Prettier](https://prettier.io/docs/en/why-prettier.html) style guide alapján
- Markdown: Mivel az alap spec nem mindig a legtisztábban érthető, a [markdownlint szabályai](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md) alapján, az néhány kivételével. Ezeket a `.markdownlint.yaml`-ben találod, ha VSCode-ot használsz automatikusan alkalmazza őket az editor és jelzi ha nem megfelelő amit írsz.

Ezek a stílusok a tárgyban ajánlott editorokban könnyen beállíthatóak.

### VSCode

Ajánlott extensionök:

- [`yzhang.markdown-all-in-one`](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one): MD szinkronizált live preview
- [`DavidAnson.vscode-markdownlint`](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint): MD formázás, szabályok stb.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): HTML+CSS formázó
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens): Kiemeli a hibákat hogy gyorsabben megtaláljuk őket

Az editor beállításához nyisd meg a repo-t a gyökerében VSCode-al. A VSCode fel fogja ajánlani a két markdown extension-t.
<figure markdown>
  ![VSCode recommended extensions](assets/vscode-recommended.png)
</figure>

Ha ez megtörtént, nyiss meg egy markdown dokumentumot, és használd a ++ctrl+shift+p++ shortcutot, a command palette megnyitásához.

!!! tip

    A command palette a VSCode parancsaihoz nyújt hozzáférést, autocompleteeli a parancsokat és egy minimális GUI-t is biztosít.

A command palette-be keressük meg a `Format Document With...` menüpontot és válasszuk ki.
Ekkor egy almenübe dob az editor és kiválaszthatjuk hogy melyik formázóval formázzuk a MD dokumentumokat.
Legalul lesz egy `Configure Default Formatter`, válasszuk ezt.
Ezután válasszuk a `markdownlint` extensiont, és készen vagyunk.

!!! caution "Megfelelő formatter kiválasztása"
    Ne válaszd ki a prettiert formatterként, mert eltöri a szövegbuborékokat.

Ezen felül érdemes lehet bekapcsolni a mentés előtti formázást.

A ++ctrl+comma++ shortcuttal megnyitjuk a beállításokat, és rákeresünk arra, hogy format on save.
Itt kipipáljuk a checkboxot és készen vagyunk.

Ha ehhez nem lenne türelmed, itt a json amit a `settings.json`-ba illesztve beállítódik minden.

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
- Ahhoz hogy biztosan formázva legyenek a fileok használd a ++ctrl+alt+l++ shortcutot

### Markdown Fileok

- A markdown fileokat se az Android Studio se a Visual Studio Code nem rendereli alaphelyzetben.
  Erre a feladatra a következő extensionöket/pluginokat tudom ajánlani:
  - VSCode: [`yzhang.markdown-all-in-one`](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
  - Android Studio: [Markdown Editor](https://plugins.jetbrains.com/plugin/17254-markdown-editor)
