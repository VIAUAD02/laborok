# Labor 11 - JavaScript alapok

## Bevezetés

A laboron egy egyszerű "offline" To-Do alkalmazást készítünk. Az első feladatokat, ahol a kódvázat és legfontosabb funkciókat valósítjuk meg, laborvezetői segítséggel, majd további funkciókat önállóan kell elvégezni, a JavaScript tudás elsajátítás érdekében.

??? note "A JavaScriptről dióhéjban"
    A korábban megismert HTML és CSS adják a weboldalunk vázát, alapműködését és kinézetét, viszont a korai dokumentum-alapú weboldalaktól áttértünk a dinamikus weboldalakra, melyek futás időben módosítják az aktuális dokumentumot (a DOM-ot), így interakciót kezelhetünk, és a weboldalunkra (a kliens oldalra) önálló alkalmazásként tekintünk.

    Az alkalmazásainkhoz dinamizmust (időbeni változást) szkripteléssel rendelünk, erre JavaScriptet használunk. A JavaScript egy dinamikusan típusos, interpretált szkriptnyelv, a hozzá tartozó futtatókörnyezetek végrehajtó egységei pedig alapvetően egyszálúak, így nincsen kölcsönös kizárási problémánk.

    Érdemes továbbá megemlíteni a felhasználandó típusokat (`function`, `object`, `string`, `number`, `undefined`, `boolean`, `symbol`), az ezek közötti szabad konverziót és a JavaScript eseményhurkot (**event loop**). Az event loop a JavaScriptet folyamatosan befejeződésig futtatja (**"Run-to-completion"**), amíg a futás be nem fejeződik, majd aszinkron eseményre vár. Az események bekövetkeztével az eseményhez regisztrált eseménykezelők lefutnak. Az események lehetnek:

    * felhasználói interakció,
    * időzítés,
    * IO műveletek eredménye (pl. AJAX, Websocket).

    A fontosabb kulcsgondolatok tehát röviden:

    * interpretált futtatás,
    * DOM dinamikus manipulációja,
    * dinamikus típusosság és típuskonverzió,
    * egyszálúság, event loop és aszinkronitás.

    Említésre méltó még, hogy a JavaScript (klasszikus értelemben véve) nem objektum-orientált, az osztályok koncepciója a nyelvben később jelent meg; a nyelv a **prototipikus öröklés** módszerét alkalmazza az objektumorientált megközelítéshez. Ezen kívül különös sajátosságai vannak, a `this` kulcsszó pl. nem az aktuális *objektumra*, hanem az aktuális *függvényre* mutat (kivétel az *arrow syntax*, ami a `this`-t az eredeti értéken hagyja).

    Az Internet Explorer elhíresült arról, hogy a fejlesztés rá jelentősen nehézkesebb, mint bármely alternatívára. Ma már a Microsoft is hivatalosan is az új, Chromium alapú Edge böngészőt támogatja, amely - a már nem is támogatott - Windows 7 OS-en is működik, így új weboldalakat Internet Explorer támogatással már nem kell készítenünk.

### Git repository létrehozása és letöltése

A feladatok megoldása során ne felejtsd el követni a feladat beadás folyamatát [Github](../../tudnivalok/github/GitHub.md).

1. Moodle-ben keresd meg a laborhoz tartozó meghívó URL-jét és annak segítségével hozd létre a saját repository-dat.
2. Várd meg, míg elkészül a repository, majd checkout-old ki.
    * Egyetemi laborokban, ha a checkout során nem kér a rendszer felhasználónevet és jelszót, és nem sikerül a checkout, akkor valószínűleg a gépen korábban megjegyzett felhasználónévvel próbálkozott a rendszer. Először töröld ki a mentett belépési adatokat (lásd [itt](../../tudnivalok/github/GitHub-credentials.md)), és próbáld újra.
3. Hozz létre egy új ágat `megoldas` néven, és ezen az ágon dolgozz.
4. A neptun.txt fájlba írd bele a Neptun kódodat. A fájlban semmi más ne szerepeljen, csak egyetlen sorban a Neptun kód 6 karaktere.


