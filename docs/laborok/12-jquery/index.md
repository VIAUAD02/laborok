# Labor 12 - jQuery

[rep]: ./assets/rep.png "Dokumentálandó"

## Bevezetés

Általános áttekintés a webes laborokról és formai követelmények a [8. labor bevezetőjében találhatók](../Labor08/README.md).

Az aktuális laborhoz tartozó jegyzőkönyv sablonja DOCX formátumban [innen](./downloads/Labor12-jegyzokonyv.docx) letölthető.

> Emlékeztetőként néhány gondolat a jQuery-ről:
>
> ### A jQuery
> 
> A [jQuery](http://jquery.com) egy "svájcibicska-szerű" JavaScript library. Jelentősége napjainkban az alkalmazásfejlesztő keretrendszerek javára egyre csökken, viszont az alapkoncepciók megértésére továbbra is hasznos eszköz. Elsősorban kiegészítésképpen használják különféle dinamikusan generált HTML tartalmakhoz történő dinamizmus hozzárendelésével, nem pedig teljes, önálló, kliensoldali alkalmazás fejlesztésére (de utóbbira is használható).
> 
> A [jQuery API](http://api.jquery.com/) a `$` (és ritkábban a `jQuery`) globális változón keresztül érhető el, alapvetően az alábbi módokon:
> - `const elements = $('ul li.active')`: a megadott CSS selectornak megfelelő DOM elemeket választja ki, és visszaadja egy *jQuery objektumban*. A bármilyen módon szerzett jQuery objektum hivatkozásokon az alábbihoz hasonló lehetőségeink vannak:
>   - A jQuery objektum példányai egyben tömbök, amik tartalmazzák a megtalált natív DOM elemeket (tehát iterálhatunk rajta), ill. a jQuery példányfüggvényeit tartalmazzák, amelyek elérik az illesztett DOM elemeket.
> ---
>   - `.show()`, `.hide()`, `.toggle()`: az illesztett elemeket megjeleníti vagy elrejti azáltal, hogy az elemre inline `display: none` stílust helyezi,
>   - `.append(e)`, `.appendTo(e)`, `.before(e)`, `.after(e)`, az elemhez/elé/után szúr be újabb elemeket (jQuery szelektorral elért elemeket, DOM elemeket vagy HTML tartalmat),
>   - `.attr()`: gyakori, hogy egy függvény getter-setterként működik, ilyen az attr is. Ha egy paramétert adunk át, az adott attribútum értékét kapjuk vissza, ha kettőt, a második paraméter az első néven adott attribútum értéke lesz (minden illesztett elemre).
>   - `.on()`: eseménykezelő feliratkoztatása az adott névvel. Két paraméter esetén ha a második paraméter a callback, úgy az hívódik meg az adott elemen; ha a callback előtt egy szelektort is megadunk, az "élő" feliratkozás lesz az illesztett elemen belüli leszármazott gyerekekre. Párja az `.off()`, amellyel eseménykezelőt iratkoztathatunk le, ezáltal elkerülve az esetleges memóriaszivárgást.
>     - `.click()`, `.submit()` stb.: az adott JavaScript események elsütése (paraméter nélkül) vagy feliratkozás az eseményre (callback megadásával) az illesztett elemeken. Elavult, ehelyett a fentebb leírt `.on()`-t használjuk feliratkozásra, a `.trigger()`-t pedig elsütésre.
>   - `.data(name)`: a DOM elem data-{name} attribútumában szereplő érték beállítására és lekérdezésére használhatjuk. A lekérdezés gyakorlatilag ekvivalens azzal, mintha az alábbit használnánk: `.attr("data-name").val()`. Emlékeztetőként, a CSS-ben attribútum alapján lekérdezni elemet az alábbi módon tudunk: `$("elem[data-my-value='value']")`. A `data-` attribútumok tetszőleges kulcs-érték párok tárolására szolgálnak a DOM-ban.
>   - Nagyon gyakori, hogy az egyes elemeken végzett műveleteket láncoljuk az alábbihoz hasonló módon: `$(".button").before(spinner).attr("disabled", true)`.
> - `$(function () { /*...*/ })`: az így megadott függvény a dokumentum betöltődését követően fut le. Ekvivalens a `$(document).ready(function () { /*...*/} )` hívással.
> - `$.ajax()`, `$.get()`, `$.post()` stb.: a globális jQuery objektumon elérhető statikus függvények függetlenek az egyes DOM elemektől, ezek pl. aszinkron AJAX kérések végrehajtására használhatók.
> 
> ### jQuery pluginek
> 
> A jQuery kiegészítéseképpen egyszerűbb és bonyolultabb plugineket használhatunk. Ezek a pluginek jellemzően a jQuery objektumra újabb függvényeket helyeznek el, amelyek segítségével a kiegészítő funkcionalitás elérhető. A Boostrap kétféle módon teszi elérhetővé a plugineket: data-attibútumok formájában és a jQuery API-n keresztül. A fontosabbak pl.: `.modal()` `.dropdown()`, `.tooltip()`, `.alert()`, `.collapse()`. [Bővebben a Bootstrap jQuery pluginekről itt olvashat.](https://getbootstrap.com/docs/4.5/getting-started/introduction/#components)
> 
> Gyakran használt pluginokat ad még pl. a [jQuery UI](https://jqueryui.com/), amiben dátum- és időválasztó, dialógusablak, progressbar stb. "widgetek" találhatók.

### Előkészítés

- Töltsük le és tömörítsük ki a kiinduló projektet az alábbi [linkről](./downloads/labor12-start.zip) egy üres munkamappába!

A laboron készülő alkalmazás egy egyszerű kvízjáték, amely az [Open Trivia Database](https://opentdb.com/) publikus, ingyenesen elérhető [API-ját](https://opentdb.com/api_config.php) használja. A játék menete az alábbi lesz:
- A játék opcióinak megadása a Let's play! gombra kattintva lehetséges.
- Az opcióknál megadható a kérdések száma (1 és 50 között), a kérdés kategóriája és nehézsége. Ezt követően a játék a Go! feliratú gombra kattintva indítható.
- A játék során a távoli API-tól lekérdezett kérdések fognak következni.
- Az aktuális kérdés sorszáma és az összes kérdés száma látható a kérdés oldalán, a kérdés kategóriája, a kérdés szövege, valamint a 4 válaszlehetőség, amelyek közül mindig pontosan egy lesz helyes.
- A 4 válaszlehetőség egyikére kattintva visszajelzés érkezik a válasz helyességéről. Ha a válasz helytelen volt, a helyes választ is jelzi az alkalmazás.
- A kérdések végére érve az alkalmazás jelzi, hány pontot értünk el a maximumból, majd új játék indítására van lehetőség.

Az alkalmazás futtatásához adjuk ki a Terminalban (Ctrl+ö) az alábbi parancsot: `http-server` (ügyeljünk arra, hogy a helyes útvonalon adjuk ki a parancsot, ahová a kiinduló projektet csomagoltuk ki), vagy használjuk a VS Code Live Servert a megszokott módon (Go Live lehetőség a jobb alsó sarokban az `index.html` megnyitása után, vagy F1 > "Live Server: Open with Live Server")! 

Említésre méltó még, hogy TypeScript támogatással a JavaScript kódunkban IntelliSense-t fogunk kapni (Visual Studio Code vagy Visual Studio használatával) a jQuery könyvtárhoz is!

Az alkalmazás kiinduló kódját megvizsgálva az alábbi fájlokat találjuk:
- index.html: a kiinduló HTML. A fájlt a feladatok megoldásához nem szükséges módosítani. Ha a fájlban módosít, dokumentálja a módosítását!
- node_modules mappa: az npm csomagkezelővel letöltött jQuery típusdefiníciós fájlok JavaScript (TypeScript) IntelliSense támogatáshoz találhatók itt.
- triviaut.js: egy üres JavaScript fájl, amely az index.html `<head>` részében került hivatkozásra. Az alkalmazás forráskódját ebbe a fájlba szükséges helyezni.
- start-game-form-contents.html: egy részleges HTML fájl, amelyben a játék indításához szükséges opciók leírása található.
- opentriviadb-logo.png: értelemszerűen a fentebb hivatkozott API logója.

Vizsgáljuk meg az index.html tartalmát!

A fájlban látható, hogy be vannak hivatkozva az alábbiak:
- a saját JavaScript fájlunk, a `triviaut.js`,
- a Bootstrap CSS és JavaScript fájljai,
- a FontAwesome ikonkészlet CSS fájlja,
- a jQuery osztálykönyvtár JS fájlja.

Fontos, hogy a JavaScript fájl betöltődésekor az _addig a pontig_ elkészült DOM-on képes manipulációt végezni.

Ezen kívül láthatjuk, hogy a HTML fájlunkban egy `<header>` és egy `<main>` elem található. A `<header>` tartalma számunkra statikus. A `<main>`-ben három db `<section>` elemet láthatunk az alábbi ID-kkal ellátva: 
- `lets-play-section`: a játék indítására (az opciók megjelenítésére) szánt gomb, 
- `start-game-form-section`: a játék opcióit tartalmazó `<form>`, amely a `Loading...` szöveget tartalmazza - egyelőre el van rejtve a `style` attribútum `display: none` értéke alapján,
- `game-section`: maga a játéktér, ahol a kérdések találhatók, szintén elrejtve található a DOM-ban.

Próbáljuk ki a jQuery könyvtárat az alábbi módon: a szerver indítását követően navigáljunk a böngészőben az oldalra! Az F12 eszköztáron nyissuk meg a Console-t, és futtassuk az alábbi parancsokat egyesével, sorrendben (közben figyeljük, mi történik a felületen):

``` JavaScript
$("#lets-play-section").hide();
$("#start-game-form-section").show();
$("#start-game-form-section, #game-section").toggle();
```

Láthatjuk, hogy a `.hide()`, `.show()` és `.toggle()` függvények értelemszerűen a CSS selector által illesztett *összes* DOM elem display: none CSS tulajdonságát teszik fel a DOM elemre, vagy veszik azt le róla.

Teszteljük a távoli API-t! A `triviaut.js` fájlba írjuk az alábbi kódot:

``` JavaScript
$.get("https://opentdb.com/api.php?amount=10").then(function (q) {
    console.log(q);
    $("body").text(JSON.stringify(q, '\n'));
});
```

Ha mindent jól csináltunk, az alábbi (vagy nagyon hasonló) hibát látjuk a konzolon az oldal betöltődését követően:

```
Uncaught ReferenceError: $ is not defined
```

A JavaScript fájlok betöltési sorrendje kiemelten fontos! A betöltődés sorrendje implikálja a függőségi sorrendet is, ugyanis végrehajtásuk a böngészőben alapértelmezetten az importálás sorrendjével megegyezik. Ha a saját fájlunkat előbb hivatkozzuk, mint a jQuery-t, úgy az ott futó kód `$` változóra történő (szinkron) hivatkozása hibát dob (mert ekkor még nem futott le a jQuery `$` objektumot definiáló kód). 

A megoldás, hogy át kell mozgatnunk a saját JS fájlunk hivatkozását a HTML `<head>` elemben a jQuery hivatkozás után (érdemes minden külső függőség hivatkozása utánra, tehát a `<head>` végére tenni).

A `$.get` statikus függvény a `$.ajax` hívás rövidítése, ahol a HTTP ige fixen a HTTP GET. Visszatérése egy Promise objektum, melyre a `.then` hívással iratkozunk fel, ami 3 callback paramétert vár (mindhárom opcionális): a sikeres teljesülést, a hibaágat, és mindet.

A fenti hívás tehát behív a megadott URL-re, a kapott választ a konzolon megjeleníti, majd a `<body>` elem tartalmát szövegesen lecseréli a kapott tartalmat string formára konvertálva (a válasz ugyanis egy JSON objektum).

Az alábbi formátumú válasz érkezik a távoli API-tól:
``` JSON
{
    "response_code": 0,
    "results": [
        { 
            "category": "Entertainment: Film",
            "type": "multiple",
            "difficulty": "hard",
            "question": "In the 1976 film 'Taxi Driver', how many guns did Travis buy from the salesman?",
            "correct_answer": "4",
            "incorrect_answers": [ "2" , "6" , "1" ]
        },
        ...]
}
```

Indítsuk el a játékot! A triviaut.js fájl tartalmát cseréljük le az alábbira:

``` JS
$("#lets-play-button").on("click", function (e) {
    $(e.target).toggle();
    $("#start-game-form").toggle();
});
```

A fenti kódrészlettel elvileg a gombra kattintva elrejtjük a gombot és megjelenítjük a játék opciós űrlapját. A kód viszont nem működik. Ha utánajárunk, úgy tűnik, hogy nem történik feliratkozás. Futtassuk le előtte az alábbi kódot is (a JS fájl elején):

``` JS
console.log($("#lets-play-button").length);
```

A konzolon a 0 érték jelenik meg, tehát ilyen nincsen a DOM-ban. A probléma, hogy a JS fájlunk korábban fut, mint a DOM betöltődne! Fontos tehát megvárnunk, amíg ez megtörténik. A klasszikus módja ennek az alábbi megadás:

``` JS
$(document).ready(function () {
    // itt már elkészült a DOM!
})
```

A fenti tehát kiválasztja a document elemet a DOM-ból, tehát a teljes DOM gyökerét, aminek feliratkozik a `ready` pszeudo-eseményére (ilyen konkrét DOM esemény ugyanis nincsen). A fentivel ekvivalens megadás az alábbi:

``` JS
$(() => {
    // itt már elkészült a DOM!
});
```

A fenti szintaxisban a `() => {}` kódrészlet szintén egy függvény deklarációja, melynek neve *arrow function*. Az arrow function szintaxis tömörebb, szintén paraméterezhető (`a => a + 10` vagy `(a, b) => { return a * b + 2; }`). További érdekessége, hogy a `function` kulcsszóval megadott függvényekkel ellentétben nem változtatja meg a `this` változó által reprezentált függvényt (objektumot) sem.

A kezdeti működésünket tehát elérhetjük az alábbi módon:

``` JS
$(() => {
    $("#lets-play-button").on("click", () => {
        $("#lets-play-section, #start-game-form-section").toggle();
    });
});
```

Tehát a gombot tartalmazó és a játék opciókat tartalmazó szekciókat megjelenítjük/elrejtjük.

Egészítsük ki továbbá a fenti kódot (a megfelelő helyen) azzal, hogy a formot reprezentáló HTML részletet letöltjük a szervertől és a megfelelő helyre szúrjuk a DOM-ban:

``` JS
$.get("start-game-form-contents.html")
  .then(html => $("#start-game-form").html(html));
```

---

### ![rep] Feladat 1 (2 pont)
    
Másoljon be egy teljes képernyős képernyőképet az opciók kezdeti állapotáról, ahol el van rejtve az indításra szolgáló gomb!

---

### Szerveroldali API használata

Töltsük le a paramétereknek megfelelő elemeket a távoli API-ról! Ehhez szintén a `$.get` függvényt tudjuk használni:

```JS
// a globális névtérben deklaráljuk az alábbi változókat és függvényt:
let remainingQuestions, totalQuestions, currentQuestion, correctAnswerIndex;
function getNextQuestion() { }

//...
$.get("start-game-form-contents.html").then(html => $("#start-game-form").html(html)
.on("submit", e => { // közvetlenül a HTML beszúrása után lácolhatjuk a 'submit' eseményre történő feliratkozást
    e.preventDefault(); // a böngésző alapértelmezett működését megállítjuk, amivel újratöltené az oldalt
    $("#start-game-form button[type='submit']").attr("disabled", true); // a Go! gombot letiltjuk, hogy ne lehessen újra API kérést indítani, amíg meg nem érkezett a válasz
    $.get("https://opentdb.com/api.php?type=multiple&encode=base64&amount=" + $("[name='trivia_amount']").val()).then(data => {
        remainingQuestions = data.results;
        console.log(remainingQuestions);
        currentQuestion = 0;
        totalQuestions = remainingQuestions.length;
        $("#total-questions").text(totalQuestions);
        $("#start-game-form button[type='submit']").removeAttr("disabled");
        getNextQuestion();
    });
}));
```

---

### ![rep] Feladat 2 (0.5 pont)

Készítsen képernyőképet a konzolon látható érkezett válaszokról! Legyen látható, hogy hány válasz érkezett, és ez a szám ne az alapértelmezett 10 legyen!

---

### ![rep] Feladat 3 (0.5 pont)

Készítse el a maradék két paraméter elküldését is a `difficulty` és `category` releváns értékeinek megadásával! Használhatja a [$().serializeArray()](http://api.jquery.com/serializeArray/) függvényt is!

Az elkészült kódról és az érkező válaszról a konzolon készítsen képernyőképet!

---

### A játék menete

A megérkezett válasz kezeléséhez a megfelelő mezőket ki kell töltenünk a HTML dokumentumban.

A `getNextQuestion()` függvény kódjának kezdeménye az alábbi lehet:
``` JS
currentQuestion++;
const question = remainingQuestions.pop();
if (question === undefined) {
    // TODO: nincs több kérdés!
    return;
}
correctAnswerIndex = Math.floor(Math.random() * 4);
const answers = question.incorrect_answers.slice();
answers.splice(correctAnswerIndex, 0, question.correct_answer);
$(".answer .correct, .answer .incorrect, #next-question").hide();
```

A függvény további részét az alábbi módon implementálja:
- rejtse el az opciós űrlapot,
- jelenítse meg a játékteret,
- töltse ki a jelenlegi játék számlálóját,
- töltse ki a kérdés kategóriáját (`atob(question.category)`),
- töltse ki a kérdés szövegét (szintén használja az `atob()` függvényt a base64 szöveg dekódolásához),
- vegye le az összes válaszlehetőségről (`.answer`) a `disabled` attribútumot (tipp: [$().removeAttr()](https://api.jquery.com/removeAttr/)),
- minden válaszlehetőség szövegének helyőrzőjében helyezze el a válasz szövegét (ügyeljen rá, hogy ne törölje ki a helyes/helytelen ikonokat, és itt is használja az `atob()` konverziót)!

---

### ![rep] Feladat 4 (1 pont)

Készítsen képernyőképet az implementáció kódjáról!

Készítsen képernyőképet a játéktéren megjelenő kérdésről, válaszlehetőségekről!

---

A tanultak gyakorlásaképp készítse el az alábbi funkciókat:
- A válaszlehetőségre kattintva a rendszer a válasz mellett található pipa ikonnal jelzi, hogy helyes válasz érkezett, vagy x-szel, ha helytelen. Utóbbi esetben a helyes válasz mellett egy pipa is megjelenik.
  - A feliratkozáshoz használja az `$(".answer").on("click", e => { /* */ })` kezelőt!
- A helyes válaszok számát tartsa nyilván!
- Jelenítse meg a továbblépéshez használt gombot, ha a felhasználó választ adott! Arra kattintva jelenjen meg a következő kérdés!
- A játék befejeztével, amikor elfogynak az aktuális kérdések, jelenítse meg, hány pontot ért el a felhasználó a maximumból!
- A játék befejeztével lehessen újratöltés (F5) nélkül új játékot indítani! Hozhat létre új gombot, vagy átírhatja a következő kérdésre szolgáló gomb szövegét (ekkor viszont ügyeljen rá, hogy ezt követően ne felejtse visszaállítani azt)! A legfelhasználóbarátabb élményért használhatja a Bootstrap modal megoldást is!

---

### ![rep] Feladat 5 (1 pont)

Képernyőképekkel és a releváns kódrészletekkel demonstrálja az alábbi eseteket:
- a játékos helyesen válaszolt a kérdésre,
- a játékos helytelenül válaszolt a kérdésre,
- a válaszadás előtt nem, utána látható a továbblépéshez használt gomb,
- az aktuális kérdés számlálója növekszik,
- megjelenik a felhasználó által elért pontszám!

---
