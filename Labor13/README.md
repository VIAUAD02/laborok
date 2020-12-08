# Labor 13 - Haladó JavaScript

[rep]: ./assets/rep.png "Dokumentálandó"

## Bevezetés

Általános áttekintés a webes laborokról és formai követelmények a [8. labor bevezetőjében találhatók](../Labor08/README.md).

A jelenlegi laborhoz telepítve kell lennie a [.NET **SDK**](https://dotnet.microsoft.com/download/dotnet/5.0) legalább 5.0-s verziójának is a gépre (ez Visual Studio 2019 16.8-as verzióval is települ).

Az aktuális laborhoz tartozó jegyzőkönyv sablonja DOCX formátumban [innen](./downloads/Labor13-jegyzokonyv.docx) letölthető.

### Modern JavaScript funkciók

A JavaScript nyelv napjainkban rohamosan (talán lassan csökkenő ütemben) fejlődik, de a böngészőgyártók lassan felvették az iramot ECMAScript szabványosítási folyamattal. A manapság támogatandó böngészők legtöbbje szinte az összes ECMAScript 5 és 6 funkciót támogatja. Az Internet Explorer egy elavult, manapság kerülendő böngésző, ami támogat bizonyos ES5 funkciókat, de új funkciófrissítéseket nem kap. Kevés érv maradt a használata mellett, ugyanis a Microsoft az UWP alapú Edge böngészőről áttért a Chromium motorra épülő Edge-re, ami még Windows 7 OS-en is elérhető. Kirívó eset gyakran néhány kevésbé elterjedt mobil böngésző (pl. Opera Mini), valamint a Safari iOS és Mac verziói is hagynak némi kívánni valót maguk után (a különféle JavaScript funkciók támogatása terén). Ezzel azt mondhatjuk, hogy modern JavaScript alapú alkalmazások fejlesztésekor elegendő az ún. "örökzöld" böngészőket támogatnunk, amik naprakészen tartják magukat folyamatos frissítésekkel.

Az új nyelvi funkciók jelentős része megfeleltethető korábban alkalmazott programozási mintáknak, ezáltal az újabb funkciókat (új ECMAScript verziókban megjelenő szabványos elemeket) lefordíthatjuk szabványos korábbi ES verzióra (jellemzően ES5-re). A [**babel**](https://babeljs.io/) fordító a "modern" forrásunkat képes átfordítani erősen kompatibilis JavaScriptté. Említésre méltó még a [TypeScript](https://www.typescriptlang.org/), ami a JavaScript nyelvre épül, kibővítve azt különféle funkciókkal, elsősrban a típusinformációk rendszerével.

Fontosabb modern JS képességek:
- **arrow function**: `function (param) { return param + 1; }` helyett írhatjuk a rövidebb `param => param + 1;` kódot. Ezen felül az arrow function nem rendel külön értéket a `this` változónak, így a this ilyen esetekben a **külső** függvényre mutat (a függvényen belül ugyanaz a `this`, mint a hívó fél számára).
- **string interpolation**: a string interpoláció sablonozást, "template-ezést" jelent, a string-ben különböző helyőrzőket helyezhetünk el, amelyek kiértékelődnek: 
    ``` JS 
    `Hello, I'm ${this.getName()}!`
    ```
- **const** és **let**: a `var` "univerzális" változódeklaráció helyett érdemesebb használni a `let` és `const` kulcsszavakat: előbbi változtathat értéket, utóbbi pedig nem. Előnyük, hogy valóban blokkszintűek, a `var` képes blokkok között is érvényesülni (sajnos).
- **class**: használhatjuk az objektum-orientált class kulcsszót, amelyet korábban címkézetlen, közönséges konstruktorfüggvényekkel próbáltunk körülírni:
    ``` JS
    class Dog {
        constructor(name) {
            this.getName = () => name;
        }
        bark() {
            alert(`Hello, I'm ${this.getName()}!`);
        }
    }

    const spot = new Dog("Spot");
    spot.bark();
    ```

- **import**/**export**: fájljainkban változókat, osztályokat deklarálhatunk, melyeket kívülről használhatnak (kvázi, mint a publikus láthatóság), ezeket az **export** kulcsszóval látjuk el. A másik oldalon, ahol használni szeretnénk a fájlból egy publikált szimbólumot, az **import** kulcsszóval tehetjük ezt meg, a fájl elérési útját megadva:

    ``` JS
    dog.js:
    -------
    export class Dog { 
        bark() => console.log(`Woof! I'm ${this.name}!`)
    }

    barks.js:
    ---------
    import { Dog } from './dog';

    export function makeNewDogAndBark(name) {
        const dog = new Dog(name);
        dog.bark();
        return dog;
    }
    ```

> A [TypeScript](https://www.typescriptlang.org/) nyelv a fenti fordítási folyamatot annyival egészíti ki, hogy fordítási időben különféle vizsgálatokat végez a kódon, így a hibáink akár már fordítási időben is kiderülhetnek. Elsősorban ehhez típusvizsgálatokat és statikus kódanalízist hajt végre. A VS Code az analízist TypeScript segítségével a normál JavaScript fájlokon is elvégzi, ezért kapunk IntelliSense-t, sőt, ezért jelennek meg esetenként változók, paraméterek típusai is a segítségben.
>
> A [Webpack](https://webpack.js.org/) egy modern "modulcsomagoló". A JavaScript fájljainkat érdemes külön tartani, hogy ne többtízezer soros kódfájljaink legyenek, hanem minden a saját helyén legyen - a böngészőben sok fájlt letölteni pedig még HTTP/2-vel sem optimálisabb, mintha egy nagy fájlt töltenénk le. Webpack segítségével többek között a JS fájljainkat minifikálni tudjuk, össze tudjuk őket csomagolni kevesebb fájllá, valamint különféle plusz funkciókat tudunk pluginekkel és betöltőkkel az alkalmazásunk terjesztési folyamatába ékelni, pl. source map fájlokat, transpilereket vagy kép-optimalizálókat használni. Manapság gyakorta használt funkciója a *Hot Module Replacement (HMR)*, amely bármiféle újraindítás nélkül, amikor a forrásfájlunk módosul, értesíti a böngészőt a változásról és azonnal az új kód töltődik be (frissíteni sem szükséges a böngészőt). Gyakran a Webpacket valamilyen magasabb szintű keretrendszer részeként (pl. Angular) használjuk, előlünk el van fedve, de használhatjuk kézzel is. Hátránya, hogy a konfiguráció gyakran nagyon bonyolult, a dokumentációja pedig nem a legjobb minőségű.

### Előkészítés

A laboron készítendő alkalmazás egy **kisebb/nagyobb barkóba** lesz. A "gép" gondol egy számra, majd a felhasználó dolga kitalálni a számot. A tippre a válasz mindig "kisebb", "nagyobb" vagy "talált".

Klónozzuk le a kiinduló projektet (https://github.com/VIAUAC00/labor13-start.git) egy git klienssel vagy parancssorból! Egy üres munkamappában indítsuk el a VS Code-ot! A beépített terminálból (Ctrl+ö) adjuk ki az alábbi parancsokat:

```
git clone https://github.com/VIAUAC00/labor13-start.git
cd labor13-start
npm install
dotnet restore
dotnet watch run
```

> Az `npm install` parancs a kliens- és szerver oldai JavaScript függőségeket tölti le. Kliens oldalon használjuk a jQuery-t és Bootstrapet, szerver oldalon pedig a Webpacket és Babelt.
> 
> A `dotnet restore` parancs a szerveroldali .NET függőségeket tölti le. A `dotnet watch run` parancs elindítja a szerveralkalmazást, majd újrafordítja és újraindítja, amikor változást detektál és értesíti a kapcsolódott böngészőpéldányt, hogy változás volt, ami frissíti magát. Utóbbi funkció (hot reload) nem mindig működik hibátlanul, ezért érdemes továbbra is figyelni, hogy a változásaink érvényre jutottak-e, esetleg kézzel frissíteni az oldalt. Fontos, hogy a webpack a .NET fordítás előtt fut, ezért ha fordítási hibánk van, akkor azt a `.\node_modules\.bin\webpack` parancs kiadásával tudjuk ellenőrizni.
> 
> <i>Megj.: Mivel ez egy .NET-es projekt, akár a Visual Studio 2019-cel is megnyithattuk volna a solution-t, sőt, ez lehet a preferált, ha a szerver oldali kódot szeretnénk majd módosítani. Ha valaki kényelmesen mozog a Visual Studio-ban, használja a labor során azt nyugodtan VS Code helyett. A VS Code gyakrabban használt kliens oldali fejlesztéshez, míg a "nagy" Visual Studio kényelmesebb a szerver oldalra.</i>

Az alkalmazás indulását követően, ha új JS fájlokat hozunk létre és hivatkozzuk őket, a Webpack HMR ezeket a fájlokat automatikusan frissíti a böngészőben. Ettől függetlenül előfordulhat, hogy a kliens oldalt újra kell indítanunk, ekkor továbbra is szükséges a böngészőben frissítenünk F5-tel.

Elegendő egyetlen fájlt referálnunk a HTML-ben, ez a guessgame.js névre hallgat. Ez az összecsomagolt, kliens oldali JavaScript alkalmazásunk.

A kliens oldali kód a ClientApp mappában lesz található. **Az alkalmazás belépési pontja a ClientApp/client-start.js fájl.**

A megoldás során használjuk az objektumorientált megközelítést és a modern JS funkciókat! Igyekezzünk komponens-orientáltan gondolkodni: **egy objektum komponens, ha megjelenik a felületen a reprezentációja**, képes kommunikálni más objektumokkal és komponensekkel, ezen felül lehet állapota (mezői, tulajdonságai, amiket karban tart).

---

### ![rep] Feladat 1 (1 pont)
    
    Másoljon be egy képernyőképet az alkalmazás kezdőképernyőjéről!

---

### Modern JavaScript funkciók

Az alkalmazásunknak szüksége lesz egy "gépre", aki majd kigondolja a számot. Az egyszerűség kedvéért most ez egy 1 és 100 közötti szám lesz, az érték nem konfigurálható. Szimuláljuk, hogy a "számítás" komplex, úgyhogy kis késleltetést viszünk majd abba, amíg a választ visszakapjuk a tippünkre.

Az objektumaink, melyek a felületen is megjelennek, rendelkezni fognak egy `render()` függvénnyel, és lesz egy (az alkalmazás szempontjából) globális `render()` függvényünk, ami minden komponenst kirajzol a `render()` függvény meghívásával.

Először készítsük el az időzítőt. Az időzítő a játék indulásakor elkezdi számolni a kliensen az eltelt időt. Más elemekről nem tud, önállóan működni képes, elindulni és megállni tud, el lehet tőle kérni formázottan az eltelt időt, és ki tudja rajzolni az eltelt időt a felületre. A komponens kódja így az alábbi:

``` JS
ClientApp\timer.js:
-------------------

export class Timer {
    start() {
        this.started = Date.now();
        this.interval = setInterval(() => this.render(), 150);
    }

    stop() {
        this.stopped = Date.now();
        clearInterval(this.interval);
    }

    clear() {
        this.started = this.stopped = undefined;
    }

    getElapsedTime() {
        return this.started ? Math.floor(((this.stopped ? this.stopped : Date.now()) - this.started) / 1000) : "-";
    }

    render() {
        document.getElementById("timer").innerText = this.getElapsedTime();
    }
}

```

Az időzítőt önmagában tesztelhetjük, ehhez példányosítjuk, elindítjuk, majd leállítjuk:

``` JS

ClientApp\client-start.js:
--------------------------

import { Timer } from './timer';

$(() => {
    const timer = new Timer();
    timer.start();
    setTimeout(() => timer.stop(), 3000);
});

```

Az időzítő persze önmagában nem egy hasznos funkció a játékban, viszont maga a játék, mint komponens egy eleme. A játékos is ilyen elem, róla csak a nevét kell tudnunk, viszont ez idővel fog csak ismertté válni számunkra, tehát egy Promise objektummal tudjuk reprezentálni.

``` JS

ClientApp\player.js:
--------------------

export class Player {
    constructor() {
        this.onNameSet = new Promise((resolve, reject) => {
            $('#start-form').on('submit', e => {
                e.preventDefault();
                const name = $('#name-input').val();
                if (name && name.length) {
                    resolve(name);
                }
                else {
                    reject();
                }
            });
        });

        this.onNameSet.then(name => {
            this.name = name;
            this.render();
        });
    }

    render() {
        const elements = $('#name-input, #start-button')
        if (this.name && this.name.length) {
            elements.attr('disabled', 'disabled');
        } else {
            elements.removeAttr('disabled');
        }
    }
}

```

A Promise beteljesedik, amikor a `#start-form` űrlapot elküldik, és a `#name-input` értéke nem üres. Erre a Promise-re a játékos maga is feliratkozik, és sikeres beteljesedés esetén a `name` property-t beállítja magának. A `render()`-ben megvizsgálja, hogy van-e név, és ha van, a `disabled` attribútumokat megfelelően beállítja.

Láthatjuk, hogy mindenki saját magát rendereli ki, amikor állapotváltozást észlel.

Az egész összekötésére hozzuk létre a Game-et, ami magát a játékot reprezentálja. A Game már biztonsan ismer egy időzítőt és egy játékost. A játékos nevének változására iratkozzunk fel, ez fogja elindítani a játékot magát. A kezdeti állapotot is ki tudja renderelni. Egy `components` property-ben fogjuk gyűjteni az egyes komponenseinket, és azoknak meg tudjuk hívni mindnek a `render` függvényét (amennyiben a komponensnek van `render` függvénye):

``` JS

ClientApp\game.js:
------------------

import { Player } from './player';
import { Timer } from './timer';

export class Game {
    constructor() {
        this.timer = new Timer();
        this.player = new Player();

        this.player.onNameSet.then(() => this.start());

        this.components = [this.timer, this.player];

        this.render();
    }

    render() {
        this.components.map(c => c && typeof(c.render) === 'function' && c.render());
    }

    start() {
        this.timer.start();
    }

    onGuessed(num, guess) {

    }

    onGuessing(num) {

    }
}

```

A játékot a dokumentum betöltésekor példányosítjuk. Az onGuessed függvényt kívülről tudják majd meghívni, jelezvén, hogy egy tipp kisebb vagy nagyobb volt a "gondolt" számnál, esetleg talált. Az onGuessing függvénnyel egy tippet tudnak majd a játéknak küldeni. A `client-start.js` tartalmát **cseréljük le** az alábbira:

``` JS

ClientApp\client-start.js:
--------------------------

import { Game } from './game';

$(() => {
    const game = new Game();
});

```

---

### ![rep] Feladat 2 (1 pont)
    
    Másoljon be egy képernyőképet, ahol megadja a nevét, és ennek hatására az időzítő elindult, a név bekérésére szolgáló input, valamint az indításra szolgáló gomb pedig le vannak tiltva.

---

### Játéklogika

A játéklogikát egy random generátor által adott 1 és 100 közötti egész szám, és a tippelésre adott kisebb/nagyobb válasz interfésze adja. Írjuk meg a játéklogikát a kliens oldalon!

``` JS

ClientApp\logic.js:
-------------------

export class Logic {
    constructor(game) { this.game = game; }

    startGame() {
        const secretNumber = Math.floor(((Math.random() * 100) + 1));
        this.secretGuess = (num) => secretNumber < num ? 'less' : secretNumber > num ? 'greater' : 'correct';
    }

    guess(num) {
        if (this.secretGuess && typeof (this.secretGuess) === 'function') {
            setTimeout(() => this.game.onGuessed(num, this.secretGuess(num)), 400);
        }
    }
}

```

A titkos számot a lokálisan, a `startGame` függvényben tárolt `secretNumber` változóban tároljuk. Ez a változó kívülről nem látható, az egyetlen függvény, aki ismeri ezt az értéket, a `secretGuess`. A `guess` "publikus" függvényt meghívva a logika értesíti a játékot a tipp helyességéről az `onGuessed` függvényen keresztül. A válasz késleltetve érkezik, a késleltetés 400ms.

A játéknak szüksége lesz valamilyen mechanizmusra, hogy meg tudja jeleníteni a helyes/helytelen tippeket. Ezt egy Guesses osztály példányában fogjuk tárolni, ami a felületen megjelenő, tippeket tartalmazó táblázatot fogja frissíteni szükség esetén.

``` JS

ClientApp\guesses.js:
---------------------

export class Guesses {
    constructor() {
        this.clear();
    }

    addGuess(num, value) {
        if (num && value) {
            this.guesses.push({ num, value });
            this.render();
        }
    }

    clear() {
        this.guesses = [];
        this.render();
    }

    render() {
        $('#guesses tbody tr').remove();
        $('#guesses tbody').append(this.guesses.map((g, i) => $(
            `<tr>
                <td>${i + 1}</td>
                <td class='text-right'>${g.num}</td>
                <td class='bg-${g.value === 'correct' ? 'success' : 'danger'}'>${g.value === 'correct' ? '!!!' : g.value === 'less' ? '&gt;' : '&lt;'}</td>
            </tr>`
        )).reverse());
    }
}

```

Már csak a felületről érkező tippet kell kezelnünk, ehhez egy Guess osztályt hozunk létre:

``` JS

ClientApp\guess.js

export class Guess {
    constructor(game) {
        $('#guess-form').on('submit', e => {
            e.preventDefault();
            const value = parseInt($('#guess-input').val());
            if (!isNaN(value) && value > 0 && value <= 100)
                game.onGuessing(value);
            $('#guess-form')[0].reset();
        });
        $('#guess-form')[0].reset();
        this.setEnabled(false);
    }

    setEnabled(value) {
        this.enabled = !!value;
        this.render();
    }

    render() {
        const elements = $('#guess-input, #guess-button')
        if (!this.enabled) {
            elements.attr('disabled', 'disabled');
        } else {
            elements.removeAttr('disabled');
            $('#guess-input').focus();
        }
    }
}

```

Össze kell kötnünk a játékot a logikával, ill. a korábbi tippek tárolásáért felelős objektummal, valamint kezelnünk kell a felületről, a felhasználó részéről érkező tippet. Frissítsük a `game.js` tartalmát az alábbira:

``` JS

ClientApp\game.js:
------------------

import { Player } from './player';
import { Timer } from './timer';
import { Logic } from './logic';
import { Guesses } from './guesses';
import { Guess } from './guess';

export class Game {
    constructor() {
        this.timer = new Timer();
        this.player = new Player();
        this.logic = new Logic(this);
        this.guesses = new Guesses();
        this.guess = new Guess(this);

        this.player.onNameSet.then(() => this.start());

        this.components = [this.timer, this.player, this.logic, this.guesses, this.guess];

        this.render();
    }

    render() {
        this.components.map(c => c && typeof (c.render) === 'function' && c.render());
    }

    start() {
        this.timer.start();
        this.guess.setEnabled(true);
        this.logic.startGame();
    }

    onGuessed(num, guess) {
        this.guesses.addGuess(num, guess);
        if (guess === 'correct') {
            this.guess.setEnabled(false);
            this.timer.stop();
        }
    }

    onGuessing(num) {
        this.logic.guess(num);
    }
}

```

---

### ![rep] Feladat 3 (1 pont)
    
    Másoljon be egy képernyőképet egy játék végeredményéről, ahol láthatók a leadott tippek és az eltelt idő!

---

<hr/>

## **Önálló feladatok**

### Toplista

A toplistán kizárólag a legjobb 10 eredménnyel rendelkező egyén jelenik meg. A toplista először a tippek száma, majd a megtett idő alapján csökkenő sorrend szerint rendezett.

A toplista perzisztens, tehát a játék indulásakor a toplista `localStorage`-ből betöltődik, az új bejegyzések pedig ide perzisztálódnak. Ehhez a `localStorage` globális objektum `getItem(key)` és `setItem(key, value)` metódusai használhatók, a rendezéshez a tömb `sort(callback)` függvénye használható, a callback két elemet kap, amelyekhez egy összehasonlítást kell megadnunk, ami egy számértékkel tér vissza (a kisebb számértékű elem előrébb lesz a listában).

``` JS 

ClientApp\toplist.js:
---------------------

export class Toplist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('toplist') || '[]');
        this.render();
    }

    setItem(name, guesses, time) {
        this.items.push({ name, guesses, time });
        this.items = this.items.sort((a, b) => a.guesses + a.time / 1000 - (b.guesses + b.time / 1000)).slice(0, 9);
        localStorage.setItem('toplist', JSON.stringify(this.items));
        this.render();
    }

    render() {
        $('#toplist tbody tr').remove();
        $('#toplist tbody').append(this.items.map((e, i) => $(
            `<tr>
                <th>${i + 1}</th>
                <td>${e.name}</td>
                <td>${e.guesses}</td>
                <td>${e.time}</td>
            </tr>`
        )));
    }
}

```

A toplistát a játékhoz kell kötnünk, és a `setItem` metódust meghívni, amikor a játéknak vége.

``` JS

ClientApp\game.js:
------------------

/* ... */
import { Toplist } from './toplist';

export class Game {
    constructor() {
        /* ... */
        this.toplist = new Toplist();
        /* ... */
        this.components = [this.timer, this.player, this.logic, this.guesses, this.guess, this.toplist];
        /* ... */
    }

    /* ... */

    onGuessed(num, guess) {
        /* ... */
        if (guess === 'correct') {
            /* ... */
            this.toplist.setItem(this.player.name, this.guesses.guesses.length, this.timer.getElapsedTime());
        }
    }

    /* ... */
}

```

---

### ![rep] Feladat 4 (1 pont)
    
    Másoljon be egy képernyőképet, amelyen legalább 3 különböző eredmény látható!

---

### Újrakezdés

A fenti gondolatmenetekhez hasonlóan készítse el a játék újrakezdését implementáló logikát! Az újrakezdés az alábbiakat jelenti:
- a játék befejezését követően megjelenik a felületen egy *Restart* címkéjű gomb, melyet megnyomva új játék indul (ezt követően ismét eltűnik),
- a felhasználó nevét bekérő űrlap újból engedélyezve lesz, a fókusz ide helyeződik, a felhasználónak lehetősége van átírni a nevét és új játékot indítani,
- a jobb oldali táblázatban látható korábbi tippek ürülnek.

---

### ![rep] Feladat 5 (1 pont)
    
    - Illessze be a forráskódot az újrakezdést megvalósító komponenshez, illetve az összes érintett komponenshez!

    - Illesszen be képernyőképet a felületen dinamikusan elhelyezett gombról!

---

### iMSc feladat (2 pont)

A kliens oldalon tárolt logikát helyezze át a szerver oldalra!

A szerveren fut egy WebSocket kiszolgáló, mely bármilyen `ws://localhost:port`-on futó kérésre válaszol.

A szerverkapcsolatot az alábbi osztály reprezentálja (a portszámot szükséges lehet átírnia a saját szerver portszámára):

``` JS

ClientApp\socketserver.js:
--------------------------

export class SocketServer {
    constructor() {
        this.socket = new WebSocket('ws://localhost:1118/ws');
        this.open = false;
        this.socket.onopen = () => {
            this.open = true;
            this.socket.onmessage = e => {
                this.onRecieve(JSON.parse(e.data));
            }
        };
    }

    send(action, name, guess) {
        if (this.open) {
            const json = JSON.stringify({ action, name, guess });
            console.log(`Sending message: ${json}`)
            this.socket.send(json);
        }
    }

    onRecieve(data) {
        console.log(data);
    }
}

```

A szervert az alábbi kód mintájára tudja használni:

``` JS

const server = new SocketServer();

setTimeout(() => {
    server.send("setName", "John Doe");

    server.send("startGame", "John Doe");

    let guess = 0;

    setInterval(() => server.send("guess", "John Doe", ++guess), 500);
}, 2000);

```

A szerver az alábbi kérésekre figyel:
- `startGame`: játék indítása.
- `setName`: név beállítása az aktuális játékoshoz. Szükséges a "name" paraméter megadása is.
- `guess`: tipp küldése. Szükséges a guess paraméter megadása is.
- `toplist`: toplista lekérése.

A szerver az alábbiakat küldi:
- a toplistát az alábbi JSON-formátumban küldi a szerver:` { name, guesses, timeInSeconds }`,
- egy tippre a szerver az összes klienst értesíti, az alábbi objektumot küldve: `{ name, guess, value, timeInSeconds }`.

Valósítsa meg az alábbiakat:
- a szerver tárolja a játék állapotot, nem a kliens,
- a szerver értesülésére a kliensek fel vannak iratkozva, és megosztják az állapotot (több böngésző ablakkal tudja demonstrálni),
- a szerver tárolja a toplistát,
- a szerver küld válaszeseményeket a tippelésre, minden feliratkozót értesít.

---

### ![rep] iMSc feladat (2 pont)
    
    Másolja be a releváns kódrészleteket és rövid magyarázattal támassza alá megoldását!

---