## 1. Feladat - Eseménykezelés

Az alkalmazás alapjaként egy egyszerű HTML oldal szolgál, amihez a saját JavaScriptünket írjuk.

A JS kódot HTML-ben is elhelyezhetnénk, viszont az nem karbantartható és alapvetően nem best practice, úgyhogy a saját `todo.js` fájlba fogjuk tenni a kódot, amit behivatkozunk. A stílusozást Bootstrappel oldjuk meg.

* Nyissuk meg a Visual Studio Code-dal leklónozott repository `feladat` mappáját *(File --> Open Folder)* és indítsuk el az alkalmazást a Live Serverrel *(`index.html` --> jobb klikk --> Open with Live Server)*
* Ellenőrizzük, hogy megfelelően betöltődik-e az alkalmazás!

<figure markdown>
  ![Kiinduló állapot](./assets/todo-start.png)
  <figcaption>Kiinduló állapot</figcaption>
</figure>

!!! warning cache
    A böngésző különböző körülmények függvényében **cache-elheti a fájljainkat**, ezért a frissítést ilyenkor kézzel kell megoldanunk. Ne felejtsük el menteni a fájlt, ezután a böngészőben állítsuk be az F12 Developer Tools-ban a Network fülön az "Always refresh from server" / "Disable cache" elnevezésű beállítást!


Láthatjuk, hogy a statikus oldal az alábbiakból tevődik össze:

* cím,
* fülek az összes, aktív, inaktív és kész elemek szűrésére,
* a to-do elemek listája, az egyes elemek mellett az értelmezett műveletek,
* új elem hozzáadása panel, melyen az új to-do bejegyzés szövegét kell megadnunk egy űrlapon.

A `<body>` végén egy `<script>` a `todo.js` fájlra hivatkozik! A szkript az oldal lényegi tartalmának betöltődése után fut le, így nem kell majd várakoznunk a dokumentum teljes betöltődésére (a gyakorlatban ez azt jelenti, hogy a szkript futásának kezdetén a DOM a HTML-nek megfelelő állapotban már létrejött). A gyakorlatban ez változó, szokás a `<head>` elemben in betölteni JS fájlokat amikor kritikus, viszont az gátolja a HTML megjelenését, amíg a JS fájl le nem töltődik.

### 1.1 Todo osztály és állapotok

Az egyes Todo elemek modelljére érdemes saját osztályt definiálnunk.

???+ tip "Osztályok"
    Modern (ES6/ES2015 és magasabb) JavaScriptben konstruktor függvény helyett használhatunk valós osztályokat is, a gyakorlaton ezt fogjuk látni. JavaScriptben egy (nem osztály) függvény konstruktorfüggvény, ha a `this` változón tulajdonságokat helyez el és nem tér vissza semmivel. Ekkor a `new` kulcsszóval meghívva a függvényt az konstruktorként funkcionál és a `this` (tulajdonságokkal "felaggatott") értékét kapjuk vissza. Ezen felül az `instanceof` kulcsszóval megvizsgálhatjuk, hogy egy adott függvény konstruktora által készített objektumról van-e szó, tehát *szinte* már osztálypéldányként kezelhetjük az objektumot.


A fülek lehetséges állapotai az `all`, `active`, `inactive` és `done`. Az `all` kivételével ezeket az állapotokat veheti fel egy Todo elem is.

A `todo.js` elejére vegyük fel a Todo osztályt, annak konstruktorfüggvényét és a konkrét példányokat tároló (üres) tömböt, valamint a lehetséges állapotokat

```js
class Todo {
    constructor(name, state) {
        this.name = name;
        this.state = state;
    }
}

const todos = [];   // Az oldal betöltődésekor a TODO lista egy üres tömb.
const states = ["active", "inactive", "done"];
const tabs = ["all"].concat(states);    // "all" + a state tömb elemei a fülek.

console.log(tabs);
```

