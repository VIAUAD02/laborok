
# Labor 04 - Felhasználói felület készítése - HorizontalPager, Chartok

## Bevezető

A labor során egy HR alkalmazást készítünk el, amelybe belépve a felhasználó meg tudja tekinteni személyes adatait, illetve szabadságot tud rögzíteni. Az alkalmazás nem használ perzisztens adattárolást és valós bejelentkeztetést, csak demo adatokkal dolgozik. A labor fő témája a Fragmentekkel való felületkészítés, illetve a Navigation Component használata lesz.

<p align="center">
<img src="./assets/menu.png" width="160">
<img src="./assets/profile1.png" width="160">
<img src="./assets/profile2.png" width="160">
<img src="./assets/holiday1.png" width="160">
<img src="./assets/datepicker.png" width="160">
</p>


!!! warning "IMSc"
	A laborfeladatok sikeres befejezése után az IMSc feladat-ot megoldva 2 IMSc pont szerezhető.

## Értékelés

Osztályzás:

- Főmenü képernyő: 1 pont
- Profil képernyő: 1 pont
- Szabadság képernyő: 1 pont
- Dátumválasztó, napok csökkentése: 1 pont
- Önálló feladat (szabadság továbbfejlesztése): 1 pont

IMSc: Fizetés menüpont megvalósítása

- Kördiagram: 1 IMSc pont
- Oszlopdiagram: 1 IMSc pont

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

Hozzunk létre egy új Android projektet 'Empty Activity' sablonnal! Az alkalmazás neve legyen `WorkplaceApp`, a Package name pedig `hu.bme.aut.android.workplaceapp`.

!!!danger "FILE PATH"
	A projekt a repository-ban lévő WorkplaceApp könyvtárba kerüljön, és beadásnál legyen is felpusholva! A kód nélkül nem tudunk maximális pontot adni a laborra!

Használhatjuk az alapértelmezett 24-es minimum SDK szintet és a Kotlin DSL-t.

Előzetesen töltsük le az alkalmazás képeit tartalmazó [tömörített fájlt](./downloads/res.zip) és bontsuk ki. A benne lévő mipmap könyvtárat másoljuk be az app/src/main/res mappába (Studio-ban res mappán állva `Ctrl+V`).

## Képernyők kezelése Android alkalmazásokban
A legtöbb mobilalkalmazás jól elkülöníthető oldalak/képernyők kombinációjából épül fel. Az egyik első fő döntés, amit alkalmazástervezés közben meg kell hoznunk, ezeknek a képernyőknek a felépítése, illetve a képernyők közötti navigáció megvalósítása. Egy Android alapú alkalmazás esetén több megoldás közül is választhatunk:

-  *Activity alapú megközelítés*: Minden képernyő egy **Activity**. Mivel az **Activity** egy rendszerszintű komponense az Androidnak, ezért ennek kezeléséért is az operációs rendszer a felelős. Mi közvetlenül sose példányosítjuk, hanem **Intent**-et küldünk a rendszer felé. A navigációért is a rendszer felel, bizonyos opciókat *flagek* segítségével tudunk beállítani.
- *Composable alapú megközelítés*: Ez esetben a képernyőink egy vagy több *Composable* elemből épülnek fel. Ezeknek a kezelése az alkalmazás szintjén történik meg, emiatt mindenképp szükséges egy **Activity**, mely a megjelenítésért felel. A megjelenítést illetve a navigációt a **NavGraph** osztály végzi.
- *Egyéb egyedi megoldás*: Külső vagy saját könyvtár használata a megjelenítéshez, mely tipikusan az alap **View** osztályból származik le. Ilyen például a régi *Conductor*, illetve a *Jetpack Compose*.

Régebben az alkalmazások az Activity alapú megközelítést használták, később azonban áttértek a Fragmentekre. Az ilyen alkalmazásoknál összesen egy fő **Activity** van, mely tartalmazza azt a **FragmentManager** példányt, amit a későbbiekben a **Fragment** alapú képernyők megjelenítésére használunk.

