# Labor 06 - Bevásárló alkalmazás készítése

## Bevezető
A labor során egy bevásárló lista alkalmazás elkészítése a feladat. Az alkalmazásban fel lehet venni megvásárolni kívánt termékeket, valamint  megvásároltnak lehet jelölni és törölni lehet meglévőket.


Az alkalmazás a termékek listáját [`LazyColumn`](https://developer.android.com/develop/ui/compose/lists)-ban jeleníti meg, a lista elemeket és azok állapotát a [`Room`](https://developer.android.com/training/data-storage/room) nevű ORM library segítségével tárolja perzisztensen. Új elem felvételére egy [`FloatingActionButton`](https://developer.android.com/develop/ui/compose/components/fab) megnyomásával van lehetőség.


!!!info "ORM"
    ORM = [Object-relational mapping](https://en.wikipedia.org/wiki/Object-relational_mapping)

Felhasznált technológiák:
- [`Scaffold`](https://developer.android.com/develop/ui/compose/components/scaffold)
- [`LazyColumn`](https://developer.android.com/develop/ui/compose/lists)
- [`ViewModel`](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [`FloatingActionButton`](https://developer.android.com/develop/ui/compose/components/fab)
- [`Room`](https://developer.android.com/training/data-storage/room)
- [`Dialog`](https://developer.android.com/develop/ui/compose/components/dialog)
- [`AppBar`](https://developer.android.com/develop/ui/compose/components/app-bars)

## Az alkalmazás specifikációja
Az alkalmazás egy `Activity`-ből áll, amin egy *Composable* osztály fog szerepelni, `MainScreen`. Új elemet a jobb alsó sarokban található `FloatingActionButton` segítségével vehetünk fel. Erre kattintva egy dialógus jelenik meg, amin megadhatjuk a vásárolni kívánt áru nevét, leírását, kategóriáját és becsült árát.
A dialóguson az *OK* gombra kattintva a dialógus eltűnik, a benne megadott adatokkal létrejön egy lista elem a listában. Az egyes lista elemeken `CheckBox` segítségével jelezhetjük, hogy már megvásároltuk őket. A kuka ikonra kattintva törölhetjük az adott elemet.
A menüben található „Remove all” opcióval az összes lista elemet törölhetjük.


<p align="center">
<img src="./assets/shopping_list.png" width="320">
<img src="./assets/new_item.png" width="320">
</p>

## Laborfeladatok
A labor során az alábbi feladatokat a laborvezető segítségével, illetve a jelölt feladatokat önállóan kell megvalósítani.

1. Perzisztens adattárolás megvalósítása: 1 pont
2. Lista megjelenítése `LazyColumn`-al: 2 pont
3. Dialógus megvalósítása új elem hozzáadásához: 1 pont
4. **Önálló feladat** (törlés megvalósítása): 1 pont


!!! warning "IMSc"
	A laborfeladatok sikeres befejezése után az IMSc feladatokat megoldva 2 IMSc pont szerezhető:  
        Megerősítő dialógus: 1 pont  
        Elemek szerkesztése: 1 pont


## Előkészületek

A feladatok megoldása során ne felejtsd el követni a [feladat beadás folyamatát](../../tudnivalok/github/GitHub.md).


### Git repository létrehozása és letöltése

1. Moodle-ben keresd meg a laborhoz tartozó meghívó URL-jét és annak segítségével hozd létre a saját repository-dat.

2. Várd meg, míg elkészül a repository, majd checkout-old ki.

    !!! tip ""
        Egyetemi laborokban, ha a checkout során nem kér a rendszer felhasználónevet és jelszót, és nem sikerül a checkout, akkor valószínűleg a gépen korábban megjegyzett felhasználónévvel próbálkozott a rendszer. Először töröld ki a mentett belépési adatokat (lásd [itt](../../tudnivalok/github/GitHub-credentials.md)), és próbáld újra.

3. Hozz létre egy új ágat `megoldas` néven, és ezen az ágon dolgozz.

4. A `neptun.txt` fájlba írd bele a Neptun kódodat. A fájlban semmi más ne szerepeljen, csak egyetlen sorban a Neptun kód 6 karaktere.



## Projekt létrehozása

Első lépésként indítsuk el az Android Studio-t, majd:  
1. Hozzunk létre egy új projektet, válasszuk az *Empty Activity* lehetőséget.  
2. A projekt neve legyen `ShoppingList`, a kezdő package pedig `hu.bme.aut.android.shoppinglist`  
3. Nyelvnek válasszuk a *Kotlin*-t.  
4. A minimum API szint legyen **API24: Android 7.0**.  

!!!danger "FILE PATH"
	A projekt a repository-ban lévő ShoppingList könyvtárba kerüljön, és beadásnál legyen is felpusholva! A kód nélkül nem tudunk maximális pontot adni a laborra!

Töltsük le és tömörítsük ki [az alkalmazáshoz szükséges erőforrásokat](./downloads/res.zip), majd másoljuk be őket a projekt *app/src/main/res* mappájába (Studio-ban a *res* mappán állva *Ctrl+V*)!

## Perzisztens adattárolás megvalósítása (1 pont)
Az adatok perzisztens tárolásához a `Room` könyvtárat fogjuk használni.

### Room hozzáadása a projekthez

Kezdjük azzal, hogy az app modulhoz tartozó `build.gradle.kts` fájlban a pluginokhoz hozzáírunk egy sort (bekapcsoljuk a Kotlin Annotation Processort - KAPT):
```gradle
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.jetbrains.kotlin.android)
    kotlin("kapt")
}
//...
```

Ezt követően, nyissuk meg a `libs.versions.toml` fájlt, és írjuk bele a következőket:
```toml
[versions]
...
roomRuntime = "2.6.1"
[libraries]
...
androidx-room-compiler = { module = "androidx.room:room-compiler", version.ref = "roomRuntime" }
androidx-room-ktx = { module = "androidx.room:room-ktx", version.ref = "roomRuntime" }
androidx-room-runtime = { module = "androidx.room:room-runtime", version.ref = "roomRuntime" }
```

Majd ismét folytassuk a `build.gradle.kts` fájlon belül a `dependencies{}`-el. Ide másoljuk be az alábbi kódot:

```gradle
dependencied {
    ...
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    kapt(libs.androidx.room.compiler)
}
```

Ezután kattintsunk a jobb felső sarokban megjelenő **Sync now** gombra.

!!!info "Room"
    A  `Room` egy kényelmes adatbazáskezelést lehetővé tevő API-t nyújt a platform szintű SQLite implementáció fölé. Megspórolható vele a korábban látott sok újra és újra megírandó kód, például a táblák adatait és létrehozó scriptjét tartalmazó *Table osztályok, a DBHelper és a PersistentDataHelper*. Ezeket és más segédosztályokat a `Room` *annotation* alapú kódgenerálással hozza létre a *build* folyamat részeként.

    A `Room` alapvető komponenseinek, architektúrájának és használatának leírása megtalálható a megfelelő [developer.android.com](https://developer.android.com/training/data-storage/room/) oldalon.


### Egy modell osztály létrehozása
A `hu.bme.aut.android.shoppinglist` *Packageben* hozzunk létre egy új *Packaget* `data` néven. Ebben a *Packageben* hozzunk létre szintén egy új *Packaget* aminek a neve `entity` legyen, majd ezen belül egy új *Kotlin Filet*, aminek a neve legyen `ShoppingItem`. (A második *Package* csak nagyobb projekteknél játszik fontos szerept, hogy ha több adatbázist is szeretnénk implementálni.):
```kotlin
@Entity(tableName = "shoppingitem")
data class ShoppingItem(
    @ColumnInfo(name = "id") @PrimaryKey(autoGenerate = true) var id: Long? = null,
    @ColumnInfo(name = "name") var name: String,
    @ColumnInfo(name = "description") var description: String,
    @ColumnInfo(name = "category") var category: String,
    @ColumnInfo(name = "estimatedPrice") var estimatedPrice: Int,
    @ColumnInfo(name = "isBought") var isBought: Boolean
){
    enum class Category{
        FOOD, ELECTRONIC, BOOK;

    }
}
```
Látható, hogy az osztályon, az osztály változóin, valamint az osztályon belül lévő *enum* osztály függvényein *annotációkat* helyeztünk el. Az `@Entity` jelzi a `Room` kódgenerátorának, hogy ennek az osztálynak a példányai adatbázis rekordoknak fognak megfelelni egy táblában és hogy az egyes változói felelnek majd meg a tábla oszlopainak. A `@ColumnInfo` *annotációval* megadjuk, hogy mi legyen a tagváltozónak megfelelő oszlop neve. `@PrimaryKey`-jel jelöljük a tábla egyszerű kulcs attribútumát.

Az osztályban létrehoztunk egy `enum`-ot is, amivel egy kategóriát akarunk kódolni. 

!!!info "data class"
    Kotlinban van lehetőség úgynevezett data class létrehozására. Ezt talán legkönnyebben a Java-s POJO (Plain-Old-Java-Object) osztályoknak lehet megfeleltetni. A céljuk, hogy publikus property-kben összefüggő adatokat tároljanak, semmi több! Ezen kívül automatikusan létrejönnek bizonyos segédfüggvények is, például egy megfelelő equals, toString és copy implementáció.


### Egy DAO osztály létrehozása

!!!info "DAO"
    DAO = [Data Access Object](https://en.wikipedia.org/wiki/Data_access_object)

A `data` package-ben hozzunk létre egy új *Packaget* `dao` névvel, majd ebben egy új Kotlin interfészt, aminek a neve legyen  `ShoppingItemDao`:

```kotlin
@Dao
interface ShoppingItemDao {

    @Query("SELECT * FROM shoppingitem")
    fun getAll(): Flow<List<ShoppingItem>>

    @Insert
    suspend fun insert(item: ShoppingItem)

    @Update
    suspend fun update(item: ShoppingItem)

    @Delete
    suspend fun delete(item: ShoppingItem)
}
```

Egy `@Dao` *annotációval* ellátott interfész a `Room` kódgenerátora számára azt jelzi, hogy generálni kell az interfészhez egy olyan implementációt, ami az interfész függvényeket az azokon lévő annotációk (`@Query`, `@Insert`, `@Update`, `@Delete`) alapján valósítja meg.

Figyeljük meg, hogy az Android Studio a `@Query` *annotáció* paramétereként átadott SQLite scriptre is nyújt kódkiegészítést, hiba jelzést!

### Az adatbázis osztály létrehozása

A `data` package-ben hozzunk létre egy új *Packaget* `database` néven, majd ebben egy új Kotlin osztályt, aminek a neve legyen  `ShoppingListDatabase`:


```kotlin
@Database(entities = [ShoppingItem::class], version = 1)
abstract class ShoppingListDatabase : RoomDatabase() {
    abstract fun shoppingItemDao(): ShoppingItemDao


    companion object{
        @Volatile
        private var INSTANCE: ShoppingListDatabase? = null

        fun getDatabase(context: Context): ShoppingListDatabase{
            return INSTANCE ?: synchronized(this){
                Room.databaseBuilder(context, ShoppingListDatabase::class.java, "shoppinglist_database")
                    .fallbackToDestructiveMigration()
                    .build()
                    .also { INSTANCE = it }
            }
        }
    }
}
```
A `@Database` *annotációval* lehet jelezni a kódgenerátornak, hogy egy osztály egy adatbázist fog reprezentálni. Az ilyen osztálynak *absztraktnak* kell lennie, valamint a `RoomDatabase`-ből kell származnia. Az *annotáció* `entities` paraméterének egy listát kell átadni, ami az adatbázis tábláknak megfelelő `@Entity`-vel jelzett osztályokat tartalmazza. A `version` paraméter értéke a lokális adatbázis verzió. A `ShoppingListDatabase` osztály felelős a megfelelő DAO osztályok elérhetőségéért is.

Ezen kívül van még egy statikus *getDatabase* függvény, ami azt írja le, hogyan kell létrehozni az adatbázist (melyik osztályból, milyen néven). Ez a függvény az alkalmazás kontextusát várja paraméterül.

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **database osztály kódja**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f1.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.


## ViewModel létrehozása (1 pont)

Hozzunk létre egy új *Packaget* `model` néven a projekt mappában, majd ezen belül egy új *Kotlin Filet* `ItemsViewModel` néven, ez az osztály egy ViewModel, amely a bevásárlólista alkalmazás UI-hoz kapcsolodó adatait kezeli. DAO-n keresztül kommunikál, így tudja végrehajtani az implementált műveleteket. 

```kotlin
class ItemsListViewModel(
    context: Context
): ViewModel(

){
    private val itemList: ShoppingItemDao = ShoppingListDatabase.getDatabase(context).shoppingItemDao()

    fun getAllLists() : Flow<List<ShoppingItem>> {
        return itemList.getAll()
    }

    suspend fun insert(item: ShoppingItem){
        itemList.insert(item)
    }

    suspend fun update(item: ShoppingItem){
        itemList.update(item)
    }

    suspend fun delete(item: ShoppingItem){
        itemList.delete(item)
    }
}
```

Itt szükségünk van egy context paraméterre, amit majd a `getDatabase` függvénynek fogunk átadni, ezzel létrehozva egy `ShoppingItemDao` példányt, amelyen már meg tudjuk hívni az implementált műveleteket.

BEADANDO

## Lista megjelenítése `LazyColumn`-al (1 pont)

### Példány létrehozása

Hozzunk létre egy példányt, amit majd később a LazyColumn fog megkapni. Ehhez hozzunk létre egy új *Packaget* `screen` néven, majd ebben egy `item` *Packaget*, és ezen belül egy új *KotlinFilet* `ColumnItem` néven. Ebben fogjuk megtervezni a görgethető listánk egyetlen példányát.

```kotlin
@Composable
fun ColumnItem(
    item: ShoppingItem,
    viewModel: ItemsListViewModel
){
    var isChecked by remember { mutableStateOf(item.isBought) }
    val image = when(item.category){
        "FOOD" -> R.mipmap.groceries
        "ELECTRONICS" -> R.mipmap.lightning
        "BOOK" -> R.mipmap.open_book
        else -> R.mipmap.groceries
    }
    val courutineScope = rememberCoroutineScope()

    Row (
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {

        Row (
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(2f)
        ){
            Checkbox(
                checked = item.isBought,
                onCheckedChange = {
                    isChecked = it

                    courutineScope.launch {
                        viewModel.update(
                            item.copy(isBought = isChecked)
                        )
                    }
                }
            )
            Text(text = "Bought")
        }
        Image(
            modifier = Modifier
                .size(100.dp),
            painter = painterResource(image),
            contentDescription = "image"
        )
        Column (
            modifier = Modifier
                .fillMaxWidth()
                .weight(2f),
            horizontalAlignment = Alignment.Start
        ) {
            Text(text = item.name)
            Text(text = item.description)
            Text(text = item.category)
            Text(text = "${item.estimatedPrice} Ft")
        }
        IconButton(
            modifier = Modifier.weight(1f),
            onClick = {
                /*TODO*/
            }
        ) {
            Icon(
                painter = painterResource(R.mipmap.ic_delete_grey600_48dp),
                contentDescription = "Delete"
            )
        }
    }
}
```

Itt látható, hogy átadjuk a viewModel-t mint paraméter, ez szükséges ahhoz, hogy a checkbox-ot lehessen módosítani a listában. Ezt az onCheckedChange event-nél adjuk át egy courutineScope-ban, ugyanis suspend függvényt ebben tudunk meghívni. Ez módosítani fogja az adatbázisban az `isBought` paramétert.

Miután sikeresen létrehoztunk egy példányt a lista egy eleméből, el tudjuk készíteni a főképernyőt, amin egy `LazyColumn` illetve egy `TopBar` fog elhelyezkedni.


### LazyColumn implementálása

A `LazyColumn`-t egy `Scaffold`-ban fogjuk elhelyezni. Ennek a segítségével könnyen el tudunk helyezni egy `TopBar`-t is, illetve egy `FloatingActionButton`-t is. 

```kotlin
@Composable
fun MainScreen(viewModel: ItemsListViewModel = ItemsListViewModel(LocalContext.current)){
    
    val list by viewModel.getAllLists().collectAsState(initial = emptyList())
    Scaffold (
        topBar = {
            /*TODO*/
        },
        floatingActionButton = {
            /*TODO*/
        }
    ){ innerPadding ->
        LazyColumn (
            modifier = Modifier.padding(innerPadding)
        ) {
            items(list.size) {
                ColumnItem(item = list[it],
                    viewModel = viewModel
                )
            }
        }
    }
}
```

Ehhez, létre kell hoznunk egy Listát ami a `ShoppingItem`-et példányosítja. Ez közvetlen a viewModel-en keresztül fog kommunikálni az adatbázissal. Ezt a listát fogjuk átadni a `LazyColumn`-on belül az `items(..)` paraméternek.

#### FloatingActionButton megvalósítása

Ez a gomb fog felelni azért, hogy egy Dialógus ablak megjelenjen aminek a segítségével új adatot tudunk rögzíteni az adatbázisba. Ehhez létre kell hoznunk egy olyan Composable függvényt, ami a Dialógus ablakot fogja megjeleníteni. Ehhez létre kell hoznunk egy új Boolean változót, aminek a segítségével megjeleníthetővé tehetjük a diaológus ablakot. 
```kotlin
fun MainScreen(...){

    ...
    var dialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {...}
        floatingActionButton = {
            FloatingActionButton(
                containerColor = Color.Cyan,
                shape = MaterialTheme.shapes.extraLarge,
                onClick = {
                    dialog = true
                }) {
                Icon(
                    painter = painterResource(id = R.mipmap.ic_add_white_36dp),
                    contentDescription = "Add new item"
                )
            }
        }
    ) { innerPadding ->
        ...
        if (dialog) {
            ...
        }
    }

}
```
Ennek a FAB-nak adunk egy onClick eseményt, ami a `dialog` Boolean változó értékét állítja `true`-ra, ennek hatására az `if(..)` meghívja a törzsében lévő Composable függvényt. Ez lesz a dialógus ablak.

#### TopBar megvalósítása


Hozzunk létre egy `appbar` packaget a `screen` *Packagen* belül, majd ezen belül egy `TopBar` Kotlin Filet. Majd írjuk bele a következőt:


```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopBar (){
    TopAppBar(
        title = {
            Text(text = "Shopping List")
        },
        actions = {
            IconButton(
                onClick = {
                    /*TODO*/
                }
            ) {
                Icon(
                    painter = painterResource(id = R.mipmap.ic_delete_grey600_48dp),
                    contentDescription = "Delete all items"
                )
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Cyan)
    )
}
```

A `TopAppBar` beépített *Composable* függvénynek adjunk át egy nevet, ezt a title paraméterrel tehetjük meg. Ezen kívül adhatunk át akciógombokat az action paraméterrel. Jelen esetben egy `Delete all items` gombot fogunk hozzáadni, aminek a működését az önállo feladatrésznél kell megvalósítani.


Ezután adjuk hozzá a MainScreen-en a topBar paraméternek:

```kotlin
...
Scaffold(
    topbar = {
        TopBar()
    }
    ...
){
    ...
}
```


## Dialógus ablak megvalósítása (1 pont)

A `screen` Packagen belül hozzunk létre egy `DialogWindow` Kotlin Filet, majd ebben valósítsuk meg az új adat felvételéért felelős képernyőt a következők alapján.

- Felirat az adott műveletről (jelen esetben "New Shopping Item)
- Termék neve beviteli mező
- Termnék leírása beviteli mező
- Termék kategória beviteli mező
- Termék ára beviteli mező
- Checkbox
- Két gomb (cancel, save)

```kotlin
@Composable
fun DialogWindow(
    onDismissRequest: () -> Unit = {},
    item: ShoppingItem? = null,
    viewModel: ItemsListViewModel,
    new : Boolean = false
){
    Column (
        modifier = Modifier
            .background(Color.White)
            .fillMaxWidth()
    ) {

        val courutineScope = rememberCoroutineScope()
        var name by remember { mutableStateOf(item?.name ?: "") }
        var description by remember { mutableStateOf(item?.description?: "") }
        var price by remember { mutableIntStateOf(item?.estimatedPrice ?: 0) }
        var category by remember { mutableStateOf(item?.category ?: "FOOD") }
        var isBought by remember { mutableStateOf(item?.isBought?: false) }
        var expanded by remember { mutableStateOf(false) }
        val options = listOf("FOOD", "ELECTRONICS", "BOOK")

        
        //Title of the Dialog Window
        
        
        //Column for the name of the item
        
        
        //Column for the description of the item
        
        
        //Column for the category of the item
        
        
        //Column for the estimated price of the item
        
        
        //Row for the checkbox if the item is already bought
        
        
        //Row for the buttons
        
    }
}
```

Egészítsük ki az alábbi Dialógus ablaknak a vázát.

`Title of the Dialog Window`
```kotlin
Text(
    text = "New Shopping Item",
    modifier = Modifier
        .fillMaxWidth()
        .padding(8.dp),
    fontWeight = FontWeight.Bold,
    fontSize = 20.sp
)
```

`Column for the name..`
```kotlin
Column (
    modifier = Modifier
        .fillMaxWidth()
        .padding(8.dp)
){
    Text(
        text = "Name",
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
    )
    TextField(
        value = name,
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth(),
        onValueChange = { name = it }
    )
}
```

`Column for the description..`
```kotlin
Column (
    modifier = Modifier
        .fillMaxWidth()
        .padding(8.dp)
){
    Text(
        text = "Description",
        modifier = Modifier.padding(8.dp)
    )
    TextField(
        value = description,
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth(),
        onValueChange = { description = it }
    )
}
```

`Column for the category..`
```kotlin
Column (
    modifier = Modifier
        .fillMaxWidth()
        .padding(8.dp)
){
    Text(
        text = "Category",
        modifier = Modifier.padding(8.dp)
    )

    OutlinedButton(
        onClick = {
            expanded = true
        },
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
    ) {
        Row (
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = category)
            Icon(
                imageVector = if(!expanded) Icons.Default.KeyboardArrowDown else Icons.Default.KeyboardArrowUp,
                contentDescription = null,
            )
        }

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = {
                expanded = false
            }
        ) {
            options.forEach { option ->
                DropdownMenuItem(
                    onClick = {
                        category = option
                        expanded = false
                    },
                    text = {
                        Text(text = option)
                    }
                )
            }
        }


    }
}
```
A kategória választást, egy gomb segítségével fogjuk megvalósítani, ami egy DropDownMenu-t nyit le, és kattintással lehet kiválasztani, a kívánt kategóriát.

`Column for the price..`
```kotlin
Column (
    modifier = Modifier
        .fillMaxWidth()
        .padding(8.dp)
){
    Text(
        text = "Estimated price",
        modifier = Modifier.padding(8.dp)
    )
    TextField(
        value = price.toString(),
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth(),
        onValueChange = { price = it.toInt() },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
    )
}
```
Itt szükséges beállítani, hogy csak Decimal típusú értéket lehessen beírni, ugyanis az adatbázisban is így mentjük el az értékeket, és ez később gondot okozhat, akár alkalmazás Crash-hez is vezethet.

`Row for the checkox`
```kotlin
Row ( //Row for the checkbox if the item is already bought
    modifier = Modifier.padding(8.dp),
    verticalAlignment = Alignment.CenterVertically
) {
    Checkbox(
        checked = isBought,
        onCheckedChange = {
            isBought = it
        }
    )
    Text(text = "Already purchased")
}
```

`Row for the buttons`

```kotlin
Row ( //Row for the buttons
    modifier = Modifier
        .fillMaxWidth()
        .padding(8.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.End
){
    TextButton(
        onClick = {
            expanded = false
            onDismissRequest()
        }
    ) {
        Text(text = "Cancel")
    }
    TextButton(
        onClick = {
            courutineScope.launch {
                expanded = false
                onDismissRequest()
                viewModel.insert(
                    ShoppingItem(
                        name = name,
                        description = description,
                        estimatedPrice = price,
                        category = category,
                        isBought = isBought
                    )
                )
            }
        }
    ) {
        Text(text = "Save")
    }
}
```

Itt átadjuk mindkét gombnak az onDismissRequest-et, illetve a mentés gombnak egy courutineScope-ban indítunk egy inster függvényt. Ennek a segítségével fűzünk az adatbázis elemeihez új adatot.


Módosítsuk a `MainScreen` Composable függvényen belül az `if()` águnkat, aminek át kell adnunk a dialógus ablakunkat. Ezt a következő képpen tehetjük meg:

```kotlin
if (dialog) {
    Dialog(onDismissRequest = { dialog = false }) {
        DialogWindow(viewModel = viewModel, onDismissRequest = { dialog = false })
    }
}
```

Ezzel a lépéssel el is készítettük a főképernyőnket.

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **dialógus ablak** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f4.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

## Önálló feladat: törlés megvalósítása (1 pont)
Elem törlése egyesével, az elemeken található szemetes ikonra kattintás hatására.
???success "Megoldás"
      - Gomb eseménykezelőjének megvalósítása
      - ColumnItem-nek lambda paraméter (deleteItem)
      - coroutineScope létrehozása MainScreen-en
      - `LazyColumn` frissítése

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik az **üres lista** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **a törléshez tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f5.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

## IMSc feladatok
### Megerősítő dialógus (1 pont)
Implementáljunk egy *Remove all* feliratú menüpontot és a hozzá tartozó funkciót!

Az alkalmazás jelenítsen meg egy megerősítő dialógust, amikor a felhasználó a *Remove all* menüpontra kattint. A dialógus tartalmazzon egy rövid szöveges figyelmeztetést, hogy minden elem törlődni fog, egy pozitív és negatív gombot (*OK* és *Cancel*). A pozitív gomb lenyomásakor törlődjenek csak az elemek.

!!!example "BEADANDÓ (1 iMSc pont)"
	Készíts egy **képernyőképet**, amelyen látszik az **megerősítő dialógus** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f6.png néven töltsd föl.
	

### Elemek szerkesztése (1 pont)
Teremtsük meg a lista elemek szerkesztésének lehetőségét. A lista elemre helyezzünk egy szerkesztés gombot, melynek hatására nyíljon meg a már korábban implementált felviteli dialógus, a beviteli mezők pedig legyenek előre kitöltve a mentett értékekkel. Az *OK* gomb hatására a meglévő lista elem módosuljon az adatbázisban és a nézeten is.

!!!example "BEADANDÓ (1 iMSc pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **szerkesztési dialógus** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f7.png néven töltsd föl.