???+ tip "JavaScript változók"
    JavaScriptben három kulcsszóval deklarálhatunk lokális változót:

    * `var`: az "eredeti" módja a változó deklarációjának, modern JS-ben **érdemes kerülni**. Engedi ugyanazon változó újradeklarációját, sőt, nem köti scope-hoz a változót.
    * **`let`**: scope-hoz köti a változót, ezért nem deklarálható újra és nem is "szivárog" át a scope-ok között.
    * `const`: konstans értékű/referenciájú "változót" (érdekes változónak nevezni, ha nem változhat) tárol. A változó nem kaphat új értéket (tehát ha referenciatípus, pl. objektum vagy tömb, akkor nem lehet új objektumot/értéket adni a változónak), de ha objektumot tárol, annak tagjai (vagy a tömb elemei) értelemszerűen változhatnak.

A legnyilvánvalóbb (ha nem is a legrobusztusabb) módja a hibakeresésnek az, ha a konzolra írunk. Az F12 segítségével a Console fülön láthatjuk a kimenetet.

### 1.2 Új Todo felvétele

Iratkozzunk fel az űrlap `submit` eseményére és valósítsuk meg az új Todo elem létrehozását. A feliratkozást megtehetjük HTML-ből és JavaScriptből is, most az utóbbit alkalmazzuk! Illesszük be az alábbi kódrészletet a korábbi kódrészletek után!

* Hozzunk létre egy `form` változót, amibe mentsük el az oldalon található `new-todo-form` azonosítójú form referenciáját. Tipp: `document.getElementById("new-todo-form")`
* Egy másik `input` nevű változóba pedig mentük el a szövegdoboz referenciáját, ahol a Todo elem nevét meg lehet. Ennek az azonosítója a `new-todo-title`.
* Iratkozzunk fel a `form` submit eseményére egy függvénnyel, aminek egy `event` bemenő paramétere legyen.
* Tiltsuk le az űrlap postolásának alapértelmezett viselkedését, hogy ne töltse újra az oldalt. Tipp: `preventDefault()`.
* Ha a szövegdobozban szerepel valamilyen érték, akkor azzal a névvel adjunk a `todos` tömbhöz egy új Todo elemet.
* Az szövegdobozból töröljük ki a begépelt szöveget.

??? tip "Megvalósítás: Todo elem felvétele"
    ```js
    const form = document.getElementById("new-todo-form");
    const input = document.getElementById("new-todo-title");

    form.onsubmit = function(event) {
        // Meggátoljuk az alapértelmezett működést, ami frissítené az oldalt.
        event.preventDefault(); 

        // Csak akkor adjuk a tömbhöz ha a szögegdobozban érvényes érték van.
        // Ekvivalens ezzel: if (input && input.value && input.value.length) 
        // vagy if (input != null && input.value != null && input.value.length > 0)
        if (input?.value?.length) { 
            // Az új todo-t aktív állapotban hozunk létre.
            todos.push(new Todo(input.value, "active")); 
            // Kiürítjük az inputot
            input.value = ""; 

            // TODO: újrarajzolni a listát
        }
    }
    ```

Definiálnunk kell még egy `Button` osztályt a gombok kezelésére, amiket a Todo elemekhez fogunk rendelni. Nem volna *szükség* a modellek definiálására, elvégre is a JS egy dinamikus nyelv, de struktúrát ad a kódnak, objektum-orientáltabban kezelhető.

A Button osztályon az alábbi tulajdonságok legyenek:

* `action` - Művelet, amit a gomb végez
* `icon` - FontAwesome ikon neve (class="fas fa-*")
* `type` - Bootstrapbeni típus ("secondary", "danger" stb.)
* `title` - Tooltip szövege

Illetve készítünk egy tömböt `buttons` névvel, amibe a következő négy gombot tegyük bele: Done, Active, Inactive, Remove. A gombok nevéből kiderül, hogy ezekkel tudjuk új állapotba tenni, vagy törölni az elemet.