Ez egy alapvetően rugalmas és jól használható megoldás volt, azonban ehhez részleteiben meg kellett ismerni a **FragmentManager** működését, különben könnyen hibákba futhattunk. Ennek a megoldására fejlesztette ki a Google a *Navigation Component* csomagot, mellyel az Android Studió környezetében egy grafikus eszközzel könnyen létre tudjuk hozni az oldalak közötti navigációt, illetve ezt a kódból egyszerűen el tudjuk indítani. 

A Jetpack Compose-ban már a **NavHost** felel a navigációért, és külön-külön hívja meg az egyes *Composable* függvényeket.

## NavHost Compose inicializálás
Első lépésként adjuk hozzá a Navigation Component csomagot az üres projektünkhöz. Ehhez a modul szintű `build.gradle.kts` fájlra illetve a `libs.versions.toml` fájlra lesz szükségünk. Keressük meg ezeket, majd írjuk bele a következő függőséget:

`libs.versions.toml`
```toml
[versions]
...
navigationCompose = "2.7.7"


[libs]
...
androidx-navigation-compose = { module = "androidx.navigation:navigation-compose", version.ref = "navigationCompose" }
```

`build.gradle.kts`

```kts
dependencies {
    ...
    implementation(libs.androidx.navigation.compose)

}
```

Ha ezzel megvagyunk akkor Synceljük a projektet, a jobb fölső sarokban lévő `Sync Now` gombbal.


!!!warning "Sync"
    Figyeljünk rá, hogy Synceljük, ugyanis, hogy ha ez a lépés kimarad, akkor nem fogja megtalálni a szükséges függőségeket, és később ez gondot okozhat!

A Navigation Component *Jetpack Compose* használatával is navigációs gráfot alkalmaz a képernyők és a közöttük lévő kapcsolatok definiálására. Ezt a gráfot azonban közvetlenül *Kotlin* kódban tudjuk megadni. Létrehozásához kövessük az alábbi lépéseket:

1. Hozzuk létre a navigációs gráfot a Jetpack Compose használatával.

2. Készítsünk egy *Packaget* `navigation` néven, majd ebbe a *Packageba* egy új *Kotlin Filet* `NavGraph` néven (*jobb klikk -> New Kotlin Class/File*)

3. Az előző laborokon látott NavGraphoz hasonlóan hozzuk létre a NavGraph-ot:
```kotlin
@Composable
fun NavGraph(...){
    NavHost(...){
        composable("..."){
            Screen1()
        }
        composable("..."){
            Screen2()
        }
    }
}
```

4. Hogy ha ezzel megvagyunk, már, csak bővíteni kell igény szerint ezt a `NavGraph`-ot, illetve a `MainActivity`-ben, ezt a Composable függvényt kell meghívni, majd ez automatikusan a beállított főképernyőt hozza be az alkalmazás elindításakor.
```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WorkplaceAppTheme {
                NavGraph()
            }
        }
    }
}
```
!!!info "Több navigációs gráf"
    A Jetpack Compose használatával több navigációs gráf létrehozása és kezelése is lehetséges, azonban a legtöbb alkalmazásnál elegendő egyetlen `NavGraph`


## Főmenü képernyő (1 pont)

Az első képernyő, amit létrehozunk, a főoldal lesz, melyről a többi oldalra tudunk navigálni. A labor során 2 funkciót fogunk meghvalósítani, ezek a Profil és a Szabadság.

Hozzunk létre egy új *Packaget* a projekt gyökérmappájában, majd nevezzük el `navigation` néven, és ebben hozzunk létre egy új *Kotlin Filet* `NavGraph` néven, majd írjuk meg a kódot az alábbi alapján:

```kotlin
@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
){
    NavHost(
        navController = navController,
        startDestination = "menu"
    ){
        composable("menu"){
            MenuScreen(
                onClick = { destination ->
                    navController.navigate(destination)
                }
            )
        }
    }
}
```

