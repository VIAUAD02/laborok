# Labor 03 - Felhasználói felület tervezése és készítése Android platformon

## Bevezető

A labor célja egy egyszerű felhasználói felület tervezése, kivitelezése. 

A feladat egy kiadás / bevétel naplózására alkalmas alkalmazás elkészítése AndroidWallet néven. Az alkalmazás alap funkcionalitása, hogy a felhasználó fel tudja venni egy listába a kiadásait, bevételeit, illetve törölni tudja az egész lista tartalmát.

A kész alkalmazás mintaképe: 

<p align="center">
<img src="./assets/sample_screen.png" width="320">
</p>
Az alkalmazás felépítése és működése a következő:

- Kezdőképernyő a listával (LazyColumn) illetve egy beviteli résszel rendelkezik. Itt a felhasználó beír egy megnevezést és egy összeget, megadja a pénzforgalom irányát, majd ezután el tudja menteni a listába a tranzakcióját. Amennyiben itt bármelyik mező üres, a mentést meg kell akadályoznunk.
- Egy listaelem felépítése:
	- Ikon a pénzforgalom irányától függően.
	- A megadott megnevezés és alatta az összeg.
	- A Toolbaron egy menüpont a lista teljes törlésére.
	- A lista görgethető kell legyen

### Felhasznált technológiák:
- Scaffold, TopBar, Column, Row, Image, OutlinedTextField, Button, ElevatedButton, Text, **LazyColumn**
- data class


## Előkészületek

A feladatok megoldása során ne felejtsd el követni a [feladat beadás folyamatát](../../tudnivalok/github/GitHub.md).

### Git repository létrehozása és letöltése

1. Moodle-ben keresd meg a laborhoz tartozó meghívó URL-jét és annak segítségével hozd létre a saját repository-dat.

1. Várd meg, míg elkészül a repository, majd checkout-old ki.

    !!! tip ""
        Egyetemi laborokban, ha a checkout során nem kér a rendszer felhasználónevet és jelszót, és nem sikerül a checkout, akkor valószínűleg a gépen korábban megjegyzett felhasználónévvel próbálkozott a rendszer. Először töröld ki a mentett belépési adatokat (lásd [itt](../../tudnivalok/github/GitHub-credentials.md)), és próbáld újra.

1. Hozz létre egy új ágat `megoldas` néven, és ezen az ágon dolgozz.

1. A `neptun.txt` fájlba írd bele a Neptun kódodat. A fájlban semmi más ne szerepeljen, csak egyetlen sorban a Neptun kód 6 karaktere.

## Projekt létrehozása

Hozzunk létre egy AndroidWallet nevű projektet Android Studioban:

1. Hozzunk létre egy új projektet, válasszuk az *Empty Activity* lehetőséget.
1. A projekt neve legyen `AndroidWallet`, a kezdő package `hu.bme.aut.android.androidwallet`, a mentési hely pedig a kicheckoutolt repository-n belül az AndroidWallet mappa.
1. Nyelvnek válasszuk a *Kotlin*-t.
1. A minimum API szint legyen API24: Android 7.0.
1. A *Build configuration language* Kotlin DSL legyen.

!!!danger "FILE PATH"
	A projekt a repository-ban lévő AndroidWallet könyvtárba kerüljön, és beadásnál legyen is felpusholva! A kód nélkül nem tudunk maximális pontot adni a laborra!

!!!danger "FILE PATH"
    A repository elérési helye ne tartalmazzon ékezeteket, illetve speciális karaktereket, mert az Android Studio ezekre érzékeny, így nem fog a kód lefordulni. Érdemes a C:\\ meghajtó gyökerében dolgozni.

## Menü elkészítése (1 pont)