???+ info IntelliSense
    A VS Code-ban valószínűleg az IntelliSense nyomára tudunk bukkanni a JS kód írása közben. Ennek az oka nem a JavaScript, hanem a háttérben futó TypeScript fordító. Mivel minden JavaScript egyben TypeScript kód is, ezért a típusinformációk kinyerhetők a kódból. Ez a TypeScript nagy előnye a JS-sel szemben. Fordítási hibáink nem lesznek JavaScriptben, de az IntelliSense segítségét ki lehet így használni.

??? tip "Megvalósítás: Gombok felvétele"
    ```js
    class Button {
        constructor(action, icon, type, title) {
            this.action = action;
            this.icon = icon;
            this.type = type;
            this.title = title;
        }
    }

    // A gombokat reprezentáló modell objektumok tömbje
    const buttons = [
        new Button("done", "check", "success", "Mark as done"),
        new Button("active", "plus", "secondary", "Mark as active"),
        // Az objektumot dinamikusan is kezelhetjük, ekkor nem a konstruktorral példányosítjuk
        { action: "inactive", icon: "minus", type: "secondary", title: "Mark as inactive" },
        new Button("remove", "trash", "danger", "Remove"),
    ];
    ```

Így már gyakorlatilag fel tudunk venni új elemet, viszont ez nem látszik a felületen, ugyanis csak memóriában dolgoztunk, és nem módosítottuk megfelelően a DOM-ot.

### 1.3 Todo lista kirajzolása

Készítenünk kell egy olyan függvényt, ami a todos tömbben lévő elemeket a felületen meg tudja jeleníteni.

Ehhez először készítsünk egy olyan függvényt `createElementFromHTML` névvel, ami a paraméterként megkapott HTML sztringbőé elkészít a memóriában egy virtuális DOM elemet.

```js
function createElementFromHTML(html) {
    const virtualElement = document.createElement("div");
    virtualElement.innerHTML = html;

    return virtualElement.childElementCount == 1 
        ? virtualElement.firstChild 
        : virtualElement.children;
}
```

Erre azért van szükség, mert nincs arra natív JavaScript API (jelenleg), hogy stringből HTML elemet hozzunk létre, viszont bármely (akár virtuális, tehát az aktuális DOM-ban nem, de memóriában létező) DOM elem innerHTML-jének beállításával a DOM elem(ek) ténylegesen létrejön(nek). 

Alternatív megoldásként megtehetnénk, hogy létrehozzuk a `createElement` segítségével az elemet, majd egyesével beállítjuk az attribútumait, de az jóval körülményesebb, kódolósabb megoldást eredményez.

Ezt követően készítük el a `renderTodos` függvényt, ami az összes Todo elemet kirajzolja a felületre. Bemenő paraméter nem kell neki, mert a `todos` tömböt elérjük.

* A lista elemet a `todo-list` azonosítójú DOM elemben találhatóak. Ezt először törölni kell. Tipp: `innerHTML` -t kell üres sztringre állítani.
* Iteráljunk végig a `todos` tömbön és egy `row` változóba készítsük el szükséges HTML template-et. A HTML template megtalálható az index.html oldalon, közvetlenül a `todo-list` azonosítójú elem alatt.
* A gombokhoz tartozó HTML tartalmat is érdemes egy ciklussal generálni. Ehhez a `buttons` tömbön kell végigiterálni és a `createElementFromHTML` függvény segítségével minden gombhoz létrehozni a szükséges DOM elemet
    * Itt kell figyelni arra, hogy azt a gombot tegyük `disabled`-re amelyik állapotban éppen a Todo elem van.
    * Majd az egyes gombokhoz generált DOM elemet adjuk hozzá az `action-buttons` CSS osztállyal ellátott elemhez, ami a sornak a templatejében `row` változó kell, hogy szerepeljen. Tipp: `.querySelector("   ").appendChild(domElem)`
* Végül az így összeállított sor template-et (`row`) hozzá kell adni a `todo-list`-hez.
* Ne feledd, hogy ezt a függvényt meg is kell hívni, hogy a kezdeti állapotot kirajzolja!