Ezzel létrehoztuk a `NavGraph`-unkat, most már csak bővíteni kell a további képernyőkhöz, valamint meg kell hívni a `MainActivity`-ben. 

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WorkplaceAppTheme {
                NavGraph()
            }
        }
    }
}
```

Ahhoz, hogy az alkalmazásunk működőképes legyen, létre kell hoznunk még a `TopBar` valamint a `MenuScreen` *Composable* függvényeket. Első lépésként valósítsuk meg a `TopBar`-t. Ezt hasonlóan megtehetjük az előző laborokon tanultakkal. Hozzunk létre egy uj *Packaget* a projektmappába `appbar` néven, majd ebben hozzunk létre egy új *Kotlin Filet* `TopBar` néven, és írjuk bele a következő kódot:

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopBar(
    string: String = "Workplace App"
) {
    TopAppBar(
        title = { Text(text = string) },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.inversePrimary
        )
    )
}
```

Ez egy egyszerű AppBar, ennek segítségével elhelyezhetünk különbőző *Actiont* valamint gombokat.

Ezután írjuk meg a `MainScreen` képernyőnket is. Ehhez hozzunk létre egy új *Packaget* `screen` néven, majd ebben egy új *Kotlin Filet* `MainScreen` néven. Ezen belül hozzunk létre egy segéd függvényt, amely a speciális gombokért fog felelni:

```kotlin
@Composable
fun CustomButton(imageId: Int, text: String, clickAction: () -> Unit) {
    Box(
        modifier = Modifier
            .clickable { clickAction() }
            .size(180.dp)
            .background(Color.LightGray)
            .padding(8.dp),
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
        ) {
            Image(
                painter = painterResource(id = imageId),
                contentDescription = text,
                modifier = Modifier
                    .fillMaxSize()
            )
            Text(
                text = text,
                fontSize = 24.sp,
                color = Color.Black,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(4.dp)
            )
        }
    }
}
```

Ez egy ImageButton-ként fog működni, amin egy feliratot is el tudunk helyezni. Ennek a segítségével valósítsuk meg a főképernyőnket:

```kotlin
@Composable
fun MenuScreen(
    onClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold (
        topBar = { TopBar() }
    ) { innerPadding ->
        Box(
            contentAlignment = Alignment.Center,
            modifier = modifier
                .padding(innerPadding)
                .fillMaxSize()
        ) {
            Column(
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxSize()
            ) {
                Row(
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    CustomButton(imageId = R.mipmap.profile, text = "Profile", clickAction = { onClick("profile") })
                    Spacer(modifier = Modifier.width(16.dp))
                    CustomButton(imageId = R.mipmap.holiday, text = "Holiday", clickAction = { onClick("holiday") })
                }
                Spacer(modifier = Modifier.height(16.dp))
                //TODO
            }
        }
    }
}
```

Ennek mintájára, valósítsuk meg a másik két gombot is az alábbi értékekkel:

|Szöveg|Kép|
|------|---|
|`Salary`|`@mipmap.payment`|
|`Cafeteria`|`@mipmap.cafeteria`|

Ne felejtsük el a szövegeket kiszervezni a szöveges erőforrásba! (A szövegen állva <kbd>ALT</kbd>+<kbd>ENTER</kbd>)

Ha most elindítjuk az alkalmazást, akkor mind a 4 gombot látnunk kellene, azonban ha ezekre kattintunk, akkor az alkalmazás el fog crashelni, ugyanis a `NavGraph`unk még hiányos. Ez a következő kódokkal tudjuk pótolni. Ehhez először létre kell hozunk 2 ideiglenes *Kotlin Filet* amit majd később szerkeszteni fogunk.

Hozzunk létre két *Kotlin Filet* a `screen` *Packageba* `ProfileScreen` illetve `HolidayScreen` névvel, és írjuk bele az alábbi ideiglenes kódokat:

```kotlin
@Composable
fun ProfileScreen(
    modifier: Modifier = Modifier
){
    Scaffold (
        topBar = {
            TopBar("Profile")
        }
    ){ innerPadding ->

        Column (
            modifier = modifier
                .padding(innerPadding)
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ){
            Text(
                fontSize = 24.sp,
                text = "Profile Screen"
            )
        }
    }
}
```

```kotlin
@Composable
fun HolidayScreen(
    modifier: Modifier = Modifier
){
    Scaffold (
        topBar ={
            TopBar("Holdiay")
        }
    ) { innerPadding ->

        Column (
            modifier = modifier
                .padding(innerPadding)
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ){
            Text(
                fontSize = 24.sp,
                text = "Holiday Screen"
            )
        }
    }
}
```

