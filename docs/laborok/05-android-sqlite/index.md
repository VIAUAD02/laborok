# Labor 05 - Rajzoló alkalmazás készítése

## Bevezető

A labor során egy egyszerű rajzoló alkalmazás elkészítése a feladat. Az alkalmazással egy vászonra lehet vonalakat vagy pontokat rajzolni. Ezen kívül szükséges a rajzolt ábrát perzisztensen elmenteni, hogy az alkalmazás újraindítása után is visszatöltődjön.

<p align="center">
<img src="./assets/main_screen.png" width="160">
<img src="./assets/color_selector.png" width="160">
<img src="./assets/style_selector.png" width="160">
</p>

!!!info "Android Room"
    A labor során meg fogunk ismerkedni az SQLite könyvtárral, mellyel egy lokális SQL adatbázisban tudunk adatokat perszisztensen tárolni. A modern Android alapú fejlesztéseknél már általában a Room-ot használják, mely az SQLite-ra építve biztosít egy könnyen használható ORM réteget az Android életciklusokkal kombinálva. Fontosnak tartottuk viszont, hogy könnyen érthető legyen az anyag, ezért most csak az SQLite-os megoldást fogjuk vizsgálni.

!!! warning "IMSc"
	A laborfeladatok sikeres befejezése után az IMSc feladat-ot megoldva 2 IMSc pont szerezhető.


## Előkészületek

A feladatok megoldása során ne felejtsd el követni a [feladat beadás folyamatát](../../tudnivalok/github/GitHub.md).

### Git repository létrehozása és letöltése

1. Moodle-ben keresd meg a laborhoz tartozó meghívó URL-jét és annak segítségével hozd létre a saját repository-dat.

2. Várd meg, míg elkészül a repository, majd checkout-old ki.

    !!! tip ""
        Egyetemi laborokban, ha a checkout során nem kér a rendszer felhasználónevet és jelszót, és nem sikerül a checkout, akkor valószínűleg a gépen korábban megjegyzett felhasználónévvel próbálkozott a rendszer. Először töröld ki a mentett belépési adatokat (lásd [itt](../../tudnivalok/github/GitHub-credentials.md)), és próbáld újra.

3. Hozz létre egy új ágat `megoldas` néven, és ezen az ágon dolgozz.

4. A `neptun.txt` fájlba írd bele a Neptun kódodat. A fájlban semmi más ne szerepeljen, csak egyetlen sorban a Neptun kód 6 karaktere.


## A projekt előkészítése

### A projekt létrehozása

Hozzunk létre egy `Simple Drawer` nevű projektet Android Studioban:

1. Hozzunk létre egy új projektet, válasszuk az *Empty Activity* lehetőséget.
1. A projekt neve legyen `Simple Drawer`, a kezdő package `hu.bme.aut.android.simpledrawer`, a mentési hely pedig a kicheckoutolt repository-n belül az SimpleDrawer mappa.
1. Nyelvnek válasszuk a *Kotlin*-t.
1. A minimum API szint legyen API24: Android 7.0.
1. A *Build configuration language* Kotlin DSL legyen.

!!!danger "FILE PATH"
	A projekt a repository-ban lévő SimpleDrawer könyvtárba kerüljön, és beadásnál legyen is felpusholva! A kód nélkül nem tudunk maximális pontot adni a laborra!

A labor során az alábbi technológiákkal fogunk találkozni:

- SQLite
- Scaffold
    - TopBar
    - BottomBar
- ViewModel
- Dialog

Hogy ha létrejött a projektünk hozzunk létre egy *Packaget* `screen` néven a projekt mappában. Erre a későbbiekben szükség lesz.


### A resource-ok hozzáadása

Először töltsük le [az alkalmazás képeit tartalmazó tömörített fájlt](./downloads/res.zip), ami tartalmazza az összes képet, amire szükségünk lesz. A tartalmát másoljuk be az `app/src/main/res` mappába (ehhez segít, ha _Android Studio_-ban bal fent a szokásos _Android_ nézetről a _Project_ nézetre váltunk erre az időre).

Az alábbi, alkalmazáshoz szükséges _string resource_-okat másoljuk be a `res/values/strings.xml` fájlba:

```xml
<resources>
    <string name="app_name">Simple Drawer</string>

    <string name="style">Stílus</string>
    <string name="line">Vonal</string>
    <string name="point">Pont</string>

    <string name="color">Szín</string>
    <string name="red">Piros</string>
    <string name="green">Zöld</string>
    <string name="blue">Kék</string>

    <string name="are_you_sure_want_to_exit">Biztosan ki akarsz lépni?</string>
    <string name="ok">OK</string>
    <string name="cancel">Mégse</string>
</resources>
```

### Álló layout kikényszerítése

Az alkalmazásunkban az egyszerűség kedvéért most csak az álló módot támogatjuk. Ehhez az `MainActivity.kt`-ben az `onCreate`-n belül módosítsuk az alábbiakat:

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        requestedOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        setContent {
            ...
        }
    }
}
```
## ViewModel létrehozás (..)

Első lépésként hozzuk létre a viewModellünket. Ez segítésget fog nyújtani a szín/stílus váltásban, és később a perzisztens adattárolásban.

Hozzunk létre egy *Packaget* `model` néven, és ezen belül egy `DrawingViewModel` *Kotlin Filet* majd írjuk bele a következő kódot:

```kotlin
class DrawingViewModel(application: Application): AndroidViewModel(application){

    private val _drawingMode = MutableStateFlow(DrawingMode.LINE)
    val drawingMode: StateFlow<DrawingMode> = _drawingMode

    private val _drawingColor = MutableStateFlow(Color.Red)
    val drawingColor: StateFlow<Color> = _drawingColor

    private val _drawElements = MutableStateFlow<List<Any>>(emptyList())
    val drawElements: StateFlow<List<Any>> = _drawElements


    fun setDrawingMode(mode: DrawingMode){
        viewModelScope.launch {
            _drawingMode.value = mode
        }
    }

    fun addDrawElement(element: Any) {
        viewModelScope.launch {
            _drawElements.value += element
        }
    }
}