???+ tip "Selectorok"
    A `querySelector()/querySelectorAll()` API-kkal egy CSS szelektort adhatunk meg a document-en vagy egy elemen, és az illeszkedő első/összes elemet kapjuk vissza.

??? tip "Megvalósítás: HTML tartalom renderelése"
    ```js
    function renderTodos() {
        // Megkeressük a konténert, ahová az elemeket tesszük
        const todoList = document.getElementById("todo-list"); 
        // A jelenleg a DOM-ban levő to-do elemeket töröljük
        todoList.innerHTML = ""; 

        // Bejárjuk a jelenlegi todo elemeket.
        for(let todo of todos)
        {
            const row = createElementFromHTML(
                `<div class="row">
                    <div class="col d-flex p-0">
                        <a class="list-group-item flex-grow-1" href="#">
                            ${todo.name}
                        </a>
                        <div class="btn-group action-buttons"></div>
                    </div>
                </div>`);

            // A gomb modellek alapján legyártjuk a DOM gombokat.
            for(let button of buttons)
            {
                const btn = createElementFromHTML(
                    `<button class="btn btn-outline-${button.type} fas fa-${button.icon}" title="${button.title}"></button>`
                );

                if (todo.state === button.action) // azt a gombot letiljuk, amilyen állapotban van egy elem
                    btn.disabled = true;

                // TODO: a gomb klikk eseményének kezelése

                // A virtuális elem gomb konténerébe beletesszük a gombot
                row.querySelector(".action-buttons").appendChild(btn); 
            }

            // Az összeállított HTML-t a DOM-ban levő todo-list ID-jú elemhez fűzzük.
            todoList.appendChild(row); 
        }
    }

    // Kezdeti állapot kirajzolása.
    renderTodos(); 
    ```

Most már látjuk, hogy mi fog kerülni a `// TODO: újrarajzolni a listát` komment helyére a form elküldésekor:

```js
renderTodos();
```

??? warning "Törlés"
    Ha abba a hibába esnénk, hogy a DOM elemeket egyesével szeretnénk eltávolítani a DOM-ból a `#todo-list` elem `children` tulajdonságának segítségével, vigyáznunk kell, ugyanis ez egy "élő" kollekció: miközben az elemeket töröljük, a kollekció length tulajdonsága is változik! Persze egy egyszerű `for` ciklussal megoldható, de mindenképpen a végétől indulva járjuk be a kollekciót, amíg az ki nem ürül!

### Beadandó

!!! example "1. feladat beadandó (1 pont)"
    Illessz be egy képernyőképet néhány hozzáadott tennivalóról, amiből az egyiknek a neve a neptun kódod legyen! (`f1.png`)

## 2. Feladat - Todo elemek állapotváltás

Az alkalmazásban több helyen is kell állapotváltozást kezelni. Egyfelől az egyes Todo elemek állapota változhat, másfelől a tabfülekre kattintva csak az adott állapotban lévő elemeket kell megjeleníteni, illetve jelölni kell az aktuálisan kiválasztott fület is.

Felhasználói interakciót úgy tudunk megvalósítani, hogy **eseménykezelőt rendelünk** egy tag megfelelő eseményéhez. 