Majd ezután kössük be ezt a két új képernyőt a `NavGraph`ba. Ehhez módosítsuk a Gráfunkat a következő képpen. Adjuk hozzá a két új *composable* sort.


```kotlin
@Composable
fun NavGraph(
    ...
){
    NavHost(
        ...
    ){
        ...
        composable("profile"){
            ProfileScreen()
        }

        composable("holiday"){
            HolidayScreen()
        }
        composable("cafeteria"){
            /*TODO*/
        }
    }
}
```

!!!note "Cafeteria"
    A Cafeteria képernyőre navigációt előre beírtuk, hogy a labor végén a gombra való kattintásnál ne crasheljen az alkalmazás. Ezt a funkciót mindenki tudja otthon módosítani gyakorlás képpen.

Indítsuk el az alkalmazást. Mostmár a felső két gombnak működnie kellene.

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **elkészült főoldal kép** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f1.png néven töltsd föl. 


## Profil képernyő elkészítése (1 pont)


A Profil képernyő két lapozható oldalból fog állni (`HorizontalPager`), amelyen a következő információk lesznek megtalálhatóak:

- Első oldal
    - Név
    - Email
    - Lakcím
- Második oldal
    - Személyi szám
    - TAJ szám
    - Adószám
    - Törzsszám

Hozzunk létre egy `data` package-et, azon belül egy `Person` adatosztályt, ebben fogjuk tárolni az oldalakon megjelenő adatokat. Az adat típusú osztályok esetében a Kotlin automatikusan deklarál gyakran használt függvényeket, mint például az `equals()` és `hashCode()` függvényeket különböző objektumok összehasonlításához, illetve egy `toString()` függvényt, mely visszaadja a tárolt változók értékét.


```kotlin
data class Person(
    val name: String,
    val email: String,
    val address: String,
    val id: String,
    val socialSecNum: String,
    val taxId: String,
    val registrationId: String
)
```

A Person osztály példányának elérésére hozzunk létre egy `DataManager` osztályt (szintén a `data` package-en belül), ezzel fogjuk szimulálni a valós adatelérést (Singleton mintát használunk, hogy az alkalmazás minden részéből egyszerűen elérhető legyen, ehhez a Kotlin által biztosított `object` kulcsszót használjuk):

```kotlin
object DataManager {
    val person = Person(
        "Test User", "testuser@domain.com",
        "1234 Test, Random Street 1.",
        "123456AB",
        "123456789",
        "1234567890",
        "0123456789"
    )
}
```

A profiloldalon az a célunk, hogy két külön részben megjelenítsük a normál és részletes adatokat. A két oldal között vízszintes swipe-al lehet majd lépni. Ehhez egy **HorizontalPager**-t fogunk használni, mely Composable függvények között képes ilyen interakciókat megvalósítani.

Hozzunk létre egy új *Package*-et `profile` néven a `screen` *Packagen* belül, majd a `ProfileScreen` *Kotlin Filen -> Jobb Klikk  -> Refactor -> Move* segítségével mozgassuk át az új *Packagebe*, majd ezután hozzunk létre három új *Kotlin Filet* az alábbi nevekkel: `ProfileFirstPage`, `ProfileSecondPage`, `ProfileInfoField`, majd írjuk bele az alábbi kódot.

`ProfileInfoField`

```kotlin
@Composable
fun InfoFields(title: String, value: String) {
    Column(
        modifier = Modifier.padding(bottom = 16.dp)
    ) {
        Text(
            color = Color.Gray,
            text = title,
            fontSize = 20.sp
        )
        Text(
            text = value,
            fontSize = 24.sp
        )
    }
}
```
Ez csak egy segéd *Composable* függvény, amely lehetővé fogja tenni a kevesebb kód írását, valamint, hogy a Profil információk formázottan jelenlenek meg.

`ProfileFirstPage`