enum class DrawingMode{
    LINE,
    DOT
}
```

Az viewModel-hez szükségünk van még 4 osztályra, ezek a `DrawingMode`, `DrawingColor`.

!!!warning "Kód értelmezése"
    A laborvezető segítségével értelmezzük a viewModel kódját!

Most, hogy már megvan a viewModellünk, már csak az AppBar-t kell létrehozni, hogy el tudjuk készíteni a kezdőképernyő vázát.

## AppBar-ok létrehozása (..)

A már létrehozott `screen` *Packagen* belül hozzunk létre egy `appbar` *Packaget*, majd ezen belül egy `TopBar` és egy `BottomBar` *Kotlin Filet*, majd írjuk bele a következőt:

`TopBar`
```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopBar(){
    TopAppBar(
        title = { Text(
            text = "Simple Drawer",
            color = Color.White
        ) },
        colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF6200EE))
    )
}
```
Ez csak egy egyszerű TopBar aminek a tetejére kiírhatjuk az alkalmazás nevét. A BottomBar kicsit összetettebb lesz ennél.

`BottomBar`
```kotlin
@Composable
fun BottomBar(){
    BottomAppBar(
        modifier = Modifier.height(70.dp),
        actions = {
            Row (
                modifier = Modifier
                    .fillMaxSize(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ){
                IconButton(
                    onClick = { /*TODO*/ },
                    modifier = Modifier.size(70.dp)
                ) {
                    Icon(
                        painterResource(id = R.mipmap.ic_style),
                        contentDescription = stringResource(id = R.string.style)
                    )
                    //Stílus
                }
                IconButton(onClick = { /*TODO*/ }) {
                    Icon(
                        painter = painterResource(id = R.mipmap.ic_color),
                        stringResource(id = R.string.color)
                    )
                    //Opciók
                }
                IconButton(onClick = { /*TODO*/ }) {
                    Icon(
                        painter = painterResource(id = R.mipmap.ic_clear_canvas),
                        contentDescription = "Delete",
                    )
                }
            }
        },
        containerColor = Color(0xFF6200EE),
    )
}
```
A BottomBar-on 3 icont helyezünk el, ezek közül a Stílus gombbal illetve a Törlés gombbal foglalkozunk. A szín választó gomb az iMSc feladat lesz.


## A kezdő képernyő létrehozása (1 pont)

A `screen` *Packagen* belül hozzunk létre egy `DrawingScreen` Kotlin Filet. Ebben fogjuk elhelyezni a *Scaffold*-ot, aminek a segítségével egy TopBar és egy BottomBar-t is megvalósítunk. Kezdetben a Scaffold tartalma csak egy fekete `Spacer` lesz, ezt később a `Canvas` fogja helyettesíteni.

```kotlin
@Composable
fun DrawingScreen() {
    val viewModel: DrawingViewModel = viewModel(
        factory = ViewModelProvider.AndroidViewModelFactory(
            LocalContext.current.applicationContext as Application
        )
    )
    val drawingMode by viewModel.drawingMode.collectAsState()

    Scaffold (
        topBar = {
            TopBar()
        },
        bottomBar = {
            BottomBar()
        }
    ) { innerPadding ->
        Spacer (
            modifier = Modifier
                .background(Color.Black)
                .padding(innerPadding)
                .fillMaxSize())
    }
}
```

Hogy ha ezzel is megvagyunk indítsuk el az alkalmazást, ha mindent jól csináltunk látnunk kellene a két AppBar-t illetve a közötte elhelyezkedő fekete képernyőt. A BottomBar-on szereplő gombok közül csak a Stílus választónak kell működnie, mivel a többire nem helyeztünk még `onClick` actiont.

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik az **elkészült kezdőképernyő** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba fx.png néven töltsd föl. 

## Stílusválasztó (..)

Most, hogy már létre van hozva a BottomBar, illetve a kezdőképernyő váza, valósítsuk meg a stílus választást is. Ehhez módosítanunk kell a `BottomBar`-t, úgy, hogy ha a Stílus választó gombra kattintunk, akkor megjelenjen egy ablak, amin ki lehet választani a rajzmódot. Ezt a következő képpen tehetjük meg:

```kotlin
@Composable
fun BottomBar(
    viewModel: DrawingViewModel = viewModel()
){
    var showStyle by remember { mutableStateOf(false) }
    val drawingMode by viewModel.drawingMode.collectAsState()

    BottomAppBar(
        ...
        actions = {
            Row (
                ...
            ){
                IconButton(
                    onClick = { showStyle = !showStyle},
                    modifier = Modifier.size(70.dp)
                ) {
                    Icon(
                        painterResource(id = R.mipmap.ic_style),
                        contentDescription = stringResource(id = R.string.style)
                    )
                    DropdownMenu(
                        expanded = showStyle,
                        onDismissRequest = { showStyle = false}) {
                        DropdownMenuItem(
                            text = { Text(
                                stringResource(id = R.string.point),
                                color = if (drawingMode == DrawingMode.DOT) Color.Magenta else Color.Black
                            ) },
                            onClick = {
                                viewModel.setDrawingMode(DrawingMode.DOT)
                                showStyle = false
                            }
                        )
                        DropdownMenuItem(
                            text = { Text(
                                stringResource(id = R.string.line),
                                color = if (drawingMode == DrawingMode.LINE) Color.Magenta else Color.Black)
                            },
                            onClick = {
                                viewModel.setDrawingMode(DrawingMode.LINE)
                                showStyle = false
                            }
                        )
                    }
                }
                ...
            }
        },
        ...
    )
}
```

Ezután módosítsuk a `DrawingScreen`-en a `BottomBar` függvény hívást, és vegyük hozzá a viewModel paramétert.

```kotlin
@Composable
fun DrawingScreen() {
    ...

    Scaffold (
        topBar = {
            TopBar()
        },
        bottomBar = {
            BottomBar(
                viewModel = viewModel
            )
        }
    ) { innerPadding ->
        ...
    }
}
```

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik az **elkészült Stílusválasztó kinyitva** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba fx.png néven töltsd föl. 


## Canvas osztály implementálása (..)

Ehhez hozzunk létre két data class-t a `model` *Packageban* `Line` és `Dot` néven, majd implementáljuk a két osztályt:

```kotlin
data class Dot(
    var x: Float = 0F,
    var y: Float = 0F,
    var color: Color = Color.Yellow
)
```
```kotlin
data class Line(
    var start: Dot,
    var end: Dot,
    var color: Color = Color.Yellow
)
```

Ilyen formában fogjuk tárolni az adatunkat a listában. A vonalnak a két végpontját lehetne 1-1 `Dot` objektummal tárolni, viszont az egyszerűség kedvéért, most így fogjuk megoldani.

Ezután a `screen` *Packagen* belül hozzunk létre egy `CanvasScreen` *Kotolin Filet*. Ebben a Composable osztályban megvalósítjuk a `Canvas` beépített Composable-t, aminek a segítségével fogjuk a rajzolást véghezvinni. Ennek az osztálynak van egy `Modifier.pointerInteropFilter` paramétere, aminek a segítségével fogjuk a gesztusokat lekezelni.

```kotlin
fun CanvasScreen(
    modifier: Modifier = Modifier,
    currentColor: Color,
    drawingMode: DrawingMode,
    viewModel: DrawingViewModel,
    drawElements: List<Any>
) {
    var startPoint by remember { mutableStateOf<Offset?>(null) }
    var endPoint by remember { mutableStateOf<Offset?>(null) }
    var tempPoint by remember { mutableStateOf<Offset?>(null) }

    Canvas(
        modifier = modifier
            .background(Color.Black)
            .pointerInteropFilter { event ->
                when (event.action) {
                    /*TODO*/
                    //ACTION_DOWN

                    //ACTION_MOVE

                    //ACTION_UP
                }
                true
            }
    ) {

        //TODO drawElements
        
    }
```

Az `event.action` belül kezelni fogjuk a `MotionEvent.ACTION_DOWN`, `MotionEvent.ACTION_MOVE`, `MotionEvent.ACTION_UP` eventeket. Valamint a `Canvas` screen-en a rajzolást is.

`ACTION_DOWN`
```kotlin
MotionEvent.ACTION_DOWN -> {
    startPoint = Offset(event.x, event.y)
    tempPoint = startPoint
}
```
Ez az esemény akkor következik be, amikor az ujjunkat a képernyőre ráhelyezzük. Ilyenkor elmentjük ezt a paramétert, egy startPoint váltózóba.

`ACTION_MOVE`
```kotlin
MotionEvent.ACTION_MOVE -> {
    tempPoint = Offset(event.x, event.y)
    if (drawingMode == DrawingMode.LINE) {
        endPoint = tempPoint
    }
}
```
Miután lehelyezük az ujjunkat, tudjuk mozgatni is. Ilyenkor következik be ez az esemény. Itt két részre bontódik a folyamat, ugyanis, hogy ha pont-ot rajzolunk és mozgatjuk az ujjunkat, akkor a pontot az utolsó pozícióra szeretnénk helyezni, így a tempPoint-ba írjuk bele a pozíciót. Hogy ha vonalat rajzolunk, akkor az endPoint-ba kell beleírnunk a pozíciót.

`ACTION_UP`
```kotlin
MotionEvent.ACTION_UP -> {
    if (drawingMode == DrawingMode.DOT) {
        tempPoint?.let {
            viewModel.addDrawElement(Dot(it.x, it.y, currentColor))
        }
    } else if (drawingMode == DrawingMode.LINE) {
        endPoint?.let {
            startPoint?.let { start ->
                viewModel.addDrawElement(
                    Line(
                        Dot(start.x, start.y, currentColor),
                        Dot(it.x, it.y, currentColor),
                        currentColor
                    )
                )
            }
        }

    }
    startPoint = null
    endPoint = null
    tempPoint = null
}
```

Ennél az eseménynél már azt kezeljük mikor a felhasználó felemelte az újját a képernyőről. Itt is két lehetőségre bomlik az algoritmus, ugyanis, hogy ha pontról van szó, akkor csak a `tempPoint` értékét kell rögzíteni. Azonban, ha már vonalról, akkor az `endPoint` illetve a `startPoint` értékeit kell rögzíteni vonalként. **Mintkét eseménynél szükséges a null ellenőrzés**!


Miután az események megvannak, már csak a kirajzolást kell megoldani. Ezt úgy tehetjük meg, hogy a drawElements-be eltárolt adatokat egyesével kirajzoljuk típusuktól függően:

```kotlin
Canvas (..){
    drawElements.forEach { element ->
        when (element) {
            is Dot -> drawCircle(color = element.color, center = Offset(element.x, element.y), radius = 5f)
            is Line -> drawLine(color = element.color, start = Offset(element.start.x, element.start.y), end = Offset(element.end.x, element.end.y), strokeWidth = 5f)
        }
    }
    ...
}
```
Ezzel kész is van a CanvasScreen, azonban így még nem látjuk a rajzot, csak ha az ujjunkat felemeltük a kijelzőről. Ezt a következő képpen lehet javítani:

```kotlin
Canvas (..){
    ...
    tempPoint?.let {
        if (drawingMode == DrawingMode.DOT) {
            drawCircle(color = currentColor, center = it, radius = 5f)
        } else if (drawingMode == DrawingMode.LINE && startPoint != null) {
            drawLine(color = currentColor, start = startPoint!!, end = it, strokeWidth = 5f)
        }
    }
}
```
Ebben az esetben kirajzoljuk azt az elemet aminek a kezdőpontja az a pont ahol lehelyeztük az ujjunkat, a végpontja pedig az ahol az ujjunk van. Ha ezt mozgatjuk akkor valós időben frissülni fog, így láthatjuk előre a végeredményt.

Ezután módosítsuk a `DrawingScreen`-t és cseréljük le a `Spacer`-t az imént elkészített `CanvasScreen`-re.

```kotlin
@Composable
fun DrawingScreen() {
    ...
    Scaffold (
        ...
    ) { innerPadding ->
        CanvasScreen(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize(),
            currentColor = drawingColor,
            drawingMode = drawingMode,
            viewModel = viewModel,
            drawElements = drawElements
        )
    }
}
```

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik az **elkészült CanvasScreen** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel) pár vonallal és ponttal, egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba fx.png néven töltsd föl. 

## Perzisztencia megvalósítása *SQLite* adatbázis segítségével (..)

Ahhoz, hogy az általunk rajzolt objektumok megmaradjanak az alkalmazásból való kilépés után is, az adatainkat valahogy olyan formába kell rendeznünk, hogy azt könnyedén el tudjuk tárolni egy *SQLite* adatbázisban.

Hozzunk létre egy új package-et az `hu.bme.aut.android.simpledrawer`-en belül, aminek adjuk az `sqlite` nevet.

### Táblák definiálása

Az adatbáziskezelés során sok konstans jellegű változóval kell dolgoznunk, mint például a táblákban lévő oszlopok nevei, táblák neve, adatbázis fájl neve, séma létrehozó és törlő szkiptek, stb. Ezeket érdemes egy közös helyen tárolni, így szerkesztéskor vagy új entitás bevezetésekor nem kell a forrásfájlok között ugrálni, valamint egyszerűbb a teljes adatbázist létrehozó és törlő szkripteket generálni. Hozzunk létre egy új singleton osztályt az `object` kulcsszóval az `sqlite` package-en belül `DbConstants` néven.

Ezen belül először is konstansként felvesszük az adatbázis nevét és verzióját is. Ha az adatbázisunk sémáján szeretnénk változtatni, akkor ez utóbbit kell inkrementálnunk, így elkerülhetjük az inkompatibilitás miatti nem kívánatos hibákat.

```kotlin
object DbConstants {

    const val DATABASE_NAME = "simpledrawer.db"
    const val DATABASE_VERSION = 1

    ...
}
```
Ezek után a `DbConstants` nevű osztályba hozzuk létre a `Point` osztályhoz a konstansokat. Az osztályokon belül létrehozunk egy `enum`-ot is, hogy könnyebben tudjuk kezelni a tábla oszlopait, majd konstansokban eltároljuk a tábla létrehozását szolgáló SQL utasítást valamint a tábla nevét is. Végezetül elkészítjük azokat a függvényeket, amelyeket a tábla létrehozásakor, illetve upgrade-elésekor kell meghívni:

```kotlin
object DbConstants{

    const val DATABASE_NAME = "simpledrawer.db"
    const val DATABASE_VERSION = 1

    object Points{
        const val DATABASE_TABLE = "points"

        enum class Columns{
            ID, COORD_X, COORD_Y
        }

        private val DATABASE_CREATE = """create table if not exists $DATABASE_TABLE (
            ${Columns.ID.name} integer primary key autoincrement,
            ${Columns.COORD_X.name} real not null,
            ${Columns.COORD_Y.name} real not null
            );"""

        private const val DATABASE_DROP = "drop table if exists $DATABASE_TABLE;"

        fun onCreate(database: SQLiteDatabase){
            database.execSQL(DATABASE_CREATE)
        }

        fun onUpgrade(database: SQLiteDatabase, oldVersion: Int, newVersion: Int){
            database.execSQL(DATABASE_DROP)
            onCreate(database)
        }
    }
    ...
}
```

Figyeljük meg, hogy a `DbConstants` osztályon belül létrehoztunk egy belső `Points` nevű osztályt, amiben a `Points` entitásokat tároló táblához tartozó konstans értékeket tároljuk. Amennyiben az alkalmazásunk több entitást is adatbázisban tárol, akkor érdemes az egyes osztályokhoz tartozó konstansokat külön-külön belső osztályokban tárolni. Így sokkal átláthatóbb és karbantarthatóbb lesz a kód, mint ha ömlesztve felvennénk a DbConstants-ba az összes tábla összes konstansát. Ezek a belső osztályok praktikusan ugyanolyan névvel léteznek, mint az entitás osztályok. Vegyük tehát fel hasonló módon a `Lines` nevű osztályt is:

```kotlin
object Lines{
    const val DATABASE_TABLE = "lines"

    enum class Columns{
        ID, START_X, START_Y, END_X, END_Y
    }

    private val DATABASE_CREATE = """create table if not exists $DATABASE_TABLE (
        ${Columns.ID.name} integer primary key autoincrement,
        ${Columns.START_X.name} real not null,
        ${Columns.START_Y.name} real not null,
        ${Columns.END_X.name} real not null,
        ${Columns.END_Y.name} real not null
        );"""

    private const val DATABASE_DROP = "drop table if exists $DATABASE_TABLE;"

    fun onCreate(database: SQLiteDatabase){
        database.execSQL(DATABASE_CREATE)
    }

    fun onUpgrade(database: SQLiteDatabase, oldVersion: Int, newVersion: Int){
        database.execSQL(DATABASE_DROP)
        onCreate(database)
    }
}
```

Érdemes megfigyelni továbbá azt is, hogy az osztályokat nem a class kulcsszóval deklaráltuk. Helyette az `object`-et használjuk, amivel a Kotlin nyelv azt biztosítja számunkra, hogy a `DbConstants` és a benne lévő `Points` és `Lines` osztály is singletonként viselkednek, azaz az alkalmazás futtatásakor létrejön belőlük egy példány, további példányokat pedig nem lehet létrehozni belőlük.

### A segédosztály létrehozása
Az adatbázis létrehozásához szükség van egy olyan segédosztályra, ami létrehozza magát az adatbázist, és azon belül inicializálja a táblákat is. Esetünkben ez lesz a `DbHelper` osztály, ami az `SQLiteOpenHelper` osztályból származik. Vegyük fel ezt is az `sqlite` package-be.

```kotlin
class DbHelper(context: Context):
    SQLiteOpenHelper(context, DbConstants.DATABASE_NAME, null, DbConstants.DATABASE_VERSION) {

    override fun onCreate(sqLiteDatabase: SQLiteDatabase) {
        DbConstants.Lines.onCreate(sqLiteDatabase)
        DbConstants.Points.onCreate(sqLiteDatabase)
    }

    override fun onUpgrade(
        sqLiteDatabase: SQLiteDatabase,
        oldVersion: Int,
        newVersion: Int
    ) {
        DbConstants.Lines.onUpgrade(sqLiteDatabase, oldVersion, newVersion)
        DbConstants.Points.onUpgrade(sqLiteDatabase, oldVersion, newVersion)
    }
}
```

Ezen kívül szükségünk van még egy olyan segédosztályra is, ami ezt az egészet összefogja, és amivel egyszerűen tudjuk kezelni az adatbázisunkat. Ez lesz a `PersistentDataHelper` továbbra is az `sqlite` package-ben. Ebben olyan függényeket fogunk megvalósítani, mint pl. az `open()` és a `close()`, amikkel az adatbáziskapcsolatot nyithatjuk meg, illetve zárhatjuk le. Ezen kívül ebben az osztályban valósítjuk meg azokat a függvényeket is, amik az adatok adatbázisba való kiírásáért, illetve az onnan való kiolvasásáért felelősek. Figyeljünk rá, hogy a saját Point osztályunkat válasszuk az import során.

```kotlin
class PersistentDataHelper(context: Context) {
    private var database: SQLiteDatabase? = null
    private val dbHelper: DbHelper = DbHelper(context)


    private val pointColumns = arrayOf(
        DbConstants.Points.Columns.ID.name,
        DbConstants.Points.Columns.COORD_X.name,
        DbConstants.Points.Columns.COORD_Y.name,
    )

    private val lineColumns = arrayOf(
        DbConstants.Lines.Columns.ID.name,
        DbConstants.Lines.Columns.START_X.name,
        DbConstants.Lines.Columns.START_Y.name,
        DbConstants.Lines.Columns.END_X.name,
        DbConstants.Lines.Columns.END_Y.name,
    )


    @Throws(SQLiteException::class)
    fun open() {
        database = dbHelper.writableDatabase
    }

    fun close() {
        dbHelper.close()
    }

    fun persistPoints(points: List<Dot>) {
        clearPoints()
        for (point in points) {
            val values = ContentValues()
            values.put(DbConstants.Points.Columns.COORD_X.name, point.x)
            values.put(DbConstants.Points.Columns.COORD_Y.name, point.y)
            database!!.insert(DbConstants.Points.DATABASE_TABLE, null, values)
        }
    }

    fun restorePoints(): MutableList<Dot> {
        val points: MutableList<Dot> = ArrayList()
        val cursor = database!!.query(DbConstants.Points.DATABASE_TABLE, pointColumns, null, null, null, null, null)
        cursor.moveToFirst()
        while (!cursor.isAfterLast) {
            val point: Dot = cursorToPoint(cursor)
            points.add(point)
            cursor.moveToNext()
        }
        cursor.close()
        return points
    }

    fun clearPoints() {
        database!!.delete(DbConstants.Points.DATABASE_TABLE, null, null)
    }

    private fun cursorToPoint(cursor: Cursor): Dot {
        val point = Dot(
            cursor.getFloat(DbConstants.Points.Columns.COORD_X.ordinal),
            cursor.getFloat(DbConstants.Points.Columns.COORD_Y.ordinal),
            Color(Color.Red.toArgb())
        )
        return point
    }

    fun persistLines(lines: List<Line>) {
        clearLines()
        for (line in lines) {
            val values = ContentValues()
            values.put(DbConstants.Lines.Columns.START_X.name, line.start.x)
            values.put(DbConstants.Lines.Columns.START_Y.name, line.start.y)
            values.put(DbConstants.Lines.Columns.END_X.name, line.end.x)
            values.put(DbConstants.Lines.Columns.END_Y.name, line.end.y)
            database!!.insert(DbConstants.Lines.DATABASE_TABLE, null, values)
        }
    }

    fun restoreLines(): MutableList<Line> {
        val lines: MutableList<Line> = ArrayList()
        val cursor = database!!.query(DbConstants.Lines.DATABASE_TABLE, lineColumns, null, null, null, null, null)
        cursor.moveToFirst()
        while (!cursor.isAfterLast) {
            val line: Line = cursorToLine(cursor)
            lines.add(line)
            cursor.moveToNext()
        }
        cursor.close()
        return lines
    }

    fun clearLines() {
        database!!.delete(DbConstants.Lines.DATABASE_TABLE, null, null)
    }

    private fun cursorToLine(cursor: Cursor): Line {
        val line = Line(
            Dot(cursor.getFloat(DbConstants.Lines.Columns.START_X.ordinal), cursor.getFloat(DbConstants.Lines.Columns.START_Y.ordinal)),
            Dot(cursor.getFloat(DbConstants.Lines.Columns.END_X.ordinal), cursor.getFloat(DbConstants.Lines.Columns.END_Y.ordinal)),
            Color(Color.Red.toArgb())
        )
        return line
    }
}
```

### ViewModel kiegészítése

Ahhoz hogy a perzisztencia rendesen működjön ki kell egészítenünk a viewModel-t, úgy hogy minden egyes rajzolás után elmentse az adatbázisba az adatot, így ha újraindítjuk az alkalmazást az alkalmazásban megmaradnak az adatok. Ahhoz hogy ezt lássuk is újra a rajzoló felületen, be is kell tölteni. Ebben szerpet fog játszani az `init{}` blokk.

```kotlin
class DrawingViewModel(application: Application): AndroidViewModel(application){


    //DrawingMode

    //DrawingColor

    //DrawElements


    private val dataHelper = PersistentDataHelper(application)


    init{
        loadDrawElements()
    }


    //setDrawingMode
    
    
    fun addDrawElement(element: Any) {
        viewModelScope.launch {
            _drawElements.value += element
            saveDrawElements()
        }
    }


    private fun saveDrawElements() {
        viewModelScope.launch {
            dataHelper.open()
            dataHelper.clearPoints()
            dataHelper.clearLines()
            val points = _drawElements.value.filterIsInstance<Dot>()
            val lines = _drawElements.value.filterIsInstance<Line>()
            dataHelper.persistPoints(points)
            dataHelper.persistLines(lines)
            dataHelper.close()
        }
    }

    private fun loadDrawElements() {
        viewModelScope.launch {
            dataHelper.open()
            val points = dataHelper.restorePoints()
            val lines = dataHelper.restoreLines()
            _drawElements.value = points + lines
            dataHelper.close()
        }
    }
}
```

Láthatjuk, hogy az `init{}` blokkban meghívódik a `loadDrawElements()` aminek a segítségével, kiolvassuk a korábban definiált `restorePoints` és `restoreLines` függvényekkel az adatokat az adatbázisból, majd hozzáadjuk a Listánkhoz.

A mentés hasonló módon működik csak ezt a függvényt akkor hívjuk, hogyha rajzoltunk.

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik az **elkészült CanvasScreen** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel) pár vonallal és ponttal, egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba fx.png néven töltsd föl. 





## __________________________________


## A kezdő képernyő létrehozása (1 pont)

Első lépésként hozzunk létre egy új _package_-et az `hu.bme.aut.android.simpledrawer`-en belül, aminek adjuk a `view` nevet. Ebben hozzunk létre egy új osztályt, amit nevezzünk el `DrawingView`-nak, és származzon le a `View` osztályból (`android.view.View`).

Hozzuk létre a szükséges konstruktort ezen belül:

```kotlin
class DrawingView(context: Context?, attrs: AttributeSet?) : View(context, attrs) {

}
```

Miután létrehoztuk a `DrawingView`-t, nyissuk meg a `res/layout/activity_drawing.xml`-t, és hozzunk létre gyökérelemként egy `ConstraintLayout`-ot, azon belül alulra egy `Toolbar`-t rakjunk, fölé pedig a frissen létrehozott `DrawingView`-nkból helyezzünk el egy példányt fekete háttérrel. Végezetül a layoutnak így kell kinéznie:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".DrawingActivity">

    <hu.bme.aut.android.simpledrawer.view.DrawingView
        android:id="@+id/canvas"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:background="@android:color/black"
        app:layout_constraintBottom_toTopOf="@+id/toolbar"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <androidx.appcompat.widget.Toolbar
        android:id="@+id/toolbar"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:background="?attr/colorPrimary"
        android:minHeight="?attr/actionBarSize"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```


!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik az **elkészült DrawingActivity** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f1.png néven töltsd föl. 

## Stílusválasztó (1 pont)

Miután létrehoztuk a rajzolás tulajdonságainak állításáért felelős `Toolbar`-t, hozzuk létre a menüt, amivel be lehet állítani, hogy pontot vagy vonalat rajzoljunk. Ehhez hozzunk létre egy új _Android resource directory_-t `menu` néven a `res` mappában, és _Resource type_-nak is válasszuk azt, hogy `menu`. Ezen belül hozzunk létre egy új _Menu resource file_-t `menu_toolbar.xml` néven. Ebben hozzunk létre az alábbi hierarchiát:

```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">
    <item
        android:id="@+id/menu_style"
        android:icon="@drawable/ic_style"
        android:title="@string/style"
        app:showAsAction="ifRoom">
        <menu>
            <group android:checkableBehavior="single">
                <item
                    android:id="@+id/menu_style_line"
                    android:checked="true"
                    android:title="@string/line" />
                <item
                    android:id="@+id/menu_style_point"
                    android:checked="false"
                    android:title="@string/point" />
            </group>
        </menu>
    </item>
</menu>
```

Ezután kössük be a menüt, hogy megjelenjen a `Toolbar`-on.
Ahhoz, hogy elérjük a létrehozott erőforrásokat kódból, view binding-ra lesz szükségünk. A modul szintű gradle file-ba fegyük fel a következő elemet. ***Ne felejtsünk*** el a `Sync` now gombra kattintani a módosítást követően.

```groovy
android {
    ...
    buildFeatures {
        viewBinding = true
    }
}
```
Ezután hozzunk létre egy binding adattagot a `DrawingActivity`-n belül `toolbarBinding` néven és inicializáljuk az `onCreate` függvényben.

```kotlin
private lateinit var binding: ActivityDrawingBinding

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding = ActivityDrawingBinding.inflate(layoutInflater)
    setContentView(binding.root)
}
```

Már csak annyi van hátra, hogy a `DrawingActivity`-ben felüldefiniáljuk  az _Activity_ `onCreateOptionsMenu()` és `onOptionsItemSelected()` függvényét az alábbi módon:

```kotlin
override fun onCreateOptionsMenu(menu: Menu): Boolean {
    val toolbarMenu: Menu = binding.toolbar.menu
    menuInflater.inflate(R.menu.menu_toolbar, toolbarMenu)
    for (i in 0 until toolbarMenu.size()) {
        val menuItem: MenuItem = toolbarMenu.getItem(i)
        menuItem.setOnMenuItemClickListener { item -> onOptionsItemSelected(item) }
        if (menuItem.hasSubMenu()) {
            val subMenu: SubMenu = menuItem.subMenu!!
            for (j in 0 until subMenu.size()) {
                subMenu.getItem(j)
                    .setOnMenuItemClickListener { item -> onOptionsItemSelected(item) }
            }
        }
    }
    return super.onCreateOptionsMenu(menu)
}
```
```kotlin
override fun onOptionsItemSelected(item: MenuItem): Boolean {
    return when (item.itemId) {
        R.id.menu_style_line -> {
            item.isChecked = true
            true
        }
        R.id.menu_style_point -> {
            item.isChecked = true
            true
        }
        else -> super.onOptionsItemSelected(item)
    }
}
```

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **elkészült menü kinyitva** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f2.png néven töltsd föl. 

## A `DrawingView` osztály implementálása (1 pont)

### A modellek létrehozása

A rajzprogramunk, ahogy az már az előző feladatban is kiderült, kétféle rajzolási stílust fog támogatni. Nevezetesen a pont- és vonalrajzolást. Ahhoz, hogy a rajzolt alakzatokat el tudjuk tárolni szükségünk lesz két új típusra, modellre, amihez hozzunk létre egy új _package_-et a `hu.bme.aut.android.simpledrawer`-en belül `model` néven.

Ezen belül először hozzunk létre egy `Point` osztályt, ami értelemszerűen a pontokat fogja reprezentálni. Kétparaméteres konstruktort fogunk  létrehozni, amihez alapértékeket rendelünk.

```kotlin
data class Point(
    var x: Float = 0F,
    var y: Float = 0F
)
```

Miután ezzel megvagyunk, hozzunk létre egy `Line` osztályt. Mivel egy vonalat a két végpontjának megadásával ki tudunk 
rajzoltatni, így elegendő két `Point`-ot tartalmaznia az osztálynak.

```kotlin
data class Line(
    var start: Point,
    var end: Point
)
```

### A rajzolási stílus beállítása

Most, hogy megvannak a modelljeink el lehet kezdeni magának a rajzolás funkciójának fejlesztését. Ehhez a `DrawingView` osztályt fogjuk ténylegesen is elkészíteni. Először vegyünk fel az osztályon belül egy `companion object`-et, amiben a rajzolási stílus konstansait fogjuk meghatározni. Ehhez kapcsolódóan vegyünk fel egy új `field`-et az osztályunkba, amiben eltároljuk, hogy jelenleg milyen stílus van kiválasztva. 

```kotlin
companion object {
        const val DRAWING_STYLE_LINE = 1
        const val DRAWING_STYLE_POINT = 2
}

var currentDrawingStyle = DRAWING_STYLE_LINE
```

Ha ezek megvannak, akkor egészítsük ki a `DrawingActivity`-ben a menükezelést, úgy, hogy a megfelelő függvények hívódjanak meg. Az `onOptionsItemSelected()` függvény megfelelő `case` ágában meg kell hívnunk a `canvas`-ra a `setDrawingStyle()` függvényt a megfelelő paraméterrel.

```kotlin
override fun onOptionsItemSelected(item: MenuItem): Boolean {
    return when (item.itemId) {
        R.id.menu_style_line -> {
            binding.canvas.currentDrawingStyle = DrawingView.DRAWING_STYLE_LINE
            item.isChecked = true
            true
        }
        R.id.menu_style_point -> {
            binding.canvas.currentDrawingStyle = DrawingView.DRAWING_STYLE_POINT
            item.isChecked = true
            true
        }
        else -> super.onOptionsItemSelected(item)
    }
}
```
### Inicializálások

A rajzolási funkció megvalósításához fel kell vennünk néhány további `field`-et a `DrawingView` osztályban, amiket a konstruktorban inicializálnunk kell. A paint objektumhoz hozzáadjuk a `lateinit` kulcsszót, hogy elég legyen az `init` blokkban inicializálnunk. A `Point` osztály import-ja során használjuk a korábban definiált osztályunkat.

```kotlin
private lateinit var paint: Paint

private var startPoint: Point? = null

private var endPoint: Point? = null

var lines: MutableList<Line> = mutableListOf()
var points: MutableList<Point> = mutableListOf()

init {
    initPaint()
}

private fun initPaint() {
    paint = Paint()
    paint.color = Color.GREEN
    paint.style = Paint.Style.STROKE
    paint.strokeWidth = 5F
}
```

### Gesztusok kezelése

Ahhoz, hogy vonalat vagy pontot tudjunk rajzolni a `View`-nkra, kezelnünk kell a felhasználótól kapott gesztusokat, mint például amikor hozzáér a kijelzőhöz, elhúzza rajta vagy felemeli róla az ujját. Szerencsére ezeket a gesztusokat nem szükséges manuálisan felismernünk és lekezelnünk, a `View` ősosztály `onTouchEvent()` függvényének felüldefiniálásával egyszerűen megolható a feladat.

```kotlin
@SuppressLint("ClickableViewAccessibility")
override fun onTouchEvent(event: MotionEvent): Boolean {
    endPoint = Point(event.x, event.y)
    when (event.action) {
        MotionEvent.ACTION_DOWN -> startPoint = Point(event.x, event.y)
        MotionEvent.ACTION_MOVE -> {
        }
        MotionEvent.ACTION_UP -> {
            when (currentDrawingStyle) {
                DRAWING_STYLE_POINT -> addPointToTheList(endPoint!!)
                DRAWING_STYLE_LINE -> addLineToTheList(startPoint!!, endPoint!!)
            }
            startPoint = null
            endPoint = null
        }
        else -> return false
    }
    invalidate()
    return true
}

private fun addPointToTheList(startPoint: Point) {
    points.add(startPoint)
}

private fun addLineToTheList(startPoint: Point, endPoint: Point) {
    lines.add(Line(startPoint, endPoint))
}
```

Ahogy a fenti kódrészletből is látszik minden gesztusnál elmentjük az adott `TouchEvent` pontját, mint a rajzolás végpontját, illetve ha `MotionEvent.ACTION_DOWN` történt, tehát a felhasználó hozzáért a `View`-hoz, elmentjük ezt kezdőpontként is. Amíg a felhasználó mozgatja az ujját a `View`-n (`MotionEvent.ACTION_MOVE`), addig nem csinálunk semmit, de amint felemeli (`MotionEvent.ACTION_UP`), elmentjük az adott elemet a korábban már definiált listákba. Ezen kívül minden egyes alkalommal meghívjuk az `invalidate()` függvényt, ami kikényszeríti a `View` újrarajzolását.

### A rajzolás

A rajzolás megvalósításához a `View` ősosztály `onDraw()` metódusát kell felüldefiniálnunk. Egyrészt ki kell rajzolnunk a már meglévő objektumokat (amiket a `MotionEvent.ACTION_UP` eseménynél beleraktunk a listába), valamint ki kell rajzolnunk az aktuális kezdőpont (a `MotionEvent.ACTION_DOWN` eseménytől) és a felhasználó ujja közötti vonalat.

```kotlin
override fun onDraw(canvas: Canvas) {
    super.onDraw(canvas)
    for (point in points) {
        drawPoint(canvas, point)
    }
    for (line in lines) {
        drawLine(canvas, line.start, line.end)
    }
    when (currentDrawingStyle) {
        DRAWING_STYLE_POINT -> drawPoint(canvas, endPoint)
        DRAWING_STYLE_LINE -> drawLine(canvas, startPoint, endPoint)
    }
}

private fun drawPoint(canvas: Canvas, point: Point?) {
    if (point == null) {
        return
    }
    canvas.drawPoint(point.x, point.y, paint)
}

private fun drawLine(canvas: Canvas, startPoint: Point?, endPoint: Point?) {
    if (startPoint == null || endPoint == null) {
        return
    }
    canvas.drawLine(
        startPoint.x,
        startPoint.y,
        endPoint.x,
        endPoint.y,
        paint
    )
}
```


!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik az **elkészült kirajzolás** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f3.png néven töltsd föl. 

## Perzisztencia megvalósítása _SQLite_ adatbázis segítségével (1 pont)

Ahhoz, hogy az általunk rajzolt objektumok megmaradjanak az alkalmazásból való kilépés után is, az adatainkat valahogy olyan formába kell rendeznünk, hogy azt könnyedén el tudjuk tárolni egy _SQLite_ adatbázisban. 

Hozzunk létre egy új _package_-et az `hu.bme.aut.android.simpledrawer`-en belül, aminek adjuk az `sqlite` nevet.

### Táblák definiálása

Az adatbáziskezelés során sok konstans jellegű változóval kell dolgoznunk, mint például a táblákban lévő oszlopok nevei, táblák neve, adatbázis fájl neve, séma létrehozó és törlő szkiptek, stb. Ezeket érdemes egy közös helyen tárolni, így szerkesztéskor vagy új entitás bevezetésekor nem kell a forrásfájlok között ugrálni, valamint egyszerűbb a teljes adatbázist létrehozó és törlő szkripteket generálni. Hozzunk létre egy új _singleton_ osztályt az `object` kulcsszóval az `sqlite` _package_-en belül `DbConstants` néven. 

Ezen belül először is konstansként felvesszük az adatbázis nevét és verzióját is. Ha az adatbázisunk sémáján szeretnénk változtatni, akkor ez utóbbit kell inkrementálnunk, így elkerülhetjük az inkompatibilitás miatti nem kívánatos hibákat.

```kotlin
object DbConstants {

    const val DATABASE_NAME = "simpledrawer.db"
    const val DATABASE_VERSION = 1
}
```

Ezek után a `DbConstants` nevű osztályba hozzuk létre a `Point` osztályhoz a konstansokat. Az osztályokon belül létrehozunk egy `enum`-ot is, hogy könnyebben tudjuk kezelni a tábla oszlopait, majd konstansokban eltároljuk a tábla létrehozását szolgáló _SQL utasítást_ valamint a tábla nevét is. Végezetül elkészítjük azokat a függvényeket, amelyeket a tábla létrehozásakor, illetve upgrade-elésekor kell meghívni:

```kotlin
object DbConstants {

    const val DATABASE_NAME = "simpledrawer.db"
    const val DATABASE_VERSION = 1

    object Points {
        const val DATABASE_TABLE = "points"

        enum class Columns {
            ID, COORD_X, COORD_Y
        }

        private val DATABASE_CREATE = """create table if not exists $DATABASE_TABLE (
            ${Columns.ID.name} integer primary key autoincrement,
            ${Columns.COORD_X.name} real not null,
            ${Columns.COORD_Y} real not null
            );"""

        private const val DATABASE_DROP = "drop table if exists $DATABASE_TABLE;"

        fun onCreate(database: SQLiteDatabase) {
            database.execSQL(DATABASE_CREATE)
        }

        fun onUpgrade(database: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
            Log.w(
                Points::class.java.name,
                "Upgrading from version $oldVersion to $newVersion"
            )
            database.execSQL(DATABASE_DROP)
            onCreate(database)
        }
    }
}
```

Figyeljük meg, hogy a `DbConstants` osztályon belül létrehoztunk egy belső `Points` nevű osztályt, amiben a `Points` entitásokat tároló táblához tartozó konstans értékeket tároljuk. Amennyiben az alkalmazásunk több entitást is adatbázisban tárol, akkor érdemes az egyes osztályokhoz tartozó konstansokat külön-külön belső osztályokban tárolni. Így sokkal átláthatóbb és karbantarthatóbb lesz a kód, mint ha ömlesztve felvennénk a DbConstants-ba az összes tábla összes konstansát. Ezek a belső osztályok praktikusan ugyanolyan névvel léteznek, mint az entitás osztályok. Vegyük tehát fel hasonló módon a `Lines` nevű osztályt is:

```kotlin
object Lines {
    const val DATABASE_TABLE = "lines"

    enum class Columns {
        ID, START_X, START_Y, END_X, END_Y
    }

    private val DATABASE_CREATE ="""create table if not exists $DATABASE_TABLE (
    ${Columns.ID.name} integer primary key autoincrement,
    ${Columns.START_X} real not null,
    ${Columns.START_Y} real not null,
    ${Columns.END_X} real not null,
    ${Columns.END_Y} real not null

    );"""

    private const val DATABASE_DROP = "drop table if exists $DATABASE_TABLE;"

    fun onCreate(database: SQLiteDatabase) {
        database.execSQL(DATABASE_CREATE)
    }

    fun onUpgrade(database: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        Log.w(
            Lines::class.java.name,
            "Upgrading from version $oldVersion to $newVersion"
        )
        database.execSQL(DATABASE_DROP)
        onCreate(database)
    }
}
```

Érdemes megfigyelni továbbá azt is, hogy az osztályokat nem a class kulcsszóval deklaráltuk. Helyette az `object`-et használjuk, amivel a Kotlin nyelv azt biztosítja számunkra, hogy a `DbConstants` és a benne lévő `Points` és `Lines` osztály is singletonként viselkednek, azaz az alkalmazás futtatásakor létrejön belőlük egy példány, további példányokat pedig nem lehet létrehozni belőlük.


### A segédosztályok létrehozása

Az adatbázis létrehozásához szükség van egy olyan segédosztályra, ami létrehozza magát az adatbázist, és azon belül inicializálja a táblákat is. Esetünkben ez lesz a `DbHelper` osztály, ami az `SQLiteOpenHelper` osztályból származik. Vegyük fel ezt is az `sqlite` _package_-be.


```kotlin
class DbHelper(context: Context) :
    SQLiteOpenHelper(context, DbConstants.DATABASE_NAME, null, DbConstants.DATABASE_VERSION) {

    override fun onCreate(sqLiteDatabase: SQLiteDatabase) {
        DbConstants.Lines.onCreate(sqLiteDatabase)
        DbConstants.Points.onCreate(sqLiteDatabase)
    }

    override fun onUpgrade(
        sqLiteDatabase: SQLiteDatabase,
        oldVersion: Int,
        newVersion: Int
    ) {
        DbConstants.Lines.onUpgrade(sqLiteDatabase, oldVersion, newVersion)
        DbConstants.Points.onUpgrade(sqLiteDatabase, oldVersion, newVersion)
    }
}
```

Ezen kívül szükségünk van még egy olyan segédosztályra is, ami ezt az egészet összefogja, és amivel egyszerűen tudjuk kezelni az adatbázisunkat. Ez lesz a `PersistentDataHelper` továbbra is az `sqlite` _package_-ben. Ebben olyan függényeket fogunk megvalósítani, mint pl. az `open()` és a `close()`, amikkel az adatbáziskapcsolatot nyithatjuk meg, illetve zárhatjuk le. Ezen kívül ebben az osztályban valósítjuk meg azokat a függvényeket is, amik az adatok adatbázisba való kiírásáért, illetve az onnan való kiolvasásáért felelősek. Figyeljünk rá, hogy a saját Point osztályunkat válasszuk az _import_ során.

```kotlin
class PersistentDataHelper(context: Context) {
    private var database: SQLiteDatabase? = null
    private val dbHelper: DbHelper = DbHelper(context)

    private val pointColumns = arrayOf(
        DbConstants.Points.Columns.ID.name,
        DbConstants.Points.Columns.COORD_X.name,
        DbConstants.Points.Columns.COORD_Y.name
    )

    private val lineColumns = arrayOf(
        DbConstants.Lines.Columns.ID.name,
        DbConstants.Lines.Columns.START_X.name,
        DbConstants.Lines.Columns.START_Y.name,
        DbConstants.Lines.Columns.END_X.name,
        DbConstants.Lines.Columns.END_Y.name

    )

    @Throws(SQLiteException::class)
    fun open() {
        database = dbHelper.writableDatabase
    }

    fun close() {
        dbHelper.close()
    }

    fun persistPoints(points: List<Point>) {
        clearPoints()
        for (point in points) {
            val values = ContentValues()
            values.put(DbConstants.Points.Columns.COORD_X.name, point.x)
            values.put(DbConstants.Points.Columns.COORD_Y.name, point.y)
            database!!.insert(DbConstants.Points.DATABASE_TABLE, null, values)
        }
    }

    fun restorePoints(): MutableList<Point> {
        val points: MutableList<Point> = ArrayList()
        val cursor: Cursor =
            database!!.query(DbConstants.Points.DATABASE_TABLE, pointColumns, null, null, null, null, null)
        cursor.moveToFirst()
        while (!cursor.isAfterLast) {
            val point: Point = cursorToPoint(cursor)
            points.add(point)
            cursor.moveToNext()
        }
        cursor.close()
        return points
    }

    fun clearPoints() {
        database!!.delete(DbConstants.Points.DATABASE_TABLE, null, null)
    }

    private fun cursorToPoint(cursor: Cursor): Point {
        val point = Point()
        point.x =cursor.getFloat(DbConstants.Points.Columns.COORD_X.ordinal)
        point.y =cursor.getFloat(DbConstants.Points.Columns.COORD_Y.ordinal)
        return point
    }

    fun persistLines(lines: List<Line>) {
        clearLines()
        for (line in lines) {
            val values = ContentValues()
            values.put(DbConstants.Lines.Columns.START_X.name, line.start.x)
            values.put(DbConstants.Lines.Columns.START_Y.name, line.start.y)
            values.put(DbConstants.Lines.Columns.END_X.name, line.end.x)
            values.put(DbConstants.Lines.Columns.END_Y.name, line.end.y)
            database!!.insert(DbConstants.Lines.DATABASE_TABLE, null, values)
        }
    }

    fun restoreLines(): MutableList<Line> {
        val lines: MutableList<Line> = ArrayList()
        val cursor: Cursor =
            database!!.query(DbConstants.Lines.DATABASE_TABLE, lineColumns, null, null, null, null, null)
        cursor.moveToFirst()
        while (!cursor.isAfterLast) {
            val line: Line = cursorToLine(cursor)
            lines.add(line)
            cursor.moveToNext()
        }
        cursor.close()
        return lines
    }

    fun clearLines() {
        database!!.delete(DbConstants.Lines.DATABASE_TABLE, null, null)
    }

    private fun cursorToLine(cursor: Cursor): Line {
        val startPoint = Point(
            cursor.getFloat(DbConstants.Lines.Columns.START_X.ordinal),
            cursor.getFloat(DbConstants.Lines.Columns.START_Y.ordinal)
        )
        val endPoint = Point(
            cursor.getFloat(DbConstants.Lines.Columns.END_X.ordinal),
            cursor.getFloat(DbConstants.Lines.Columns.END_Y.ordinal)
        )
        return Line(startPoint, endPoint)
    }

}
```

### A `DrawingView` kiegészítése

Ahhoz, hogy a rajzolt objektumainkat el tudjuk menteni az adatbázisba, fel kell készíteni a `DrawingView` osztályunkat arra, hogy átadja, illetve meg lehessen adni neki kívülről is őket. Ehhez a következő függvényeket kell felvennünk:

```kotlin
fun restoreObjects(points: MutableList<Point>?, lines: MutableList<Line>?) {
    points?.also { this.points = it }
    lines?.also { this.lines = it }
    invalidate()
}
```

### A `DrawingActivity` kiegészítése

A perzisztencia megvalósításához már csak egy feladatunk maradt hátra, mégpedig az, hogy bekössük a frissen létrehozott osztályainkat a `DrawingActivity`-nkbe. Ehhez először is példányosítanunk kell a `PersistentDataHelper` osztályunkat. Mivel az adatbázishozzáférés drága erőforrás, ezért ne felejtsük el az `Activity` `onResume()` függvényében megnyitni, az `onPause()` függvényében pedig lezárni a vele való kapcsolatot:

```kotlin
private lateinit var dataHelper: PersistentDataHelper

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding = ActivityDrawingBinding.inflate(layoutInflater)
    setContentView(binding.root)

    dataHelper = PersistentDataHelper(this)
    dataHelper.open()
    restorePersistedObjects()
}

override fun onResume() {
    super.onResume()
    dataHelper.open()
}

override fun onPause() {
    dataHelper.close()
    super.onPause()
}

private fun restorePersistedObjects() {
    binding.canvas.restoreObjects(dataHelper.restorePoints(), dataHelper.restoreLines())
}
```

Végezetül szeretnénk, hogy amikor a felhasználó ki szeretne lépni az alkalmazásból, akkor egy dialógusablak jelenjen meg, hogy biztos kilép-e, és ha igen, csak abban az esetben mentsük el a rajzolt objektumokat, és lépjünk ki az alkalmazásból. Ehhez felül kell definiálnunk az `Activity` `onBackPressed()` függvényét. Az _AlertDialog_-nál válasszuk az _androidx.appcompat.app_-ba tartozó verziót.

```kotlin
override fun onBackPressed() {
    AlertDialog.Builder(this)
        .setMessage(R.string.are_you_sure_want_to_exit)
        .setPositiveButton(R.string.ok) { _, _ -> onExit() }
        .setNegativeButton(R.string.cancel, null)
        .show()
}

private fun onExit() {
    dataHelper.persistPoints(binding.canvas.points)
    dataHelper.persistLines(binding.canvas.lines)
    dataHelper.close()
    finish()
}
```


!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **kilépő dialógus** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **a perzisztens mentéshez tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f4.png néven töltsd föl. 

## Önálló feladat: A vászon törlése (1 pont)

Vegyünk fel a vezérlők közé egy olyan gombot, amelynek segíségével a törölhetjük a vásznat, valósítsuk is meg a funkciót!


!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **törlés gomb** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), a **törlést elvégző kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f5.png néven töltsd föl. 

## Kiegészítő iMSc feladat (2 iMSc pont)

Vegyünk fel az alkalmazásba egy olyan vezérlőt, amivel változtatni lehet a rajzolás színét a 3 fő szín között (_RGB_).

**Figyelem:** az adatbázisban is el kell menteni az adott objektum színét!


!!!example "BEADANDÓ (1 iMSc pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **rajzoló oldal a különböző színekkel** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f6.png néven töltsd föl.
	
	
!!!example "BEADANDÓ (1 iMSc pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **különböző színek mentését végző kódrészletet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f7.png néven töltsd föl. 