HTML-ben az `on{eseménynév}` attribútumok megadásával tudunk eseménykezelőt kötni egy taghez. Például: `<button onclick="saveData">Mentés</button>

JavaScriptben a DOM API-t használval

* az elem referenciáját megszerezve az `.addEventListener("eseménynév", callbackFüggvény)` függvény meghívásával 
* vagy a megfelelő feliratkoztató függvény beállításával. Például: `onclick = callbackFüggvény`

### 2.1. Tabfül váltás

Készítsük el a kódot, amiben az egyes tabfülek között váltani tudunk. Ehhez a `todo.js` fájlt kell kiegészíteni.

* Vegyünk fel egy változót `currentTab` névvel, amiben eltároljuk az aktuálisan kiválasztott fül típusát.
* Készísünk egy függényt `selectTab` névvel, ami paraméterül megkapja, hogy melyik fület kell megjelenítenie és ez alapján a `todo-tab` CSS osztállyal rendelkező tabfüleken az `.active` CSS osztályt átteszi az újonnan kiválasztott fülre.

??? info "Megvalósítás: Tabfül váltás JavaScript"
    ```js
    // Aktuálisan kiválasztott fül.
    let currentTab; 

    function selectTab(type) {
        // Beállítjuk az újonnan kiválasztott fület.
        currentTab = type; 

        for (let tab of document.getElementsByClassName("todo-tab")) {
            // Az összes fülről levesszük az `.active` osztályt.
            tab.classList.remove("active"); 

            // Ha éppen ez a fül a kiválasztott, visszatesszük az `.active` osztályt.
            if (tab.getAttribute("data-tab-name") == type) 
                tab.classList.add("active");
        }

        // Újrarajzolunk mindent.
        renderTodos(); 
    }

    // App indulásakor (oldal betöltéskor) kiválasztjuk az "all" fület.
    selectTab("all"); 
    ```

???+ tip "self-invoking function declaration"
    A fenti minta, amikor egy függvényt a definiálása után közvetlenül meghívunk, egy "csúnyább", de elterjedt alternatívával szokták alkalmazni, ez az ún. *self-invoking function declaration*, aminek sok változata ismeretes, ez az egyik:
    ```js
    (const selectTab = function(type) { /* ... */})("all");
    ```

* A HTML-ben az egyes fülekhez a klikk esemény kezelőben hívjuk meg a `selectTab` függvényt. Tipp: `onclick="selectTab('all')"`)
* Ezen felül minden fülhöz vegyünk fel egy adattároló attribútumot is. Ezt az attribútumot a `data-` előtaggal láttuk el jelezvén, hogy az attribútum kizárólag adathordozásra szolgál. Tipp: `data-tab-name="all"`

??? info "Megvalósítás: Tabfül váltás HTML"
    ```html
    <li class="nav-item">
        <a class="todo-tab nav-link" data-tab-name="all" href="#all" onclick="selectTab('all')">
            All <span class="badge bg-secondary">1</span>
        </a>
    </li>
    <li class="nav-item">
        <a class="todo-tab nav-link" data-tab-name="active" href="#active" onclick="selectTab('active')">
            Active <span class="badge bg-secondary">1</span>
        </a>
    </li>
    <li class="nav-item">
        <a class="todo-tab nav-link" data-tab-name="inactive" href="#inactive" onclick="selectTab('inactive')">
            Inactive <span class="badge bg-secondary"></span>
        </a>
    </li>
    <li class="nav-item">
        <a class="todo-tab nav-link" data-tab-name="done" href="#done" onclick="selectTab('done')">
            Done <span class="badge bg-secondary"></span>
        </a>
    </li>
    ```

### 2.2. Todo elem állapot váltása

Az elemek állapotának változását hasonlóképpen kezelhetjük, mint a tabfülek váltását.

Amikor a gombokat gyártjuk a `renderTodos()` függvényben, az eseménykezelőket ott helyben be tudjuk regisztrálni (a `/ TODO: a gomb klikk eseményének kezelése` komment helyére)

* Regisztráljuk be a kattintás eseménykezelőt a gombhoz.
* A `remove` akciót külön kell kezelni. Egy megerősítés után (tipp: `confirm`) a `todos` tömbből kell kivenni az elemet.
* Az összes többi esetben csak az adott todo elem állapotát kell módosítani a gomb actionjére.

??? tip "Megvalósítás: Gomb eseménykezelők állapot változáshoz"
    ```js
    // Feliratkozás a kattints eseményre.
    // A `btn.onclick = function() {` függvény helyett az arrow function-t használjuk.
    btn.onclick = () => { 
        // Törlést külön kell kezelni.
        if (button.action === "remove") { 
            // Megerősítés után kiveszünk a 'todo'-adik elemtől 1 elemet a todos tömbből.
            if (confirm("Are you sure you want to delete the todo titled '" + todo.name + "'?")) { 
                todos.splice(todos.indexOf(todo), 1);
                renderTodos();
            }
        }
        else { 
            // Ha nem törlés, akkor átállítjuk a kiválasztott todo állapotát a gomb állapotára.
            todo.state = button.action;
            renderTodos();
        }
    }
    ```

!!! info "Confirm"
    Érdekesség a `confirm()` függvény, amely böngészőben natívan implementált: a felhasználónak egy egyszerű megerősítő ablakot dob fel a megadott szöveggel, és blokkolva várakozik a válaszra. A válasz egy boolean érték, így az `if` törzse csak akkor fut le, ha a felhasználó OK-val válaszol. Hasonló az `alert()`, az viszont csak egy OK-zható figyelmeztetést dob fel, ami nem tér vissza semmivel, ill. a `prompt()`, amivel stringet kérhetünk be. Ezeket ritkán, lehetőleg soha nem használjuk, helyettük nem blokkoló, aszinkron egyedi megoldást készítünk.

    Ha `for (var ... in ...)` ciklust és `function`-t használnánk a `buttons` és `todos` tömbökön, akkor a klikk eseménykezelő ebben a formában hibás lesz, mert az iterációk újrahasznosítanák a todo és button változókat. Az arrow function viszont ezeket a változókat ún. "closure"-be helyezi, technikailag a változókból egy lokális másolat készül, így a függvény helyesen fog lefutni.

### 2.3. Badge-ek frissítése

Egészítsük ki a `renderTodos()` függvényt, hogy frissítse a fülek mellett található badge-ben megjelenő számértékeket:

??? tip "Megvalósítás: badge-ek frissítése"
    ```js
    document.querySelector(".todo-tab[data-tab-name='all'] .badge").innerHTML = todos.length || "";

    for (let state of states)
        document.querySelector(`.todo-tab[data-tab-name='${state}'] .badge`).innerHTML = todos.filter(t => t.state === state).length || "";
    ```

!!! info "Filter"
    A `filter()` függvénynek egy callbacket adunk át, ez fog kiértékelődni minden elemre: ha a feltétel igaz, akkor az elemet visszakapjuk, különben nem. Magyarul: azokra az elemekre szűrünk, amelyek állapota az aktuálisan bejárt állapot ("active", "inactive", "done"), tehát megszámoljuk, hány elem van az adott státuszban. Ezen felül, ha az érték `falsey`, tehát esetünkben 0, helyette üres stringet adunk vissza, így nem fog megjelenni a badge.

### 2.4. Lista szűrése

Utolsó lépésként logikus, hogy az aktuális fül alapján szűrjük le az elemeket, ne mindig az összes látszódjon. Ezt a `renderTodos()` apró módosításával tudjuk megtenni. Szűrjük le a `todos` tömböt, majd a szűrés eredményén iteráljunk végig a `for..of` ciklussal.

Tehát az eredeti `todos` tömböt a `filter` segítségével szűrjük úgy, hogy csak azok az elemek maradjanak a szűrt tömbben, ami az aktuális fülnek megfelel VAGY az "all" fülön vagyunk (tehát látszódjon minden).

??? tip "Megvalósítás: lista szűrése"
    ```js
    const filtered = todos.filter(function(todo){ return todo.state === currentTab || currentTab === "all"; });
    for(let todo of filtered) { // ...
    ```

??? tip "Alternatíva"
    Egy tömör megoldás, amit persze nem egyszerű megérteni, az alábbi:

    ```js
    const filtered = todos.filter(todo => ["all", todo.state].includes(currentTab);
    ```

    Szintén alternatív megoldásként, ahol a fül vizsgálatot kiszerveztük:

    ```js
    const filtered = (currentTab === 'all' ? todos : todos.filter(todo => todo.state === currentTab));
    ```

### Beadandó

!!! example "BEADANDÓ (1 pont)"
    Illesszen be egy-egy képernyőképet (`f2-1.png`, `f2-2.png`, `f2-3.png`) a tennivalók állapotainak változtatásáról, a különböző oldalakon történő megjelenésükről!

## 3. Feladat (Önálló) - Sorrendezés

Legyenek fel-le mozgathatók a to-do elemek az `all` listában!

* Hozz létre két új gombot, amely a felfelé és lefelé mozgatást jelzik az elemnél! Használd a `fas fa-arrow-up` és `fas fa-arrow-down` osztályokat az ikonokhoz! A gombok csak az `all` fülön legyenek láthatók!
* A gomb legyen letiltva, ha nem mozgatható az elem a megadott irányba!
* A gombra kattintva az elem kerüljön előrébb/hátrébb az elemek listájában!

### Beadandó

!!! example "BEADANDÓ (1.5 pont)"
    Illessz be egy-egy képernyőképet néhány tennivalóról sorrendezés előtt és után! (`f3-1.png`, `f3-2.png`)

## 4. Feladat (Önálló) - Perzisztálás

Egy to-do listának nem sok értelme van, ha nem menthetők el az adataink. A mentésre egyértelmű lehetőséget biztosít a `localStorage` és a `sessionStorage`. Mindkettő kulcs-érték tároló, a kulcsok és értékek egyaránt `string` típusúak. A különbség a kettő között az élettartamuk: míg a `localStorage` - bár korlátos méretű - a böngészőt újraindítva is megtartja állapotát, a `sessionStorage` a böngészőt/fület bezárva elvész. A `sessionStorage` adatokat memóriában, a `localStorage` adatokat viszont perzisztensen, fájlban tárolja a böngésző.

A tároláshoz minden renderelési ciklus elején volna érdemes mentenünk. Bár az alkalmazásunk `renderTodos()` függvénye nevéből fakadóan a DOM-ot manipulálja, ez az a pont, ahol bármilyen változásról értesülünk. Fontos, hogy tartsuk be a *separation of concerns* elvet: mindenki a saját feladatával foglalkozzon! Ezért ne itt valósítsuk meg a perzisztálást, hanem egy saját függvényben, amit meghívunk minden változást indukáló ponton a kódban:

* elem állapotának változása,
* elem létrehozása,
* elem törlése.

!!! note "Változásdetektálás"
    Komplexebb alkalmazásfejlesztő keretrendszerekben is problémát okoz a változásokról történő értesülés, a React, az AngularJS és az Angular mind más és más módszereket alkalmaznak a változások detektálására.

A tároláshoz a `localStorage.setItem(key, value)` függvényt használjuk. A sorosítandó objektumot egyszerűen JSON-be sorosíthatjuk: `JSON.stringify(object)`, illetve visszafejthetjük: `JSON.parse(string)`.

!!! warning "Objektum sorosítás"
    Fontos, hogy a `JSON.parse()` által visszafejtett objektumok egyszerű objektumok, ha a forrás objektumunkon pl. függvények is szerepeltek, azok a deszerializált objektumon nem lesznek elérhetők!

A részfeladatok tehát:

* Készíts egy függvényt, ami elmenti a teljes todos tömb tartalmát `localStorage`-ba,
* Bármilyen változás hatására (elem állapotváltozása, létrejötte, törlése) mentsd el a függvény segítségével az elemeket,
* Alkalmazás indulásakor egyetlen alkalommal töltsd vissza az összes eltárolt todo elemet, és ez legyen a `todos` változó kiinduló tartalma!
* Az elkészített alkalmazást az implementáció után teszted egy inkognító abalkban is, hogy ott is működik-e, vagy netán a `todos` tömb `null` vagy `undefined` értéket kap, amin a `push` nem értelmezett.

!!! tip "Storage debuggolás"
    A storage tartalmát böngészőtől függően különböző helyen tudjuk megvizsgálni, jellemzően az Application/Storage vagy Debugger fülön található.

### Beadandó

!!! example "BEADANDÓ (1.5 pont)"
    Illessz be egy képernyőképet a lokális tárolóban (localStorage) található perzisztált to-do elemekről! (`f4.png`)