```kotlin
@Composable
fun ProfileFirstPage(
    name: String,
    email: String,
    address: String
){
    Column (
        modifier = Modifier
            .padding(16.dp)
            .fillMaxSize()
    ) {
        InfoFields(title = "NAME:", value = name)
        InfoFields(title = "EMAIL:", value = email)
        InfoFields(title = "ADDRESS:", value = address)
    }
}
```

Ez a *Composable* függvény fog felelni az első oldalért, a következő pedig a második oldalért.

`ProfileSecondPage`

```kotlin
@Composable
fun ProfileSecondPage(
    id: String,
    socialSecurityId: String,
    taxId: String,
    registrationId: String
) {
    Column(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxSize()
    ) {
        InfoFields(title = "ID:", value = id)
        InfoFields(title = "SOCIAL SECURITY ID:", value = socialSecurityId)
        InfoFields(title = "TAX ID:", value = taxId)
        InfoFields(title = "REGISTRATION ID:", value = registrationId)
    }
}
```

A függvény paraméterei a Profil egyes adatai lesznek String formátumban. Ha ezekkel megvagyunk, módosítsuk a `ProfileScreen` nevű *Composable* függvényünket az alábbiak szerint:

```kotlin
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ProfileScreen(
    modifier: Modifier = Modifier
){
    Scaffold (
        topBar = {
            TopBar("Profile")
        }
    ){ innerPadding ->
        val pagerState = rememberPagerState(pageCount = { 2 })
        val profile = DataManager.person
        HorizontalPager(
            modifier = modifier
                .padding(innerPadding),
            state = pagerState
        ) {
            Column(
                modifier = modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                when (pagerState.currentPage) {
                    0 -> {
                        ProfileFirstPage(
                            name = profile.name,
                            email = profile.email,
                            address = profile.address
                        )
                    }
                    1 -> {
                        ProfileSecondPage(
                            id = profile.id,
                            socialSecurityId = profile.socialSecNum,
                            taxId = profile.taxId,
                            registrationId = profile.registrationId
                        )
                    }
                }
            }
        }
    }
}
```

Először is létre kell hozunk egy `pagerState` nevű változót, amit át fogunk adni a `HorizontalPager`nek. Ez tartalmazza, hogy hány oldal lesz az adott *Composable*-n. Ezt követően szükség lesz egy profil-ra, amit már korábban definiáltunk egy `object`ként. Végül a `HorizontalPager` segítségével létrehozzuk a lapozható oldalt, amin elhelyezzük a két *Composable* függvényt 1-1 oldalként.

Próbáljuk ki az alkalmazást. A Profile gombra kattintva megjelennek a felhasználó adatai, és ha mindent jól csináltunk lehet lapozni is.



!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **profil oldal** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), melyben az egyik mező helyére a **neptun kódod** van kírva, illetve a **HorizontalPager** kódrészlete. A képet a megoldásban a repository-ba f2.png néven töltsd föl. 



## Szabadság képernyő elkészítése (1 pont)

A Szabadság képernyőn egy kördiagrammot fogunk megjeleníteni, ami mutatja, hogy mennyi szabadságot vettunk már ki, és mennyi maradt százalékos arányban. Ezen kívül egy gomb segítségével egy új szabadság intervallum kivételét is megengedjük a felhasználónak.