Azt szeretnénk, ha a képernyő felső részében lenne egy ActionBar, (alkalmazás nevével és) egy törlési opcióval, vagy akár egy legördülő menü opcióval. Ehhez a megvalósításhoz, nagyon jól alkalmazható a Scaffold Composable, ugyanis ennek van egy *topBar* attribútuma, aminek könnyen adhatunk egy ilyen ActionBar-t. Első lépésben hozzunk létre egy Packaget a projekt mappa gyökerén `(hu.bme.aut.android.androidwallet)` `screen` néven, majd ezen belül egy új *Kotlin Filet*  `TopBar` néven. Ezután írjuk bele a következőt:

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopBar(title: String, icon: ImageVector, onIconClick: () -> Unit) {
    TopAppBar(
        title = { Text(text = title) },
        actions = {
            IconButton(onClick = onIconClick) {
                Icon(imageVector = icon, contentDescription = "Delete", tint = Color.Red)
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.inversePrimary)
    )
}
```

Ezzel a TopBar kész is, azonban ahhoz, hogy a főképernyőt elkészítsük, létre kell hoznunk egy listaelemet, amit majd a LazyColumn-ban fogunk látni. 

- Egy listaelem felépítése:
	- Ikon a pénzforgalom irányától függően.
	- A megadott megnevezés és alatta az összeg.
	- A Toolbaron egy menüpont a lista teljes törlésére.
	- A lista görgethető kell legyen


!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **TopBar** Kotlin File, a menü kódjával, valamint a **neptun kódod kommentként**. A képet a megoldásban a repository-ba f1.png néven töltsd föl.

	A képernyőkép szükséges feltétele a pontszám megszerzésének.


## Listaelem létrehozása (1 pont)

Ehhez hozzunk létre egy új *Kotlin Filet* `SalaryCard` néven a `screen` packageba. Mielőtt a kód beírásra kerülne, töltsük le az alábbi iconokat:

- [income.png](downloads/income.png)
- [expense.png](downloads/expense.png)

Ezt a két icont másoljuk be a `res/mipmap` mappába, majd írjuk meg a kódot a következő képpen:

```kotlin
@Composable
@Preview
fun SalaryCard(isIncome: Boolean = false, item: String = "Item", price: String = "Price") {
    Row {
        Image(modifier = Modifier
            .size(64.dp)
            .padding(8.dp),
            painter = painterResource(id = if (isIncome) R.mipmap.income else R.mipmap.expense),
            contentDescription = "Income/Expense")
        Column (
            modifier = Modifier.padding(8.dp)
        ) {
            Text(text = item)
            Text(text = price)
        }
    }
}
```

A *SalaryCard* Composable függvény 3 paramétert tartalmaz:

- `isIncome - Boolean változó amely a kiadás/bevétel állapotért felel`   
- `item - kiadás/bevétel neve`
- `price - kiadás/bevétel értéke`

A függvényen belül megtalálható egy *Row*, valamint egy *Column*. A *Row* felel azért, hogy az elemeket horizontálisan egymás mellé lehessen rakni, a Column pedig, hogy az elemeket egymás alá. (Ez utóbbi a kiadás/bevétel neve, illetve értéke miatt szükséges, hogy egymás alatt szerepeljenek) A képet pedig egy Image Composable-val helyezzük el. Itt a `modifier` segítségével sok fajta beállításra van lehetőség, most csak a size-val, illetve a paddinggel foglalkozunk, hogy átláthatóbb legyen. A `painter` segítségével adhatjuk meg a képet, amit szeretnénk megjeleníteni. Ennek egy *Painter* típust kell adni, amit a *painterResource* segítségével tehetünk meg. Ennek paraméterét egy if-else elágazással oldjuk meg, mégpedig a paraméterként kapott `isIncome` segítségével, hogy dinamikusan változzon a kép a kiadás/bevétel szerint. Miután megvagyunk az Image-val, a `Row`-n belül a `Column`-ba elhelyezünk kettő `Text`-et, a maradék kettő paraméterrel.


Ahhoz, hogy végezzünk a `SalaryCard` Kotlin File-val, még egy fontos lépést végre kell hajtani, ez pedig egy *data class* implementálása. Ez a LazyColumn-nak átadott lista miatt lesz szükséges.

```kotlin
data class SalaryCardData(
    val isIncome: Boolean,
    val item: String,
    val price: String
)
```

Jól láthatjuk, hogy ennek *data classnak* a paraméterezése, ugyanaz mint a *SalaryCard*-nak. Ez a későbbiekben fontos lesz, ugyanis, ennek a Composable függvénynek, fogjuk átadni a *data class* elemeit.

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **SalaryCard** Composable, illetve a **data class** Kotlin kódja, a **neptun kódod kommentként**, illetve a Design menü-ben a készített Card. (<kbd>ALT</kbd>+<kbd>SHIFT</kbd>+<kbd>RIGHT</kbd>  billentyű kombinációval érhető ez el, vagy a jobb fölső sarokban a Design elemre kattintva). A képet a megoldásban a repository-ba f2.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

    

## Főképernyő elkészítése (1 pont)

Most már csak a főképernyő van hátra, hogy valamit láthassunk is az alkalmazásból. Ehhez hozzunk létre egy `MainScreen` nevű új *Kotlin Filet* a `screen` packagen belül, majd írjuk meg a főképernyőnek a felépítését az alábbi kód alapján:

```kotlin
@Composable
fun MainScreen() {
    var items by remember { mutableStateOf(emptyList<SalaryCardData>()) }
    val context = LocalContext.current
    Scaffold (
        topBar = {
            TopBarT(title = "Android Wallet",
                icon = Icons.Default.Clear,
                onIconClick = {
                    items = emptyList()
                })
        }
    ) { innerPadding ->
        Column (
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ){
            var item by remember { mutableStateOf("") }
            var price by remember { mutableStateOf("") }
            Row(
                modifier = Modifier
                    .fillMaxWidth(),
            ){
                //TODO (TextFields)
            }
            var isIncome by remember { mutableStateOf(false) }


            Row (
                modifier = Modifier
                    .fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically,
            ){
                //TODO (Buttons)
            }

            LazyColumn (
                modifier = Modifier
                    .fillMaxSize()
                    .padding(8.dp)
            ) {
                //TODO (items)
            }
        }
    }
}
```

A `MainScreen` tartalmaz egy *Scaffold*ot, amivel el tudjuk érni, hogy az elején implementált `TopBar`-t átadjuk a topBar paraméterének. Ezt a következő képpen tesszük meg. Adunk neki egy tetszőleges *title*-t (általában az alkalmazás nevét), ez most *Android Wallet* lesz, majd egy icon-t. Használjuk az Android Studio beépített iconjait. Ezután meg kell adnunk egy Lambdát, aminek a segítségével leírjuk, hogy mi történjen, hogyha a felhasználó rákattint az iconra. Jelen esetben ki kell ürítenünk a listánkat, valamint a sum értékét 0-ra állítani. Mivel mind a két változó kapott egy `by remember {mutableStateOf(...)}` értéket, ezért ha változás történik, akkor az összes Composable újrafordul. Ha ezzel megvagyunk, a következőt kellene látni a Preview-ben.

<p align="center">
<img src="./assets/MainScreen_TopBar.png" width="320">
</p>

Ezután fejezzük be a *Scaffold* tartalmát. Elsőként a TextField-eket fogjuk megírni az alábbi kód alapján. (`Ezt a //TODO (TextFields)` helyére kell beírni.)

```kotlin
OutlinedTextField(
    label = { Text("Item") },
    modifier = Modifier
        .padding(start = 8.dp, end = 8.dp)
        .weight(2f),
    singleLine = true,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
    value = item,
    onValueChange = {
        item = it
    }
)
OutlinedTextField(
    label = { Text("Price") },
    modifier = Modifier
        .padding(start = 8.dp, end = 8.dp)
        .weight(1f),
    singleLine = true,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    value = price,
    onValueChange = {
        price = it
    }
)
```

Itt szintén elvégezzük a szükséges beállításokat, a legtöbb azért felel, hogy barátibb UI-t láthassunk, viszont a legfontosabb a `value`, valamint az `onValueChange` értéke, ugyanis, ha ezek nincsennek beállítva, akkor nem fog megjelenni a begépelt szöveg. a `value`-nak átadjuk az *item* értéket, valamint az `onValueChange` esetén beállítjuk, hogy minden egyes karakter leütésnél új értéket kapjon a változó. Ezzel érhetjük el azt, hogy futási időben láthassuk a *TextField* értékét.

A következő lépésben, a gombok elhelyezését végezzük el, valamint egy text-et is elhelyezünk, amelyről leolvasható lesz a kiadások/bevételek összege. (Ezt a `//TODO (Buttons)` helyére kell elhelyezni.)

```kotlin
ElevatedButton(
    modifier = Modifier.padding(8.dp),
    onClick = { isIncome = !isIncome },
    colors = ButtonDefaults.elevatedButtonColors(
        if (isIncome) Color.Green else Color.Red
    )
) {
    Text(text = if (isIncome) "Income" else "Expense")
}
Button(
    modifier = Modifier.padding(8.dp),
    onClick = {
        if(item.isNotEmpty() && price.isNotEmpty()) {
            items += SalaryCardData(isIncome, item, price)
        } else {
            Toast.makeText(context, "Item and price must be filled", Toast.LENGTH_SHORT).show()
        }
    }
) {
    Text(text = "Save", color = Color.Red)
}
```

Az ElevatedButton helyett más fajta gombot is lehet használni, ez csak demonstrálja, hogy a Compose mennyi lehetőséget kínál a tervezés során. A két gombnak szintén beállítjuk az onClick eseményét, valamint a megjelenítendő szöveget rajtuk. A második gomb esetén az onClick eseményt egy if-else elágazásba kell tenni, hogy ha a felhasználó üresen hagyná, akkor ez figyelmeztesse. Ha nem üres, akkor az items listához hozzáadunk egy új elemet a bevitt adatnak megfelelően. Ez az elem a már korábban definiált `data class` egy példánya. 

Végül a LazyColumn-ot is befejezzük a következő kód segítségével. (Ezt a `//TODO (items)` helyére kell elhelyezni.)

```kotlin
items(items.size) {
    SalaryCard(isIncome = items[it].isIncome, item = items[it].item, price = items[it].price)
}
```

Az `items(..)`-nek egy méretet kell átadni, ami azt jelöli, hogy mekkora a lista, majd a blokk törzsében el kell helyezni azt a Composable elemet amit látni szeretnénk a LazyColumn-ban. Ez a `SalaryCard` Composable lesz, amit már korábban implementáltunk. Ennek paraméterként megadjuk az `it` elemeit. Ezen végig fog iterálni a LazyColumn, és minden elemet ki fog rajzolni a listából.

Ezzel a lépéssel elérkeztünk a kész alkalmazáshoz, és indítás során a következőt kell látnunk:

<p align="center">
<img src="./assets/sample_screen.png" width="320">
</p>


!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **MainScreen** kódja, az emulátor a működő alkalmazásról, valamint a **neptun kódod egy elemként a listában, vagy a kódban kommentként**. A képet a megoldásban a repository-ba f3.png néven töltsd föl.

	A képernyőkép szükséges feltétele a pontszám megszerzésének.


## Önálló feladatok

### Snack bar (1 pont)

A Toast üzeneteknél már van egy sokkal szebb megoldás is, ez a [Snackbar](https://developer.android.com/develop/ui/compose/components/snackbar). Cseréljük le a Toast figyelmeztetést Snackbarra!

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **Snackbar** kódja, az emulátor a működő alkalmazásról, valamint a **neptun kódod egy elemként a listában, vagy a kódban kommentként**, valamint a SnackBar üzenet üres adat bevitele esetén. A képet a megoldásban a repository-ba f4.png néven töltsd föl.

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

### Összegző mező (1 pont)

Vegyünk fel egy összegző mezőt a gombok mellé, amely minden bevitt érték után frissül. Figyeljünk arra, hogyha nincs még egyetlen bejegyzés sem, akkor ne jelenjen meg semmi, valamint a felhasználó nem mínusz karakter alapján állítja a kiadás/bevétel állapotot, hanem a kapcsoló alapján kell eldöntenünk, hogy pozitív vagy negatív érték. 

!!!warning "Figyelem"
	Figyeljünk az összegző mező helyes működésére! Ha töröljük a listából a bejegyzéseket, akkor a számláló is nullázódjon és tűnjön el! (Nem elég csak akkor eltüntetni, hogyha a `sum` 0 értéket vesz fel.) (-0.5 pont)


### Bonus

Módosítsuk a *TopBar* menü gombját, úgy hogy legördülő menü lista legyen belőle, ahol 3 opció található meg.

- Delete Expenses
- Delete Incomes
- Delete All

Ehhez módosítsuk a TopBar Composable függvényünket.

???success "Segítség"
      - Plusz két lambda operátor
      - DropdownMenu
      - DropdownMenuItem
      - .filter használata a listán/sum-on