A PieChart kirajzoláshoz korábban az [MPAndroidChart](https://github.com/PhilJay/MPAndroidChart) library-t használtuk, azonban ez sajnos Jetpack Compose-ra nem működik már teljesen így a [YCharts](https://github.com/codeandtheory/YCharts) könyvtárat fogjuk a következőkben használni. Ehhez vegyük is fel a függőséget. Nyissuk meg a `settings.gradle` fájlt, és vegyük fel a `repositories`-hez a következőt:

```groovy
repositories {
    ...
    maven { url = uri("https://jitpack.io")}
}
```

Ezután nyissuk vegyük fel az előzőhöz hasonlóan a függőséget.


`libs.versions.toml`
```toml
[versions]
...
ycharts = "2.1.0"

[libraries]
...
ycharts = { module = "co.yml:ycharts", version.ref = "ycharts" }
```


`build.gradle`
```groovy
dependencies {
    ...
    implementation(libs.ycharts)
}
```

Valamint ezen a fájlon belül keressük meg a `minSdk` változót, és írjuk át 26-ra:

```groovy
android {
    ...
    defaultConfig{
        ...
        minSdk = 26
        ...
    }
    ...
}
```

Ezután Synceljük a Projectet a jobb fent lévő `Sync Now` gombbal. 

Ha a fájlok letöltődtek frissítsük a `HolidayScreen` *Composable* függvényünket az alábbiak szerint:

```kotlin
@Composable
fun HolidayScreen(
    modifier: Modifier = Modifier
) {
    var showDialog by remember { mutableStateOf(false) }

    Scaffold (
        topBar = {
            TopBar("Holiday")
        }
    ) { innerPadding ->

        Column(
            modifier = modifier
                .padding(innerPadding)
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {

            //PieChartData létrehozása
            //...

            //PieChartConfig létrehozása
            //...

            //PieChart létrehozása - PieChartData, PieChartConfig segítségével
            //...

            //Holiday Button
            //...

            //DatePicker Dialog
            //...

        }
    }

}
```


1. Hozzuk létre a `pieChardData` változónkat az alábbiak szerint (Másoljuk be a `//PieChartData létrehozása` comment alá):
```kotlin
val pieChartData = PieChartData(
    slices = listOf(
        PieChartData.Slice("Remaining", 5f, Color(0xFFFFEB3B)),
        PieChartData.Slice("Taken", 15f, Color(0xFF00FF00)),
    ), plotType = PlotType.Pie
)
```
    * `PieChartData`-nak két paramétert tudunk átadni ezek:
        - **slices**: Ez a paraméter fogja tartalmazni az adatokat, és az adatok eloszlását, valamint az adatok színét.
        - **plotType**: Ezzel a változóval tudjuk megadni a diagram típusát. Jelen esetben ez most `Pie` típus lesz.
    * `PieChartData.Slice`-nak négy paramétert tudunk átadni, mi most csak az első hárommal foglalkozunk:
        - **label**: Ez a String fog megjelenni az egyes "szeleteken".
        - **value**: Ez az eloszlás értéke az adatoknak
        - **color**: Ezzel tudjuk beállítani az egyes adatok színét a diagramon.

    Az eloszlás értékének átadtuk a ViewModel-ben tárolt két változónkat. Ez minden egyes alkalommal változni fog, hogy ha új szabadság időintervallumot nyújtunk be, valamint, hogy ha kilépünk a Szabadság képernyőről a főmenübe, és vissza, továbbra is meg fogja tartani az értéket.

2. Az előzőhöz hasonlóan hozzuk létre a `pieChartConfig` változót is:
```kotlin
val pieChartConfig = PieChartConfig(
    backgroundColor = Color.Transparent,
    labelType = PieChartConfig.LabelType.VALUE,
    isAnimationEnable = true,
    labelVisible = true,
    sliceLabelTextSize = TextUnit(20f, TextUnitType.Sp),
    animationDuration = 1000,
    sliceLabelTextColor = Color.Black,
    inActiveSliceAlpha = .8f,
    activeSliceAlpha = 1.0f,
)
```
    * A `PieChartConfig`-nak nagyon sok paramétere van, ezek közül csak párat fogunk megnézni a labor során.
        - **backgroundColor**: Ezzel tudjuk módosítani a diagram hátterét. Jelen esetben átlátszóra van szükségünk.
        - **labelType**: Ezzel lehet(ne) állítani, hogy az értéket, vagy a százalékot írja ki a diagram egyes szeletein, de ez jelenleg nem működik :)
        - **isAnimationEnable**: Animáció ki-be kapcsolása.
        - **labelVisible**: Ezzel tudjuk ki-be kapcsolni, hogy látszódjon a felirat a diagram szeletein.
        - **sliceLabelTextSize**: Felirat mérete a szeleteken.
        - **animationDuration**: Animáció időtartama.
        - **sliceLabelTextColor**: Felirat színe.
        - **inActiveSliceAlpha**: Inaktív szeletek átlátszósága.
        - **activeSliceAlpha**: Aktív szeletek átlátszósága.

3. `PieChart` létrehozása:
```kotlin
PieChart(
    modifier = Modifier
        .width(400.dp)
        .height(400.dp),
    pieChartData,
    pieChartConfig
)
```
    * Az előbb létrehozott két változót átadjuk a `PieChart` *Composable* függvénynek, és ezeknek a segítségével létrehozza a kördiagrammot.

    * Hogy ha most elindítjuk az alkalmazást, és mindent jól csináltunk, akkor a Holiday opciónál látni kéne a diagramot

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **szabadságképernyő** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f3.png néven töltsd föl.

## Dátumválasztó megvalósítása (1 pont)

Következő lépésként valósítsuk meg a `Take Holiday` gombot:
    * Ehhez szükségünk lesz az 5. lépésben egy DialogWindow-ra, de addig is be tudjuk állítani a Gomb működését.
```kotlin
Button(
    onClick = { showDialog = true }
) {
    Text("Take holiday")
}
```
### Képernyők közötti kommunikáció viewModel segítségével

Hozzunk létre egy `model` *Packaget* a projekt mappában, és ezen belül hozzunk létre egy új *Kotlin Filet* `HolidayViewModel` néven. Erre azért lesz szükség, hogy eltároljuk a szabadnapok maximális számát, illetve a már kivett szabadnapok számát. Ezt lehetne egy külön változóban is, azonban szükség van a ViewModel-re, hogy az egyes képernyők között megtartsák az értékeket a változók. Ennek alapján írjuk be az alábbi kódot a fájlba:

```kotlin
class HolidayViewModel : ViewModel() {
    private val _holidayMaxValue = MutableStateFlow(20)
    val holidayMaxValue: StateFlow<Int> = _holidayMaxValue

    private val _holidayDefaultValue = MutableStateFlow(15)
    val holidayDefaultValue: StateFlow<Int> = _holidayDefaultValue

    fun incrementDefaultValue(
        days: Int
    ) {
        viewModelScope.launch {
            _holidayDefaultValue.value+=days
        }
    }
}
```

Ezután módosítsuk a `HolidayScreen` fejlécét a következő képpen, és hozzunk létre pár új változót:

```kotlin
@Composable
fun HolidayScreen(
    modifier: Modifier = Modifier,
    viewModel: HolidayViewModel = viewModel()
) {

    val holidayMaxValueVM by viewModel.holidayMaxValue.collectAsState()
    val holidayDefaultValueVM by viewModel.holidayDefaultValue.collectAsState()
    val remainingHolidaysVM = holidayMaxValueVM - holidayDefaultValueVM

    val currentDate = Calendar.getInstance()
    val context = LocalContext.current
    var showDialog by remember { mutableStateOf(false) }

    Scaffold (
        topBar = {
            TopBar("Holiday")
        }
    ) { innerPadding ->

        Column(
            modifier = modifier
                .padding(innerPadding)
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {

            //PieChartData létrehozása
            val pieChartData = PieChartData(
                slices = listOf(
                    PieChartData.Slice("Remaining", remainingHolidaysVM.toFloat(), Color(0xFFFFEB3B)),
                    PieChartData.Slice("Taken", holidayDefaultValueVM.toFloat(), Color(0xFF00FF00)),
                ), plotType = PlotType.Pie
            )

            //PieChartConfig létrehozása
            //...

            //PieChart létrehozása - PieChartData, PieChartConfig segítségével
            //...

            //Holiday Button
            Button(
                onClick = { showDialog = true }
            ) {
                Text("Take holiday")
            }

            //DatePicker Dialog
            //...

        }
    }

}
```
!!!danger "pieChartData"
    Figyelj arra, hogy a `pieChartData`-t is frissítsed, ugyanis itt már nem beégetett eloszlás értéket használunk, hanem a viewModel-ben lévő változót!

!!!warning "viewModel"
    Sokszor az Android Studio nem tudja megtalálni a `viewModel()`-hez szükséges importot. Ilyenkor kézileg írjuk az importokhoz az alábbi importot:
    ```kotlin
    import androidx.lifecycle.viewmodel.compose.viewModel
    ```



Hozzuk létre a dialógus ablakot az alábbiak szerint.
```kotlin
if (showDialog) {
    DatePickerDialog(
        context,
        { _, _year, _months, _days ->
            showDialog = false
            val selectedDate = Calendar.getInstance().apply{
                set(_year, _months, _days)
            }
            val diff = ((selectedDate.timeInMillis - currentDate.timeInMillis) / (24 * 60 * 60 * 1000)).toInt()
            viewModel.incrementDefaultValue(
                days = diff
            )
        },
        currentDate.get(Calendar.YEAR), currentDate.get(Calendar.MONTH), currentDate.get(Calendar.DAY_OF_MONTH)
    ).apply {
        setOnCancelListener { showDialog = false }
        show()
    }
}
```

Az előző laborokon látottak alapján, hasonló módon használjuk a DataPicker Dialógust. Átadunk neki egy context-et, ezután egy lambda paramétert, ami a működést fogja leírni, abban az esetben, hogy ha dátumot választunk ki, majd végül utolsó három paraméternek átadjuk a jelenlegi dátumot.

!!!tip "DatePickerDialog import"
    A `DatePickerDialog`-nál használjuk az alábbi importot:
    ```kotlin
    import android.app.DatePickerDialog
    ```

Hogy ha ezzel megvagyunk, akkor már csak a `NavGraph`-ot kell úgy módosítani, hogy az értékeket megtartsa az alkalmazás, hogy ha ki-és belépünk a Holiday képernyőre. Ezt a következő képpen tudjuk megtenni:
```kotlin
@Composable
fun NavGraph(
    ...
){
    val holidayViewModel: HolidayViewModel = viewModel()

    NavHost(
        ...
    ){
        ...
        composable("holiday"){
            HolidayScreen(viewModel = holidayViewModel)
        }

    }
}
```

Ezután az alkalmazást elindítva már rendesen kell működnie a `Take Holiday` gombnak.

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **dátumválasztó kép** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f4a.png néven töltsd föl. **Emellett**  készíts egy **képernyőképet**, amelyen látszik a **dátumválasztás eredménye a szabadság képernyőn** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **a kommunikációhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f4b.png néven töltsd föl.


## Önálló feladat (1 pont)

*   Csak akkor engedjünk új szabadságot kivenni, hogy ha a kiválasztott nap a mai napnál későbbi. (0.5 pont)
*   Ha elfogyott a szabadságkeretünk, akkor a Take Holiday gomb legyen letiltva. (0.5 pont)

!!!example "BEADANDÓ (0.5 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **dátumválasztó oldal** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), a **korábbi napok tiltásához tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f5a.png néven töltsd föl.
	
!!!example "BEADANDÓ (0.5 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **letiltott gomb** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f5b.png néven töltsd föl.

## iMSc feladat
### Fizetés menüpont megvalósítása

A Payment menüpontra kattintva jelenjen meg egy `PaymentScreen` rajta egy HorizontalPager-rel és két képernyővel (A Profile menüponthoz hasonlóan):
- `PaymentTaxesScreen`: kördiagram, aminek a közepébe van írva az aktuális fizetés és mutatja a nettó jövedelmet illetve a levont adókat (adónként külön)
- `MonthlyPaymentScreen`: egy oszlopdiagramot mutasson 12 oszloppal, a havi szinten lebontott fizetéseket mutatva - érdemes az adatokat itt is a DataManager osztályban tárolni

[Segítség](https://github.com/codeandtheory/YCharts)

!!!example "BEADANDÓ (1 iMSc pont)"
	Készíts egy **képernyőképet**, amelyen látszik az **aktuális fizetés és nettó jövedelem a levont adókkal** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f6.png néven töltsd föl.
	

!!!example "BEADANDÓ (1 iMSc pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **12 oszlop a havi fizetési adatokkal** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f7.png néven töltsd föl.

## Extra

Az érdeklődők kedvéért ezen a laboron egy extra feladat is van, viszont ez csak saját tapasztalat szerzésért. **Ezért a feladatért nem jár pont!**

*   Az önálló feladathoz hasonlóan most a állítsad be, hogy a DatePicker dialógus ablakon csak a mai illetve a mai + maximális szabadnapok között lehessen választani. 